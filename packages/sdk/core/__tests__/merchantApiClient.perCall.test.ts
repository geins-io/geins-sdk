import { ApolloError } from '@apollo/client/core';
import type { GeinsSettings } from '@geins/types';
import { MerchantApiClient } from '../src/api-client/merchantApiClient';
import { TimeoutError } from '../src/errors/networkError';

const MUTATION = `
  mutation commit($id: String!) {
    commit(id: $id)
  }
`;

const QUERY = `
  query get($id: String!) {
    get(id: $id)
  }
`;

const ok = (data: unknown) =>
  new Response(JSON.stringify({ data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

const failed = () =>
  new Response(JSON.stringify({ errors: [{ message: 'down' }] }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });

const settings = (requestConfig: GeinsSettings['requestConfig']): GeinsSettings => ({
  apiKey: 'k',
  accountName: 'a',
  channel: '1',
  tld: 'se',
  locale: 'sv-SE',
  market: 'se',
  requestConfig,
});

const client = (requestConfig?: GeinsSettings['requestConfig']) =>
  new MerchantApiClient({
    apiUrl: 'https://api.test/graphql',
    apiKey: 'k',
    ...(requestConfig ? { settings: settings(requestConfig) } : {}),
  });

/** A fetch that answers after `ms`, or rejects as fetch does when its signal aborts. */
function answerAfter(ms: number) {
  const signals: AbortSignal[] = [];
  const spy = jest.spyOn(globalThis, 'fetch').mockImplementation(
    (_input, init) =>
      new Promise((resolve, reject) => {
        const signal = init?.signal as AbortSignal;
        signals.push(signal);
        const timer = setTimeout(() => resolve(ok({ commit: true, get: true })), ms);
        signal?.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new DOMException('aborted', 'AbortError'));
        });
      }),
  );
  return { spy, signals };
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe('MerchantApiClient per-call context', () => {
  function contextSent(target: MerchantApiClient, method: 'mutate' | 'query') {
    const spy = jest.spyOn(target.getClient()!, method).mockResolvedValue({ data: {} } as never);
    return () => (spy.mock.calls[0][0] as { context?: unknown }).context;
  }

  it.each(['mutate', 'query'] as const)(
    '%s: sends no context when none is asked and no token',
    async (method) => {
      const target = client();
      const sent = contextSent(target, method);

      await (method === 'mutate'
        ? target.runMutation({ queryAsString: MUTATION })
        : target.runQuery({ queryAsString: QUERY }));

      expect(sent()).toBeUndefined();
    },
  );

  it.each(['mutate', 'query'] as const)(
    '%s: sends only the auth header for a token, as before',
    async (method) => {
      const target = client();
      const sent = contextSent(target, method);

      await (method === 'mutate'
        ? target.runMutation({ queryAsString: MUTATION, userToken: 't' })
        : target.runQuery({ queryAsString: QUERY, userToken: 't' }));

      expect(sent()).toEqual({ headers: { Authorization: 'Bearer t' } });
    },
  );

  it.each(['mutate', 'query'] as const)(
    '%s: merges the asked context with the auth header',
    async (method) => {
      const target = client();
      const sent = contextSent(target, method);
      const requestOptions = { context: { timeoutMs: 5, retry: false, headers: { 'x-a': '1' } } };

      await (method === 'mutate'
        ? target.runMutation({ queryAsString: MUTATION, userToken: 't', requestOptions })
        : target.runQuery({ queryAsString: QUERY, userToken: 't', requestOptions }));

      expect(sent()).toEqual({
        timeoutMs: 5,
        retry: false,
        headers: { 'x-a': '1', Authorization: 'Bearer t' },
      });
    },
  );
});

describe('MerchantApiClient per-call timeout', () => {
  it('answers a slow call when there is no deadline at all', async () => {
    answerAfter(30);

    await expect(client().runMutation({ queryAsString: MUTATION })).resolves.toMatchObject({
      data: { commit: true },
    });
  });

  it('fails a call past its own deadline and aborts the request', async () => {
    const { signals } = answerAfter(500);

    const error = await client()
      .runMutation({ queryAsString: MUTATION, requestOptions: { context: { timeoutMs: 20 } } })
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApolloError);
    expect((error as ApolloError).networkError).toBeInstanceOf(TimeoutError);
    expect((error as ApolloError).networkError).toMatchObject({ timeoutMs: 20 });
    expect(signals[0].aborted).toBe(true);
  });

  it("falls back to the client's deadline", async () => {
    answerAfter(500);

    const error = await client({ timeoutMs: 20 })
      .runQuery({ queryAsString: QUERY })
      .catch((e: unknown) => e);

    expect((error as ApolloError).networkError).toMatchObject({ timeoutMs: 20 });
  });

  it("lets a call's own deadline override the client's", async () => {
    answerAfter(40);

    await expect(
      client({ timeoutMs: 20 }).runQuery({
        queryAsString: QUERY,
        requestOptions: { context: { timeoutMs: 1_000 } },
      }),
    ).resolves.toMatchObject({ data: { get: true } });
  });
});

describe('MerchantApiClient per-call retry', () => {
  const retrying = () => client({ retry: { maxRetries: 2, initialDelayMs: 1, jitter: false } });

  it('retries a failed mutation that asks nothing, as before', async () => {
    const spy = jest.spyOn(globalThis, 'fetch').mockImplementation(async () => failed());

    await retrying()
      .runMutation({ queryAsString: MUTATION })
      .catch(() => undefined);

    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('sends a mutation that asks for no retry once', async () => {
    const spy = jest.spyOn(globalThis, 'fetch').mockImplementation(async () => failed());

    await retrying()
      .runMutation({ queryAsString: MUTATION, requestOptions: { context: { retry: false } } })
      .catch(() => undefined);

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
