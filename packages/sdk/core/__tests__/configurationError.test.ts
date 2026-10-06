import { MerchantApiClient } from '../src/api-client/merchantApiClient';
import {
  ConfigurationError,
  isConfigurationError,
  toConfigurationError,
} from '../src/errors/configurationError';
import { GeinsError, GeinsErrorCode } from '../src/errors/geinsError';
import { TimeoutError } from '../src/errors/networkError';

const MUTATION = `
  mutation commitConfiguration($configurationId: String!) {
    commitConfiguration(configurationId: $configurationId) {
      committedConfigurationId
    }
  }
`;

const answer = (status: number, body: unknown) =>
  jest.spyOn(globalThis, 'fetch').mockImplementation(
    async () =>
      new Response(typeof body === 'string' ? body : JSON.stringify(body), {
        status,
        headers: { 'Content-Type': typeof body === 'string' ? 'text/plain' : 'application/json' },
      }),
  );

/** What the real client throws for the stubbed answer, through the SDK's own link chain. */
async function thrown(context?: Record<string, unknown>): Promise<ConfigurationError> {
  const client = new MerchantApiClient({ apiUrl: 'https://canary.example.test/graphql', apiKey: 'k' });
  try {
    await client.runMutation({
      queryAsString: MUTATION,
      variables: { configurationId: 'c' },
      ...(context ? { requestOptions: { context } } : {}),
    });
  } catch (error) {
    return toConfigurationError(error);
  }
  throw new Error('the request did not fail');
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe('ConfigurationError', () => {
  it('is a GeinsError with its own code', () => {
    const error = new ConfigurationError({ providerErrors: [] });

    expect(error).toBeInstanceOf(GeinsError);
    expect(error.name).toBe('ConfigurationError');
    expect(error.code).toBe(GeinsErrorCode.CONFIGURATION_FAILED);
  });

  it('reads the code of a GraphQL error sent with a 200', async () => {
    answer(200, {
      data: null,
      errors: [{ message: 'Variable M-2300 rejected', extensions: { code: 'ConfigurationFailed' } }],
    });

    const error = await thrown();

    expect(error.providerCodes).toEqual(['ConfigurationFailed']);
    expect(error.providerCode).toBe('ConfigurationFailed');
    expect(error.providerMessage).toBe('Variable M-2300 rejected');
    // Apollo does not expose the status of a 2xx answer.
    expect(error.status).toBeUndefined();
  });

  it('reads the code of a GraphQL error sent with a non-2xx status', async () => {
    answer(400, {
      errors: [{ message: 'No such configuration', extensions: { code: 'ConfigurationNotFound' } }],
    });

    const error = await thrown();

    expect(error.providerCodes).toEqual(['ConfigurationNotFound']);
    expect(error.providerMessage).toBe('No such configuration');
    expect(error.status).toBe(400);
  });

  it('keeps every code, in order', async () => {
    answer(200, {
      errors: [
        { message: 'a', extensions: { code: 'LoginRequired' } },
        { message: 'b' },
        { message: 'c', extensions: { code: 'CartBelongsToAnotherCompany' } },
      ],
    });

    const error = await thrown();

    expect(error.providerCodes).toEqual(['LoginRequired', 'CartBelongsToAnotherCompany']);
    expect(error.providerCode).toBe('LoginRequired');
    expect(error.providerMessage).toBe('a');
    expect(error.providerErrors).toEqual([
      { code: 'LoginRequired', message: 'a' },
      { message: 'b' },
      { code: 'CartBelongsToAnotherCompany', message: 'c' },
    ]);
  });

  it('carries a code the SDK has never heard of', async () => {
    answer(200, { errors: [{ message: 'new', extensions: { code: 'SomethingAddedUpstream' } }] });

    expect((await thrown()).providerCode).toBe('SomethingAddedUpstream');
  });

  it('gives the status and no code for a non-JSON error body', async () => {
    answer(503, 'Service Unavailable');

    const error = await thrown();

    expect(error.status).toBe(503);
    expect(error.providerCodes).toEqual([]);
    expect(error.providerCode).toBeUndefined();
  });

  it('gives the status and no code for a non-JSON 200', async () => {
    answer(200, '<html>proxy</html>');

    const error = await thrown();

    expect(error.status).toBe(200);
    expect(error.providerCodes).toEqual([]);
  });

  it('keeps a timeout as its cause, with no code', async () => {
    jest.spyOn(globalThis, 'fetch').mockImplementation(
      (_input, init) =>
        new Promise((_resolve, reject) => {
          (init?.signal as AbortSignal).addEventListener('abort', () =>
            reject(new DOMException('', 'AbortError')),
          );
        }),
    );

    const error = await thrown({ timeoutMs: 10 });

    expect(error.cause).toBeInstanceOf(TimeoutError);
    expect(error.providerCodes).toEqual([]);
    expect(error.status).toBeUndefined();
  });

  it('never puts the request URL in its message', async () => {
    answer(400, { errors: [{ message: 'x', extensions: { code: 'ConfigurationNotFound' } }] });

    expect((await thrown()).message).not.toContain('canary.example.test');
  });

  it('wraps a non-Apollo failure with no code', () => {
    const cause = new TypeError('fetch failed');

    const error = toConfigurationError(cause);

    expect(error.cause).toBe(cause);
    expect(error.providerCodes).toEqual([]);
  });

  describe('isConfigurationError', () => {
    it('recognises the class', () => {
      expect(
        isConfigurationError(
          new ConfigurationError({ providerErrors: [{ code: 'ConfigurationGone', message: 'gone' }] }),
        ),
      ).toBe(true);
    });

    it('recognises one from another copy of the package, by its shape', () => {
      const copy = Object.assign(new Error('x'), {
        name: 'ConfigurationError',
        providerErrors: [{ code: 'ConfigurationGone', message: 'gone' }],
      });

      expect(isConfigurationError(copy)).toBe(true);
    });

    it.each([
      ['another GeinsError', new GeinsError('x', GeinsErrorCode.CART_OPERATION_FAILED)],
      ['a plain error', new Error('x')],
      ['the name without the codes', Object.assign(new Error('x'), { name: 'ConfigurationError' })],
      ['null', null],
      ['a string', 'ConfigurationError'],
    ])('rejects %s', (_label, value) => {
      expect(isConfigurationError(value)).toBe(false);
    });
  });
});
