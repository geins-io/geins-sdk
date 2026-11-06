import { gatedFetch } from '../../../../test/gatedFetch';
import { MerchantApiClient, RequestOptions } from '../src/api-client/merchantApiClient';
import { TimeoutError } from '../src/errors/networkError';

// Same query and variables for every read: Apollo keys an in-flight call on those two only.
const QUERY = `
  query me($channelId: String) {
    me(channelId: $channelId)
  }
`;

const MUTATION = `
  mutation touch($channelId: String) {
    touch(channelId: $channelId)
  }
`;

const VARIABLES = { channelId: '1|se' };

const client = () => new MerchantApiClient({ apiUrl: 'https://api.test/graphql', apiKey: 'k' });

/** Each answer names the token its request carried, so the test can tell the answers apart. */
const answer = (auth: string | null) => ({ me: auth ?? 'none', touch: auth ?? 'none' });

function read(target: MerchantApiClient, userToken?: string, requestOptions?: RequestOptions) {
  return target.runQuery<{ me: string }>({
    queryAsString: QUERY,
    variables: VARIABLES,
    ...(userToken ? { userToken } : {}),
    ...(requestOptions ? { requestOptions } : {}),
  });
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe('MerchantApiClient: reads in flight at the same time', () => {
  it('gives two signed-in reads a call each, each answered with its own token', async () => {
    const gate = gatedFetch(answer);
    const target = client();

    const a = read(target, 'A');
    const b = read(target, 'B');
    await gate.settle();

    expect(gate.held.map((r) => r.auth)).toEqual(['Bearer A', 'Bearer B']);
    gate.open();
    expect((await a).data.me).toBe('Bearer A');
    expect((await b).data.me).toBe('Bearer B');
  });

  it('still shares one call between two reads without headers', async () => {
    const gate = gatedFetch(answer);
    const target = client();
    let answered = 0;

    const a = read(target).then((r) => (answered++, r));
    const b = read(target).then((r) => (answered++, r));
    await gate.settle();

    expect(gate.held).toHaveLength(1);
    expect(answered).toBe(0);
    gate.open();
    expect((await a).data.me).toBe('none');
    expect((await b).data.me).toBe('none');
  });

  it('still shares one call between two reads whose context has no headers', async () => {
    const gate = gatedFetch(answer);
    const target = client();

    const a = read(target, undefined, { context: { timeoutMs: 0 } });
    const b = read(target, undefined, { context: { timeoutMs: 0 } });
    await gate.settle();

    expect(gate.held).toHaveLength(1);
    gate.open();
    await Promise.all([a, b]);
  });

  it("keeps a caller's own queryDeduplication: false on a read without headers", async () => {
    const gate = gatedFetch(answer);
    const target = client();

    const a = read(target, undefined, { context: { queryDeduplication: false } });
    const b = read(target, undefined, { context: { queryDeduplication: false } });
    await gate.settle();

    expect(gate.held).toHaveLength(2);
    gate.open();
    await Promise.all([a, b]);
  });

  it.each([
    ['signed-out first', [undefined, 'A']],
    ['signed-in first', ['A', undefined]],
  ])('gives a signed-in and a signed-out read a call each (%s)', async (_order, tokens) => {
    const gate = gatedFetch(answer);
    const target = client();

    const [first, second] = tokens.map((token) => read(target, token));
    await gate.settle();

    expect(gate.held).toHaveLength(2);
    gate.open();
    expect((await first).data.me).toBe(tokens[0] ? `Bearer ${tokens[0]}` : 'none');
    expect((await second).data.me).toBe(tokens[1] ? `Bearer ${tokens[1]}` : 'none');
  });

  it("does not let a caller's queryDeduplication: true share a signed-in read", async () => {
    const gate = gatedFetch(answer);
    const target = client();
    const share = { context: { queryDeduplication: true } };

    const a = read(target, 'A', share);
    const b = read(target, 'B', share);
    await gate.settle();

    expect(gate.held).toHaveLength(2);
    gate.open();
    expect((await a).data.me).toBe('Bearer A');
    expect((await b).data.me).toBe('Bearer B');
  });

  it.each(['Authorization', 'authorization'])(
    'gives a call each to reads whose token comes as an %s context header',
    async (name) => {
      const gate = gatedFetch(answer);
      const target = client();
      const withToken = (token: string) => ({ context: { headers: { [name]: `Bearer ${token}` } } });

      const a = read(target, undefined, withToken('A'));
      const b = read(target, undefined, withToken('B'));
      await gate.settle();

      expect(gate.held).toHaveLength(2);
      gate.open();
      expect((await a).data.me).toBe('Bearer A');
      expect((await b).data.me).toBe('Bearer B');
    },
  );

  it('gives a call each to reads that carry any other caller header', async () => {
    const gate = gatedFetch(answer);
    const target = client();
    const withHeader = { context: { headers: { 'x-customer': '1' } } };

    const a = read(target, undefined, withHeader);
    const b = read(target, undefined, withHeader);
    await gate.settle();

    expect(gate.held).toHaveLength(2);
    gate.open();
    await Promise.all([a, b]);
  });

  it('gives two signed-in mutations a call each', async () => {
    const gate = gatedFetch(answer);
    const target = client();
    const mutate = (userToken: string) =>
      target.runMutation<{ touch: string }>({ queryAsString: MUTATION, variables: VARIABLES, userToken });

    const a = mutate('A');
    const b = mutate('B');
    await gate.settle();

    expect(gate.held).toHaveLength(2);
    gate.open();
    expect((await a).data?.touch).toBe('Bearer A');
    expect((await b).data?.touch).toBe('Bearer B');
  });

  it('keeps each signed-in read to its own timeout', async () => {
    const gate = gatedFetch(answer);
    const target = client();

    const a = read(target, 'A');
    const b = read(target, 'B', { context: { timeoutMs: 50 } });

    await expect(b).rejects.toMatchObject({ networkError: expect.any(TimeoutError) });
    gate.open();
    expect((await a).data.me).toBe('Bearer A');
  });
});
