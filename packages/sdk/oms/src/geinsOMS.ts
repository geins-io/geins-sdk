import {
  BasePackage,
  CheckoutTokenPayload,
  GeinsCore,
  GeinsError,
  GeinsErrorCode,
  GenerateCheckoutTokenOptions,
  OMSSettings,
} from '@geins/core';
import { CustomerType } from '@geins/types';
import { CartService } from './services/cartService';
import { CheckoutService } from './services/checkoutService';
import { OrderService } from './services/orderService';

export interface GeinsOMSInterface {
  /**
   * Stateless cart service.
   * Every method takes a cartId and returns the full CartType.
   */
  readonly cart: CartService;
  /**
   * Checkout service.
   * Handles the checkout process — validation, order creation, token generation.
   */
  readonly checkout: CheckoutService;
  /**
   * Order service.
   * Retrieves order summaries.
   */
  readonly order: OrderService;
  /**
   * Creates a token for external checkout pages.
   * @param args.cartId - Required. The cart ID.
   */
  createCheckoutToken(args: GenerateCheckoutTokenOptions): Promise<string | undefined>;
}

/**
 * Geins Order Management System (OMS).
 * Provides stateless services for cart, checkout, and orders.
 */
export class GeinsOMS extends BasePackage implements GeinsOMSInterface {
  private _cart!: CartService;
  private _checkout!: CheckoutService;
  private _order!: OrderService;
  private _omsSettings: OMSSettings;

  constructor(core: GeinsCore, options?: { omsSettings?: OMSSettings }) {
    super(core);
    this._omsSettings = options?.omsSettings ?? {};
  }

  destroy(): void {
    this._cart?.destroy();
    this._checkout?.destroy();
    this._order?.destroy();
  }

  /** @inheritdoc */
  get cart(): CartService {
    if (!this._cart) {
      this._cart = new CartService(() => this._apiClient(), this._geinsSettings);
    }
    return this._cart;
  }

  /** @inheritdoc */
  get checkout(): CheckoutService {
    if (!this._checkout) {
      this._checkout = new CheckoutService(
        () => this._apiClient(),
        this._geinsSettings,
        this._omsSettings,
      );
    }
    return this._checkout;
  }

  /** @inheritdoc */
  get order(): OrderService {
    if (!this._order) {
      this._order = new OrderService(() => this._apiClient(), this._geinsSettings);
    }
    return this._order;
  }

  async createCheckoutToken(options?: GenerateCheckoutTokenOptions): Promise<string | undefined> {
    const tokenArgs: GenerateCheckoutTokenOptions = {
      cartId: options?.cartId,
      user: options?.user,
      isCartEditable: options?.isCartEditable ?? false,
      copyCart: options?.copyCart ?? true,
      selectedPaymentMethodId: options?.selectedPaymentMethodId ?? this._omsSettings.defaultPaymentId ?? 0,
      selectedShippingMethodId: options?.selectedShippingMethodId ?? this._omsSettings.defaultShippingId ?? 0,
      availablePaymentMethodIds: options?.availablePaymentMethodIds,
      availableShippingMethodIds: options?.availableShippingMethodIds,
      redirectUrls: options?.redirectUrls ?? this._omsSettings.checkoutUrls ?? undefined,
      customerType: options?.customerType ?? CustomerType.PERSON,
      branding: options?.branding,
      geinsSettings: this._geinsSettings,
    };

    if (!tokenArgs.cartId) {
      throw new GeinsError('cartId is required to create a checkout token.', GeinsErrorCode.INVALID_ARGUMENT);
    }

    return this.checkout.createToken(tokenArgs);
  }

  /** Parse a checkout token to retrieve the checkout payload. */
  static async parseCheckoutToken(token: string): Promise<CheckoutTokenPayload> {
    const payload = await CheckoutService.parseToken(token);
    if (!payload) {
      throw new GeinsError('Invalid token: Unable to parse token.', GeinsErrorCode.PARSE_ERROR);
    }
    return payload;
  }
}
