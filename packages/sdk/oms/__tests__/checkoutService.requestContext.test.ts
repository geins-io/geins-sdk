import { CheckoutService } from '../src/services/checkoutService';
import { GeinsError } from '@geins/core';

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

const omsSettings = {} as any;

describe('CheckoutService requestContext override', () => {
  let service: CheckoutService;
  let mockClient: ReturnType<typeof createMockApiClient>['mock'];

  beforeEach(() => {
    const client = createMockApiClient();
    mockClient = client.mock;
    service = new CheckoutService(client.getter, settings, omsSettings);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const requestContext = { languageId: 'en-US', marketId: 'US', channelId: 'us-channel' };

  describe('createOrder', () => {
    it('spreads requestContext into createVariables', async () => {
      mockClient.runQuery.mockResolvedValue({
        __typename: 'CreateOrderResponseType',
        created: true,
        orderId: 'order-1',
      });

      await service.createOrder({
        cartId: 'cart-1',
        checkoutOptions: { paymentId: 1 } as any,
        requestContext,
      });

      const callArgs = mockClient.runQuery.mock.calls[0][0];
      expect(callArgs.variables.languageId).toBe('en-US');
      expect(callArgs.variables.marketId).toBe('US');
      expect(callArgs.variables.channelId).toBe('us-channel');
    });

    it('uses default settings when requestContext is omitted', async () => {
      mockClient.runQuery.mockResolvedValue({
        __typename: 'CreateOrderResponseType',
        created: true,
      });

      await service.createOrder({
        cartId: 'cart-1',
        checkoutOptions: { paymentId: 1 } as any,
      });

      const callArgs = mockClient.runQuery.mock.calls[0][0];
      expect(callArgs.variables.languageId).toBe('sv-SE');
      expect(callArgs.variables.marketId).toBe('SE');
    });
  });

  describe('validate', () => {
    it('spreads requestContext into createVariables', async () => {
      mockClient.runQuery.mockResolvedValue({ valid: true });

      await service.validate({
        cartId: 'cart-1',
        checkoutOptions: { paymentId: 1 } as any,
        requestContext,
      });

      const callArgs = mockClient.runQuery.mock.calls[0][0];
      expect(callArgs.variables.languageId).toBe('en-US');
      expect(callArgs.variables.marketId).toBe('US');
    });
  });

  describe('summary', () => {
    it('spreads requestContext into createVariables', async () => {
      mockClient.runQuery.mockResolvedValue({ data: {} });

      try {
        await service.summary({
          orderId: 'order-1',
          paymentMethod: 'card',
          requestContext,
        });
      } catch {
        // May throw due to parse — we only care about the variables
      }

      const callArgs = mockClient.runQuery.mock.calls[0][0];
      expect(callArgs.variables.languageId).toBe('en-US');
      expect(callArgs.variables.marketId).toBe('US');
    });
  });
});
