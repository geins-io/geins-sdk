import { GeinsError, OrderError } from '@geins/core';
import { OrderService } from '../src/services/orderService';

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

    it('spreads requestContext into createVariables', async () => {
      mockClient.runQuery.mockResolvedValue({ data: {} });

      await service.get({ publicOrderId: 'PUB-1' }, { languageId: 'en-US', marketId: 'US' });

      const callArgs = mockClient.runQuery.mock.calls[0][0];
      expect(callArgs.variables.languageId).toBe('en-US');
      expect(callArgs.variables.marketId).toBe('US');
    });

    it('uses default settings when requestContext is omitted', async () => {
      mockClient.runQuery.mockResolvedValue({ data: {} });

      await service.get({ publicOrderId: 'PUB-1' });

      const callArgs = mockClient.runQuery.mock.calls[0][0];
      expect(callArgs.variables.languageId).toBe('sv-SE');
      expect(callArgs.variables.marketId).toBe('SE');
    });

    describe('an order row', () => {
      function orderWith(item: Record<string, unknown>) {
        return {
          __typename: 'OrderType',
          id: 1548,
          publicId: 'PUB-1548',
          cart: {
            __typename: 'CartType',
            id: 'cart-1',
            items: [
              { id: '00000000-0000-0000-0000-000000000000', skuId: 1, quantity: 1, groupKey: null, ...item },
            ],
            summary: null,
          },
        };
      }

      async function rowOf(item: Record<string, unknown>) {
        mockClient.runQuery.mockResolvedValue(orderWith(item));
        return (await service.get({ publicOrderId: 'PUB-1548' }))!.cart!.items[0];
      }

      // As measured on real orders: the configured row's id is null.
      it('reads a configured row with its product type and configuration, and no configuration id', async () => {
        const row = await rowOf({
          product: { productId: 8820, type: 'configurable' },
          configurationId: null,
          configuration: { summary: [{ label: 'Width', value: '1200 mm' }], sections: null },
        });
        expect(row.product?.type).toBe('configurable');
        expect(row.configuration).toStrictEqual({ summary: [{ label: 'Width', value: '1200 mm' }] });
        expect(row.configurationId).toBeUndefined();
      });

      it('reads the committed fields of a configured row, without the committed id an order does not carry', async () => {
        const row = await rowOf({
          product: { productId: 8820, type: 'configurable' },
          configurationId: null,
          configuration: {
            committedConfigurationId: null,
            articleNumber: 'ART-1200',
            discountPercent: 0,
            weightPerUnit: 3.75,
            summary: [],
            sections: null,
          },
        });
        expect(row.configuration).toStrictEqual({
          articleNumber: 'ART-1200',
          discountPercent: 0,
          weightPerUnit: 3.75,
          summary: [],
        });
        expect(row.configuration?.committedConfigurationId).toBeUndefined();
      });

      it('reads a plain row with its product type and no configuration', async () => {
        const row = await rowOf({
          product: { productId: 1045, type: 'product' },
          configurationId: null,
          configuration: null,
        });
        expect(row.product?.type).toBe('product');
        expect(row.configuration).toBeUndefined();
        expect(row.configurationId).toBeUndefined();
      });

      it('reads a product that answers no type as having none', async () => {
        const row = await rowOf({ product: { productId: 1045, type: null } });
        expect(row.product?.type).toBeUndefined();
      });
    });
  });
});
