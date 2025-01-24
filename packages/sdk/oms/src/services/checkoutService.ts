import {
  BaseApiService,
  CookieService,
  CustomerType,
  FetchPolicyOptions,
  encodeJWT,
  decodeJWT,
} from '@geins/core';

import type {
  GeinsSettings,
  OMSSettings,
  CheckoutType,
  CheckoutTokenPayload,
  CheckoutInputType,
  ValidateOrderCreationResponseType,
  CheckoutRedirectsType,
  GeinsUserType,
} from '@geins/core';

import { GeinsOMS } from '../geinsOMS';
import { queries } from '../graphql';
import { parseCheckout, parseValidateOrder } from '../parsers';

export interface CheckoutServiceInterface {
  /**
   * Retrieves a checkout with information based on the provided arguments.
   *
   * @param args - The arguments for retrieving checkout information.
   * @param args.cartId - The ID of the cart to retrieve the checkout for.
   * @param args.paymentMethodId - The ID of the payment method to be preselected.
   * @param args.shippingMethodId - The ID of the shipping method to be preselected.
   * @param args.checkout - The checkout input data of Type CheckoutInputType.
   * @returns A promise that resolves to the checkout information or undefined.
   */
  get(args: {
    cartId?: string;
    paymentMethodId?: number;
    shippingMethodId?: number;
    checkout?: CheckoutInputType;
  }): Promise<CheckoutType | undefined>;

  /**
   * Validates the checkout process with the given cart ID and checkout input.
   * Make sure to call get() with the same checkout arg or paymentMethodId before calling validate().
   * Validations include checking that the cart has stock and that the customer is not blocked.
   *
   * @param args - The arguments for validating the checkout.
   * @param args.cartId - The ID of the cart to validate.
   * @param args.checkout - The checkout input data of type CheckoutInputType.
   * @returns A promise that resolves to the validation response or undefined.
   */
  validate(args: {
    cartId: string;
    checkout: CheckoutInputType;
  }): Promise<ValidateOrderCreationResponseType | undefined>;

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
  tokenCreate(args?: {
    cartId?: string;
    user?: any;
    customerType?: CustomerType;
    paymentId?: number;
    shippingId?: number;
    paymentMethods?: number[];
    shippingMethods?: number[];
    redirectUrls?: any;
    geinsSettings?: GeinsSettings;
  }): Promise<string | undefined>;

  /**
   * Parses a checkout token and returns the payload.
   *
   * @param token - The token to parse.
   * @returns A promise that resolves to the parsed token payload or undefined.
   */
  tokenParse(token: string): Promise<CheckoutTokenPayload | undefined>;
}

export class CheckoutService extends BaseApiService implements CheckoutServiceInterface {
  private _settings!: OMSSettings;

  constructor(
    apiClient: any,
    geinsSettings: GeinsSettings,
    _settings: OMSSettings,
    private _parent?: GeinsOMS,
  ) {
    super(apiClient, geinsSettings);
    this._settings = _settings;
  }

  async get(args: {
    cartId?: string;
    paymentMethodId?: number;
    shippingMethodId?: number;
    checkout?: CheckoutInputType;
  }): Promise<CheckoutType | undefined> {
    const resolvedArgs = { ...args };

    if (!resolvedArgs.cartId) {
      if (this._parent?.cart.id) {
        resolvedArgs.cartId = this._parent?.cart.id;
      }

      if (!resolvedArgs.cartId) {
        throw new Error('Missing cartId');
      }
    }

    if (resolvedArgs.checkout) {
      const checkout: CheckoutInputType = resolvedArgs.checkout;

      if (checkout.paymentId) {
        resolvedArgs.paymentMethodId = checkout.paymentId;
      }

      if (checkout.shippingId) {
        resolvedArgs.shippingMethodId = checkout.shippingId;
      }
    }

    if (!resolvedArgs.paymentMethodId) {
      resolvedArgs.paymentMethodId = this._settings.defaultPaymentId ?? 0;
    }

    if (!resolvedArgs.shippingMethodId) {
      resolvedArgs.paymentMethodId = this._settings.defaultShippingId ?? 0;
    }

    const variables = {
      cartId: resolvedArgs.cartId,
      checkout: {
        paymentId: resolvedArgs.paymentMethodId,
        shippingId: resolvedArgs.shippingMethodId,
      },
    };

    const options: any = {
      query: queries.checkoutCreate,
      variables: this.generateVars(variables),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    try {
      const data = await this.runMutation(options);
      return parseCheckout(data, this._geinsSettings.locale);
    } catch (e) {
      console.error('ERROR', e);
      throw new Error('Error creating cart');
    }
  }

  async validate(args: {
    cartId: string;
    checkout: CheckoutInputType;
  }): Promise<ValidateOrderCreationResponseType | undefined> {
    const variables = {
      cartId: args.cartId,
      checkout: args.checkout,
      marketId: this._geinsSettings.market,
    };

    const options: any = {
      query: queries.checkoutValidate,
      variables: this.createVariables(variables),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    try {
      const data = await this.runQuery(options);
      return parseValidateOrder(data);
    } catch (e) {
      throw new Error('Error validating order');
    }
  }

  async tokenCreate(args?: {
    cartId?: string;
    user?: GeinsUserType;
    customerType?: CustomerType;
    paymentId?: number;
    shippingId?: number;
    paymentMethods?: number[];
    shippingMethods?: number[];
    redirectUrls?: CheckoutRedirectsType;
    geinsSettings?: GeinsSettings;
  }): Promise<string | undefined> {
    const resolvedArgs = { ...args };

    if (!resolvedArgs.cartId) {
      if (this._parent?.cart.id) {
        resolvedArgs.cartId = this._parent?.cart.id;
      }
      if (!resolvedArgs.cartId) {
        throw new Error('Missing cartId');
      }
    }

    if (!resolvedArgs.geinsSettings) {
      resolvedArgs.geinsSettings = this._geinsSettings;
    }

    if (!resolvedArgs.customerType) {
      resolvedArgs.customerType = args?.customerType ?? CustomerType.PERSON;
    }

    if (!resolvedArgs.user) {
      resolvedArgs.user = args?.user;
    }

    if (!resolvedArgs.paymentId) {
      resolvedArgs.paymentId = args?.paymentId ?? this._settings.defaultPaymentId ?? 0;
    }

    if (!resolvedArgs.shippingId) {
      resolvedArgs.shippingId = args?.shippingId ?? this._settings.defaultShippingId ?? 0;
    }

    if (!resolvedArgs.redirectUrls) {
      resolvedArgs.redirectUrls = args?.redirectUrls;
    }

    const obj = {
      cartId: resolvedArgs.cartId,
      user: resolvedArgs.user,
      settings: {
        paymentId: resolvedArgs.paymentId,
        paymentMethods: resolvedArgs.paymentMethods,
        shippingId: resolvedArgs.shippingId,
        shippingMethods: resolvedArgs.shippingMethods,
        customerType: resolvedArgs.customerType,
        redirectUrls: resolvedArgs.redirectUrls,
      },
      geinsSettings: resolvedArgs.geinsSettings,
    };

    return encodeJWT(obj);
  }

  async tokenParse(token: string): Promise<CheckoutTokenPayload | undefined> {
    const decodedToken = decodeJWT(token);
    if (!decodedToken) {
      return undefined;
    }
    return decodedToken.payload;
  }

  private generateVars(variables: any) {
    return this.createVariables(variables);
  }
}
