import { ApolloError } from '@apollo/client/core';
import { MerchantApiClient } from '../src/api-client/merchantApiClient';
import { graphQLErrorCode } from '../src/errors/configurationError';

const MUTATION = `
  mutation placeOrder($cartId: String!) {
    placeOrder(cartId: $cartId, checkout: {}) {
      orderId
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
async function thrown(): Promise<unknown> {
  const client = new MerchantApiClient({ apiUrl: 'https://canary.example.test/graphql', apiKey: 'k' });
  try {
    await client.runMutation({ queryAsString: MUTATION, variables: { cartId: 'c' } });
  } catch (error) {
    return error;
  }
  throw new Error('the request did not fail');
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe('graphQLErrorCode', () => {
  it('reads the code of a GraphQL error sent with a 200', async () => {
    answer(200, {
      data: { placeOrder: null },
      errors: [{ message: 'Invalid identity number', extensions: { code: 'INVALID_IDENTITY_NUMBER' } }],
    });

    expect(graphQLErrorCode(await thrown())).toBe('INVALID_IDENTITY_NUMBER');
  });

  it('reads the code of a GraphQL error sent with a non-2xx status', async () => {
    answer(400, {
      errors: [{ message: 'Another company', extensions: { code: 'CartBelongsToAnotherCompany' } }],
    });

    expect(graphQLErrorCode(await thrown())).toBe('CartBelongsToAnotherCompany');
  });

  it('gives no code for a refusal sent without one, as Geins sends its validation errors', async () => {
    answer(200, {
      data: { placeOrder: null },
      errors: [{ message: 'First name is required', extensions: null }],
    });

    expect(graphQLErrorCode(await thrown())).toBeUndefined();
  });

  it('gives the first code when an earlier error has none', () => {
    const error = new ApolloError({
      graphQLErrors: [
        { message: 'a', extensions: {} },
        { message: 'b', extensions: { code: 'LoginRequired' } },
        { message: 'c', extensions: { code: 'CartBelongsToAnotherCompany' } },
      ],
    });

    expect(graphQLErrorCode(error)).toBe('LoginRequired');
  });

  it('ignores a code that is not a string', () => {
    const error = new ApolloError({ graphQLErrors: [{ message: 'a', extensions: { code: 42 } }] });

    expect(graphQLErrorCode(error)).toBeUndefined();
  });

  it('gives no code for a non-JSON error body', async () => {
    answer(502, '<html>Bad gateway</html>');

    expect(graphQLErrorCode(await thrown())).toBeUndefined();
  });

  it('gives no code for a failure that is not from Apollo', () => {
    expect(graphQLErrorCode(new Error('socket hang up'))).toBeUndefined();
    expect(graphQLErrorCode(undefined)).toBeUndefined();
  });
});
