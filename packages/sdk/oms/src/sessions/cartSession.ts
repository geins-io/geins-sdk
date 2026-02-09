import {
  CART_STORAGE_KEYS,
  CART_STORAGE_MAX_AGE,
  CartError,
  CookieStorageAdapter,
  GeinsErrorCode,
} from '@geins/core';
import type {
  EventService,
  StorageInterface,
} from '@geins/core';
import type { CartItemType, CartType, GeinsEventMessage } from '@geins/types';
import { GeinsEventType } from '@geins/types';
import { CartService } from '../services/cartService';
import { groupCartItems } from '../parsers/cartParser';

export interface CartSessionOptions {
  storage?: StorageInterface;
  events?: EventService;
}

/**
 * Browser-side cart session.
 * Wraps the stateless CartService with storage persistence, in-memory caching,
 * event emission, and convenience methods (quantity increment/decrement, clear).
 *
 * Not safe for server-side shared singletons — one instance per browser session.
 */
export class CartSession {
  private _cartService: CartService;
  private _storage: StorageInterface;
  private _events?: EventService;
  private _cart: CartType | undefined;
  private _locale: string;

  constructor(cartService: CartService, locale: string, options?: CartSessionOptions) {
    this._cartService = cartService;
    this._storage = options?.storage ?? new CookieStorageAdapter();
    this._events = options?.events;
    this._locale = locale;
  }

  /** Current cart ID (from cache or storage). */
  get id(): string | undefined {
    return this._cart?.id ?? this.storageGet();
  }

  /** Cached cart object. */
  get cart(): CartType | undefined {
    return this._cart;
  }

  /** Whether the cart is completed (read-only). */
  get isReadOnly(): boolean {
    return this._cart?.completed ?? false;
  }

  /** Get or create a cart. Reads ID from storage if available. */
  async get(id?: string): Promise<CartType> {
    const cartId = id ?? this.storageGet();
    try {
      if (cartId) {
        this._cart = await this._cartService.get(cartId);
      } else {
        this._cart = await this._cartService.create();
      }
      this.storageSet(this._cart.id);
      return this._cart;
    } catch (error) {
      throw new CartError(
        'Failed to get or create cart',
        GeinsErrorCode.CART_OPERATION_FAILED,
        error,
      );
    }
  }

  /** Create a fresh cart (ignores any existing cart/storage). */
  async create(): Promise<CartType> {
    try {
      this._cart = await this._cartService.create();
      this.storageSet(this._cart.id);
      return this._cart;
    } catch (error) {
      throw new CartError(
        'Failed to create cart',
        GeinsErrorCode.CART_OPERATION_FAILED,
        error,
      );
    }
  }

  /** Item convenience methods with quantity logic using cached cart. */
  get items() {
    return {
      /** Add an item. If it already exists in the cart, increments quantity. */
      add: async (args: { skuId?: number; id?: string; quantity?: number; message?: string }): Promise<CartType> => {
        const cart = await this.ensureCart();
        const qty = args.quantity ?? 1;

        const existing = cart.items?.find(
          (item) => item.id === args.id || (item.skuId === args.skuId && (item.message ?? '') === (args.message ?? '')),
        );

        const totalQty = existing ? existing.quantity + qty : qty;

        try {
          if (existing) {
            this._cart = await this._cartService.updateItem(cart.id, {
              id: existing.id,
              skuId: existing.skuId,
              quantity: totalQty,
              message: args.message,
            });
          } else {
            this._cart = await this._cartService.addItem(cart.id, {
              skuId: args.skuId,
              id: args.id,
              quantity: totalQty,
              message: args.message,
            });
          }
        } catch (error) {
          throw new CartError('Failed to add item to cart', GeinsErrorCode.CART_OPERATION_FAILED, error);
        }

        this.emitEvent(GeinsEventType.CART_ADD, { skuId: args.skuId, id: args.id, quantity: totalQty });
        return this._cart;
      },

      /** Remove quantity from an item. If resulting quantity <= 0, deletes it. */
      remove: async (args: { id?: string; skuId?: number; quantity?: number }): Promise<CartType> => {
        const cart = await this.ensureCart();
        const qty = args.quantity ?? 1;

        const existing = cart.items?.find(
          (item) => item.id === args.id || item.skuId === args.skuId,
        );

        if (!existing) {
          return cart;
        }

        const newQty = existing.quantity - qty;

        try {
          this._cart = await this._cartService.updateItem(cart.id, {
            id: existing.id,
            skuId: existing.skuId,
            quantity: Math.max(0, newQty),
          });
        } catch (error) {
          throw new CartError('Failed to remove item from cart', GeinsErrorCode.CART_OPERATION_FAILED, error);
        }

        this.emitEvent(GeinsEventType.CART_REMOVE, { skuId: args.skuId, id: args.id, quantity: newQty });
        return this._cart;
      },

      /** Set an item to an exact quantity. */
      update: async (args: { id?: string; skuId?: number; quantity: number; message?: string }): Promise<CartType> => {
        const cart = await this.ensureCart();

        try {
          this._cart = await this._cartService.updateItem(cart.id, {
            id: args.id,
            skuId: args.skuId,
            quantity: args.quantity,
            message: args.message,
          });
        } catch (error) {
          throw new CartError('Failed to update cart item', GeinsErrorCode.CART_OPERATION_FAILED, error);
        }

        this.emitEvent(GeinsEventType.CART_UPDATE, { skuId: args.skuId, id: args.id, quantity: args.quantity });
        return this._cart;
      },

      /** Delete an item entirely. */
      delete: async (args: { id: string }): Promise<CartType> => {
        const cart = await this.ensureCart();

        try {
          this._cart = await this._cartService.deleteItem(cart.id, args.id);
        } catch (error) {
          throw new CartError('Failed to delete cart item', GeinsErrorCode.CART_ITEM_NOT_FOUND, error);
        }

        this.emitEvent(GeinsEventType.CART_REMOVE, { id: args.id });
        return this._cart;
      },

      /** Clear all items from the cart. */
      clear: async (): Promise<CartType> => {
        const cart = await this.ensureCart();
        if (!cart.items?.length) {
          return cart;
        }

        let latestCart = cart;
        for (const item of cart.items) {
          if (item.id) {
            latestCart = await this._cartService.deleteItem(cart.id, item.id);
          }
        }

        this._cart = latestCart;
        this.emitEvent(GeinsEventType.CART_CLEAR, {});
        return this._cart;
      },

      /** Get cart items (grouped by package if applicable). */
      get: (): CartItemType[] => {
        if (!this._cart?.items) {
          return [];
        }

        const hasPackages = this._cart.items.some((item) => item.productPackage != null);
        if (!hasPackages) {
          return this._cart.items;
        }

        return groupCartItems(this._cart.items, this._locale);
      },
    };
  }

