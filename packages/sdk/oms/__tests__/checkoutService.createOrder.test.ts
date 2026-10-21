import { ApolloError } from '@apollo/client/core';
import { CheckoutService } from '../src/services/checkoutService';

function createMockApiClient() {
  const mockClient = {
    runQuery: jest.fn(),
    runMutation: jest.fn(),
  };
  return { getter: () => mockClient as any, mock: mockClient };
}

const settings = {
  channel: 'test-channel',
  tld: 'se',
  locale: 'sv-SE',
  market: 'SE',
} as any;

const args = { cartId: 'cart-1', checkoutOptions: { paymentId: 1 } as any };

describe('CheckoutService createOrder result', () => {
  let service: CheckoutService;
  let mockClient: ReturnType<typeof createMockApiClient>['mock'];

  beforeEach(() => {
    const client = createMockApiClient();
    mockClient = client.mock;
    service = new CheckoutService(client.getter, settings, {} as any);
  });

  it('keeps the code Geins refused the order with', async () => {
    mockClient.runQuery.mockRejectedValue(
      new ApolloError({
        graphQLErrors: [
          { message: 'Invalid identity number', extensions: { code: 'INVALID_IDENTITY_NUMBER' } },
        ],
      }),
    );

    await expect(service.createOrder(args)).resolves.toEqual({
      created: false,
      message: 'Invalid identity number',
      code: 'INVALID_IDENTITY_NUMBER',
    });
  });

  it('answers without a code when the refusal carries none', async () => {
    mockClient.runQuery.mockRejectedValue(
      new ApolloError({ graphQLErrors: [{ message: 'First name is required', extensions: null as any }] }),
    );

    await expect(service.createOrder(args)).resolves.toEqual({
      created: false,
      message: 'First name is required',
    });
  });

  it('answers without a code for a failure that is not a GraphQL error', async () => {
    mockClient.runQuery.mockRejectedValue(new Error('socket hang up'));

    await expect(service.createOrder(args)).resolves.toEqual({
      created: false,
      message: 'socket hang up',
    });
  });

  it('answers a placed order as before', async () => {
    mockClient.runQuery.mockResolvedValue({
      data: {
        placeOrder: {
          __typename: 'PlaceOrderResponseType',
          orderId: 'o-1',
          publicId: 'p-1',
          status: 'completed',
        },
      },
    });

    await expect(service.createOrder(args)).resolves.toEqual({
      created: true,
      orderId: 'o-1',
      publicId: 'p-1',
    });
  });
});
