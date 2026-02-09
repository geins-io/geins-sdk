import { EventService, MemoryStorage, CART_STORAGE_KEYS } from '@geins/core';
import { GeinsEventType } from '@geins/types';
import type { CartType } from '@geins/types';
import { CartSession } from '../src/sessions/cartSession';

// --- Helpers ---

function mockCart(overrides: Partial<CartType> = {}): CartType {
  return {
    id: 'cart-123',
    completed: false,
    items: [],
    promoCode: '',
    merchantData: '',
    freeShipping: false,
    freeShippingLimit: { current: 0, limit: 0 },
    summary: {
      total: { regular: 0, selling: 0 },
      subTotal: { regular: 0, selling: 0 },
      shipping: { regular: 0, selling: 0 },
      balance: { amount: 0, resultingBalance: 0 },
      vat: 0,
      fixedDiscount: 0,
      discount: 0,
      quantity: 0,
    },
    ...overrides,
  } as CartType;
}

function createMockCartService() {
  return {
    get: jest.fn().mockResolvedValue(mockCart()),
    create: jest.fn().mockResolvedValue(mockCart()),
    addItem: jest.fn().mockResolvedValue(mockCart()),
    updateItem: jest.fn().mockResolvedValue(mockCart()),
    deleteItem: jest.fn().mockResolvedValue(mockCart({ items: [] })),
    setPromotionCode: jest.fn().mockResolvedValue(mockCart()),
    removePromotionCode: jest.fn().mockResolvedValue(mockCart()),
    setShippingFee: jest.fn().mockResolvedValue(mockCart()),
    setMerchantData: jest.fn().mockImplementation((_id: string, data: string) =>
      Promise.resolve(mockCart({ merchantData: data })),
    ),
  } as any;
}

// --- Tests ---

describe('CartSession', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('pluggable storage', () => {
    it('persists cart ID in MemoryStorage', async () => {
      const storage = new MemoryStorage();
      const session = new CartSession(createMockCartService(), 'en', { storage });

      await session.get();

      expect(storage.get(CART_STORAGE_KEYS.CART_ID)).toBe('cart-123');
    });

    it('restores cart ID from storage', async () => {
      const storage = new MemoryStorage();
      storage.set(CART_STORAGE_KEYS.CART_ID, 'existing-cart');

      const cartService = createMockCartService();
      const session = new CartSession(cartService, 'en', { storage });

      expect(session.id).toBe('existing-cart');

      await session.get();
      expect(cartService.get).toHaveBeenCalledWith('existing-cart');
    });

    it('remove() clears storage', async () => {
      const storage = new MemoryStorage();
      const session = new CartSession(createMockCartService(), 'en', { storage });

      await session.get();
      expect(storage.get(CART_STORAGE_KEYS.CART_ID)).toBe('cart-123');

      session.remove();
      expect(storage.get(CART_STORAGE_KEYS.CART_ID)).toBeUndefined();
    });
  });

  describe('events', () => {
    it('emits CART_ADD on items.add()', async () => {
      const events = new EventService();
      const handler = jest.fn();
      events.listenerAdd(handler, GeinsEventType.CART_ADD);

      const session = new CartSession(createMockCartService(), 'en', {
        storage: new MemoryStorage(),
        events,
      });

      await session.items.add({ skuId: 42, quantity: 1 });

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: GeinsEventType.CART_ADD,
          payload: expect.objectContaining({ skuId: 42 }),
        }),
      );
    });

    it('emits CART_REMOVE on items.remove()', async () => {
      const events = new EventService();
      const handler = jest.fn();
      events.listenerAdd(handler, GeinsEventType.CART_REMOVE);

      const cartWithItems = mockCart({
        items: [{ id: 'item-1', skuId: 42, quantity: 2 } as any],
      });
      const cartService = createMockCartService();
      cartService.get.mockResolvedValue(cartWithItems);
      cartService.create.mockResolvedValue(cartWithItems);

      const session = new CartSession(cartService, 'en', {
        storage: new MemoryStorage(),
        events,
      });

      await session.items.remove({ skuId: 42, quantity: 1 });

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('emits CART_UPDATE on items.update()', async () => {
      const events = new EventService();
      const handler = jest.fn();
      events.listenerAdd(handler, GeinsEventType.CART_UPDATE);

      const session = new CartSession(createMockCartService(), 'en', {
        storage: new MemoryStorage(),
        events,
      });

      await session.items.update({ skuId: 42, quantity: 5 });

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('emits CART_CLEAR on items.clear()', async () => {
      const events = new EventService();
      const handler = jest.fn();
      events.listenerAdd(handler, GeinsEventType.CART_CLEAR);

      const cartWithItems = mockCart({
        items: [{ id: 'item-1', skuId: 42, quantity: 1 } as any],
      });
      const cartService = createMockCartService();
      cartService.get.mockResolvedValue(cartWithItems);
      cartService.create.mockResolvedValue(cartWithItems);

      const session = new CartSession(cartService, 'en', {
        storage: new MemoryStorage(),
        events,
      });

      await session.items.clear();

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('emits CART parent event alongside specific event', async () => {
      const events = new EventService();
      const parentHandler = jest.fn();
      events.listenerAdd(parentHandler, GeinsEventType.CART);

      const session = new CartSession(createMockCartService(), 'en', {
        storage: new MemoryStorage(),
        events,
      });

      await session.items.add({ skuId: 42 });

      expect(parentHandler).toHaveBeenCalledTimes(1);
    });

    it('does not throw when no EventService provided', async () => {
      const session = new CartSession(createMockCartService(), 'en', {
        storage: new MemoryStorage(),
      });

      await session.items.add({ skuId: 42 });
      // Should not throw
    });
  });

  describe('associateUser', () => {
    it('sets merchant data with user identity', async () => {
      const cartService = createMockCartService();
      const session = new CartSession(cartService, 'en', {
        storage: new MemoryStorage(),
      });

      const result = await session.associateUser({ userId: 'u-1', username: 'luke' });

      expect(cartService.setMerchantData).toHaveBeenCalledWith(
        'cart-123',
        JSON.stringify({ user: { userId: 'u-1', username: 'luke' } }),
      );
      expect(result.merchantData).toContain('luke');
    });

    it('preserves existing merchant data', async () => {
      const cartWithData = mockCart({ merchantData: JSON.stringify({ trackingId: 'abc' }) });
      const cartService = createMockCartService();
      cartService.get.mockResolvedValue(cartWithData);
      cartService.create.mockResolvedValue(cartWithData);

      const session = new CartSession(cartService, 'en', {
        storage: new MemoryStorage(),
      });

      await session.associateUser({ userId: 'u-1' });

      const calledWith = cartService.setMerchantData.mock.calls[0][1];
      const parsed = JSON.parse(calledWith);
      expect(parsed.trackingId).toBe('abc');
      expect(parsed.user.userId).toBe('u-1');
    });
  });
});
