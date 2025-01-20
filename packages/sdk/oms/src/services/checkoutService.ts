import {
  BaseApiService,
  CookieService,
  isServerContext,
  CART_COOKIES,
  CART_COOKIES_MAX_AGE,
  CookieType,
  FetchPolicyOptions,
  encodeJWT,
  decodeJWT,
} from '@geins/core';
import { queries } from '../graphql';
import {
  CartType,
  CartItemType,
  CartItemInputType,
  GeinsSettings,
  OMSSettings,
  ProductPackageSelectionType,
  CartGroupInputType,
  CustomerType,
  CheckoutTokenPayload,
  CheckoutInputType,
} from '@geins/types';
import { parseCheckout } from '../parsers';
import { c } from 'vite/dist/node/types.d-aGj9QkWt';
import { GeinsOMS } from '../geinsOMS';

export class CheckoutService extends BaseApiService {
  private _cartId!: string | undefined;
  private _paymentId!: number;
  private _settings!: OMSSettings;
  private _cookieService!: CookieService;

  constructor(
    apiClient: any,
    geinsSettings: GeinsSettings,
    _settings: OMSSettings,
    private _parent?: GeinsOMS,
  ) {
    super(apiClient, geinsSettings);
    this._settings = _settings;

    if (!isServerContext() && _settings.context !== 'server') {
      this._cookieService = new CookieService();
      const cookieId = this.cookieGet();
      if (cookieId) {
        this._cartId = cookieId;
      }
    }
  }

  get id(): string | undefined {
    if (!isServerContext() && !this._cartId) {
      this._cartId = this.cookieGet();
    }
    return this._cartId;
  }

  get hasCart(): boolean {
    return !!this.id;
  }
  // from token???
  async get(args: {
    cartId?: string;
    paymentMethodId?: number;
    shippingMethodId?: number;
    billingAddress?: any;
    shippingAddress?: any;
    token?: string;
  }): Promise<any> {
    const resolvedArgs = { ...args };

    if (!resolvedArgs.cartId) {
      if (!this.id) {
        console.error('No cart id found');
        return undefined;
      }
      resolvedArgs.cartId = this.id;
    }

    if (!resolvedArgs.cartId) {
      resolvedArgs.paymentMethodId = this._paymentId;
    }

    // klarna 23
    // svea 24
    // walley 25
    // avarda 26
    // faktura 18
    // checkout: {
    //   paymentId: PAYMENT_ID;
    // }
    const variables = {
      cartId: resolvedArgs.cartId,
      checkoutMarketId: 'se',
      checkout: {
        customerType: CustomerType.PERSON,
        paymentId: resolvedArgs.paymentMethodId,
        shippingId: resolvedArgs.shippingMethodId,
      },
    };
    console.log('**CheckoutService**  CHECKOUT get() - variables', variables);

    const options: any = {
      query: queries.checkoutCreate,
      variables: this.generateVars(variables),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    try {
      const data = await this.runQuery(options);
      const checkout = parseCheckout(data, this._geinsSettings.locale);

      console.log('**CheckoutService**  CHECKOUT get() - data', data);

      return checkout;
    } catch (e) {
      console.error('ERROR', e);
      throw new Error('Error creating cart');
    }
    return;
  }
  // check that cart has stock and cutomer is not blocked
  async validate(args: { cartId: string; checkout: CheckoutInputType }): Promise<any> {
    const variables = {
      cartId: args.cartId,
      checkout: args.checkout,
    };

    const options: any = {
      query: queries.checkoutValidate,
      variables: this.createVariables(variables),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    console.log('CHECKOUT validate() - options.variables', options.variables);
    console.log('CHECKOUT validate() - _parent', this._parent);

    // validation type

    try {
      const data = await this.runQuery(options);
      console.log('CHECKOUT validate() - data', data);

      return data;
    } catch (e) {
      console.error('ERROR', e);
      throw new Error('Error creating cart');
    }
  }

  // read cookies etc
  async tokenCreate(args?: {
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
    const resolvedArgs = { ...args };

    if (!resolvedArgs.cartId) {
      if (!this._cartId) {
        return undefined;
      }
      resolvedArgs.cartId = this._cartId;
    }

    if (!resolvedArgs.geinsSettings) {
      resolvedArgs.geinsSettings = this._geinsSettings;
    }

    if (!resolvedArgs.customerType) {
      resolvedArgs.customerType = CustomerType.PERSON;
    }

    if (!resolvedArgs.user) {
      resolvedArgs.user = null;
    }

    if (!resolvedArgs.paymentId) {
      resolvedArgs.paymentId = args?.paymentId ?? this._settings.defaultPaymentId ?? 0;
    }

    if (!resolvedArgs.shippingId) {
      resolvedArgs.shippingId = args?.shippingId ?? this._settings.defaultShippingId ?? 0;
    }

    if (!resolvedArgs.redirectUrls) {
      resolvedArgs.redirectUrls = {
        success: '',
        error: '',
        cancel: '',
        change: '',
      };
    }

    // validate args????

    const obj = {
      cartId: resolvedArgs.cartId,
      user: resolvedArgs.user,
      settings: {
        paymentId: resolvedArgs.paymentId,
        paymentMethods: resolvedArgs.paymentMethods,
        shippingId: resolvedArgs.shippingId,
        shippingMethods: resolvedArgs.shippingMethods,
        customerType: CustomerType.PERSON,
        redirectUrls: resolvedArgs.redirectUrls,
      },
      geinsSettings: resolvedArgs.geinsSettings,
    };

    const token = encodeJWT(obj);

    return token;
  }

  async tokenParse(token: string): Promise<CheckoutTokenPayload | undefined> {
    const decodedToken = decodeJWT(token);
    if (!decodedToken) {
      return undefined;
    }
    return decodedToken.payload;
  }

  // paymentOptions

  // private util methods
  private loadCheckoutFromData(data: any): boolean {
    const checkout = parseCheckout(data, this._geinsSettings.locale);
    if (!checkout) {
      return false;
    }
    return this.loadCheckout(checkout);
  }

  private loadCheckout(checkout: any): boolean {
    if (!checkout) {
      return false;
    }

    return true;
  }

  private generateVars(variables: any) {
    return this.createVariables(variables);
  }

  private cookieGet(): string | undefined {
    if (!this._cookieService) {
      return undefined;
    }

    return this._cookieService.get(CART_COOKIES.CART_ID);
  }
}
