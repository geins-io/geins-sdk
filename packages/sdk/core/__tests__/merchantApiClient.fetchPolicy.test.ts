import { FetchPolicyOptions, MerchantApiClient } from '../src/api-client/merchantApiClient';

const ADD_TO_CART = `
  mutation addToCart($id: String!) {
    addToCart(id: $id) {
      id
      items {
        id
        quantity
      }
    }
  }
`;

const CART_QUERY = `
  query getCart($id: String!) {
    getCart(id: $id) {
      id
    }
  }
`;

const cartResponse = (id: string) =>
  new Response(
    JSON.stringify({
      data: {
        addToCart: {
          __typename: 'CartType',
          id,
          items: [{ __typename: 'CartItemType', id: `${id}-item`, quantity: 1 }],
        },
      },
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );

const queryResponse = () =>
  new Response(JSON.stringify({ data: { getCart: { __typename: 'CartType', id: 'c' } } }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

/** A client built while `window` exists, as in a browser. */
function browserClient(): MerchantApiClient {
  Object.defineProperty(globalThis, 'window', { value: {}, configurable: true });
  try {
    return new MerchantApiClient({ apiUrl: 'https://api.test/graphql', apiKey: 'k' });
  } finally {
    delete (globalThis as { window?: unknown }).window;
  }
}

const serverClient = () => new MerchantApiClient({ apiUrl: 'https://api.test/graphql', apiKey: 'k' });

function policySent(client: MerchantApiClient, method: 'mutate' | 'query') {
  const spy = jest.spyOn(client.getClient()!, method);
  return () => (spy.mock.calls[0][0] as { fetchPolicy?: string }).fetchPolicy;
}

describe('MerchantApiClient fetch policy', () => {
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchSpy = jest.spyOn(globalThis, 'fetch').mockImplementation(async () => cartResponse('c'));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('mutations', () => {
    it.each([
      ['server', 'no-cache asked', 'no-cache', serverClient, FetchPolicyOptions.NO_CACHE],
      ['server', 'nothing asked', 'no-cache', serverClient, undefined],
      ['browser', 'no-cache asked', 'no-cache', browserClient, FetchPolicyOptions.NO_CACHE],
      ['browser', 'nothing asked', 'network-only', browserClient, undefined],
    ])('in the %s with %s, sends %s', async (_context, _asked, expected, build, asked) => {
      const client = build();
      const sent = policySent(client, 'mutate');

      await client.runMutation({
        queryAsString: ADD_TO_CART,
        variables: { id: 'c' },
        ...(asked ? { requestOptions: { fetchPolicy: asked } } : {}),
      });

      expect(sent()).toBe(expected);
    });

    it('leaves the cache empty after many server-side mutations', async () => {
      fetchSpy.mockImplementation(async (_input, init) => {
        const { variables } = JSON.parse(String((init as RequestInit).body));
        return cartResponse(variables.id);
      });
      const client = serverClient();

      for (let i = 0; i < 50; i++) {
        await client.runMutation({ queryAsString: ADD_TO_CART, variables: { id: `cart-${i}` } });
      }

      expect(client.getClient()!.cache.extract()).toEqual({});
    });

    it('still writes a browser mutation that asks for nothing into the cache', async () => {
      const client = browserClient();

      await client.runMutation({ queryAsString: ADD_TO_CART, variables: { id: 'c' } });

      expect(client.getClient()!.cache.extract()).toHaveProperty(['CartType:c']);
    });
  });

  describe('queries', () => {
    beforeEach(() => {
      fetchSpy.mockImplementation(async () => queryResponse());
    });

    it.each([
      ['server', 'no-cache', serverClient],
      ['browser', 'cache-first', browserClient],
    ])('in the %s with nothing asked, sends %s as before', async (_context, expected, build) => {
      const client = build();
      const sent = policySent(client, 'query');

      await client.runQuery({ queryAsString: CART_QUERY, variables: { id: 'c' } });

      expect(sent()).toBe(expected);
    });

    it('sends the policy a query asks for', async () => {
      const client = serverClient();
      const sent = policySent(client, 'query');

      await client.runQuery({
        queryAsString: CART_QUERY,
        variables: { id: 'c' },
        requestOptions: { fetchPolicy: FetchPolicyOptions.CACHE_FIRST },
      });

      expect(sent()).toBe('cache-first');
    });
  });
});
