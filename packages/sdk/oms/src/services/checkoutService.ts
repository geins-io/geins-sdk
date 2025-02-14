import {
  BaseApiService,
  CustomerType,
  FetchPolicyOptions,
  encodeJWT,
  decodeJWT,
  extractParametersFromUrl,
  CHECKOUT_PARAMETERS,
} from '@geins/core';

import type {
  GeinsSettings,
  OMSSettings,
  CheckoutType,
  CheckoutTokenPayload,
  CheckoutInputType,
  ValidateOrderCreationResponseType,
  CheckoutRedirectsType,
  GenerateCheckoutTokenOptions,
} from '@geins/core';

import { GeinsOMS } from '../geinsOMS';
import { queries } from '../graphql';
import { parseCheckout, parseValidateOrder, parseCheckoutSummary } from '../parsers';

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
   * Retrieves a summary of the checkout process after a completed order.
   *
   * @param args - WIP
   * @returns - WIP
   */
  getSummary(args: {}): Promise<CheckoutType | undefined>;

  /**
   * Generates checkout parameters by merging current parameters with default CHECKOUT_PARAMETERS
   * @param currentParameters - Map of current parameters to merge with defaults
   * @returns A new Map containing merged checkout parameters
   * @example
   * const params = new Map([['key', 'value']]);
   * const mergedParams = generateCheckoutParameters(params);
   */
  generateExternalCheckoutUrlParameters(currentParameters: Map<string, string>): Map<string, string>;

  /**
   * Creates a token for the checkout process to use when sending user to an external checkout page.
   *
   * @param args - The arguments for creating the token.
   * @param args.cartId - The ID of the cart (optional), if not provided cookie will be read.
   * @param args.user - The user information (optional).
   * @param args.isCartEditable - Indicates if the cart is editable (optional).
   * @param args.selectedPaymentMethodId - The ID of the payment method (optional).
   * @param args.selectedShippingMethodId - The ID of the shipping method (optional).
   * @param args.availablePaymentMethodIds - The list of available payment method IDs (optional).
   * @param args.availableShippingMethodIds - The list of available shipping method IDs (optional).
   * @param args.redirectUrls - The redirect URLs (optional).
   * @param args.checkoutStyle - The checkout style (optional).
   * @param args.geinsSettings - The Geins settings (optional).
   * @returns A promise that resolves to the generated token or undefined.
   */
  tokenCreate(args?: GenerateCheckoutTokenOptions): Promise<string | undefined>;
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
      resolvedArgs.shippingMethodId = this._settings.defaultShippingId ?? 0;
    }

    const variables = {
      cartId: resolvedArgs.cartId,
      checkout: {
        paymentId: resolvedArgs.paymentMethodId,
        shippingId: resolvedArgs.shippingMethodId,
        checkoutUrls: resolvedArgs.checkout?.checkoutUrls,
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

  async getSummary(args: { orderId: string; paymentType: string }): Promise<any | undefined> {
    if (!args.orderId) {
      throw new Error('Missing orderId');
    }

    if (!args.paymentType) {
      throw new Error('Missing paymentType');
    }

    const variables = {
      id: args.orderId,
      paymentType: args.paymentType,
    };

    const options: any = {
      query: queries.checkoutSummaryGet,
      variables: this.createVariables(variables),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    try {
      const data = await this.runQuery(options);
      return parseCheckoutSummary(data, this._geinsSettings.locale);
    } catch (e) {
      throw new Error(`Error getting summmary`);
    }
  }

  async tokenCreate(args?: GenerateCheckoutTokenOptions): Promise<string | undefined> {
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
      resolvedArgs.geinsSettings = this._geinsSettings ?? {};
    }

    if (!resolvedArgs.customerType) {
      resolvedArgs.customerType = args?.customerType ?? CustomerType.PERSON;
    }

    if (!resolvedArgs.user) {
      resolvedArgs.user = args?.user;
    }

    if (!resolvedArgs.selectedPaymentMethodId) {
      resolvedArgs.selectedPaymentMethodId =
        args?.selectedPaymentMethodId ?? this._settings.defaultPaymentId ?? 0;
    }

    if (!resolvedArgs.selectedShippingMethodId) {
      resolvedArgs.selectedShippingMethodId =
        args?.selectedShippingMethodId ?? this._settings.defaultShippingId ?? 0;
    }

    if (!resolvedArgs.redirectUrls) {
      resolvedArgs.redirectUrls = args?.redirectUrls;
      if (!resolvedArgs.redirectUrls) {
        resolvedArgs.redirectUrls = this._settings.checkoutUrls;
      }
    }
    if (resolvedArgs.redirectUrls) {
      // add parameters to urls
      resolvedArgs.redirectUrls = this.addParametersToUrls(resolvedArgs.redirectUrls);
    }

    const obj = {
      cartId: resolvedArgs.cartId,
      user: resolvedArgs.user,
      checkoutSettings: {
        isCartEditable: resolvedArgs?.isCartEditable ?? false,
        cloneCart: resolvedArgs?.cloneCart ?? true,
        selectedPaymentMethodId: resolvedArgs.selectedPaymentMethodId,
        selectedShippingMethodId: resolvedArgs.selectedShippingMethodId,
        availablePaymentMethodIds: resolvedArgs.availablePaymentMethodIds,
        availableShippingMethodIds: resolvedArgs.availableShippingMethodIds,
        customerType: resolvedArgs.customerType,
        redirectUrls: resolvedArgs.redirectUrls,
        style: resolvedArgs.checkoutStyle,
      },
      geinsSettings: resolvedArgs.geinsSettings,
    } as CheckoutTokenPayload;

    return encodeJWT(obj);
  }

  generateExternalCheckoutUrlParameters(currentParameters: Map<string, string>): Map<string, string> {
    const mergedMap = new Map(CHECKOUT_PARAMETERS);
    Array.from(currentParameters.entries()).forEach(([key, value]) => {
      mergedMap.set(key, value);
    });
    return mergedMap;
  }

  static async tokenParse(token: string): Promise<CheckoutTokenPayload | undefined> {
    const decodedToken = decodeJWT(token);
    if (!decodedToken) {
      return undefined;
    }
    return decodedToken.payload;
  }

  private addParametersToUrls(redirectUrls: CheckoutRedirectsType): CheckoutRedirectsType | undefined {
    if (!redirectUrls) {
      return;
    }

    (Object.keys(redirectUrls) as Array<keyof CheckoutRedirectsType>).forEach((key) => {
      if (!redirectUrls[key]) {
        return;
      }
      // only add for success url
      if (key !== 'success') {
        return;
      }
      const { url, params } = extractParametersFromUrl(redirectUrls[key]);
      const parameters = this.generateExternalCheckoutUrlParameters(params);
      const queryString = this.mapToQueryString(parameters);

      redirectUrls[key] = `${url}${queryString}`;
    });
    return redirectUrls;
  }

  private mapToQueryString(parameters: Map<string, string>): string {
    if (!parameters.size) {
      return '';
    }
    const queryParams = Array.from(parameters.entries())
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    return `?${queryParams}`;
  }

  private generateVars(variables: any) {
    return this.createVariables(variables);
  }
}
