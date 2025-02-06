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

export interface GeinsOMSInterface {
  /**
   * Service for managing the shopping cart.
   * The Cart Service is used to handle the shopping cart.
   * It can be used to retrieve the cart, add items to the cart, update items in the cart, remove items from the cart, and clear the cart.
   */
  readonly cart: CartService;
  /**
   * Class representing the Checkout Service.
   * The Checkout Service is used to handle the checkout process.
   * It can be used to retrieve checkout information, validate the checkout, create a token for the checkout process, and parse a checkout token.
   *  */
  readonly checkout: CheckoutService;
  /**
   * Service for managing orders.
   * The Order Service is used to handle orders.
   * It can be used to retrieve orders, retrieve an order by ID, create an order.
   */
  readonly order: OrderService;
  /**
   * Creates a token for the checkout process to use when sending user to an external checkout page.
   *
   * @param args - The arguments for creating the token.
   * @param args.cartId - The ID of the cart (optional), if not provided cookie will be read.
   * @param args.user - The user information (optional).
   * @param args.customerType - The type of customer (optional).
   * @param args.paymentId - The ID of the payment method (optional).
   * @param args.shippingId - The ID of the shipping method (optional).
   * @param args.paymentMethods - The list of payment method IDs (optional).
   * @param args.shippingMethods - The list of shipping method IDs (optional).
   * @param args.redirectUrls - The redirect URLs (optional).
   * @param args.geinsSettings - The Geins settings (optional).
   * @returns A promise that resolves to the created token or undefined.
   */
  createCheckoutToken(args?: {
    cartId?: string;
    user?: GeinsUserType;
    customerType?: CustomerType;
    paymentId?: number;
    shippingId?: number;
    paymentMethods?: number[];
    shippingMethods?: number[];
    redirectUrls?: any;
    geinsSettings?: GeinsSettings;
  }): Promise<string | undefined>;
}
/**
 * Geins Order Management System (OMS).
 * This package provides services for managing the shopping cart, handling the checkout process, and managing orders.
 * It also provides methods for creating a token for the checkout process.
 * The OMS settings can be configured to specify the context for the OMS.
 */
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
    return await this.checkout.tokenCreate(tokenArgs);
  }
}
