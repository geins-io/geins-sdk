import { OrderService } from '../src/services/orderService';
import { GeinsError, OrderError } from '@geins/core';

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

describe('OrderService', () => {
  let service: OrderService;
  let mockClient: ReturnType<typeof createMockApiClient>['mock'];

  beforeEach(() => {
    const client = createMockApiClient();
    mockClient = client.mock;
    service = new OrderService(client.getter, settings);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('get', () => {
    it('throws when publicOrderId is missing', async () => {
      await expect(service.get({ publicOrderId: '' })).rejects.toThrow(GeinsError);
    });

    it('returns parsed order summary', async () => {
      mockClient.runQuery.mockResolvedValue({
        __typename: 'OrderType',
        id: 42,
        customerId: 100,
        status: 'shipped',
        publicId: 'PUB-42',
        currency: 'SEK',
        billingAddress: null,
        shippingAddress: null,
        cart: null,
        paymentDetails: null,
        discount: null,
        orderTotal: null,
        paymentFee: null,
        shippingFee: null,
        vat: null,
        refunds: null,
        shippingDetails: null,
      });

      const result = await service.get({ publicOrderId: 'PUB-42' });
      expect(result).toBeDefined();
      expect(result!.id).toBe('42');
      expect(result!.status).toBe('shipped');
      expect(result!.publicId).toBe('PUB-42');
    });

    it('returns undefined when order not found', async () => {
      mockClient.runQuery.mockResolvedValue({ data: {} });

      const result = await service.get({ publicOrderId: 'PUB-missing' });
      expect(result).toBeUndefined();
    });

    it('passes market override when provided', async () => {
      mockClient.runQuery.mockResolvedValue({ data: {} });

      await service.get({ publicOrderId: 'PUB-1', checkoutMarketId: 'NO' });

      const callArgs = mockClient.runQuery.mock.calls[0][0];
      expect(callArgs.variables).toMatchObject({
        publicOrderId: 'PUB-1',
        marketId: 'NO',
      });
    });

    it('uses default market when no override', async () => {
      mockClient.runQuery.mockResolvedValue({ data: {} });

      await service.get({ publicOrderId: 'PUB-1' });

      const callArgs = mockClient.runQuery.mock.calls[0][0];
      expect(callArgs.variables.marketId).toBe('SE');
    });

    it('wraps errors in OrderError', async () => {
      mockClient.runQuery.mockRejectedValue(new Error('Network failure'));

      await expect(service.get({ publicOrderId: 'PUB-1' })).rejects.toThrow(OrderError);
    });
  });
});