  /** Promotion code convenience methods. */
  get promotionCode() {
    return {
      apply: async (code: string): Promise<CartType> => {
        const cart = await this.ensureCart();
        this._cart = await this._cartService.setPromotionCode(cart.id, code);
        return this._cart;
      },
      remove: async (): Promise<CartType> => {
        const cart = await this.ensureCart();
        this._cart = await this._cartService.removePromotionCode(cart.id);
        return this._cart;
      },
    };
  }

  /** Shipping fee convenience methods. */
  get shippingFee() {
    return {
      set: async (fee: number): Promise<CartType> => {
        const cart = await this.ensureCart();
        this._cart = await this._cartService.setShippingFee(cart.id, fee);
        return this._cart;
      },
    };
  }

  /** Merchant data convenience methods. */
  get merchantData() {
    return {
      set: async (data: string): Promise<CartType> => {
        const cart = await this.ensureCart();
        this._cart = await this._cartService.setMerchantData(cart.id, data);
        return this._cart;
      },
      get: (): string | undefined => {
        return this._cart?.merchantData;
      },
    };
  }

  /** Associate a user identity with the cart via merchant data. Preserves existing merchant data. */
  async associateUser(userInfo: {
    userId?: string;
    username?: string;
    customerType?: string;
  }): Promise<CartType> {
    const cart = await this.ensureCart();
    let existing: Record<string, unknown> = {};
    if (cart.merchantData) {
      try {
        existing = JSON.parse(cart.merchantData);
      } catch {
        // Malformed merchantData — overwrite rather than crash
      }
    }
    const merged = JSON.stringify({ ...existing, user: userInfo });
    this._cart = await this._cartService.setMerchantData(cart.id, merged);
    return this._cart;
  }

  /** Remove the session — clears cache and storage. */
  remove(): void {
    this._cart = undefined;
    this.storageRemove();
  }

  // --- Private helpers ---

  private async ensureCart(): Promise<CartType> {
    if (!this._cart) {
      return this.get();
    }
    return this._cart;
  }

  private emitEvent(eventType: GeinsEventType, payload: unknown): void {
    if (!this._events) {
      return;
    }

    const message: GeinsEventMessage = {
      subject: eventType,
      payload,
    };

    // Emit parent event (e.g., CART for CART_ADD)
    const eventStr = eventType as string;
    if (eventStr.includes('_')) {
      const parent = eventStr.split('_')[0];
      this._events.push(message, parent);
    }

    this._events.push(message, eventStr);
  }

  private storageGet(): string | undefined {
    return this._storage.get(CART_STORAGE_KEYS.CART_ID);
  }

  private storageSet(cartId?: string): void {
    if (!cartId) {
      this._storage.remove(CART_STORAGE_KEYS.CART_ID);
      return;
    }
    this._storage.set(CART_STORAGE_KEYS.CART_ID, cartId, {
      maxAge: CART_STORAGE_MAX_AGE.DEFAULT,
    });
  }

  private storageRemove(): void {
    this._storage.remove(CART_STORAGE_KEYS.CART_ID);
  }
}
