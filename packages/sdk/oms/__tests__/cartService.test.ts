import { CartService } from '../src/services/cartService';
import { CartError, GeinsError } from '@geins/core';

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

function mockCartResponse(overrides: Record<string, unknown> = {}) {
  return {
    __typename: 'CartType',
    id: 'cart-123',
    items: [],
    isCompleted: false,
    promoCode: null,
    freeShipping: false,
    fixedDiscount: 0,
    merchantData: null,
    appliedCampaigns: null,
    summary: null,
    ...overrides,
  };
}

describe('CartService', () => {
  let service: CartService;
  let mockClient: ReturnType<typeof createMockApiClient>['mock'];

  beforeEach(() => {
    const client = createMockApiClient();
    mockClient = client.mock;
    service = new CartService(client.getter, settings);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('throws when channel is missing', () => {
      const client = createMockApiClient();
      expect(() => new CartService(client.getter, { tld: 'se' } as any)).toThrow(GeinsError);
    });
  });

  describe('create', () => {
    it('creates a cart via mutation', async () => {
      mockClient.runMutation.mockResolvedValue(mockCartResponse());

      const result = await service.create();
      expect(result.id).toBe('cart-123');
      expect(result.completed).toBe(false);
      expect(mockClient.runMutation).toHaveBeenCalledTimes(1);
    });

    it('throws CartError when parse returns undefined', async () => {
      mockClient.runMutation.mockResolvedValue({ data: {} });

      await expect(service.create()).rejects.toThrow(CartError);
    });
  });

  describe('get', () => {
    it('gets cart by id via query', async () => {
      mockClient.runQuery.mockResolvedValue(mockCartResponse({ id: 'existing-cart' }));

      const result = await service.get('existing-cart');
      expect(result.id).toBe('existing-cart');
      expect(mockClient.runQuery).toHaveBeenCalledTimes(1);

      const callArgs = mockClient.runQuery.mock.calls[0][0];
      expect(callArgs.variables).toMatchObject({ id: 'existing-cart' });
    });

    it('throws CartError when cart not found', async () => {
      mockClient.runQuery.mockResolvedValue({ data: {} });

      await expect(service.get('missing-cart')).rejects.toThrow(CartError);
    });

    it('creates new cart when id is invalid', async () => {
      mockClient.runQuery.mockRejectedValue(new Error("Variable '$id' is invalid. blah"));
      mockClient.runMutation.mockResolvedValue(mockCartResponse({ id: 'new-cart' }));

      const result = await service.get('invalid-id');
      expect(result.id).toBe('new-cart');
      expect(mockClient.runMutation).toHaveBeenCalledTimes(1);
    });

    it('re-throws non-invalid-id errors as CartError', async () => {
      mockClient.runQuery.mockRejectedValue(new Error('Network timeout'));

      await expect(service.get('cart-1')).rejects.toThrow(CartError);
    });
  });

  describe('addItem', () => {
    it('adds item with skuId', async () => {
      mockClient.runMutation.mockResolvedValue(
        mockCartResponse({
          items: [{ id: 1, skuId: 42, quantity: 1, product: { productId: 100, name: 'Shoe' } }],
        }),
      );

      const result = await service.addItem('cart-1', { skuId: 42, quantity: 1 });
      expect(result.items).toHaveLength(1);
      expect(mockClient.runMutation).toHaveBeenCalledTimes(1);

      const callArgs = mockClient.runMutation.mock.calls[0][0];
      expect(callArgs.variables.item).toMatchObject({ skuId: 42, quantity: 1 });
    });

    it('adds item with string id', async () => {
      mockClient.runMutation.mockResolvedValue(mockCartResponse());

      await service.addItem('cart-1', { id: 'item-1', quantity: 2 });

      const callArgs = mockClient.runMutation.mock.calls[0][0];
      expect(callArgs.variables.item).toMatchObject({ id: 'item-1', quantity: 2 });
    });

    it('throws when neither id nor skuId provided', async () => {
      await expect(service.addItem('cart-1', { quantity: 1 } as any)).rejects.toThrow(GeinsError);
    });

    it('converts string skuId to number', async () => {
      mockClient.runMutation.mockResolvedValue(mockCartResponse());

      await service.addItem('cart-1', { skuId: '42' as any, quantity: 1 });

      const callArgs = mockClient.runMutation.mock.calls[0][0];
      expect(callArgs.variables.item.skuId).toBe(42);
    });

    it('throws CartError when parse returns undefined', async () => {
      mockClient.runMutation.mockResolvedValue({});

      await expect(service.addItem('cart-1', { skuId: 42, quantity: 1 })).rejects.toThrow(CartError);
    });
  });

  describe('updateItem', () => {
    it('updates item quantity', async () => {
      mockClient.runMutation.mockResolvedValue(mockCartResponse());

      await service.updateItem('cart-1', { skuId: 42, quantity: 5 });

      const callArgs = mockClient.runMutation.mock.calls[0][0];
      expect(callArgs.variables.item).toMatchObject({ skuId: 42, quantity: 5 });
    });
  });

  describe('deleteItem', () => {
    it('deletes item by setting quantity to 0', async () => {
      mockClient.runMutation.mockResolvedValue(mockCartResponse());

      await service.deleteItem('cart-1', 'item-1');

      const callArgs = mockClient.runMutation.mock.calls[0][0];
      expect(callArgs.variables.item).toMatchObject({ id: 'item-1', quantity: 0 });
    });
  });

  describe('complete', () => {
    it('marks cart as completed', async () => {
      mockClient.runQuery.mockResolvedValue(mockCartResponse({ isCompleted: true }));

      const result = await service.complete('cart-1');
      expect(result.completed).toBe(true);
    });
  });

  describe('copy', () => {
    it('copies cart with resetPromotions default true', async () => {
      mockClient.runMutation.mockResolvedValue(mockCartResponse({ id: 'cart-copy' }));

      const result = await service.copy('cart-1');
      expect(result.id).toBe('cart-copy');

      const callArgs = mockClient.runMutation.mock.calls[0][0];
      expect(callArgs.variables).toMatchObject({ id: 'cart-1', resetPromotions: true });
    });

    it('copies cart with resetPromotions false', async () => {
      mockClient.runMutation.mockResolvedValue(mockCartResponse({ id: 'cart-copy' }));

      await service.copy('cart-1', { resetPromotions: false });

      const callArgs = mockClient.runMutation.mock.calls[0][0];
      expect(callArgs.variables.resetPromotions).toBe(false);
    });
  });

  describe('setPromotionCode', () => {
    it('sets promo code', async () => {
      mockClient.runMutation.mockResolvedValue(mockCartResponse({ promoCode: 'SAVE10' }));

      const result = await service.setPromotionCode('cart-1', 'SAVE10');
      expect(result.promoCode).toBe('SAVE10');

      const callArgs = mockClient.runMutation.mock.calls[0][0];
      expect(callArgs.variables).toMatchObject({ id: 'cart-1', promoCode: 'SAVE10' });
    });
  });

  describe('removePromotionCode', () => {
    it('removes promo code by setting empty string', async () => {
      mockClient.runMutation.mockResolvedValue(mockCartResponse());

      await service.removePromotionCode('cart-1');

      const callArgs = mockClient.runMutation.mock.calls[0][0];
      expect(callArgs.variables.promoCode).toBe('');
    });
  });

  describe('setShippingFee', () => {
    it('sets shipping fee', async () => {
      mockClient.runMutation.mockResolvedValue(mockCartResponse());

      await service.setShippingFee('cart-1', 50);

      const callArgs = mockClient.runMutation.mock.calls[0][0];
      expect(callArgs.variables).toMatchObject({ id: 'cart-1', shippingFee: 50 });
    });
  });

  describe('setMerchantData', () => {
    it('sets merchant data', async () => {
      const data = JSON.stringify({ trackingId: 'abc' });
      mockClient.runMutation.mockResolvedValue(mockCartResponse({ merchantData: data }));

      const result = await service.setMerchantData('cart-1', data);
      expect(result.merchantData).toBe(data);

      const callArgs = mockClient.runMutation.mock.calls[0][0];
      expect(callArgs.variables).toMatchObject({ id: 'cart-1', merchantData: data });
    });
  });
});
