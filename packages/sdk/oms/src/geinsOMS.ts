import {
  GeinsCore,
  BasePackage,
  RuntimeContext,
  OMSSettings,
  GeinsUserType,
  CustomerType,
  GeinsSettings,
} from '@geins/core';
import { CartService } from './services/cartService';
import { CheckoutService } from './services/checkoutService';
import { OrderService } from './services/orderService';

/**
 * Interface representing the Geins Order Management System (OMS).
 *
 * @interface GeinsOMSInterface
 * @property {CartService} cart - Service for managing the shopping cart.
 * @property {CheckoutService} checkout - Service for handling the checkout process.
 */
export interface GeinsOMSInterface {
  readonly cart: CartService;
  readonly checkout: CheckoutService;
  readonly order: OrderService;
  createCheckoutToken(args: { user?: GeinsUserType }): Promise<string | undefined>;
}

export class GeinsOMS extends BasePackage implements GeinsOMSInterface {
  private _cart!: CartService;
  private _checkout!: CheckoutService;
  private _order!: OrderService;
  private _omsSettings: OMSSettings;

  constructor(core: GeinsCore, options?: { omsSettings?: OMSSettings }) {
    super(core);
    const { client, geinsSettings } = core;
    this._omsSettings = options?.omsSettings ?? { context: RuntimeContext.HYBRID };
    this._geinsSettings = geinsSettings;
    this._apiClient = () => client ?? undefined;
    this.initServices();
  }

  private async initServices(): Promise<void> {}

  get cart(): CartService {
    if (!this._cart) {
      this._cart = new CartService(() => this._apiClient(), this._geinsSettings, this._omsSettings);
    }
    return this._cart;
  }

  get checkout(): CheckoutService {
    if (!this._checkout) {
      this._checkout = new CheckoutService(
        () => this._apiClient(),
        this._geinsSettings,
        this._omsSettings,
        this,
      );
    }
    return this._checkout;
  }

  get order(): OrderService {
    if (!this._order) {
      this._order = new OrderService(() => this._apiClient(), this._geinsSettings, this._omsSettings, this);
    }
    return this._order;
  }

  async createCheckoutToken(args?: {
    cartId?: string;
    user?: any;
    customerType?: CustomerType;
    paymentId?: number;
    shippingId?: number;
    paymentMethods?: number[];
    shippingMethods?: number[];
    redirectUrls?: any;
    geinsSettings?: GeinsSettings;
  }): Promise<string | undefined> {
    const tokenArgs = {
      cartId: args?.cartId ?? this.cart.id,
      user: args?.user,
      paymentId: args?.paymentId ?? this._omsSettings.defaultPaymentId ?? 0,
      shippingId: args?.shippingId ?? this._omsSettings.defaultShippingId ?? 0,
      paymentMethods: args?.paymentMethods,
      shippingMethods: args?.shippingMethods,
      ...args,
    };

    return await this.checkout.tokenCreate(args);
  }
}
