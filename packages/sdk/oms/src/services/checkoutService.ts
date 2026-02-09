import { BaseApiService, CheckoutError, FetchPolicyOptions, GeinsError, GeinsErrorCode, decodeJWT, encodeJWT, parseErrorMessage } from '@geins/core';
import type { ApiClientGetter, GraphQLQueryOptions } from '@geins/core';

import type {
  CheckoutInputType,
  CheckoutSummaryType,
  CheckoutTokenPayload,
  CheckoutType,
  CreateOrderOptions,
  CreateOrderResponseType,
  GeinsSettings,
  GenerateCheckoutTokenOptions,
  GetCheckoutOptions,
  OMSSettings,
  ValidateOrderConditionsArgs,
  ValidateOrderConditionsResponseType,
  ValidateOrderCreationResponseType,
} from '@geins/core';

import { queries } from '../graphql';
import { parseCheckout, parseCheckoutSummary, parseOrder, parseValidateOrderConditions } from '../parsers';
import { CheckoutDataResolver, UrlProcessor } from '../util';

export interface CheckoutServiceInterface {
  /**
   * Retrieves a checkout with information based on the provided arguments.
   *
   * @param {Object} args - The arguments for retrieving checkout information.
   * @param {string} args.cartId - The ID of the cart to retrieve the checkout for. If not provided, the cart ID from the parent OMS instance will be used.
   * @param {number} args.paymentMethodId - The ID of the payment method to be preselected.
   * @param {number} args.shippingMethodId - The ID of the shipping method to be preselected.
   * @param {CheckoutInputType} args.checkoutOptions - The checkout input data of Type CheckoutInputType.
   * @returns A promise that resolves to the checkout information or undefined.
   */
  get(args?: GetCheckoutOptions): Promise<CheckoutType | undefined>;

  /**
   * Validates the checkout process with the given cart ID and checkout input.
   * Make sure to call get() with the same checkout arg or paymentMethodId before calling validate().
   * Validations include checking that the cart has stock and that the customer is not blocked.
   *
   * @param {CreateOrderOptions} args - The arguments for validating the checkout.
   * @param {string} [args.cartId] - The ID of the cart to validate.
   * @param {CheckoutInputType} [args.checkoutOptions] - The checkout input data of type CheckoutInputType.
   * @returns A promise that resolves to the validation response or undefined.
   */
  validate(args: CreateOrderOptions): Promise<ValidateOrderCreationResponseType | undefined>;

  /**
   * Validates the order conditions with the given cart ID and email.
   * Validations include checking that the cart has stock and that the customer is not blocked.
   *
   * @param {ValidateOrderConditionsArgs} args - The arguments for validating the order conditions.
   * @param {string} args.cartId - The ID of the cart to validate.
   * @param {string} [args.email] - The email of the customer.
   * @returns A promise that resolves to the validation response or undefined.
   */
  validateOrder(args: ValidateOrderConditionsArgs): Promise<ValidateOrderConditionsResponseType | undefined>;

  /**
   * Creates a new order based on the cart ID and checkout information.
   *
   * @param {CreateOrderOptions} args - The arguments object.
   * @param {string} args.cartId - The cart ID.
   * @param {CheckoutInputType} [args.checkoutOptions] - The checkout input data (optional).
   * @returns {Promise<CreateOrderResponseType | undefined>} A promise that resolves to the place order response or undefined.
   */
  createOrder(args: CreateOrderOptions): Promise<CreateOrderResponseType | undefined>;

  /**
   * Retrieves a summary of the checkout process after a completed order.
   *
   * @param {Object} args - The arguments for getting the checkout summary.
   * @param {string} args.orderId - The ID of the order.
   * @param {string} args.paymentMethod - The payment type.
   * @returns {Promise<CheckoutSummaryType | undefined>} A promise that resolves to the checkout summary or undefined.
   */
  summary(args: { orderId: string; paymentMethod: string }): Promise<CheckoutSummaryType | undefined>;

  /**
   * Creates a token for the checkout process to use when sending user to an external checkout page.
   *
   * @param {GenerateCheckoutTokenOptions} args - The arguments for creating the token.
   * @param {string} [args.cartId] - The ID of the cart (optional), if not provided cookie will be read.
   * @param {Object} [args.user] - The user information (optional).
   * @param {boolean} [args.isCartEditable] - Indicates if the cart is editable (optional).
   * @param {number} [args.selectedPaymentMethodId] - The ID of the payment method (optional).
   * @param {number} [args.selectedShippingMethodId] - The ID of the shipping method (optional).
   * @param {number[]} [args.availablePaymentMethodIds] - The list of available payment method IDs (optional).
   * @param {number[]} [args.availableShippingMethodIds] - The list of available shipping method IDs (optional).
   * @param {string[]} [args.redirectUrls] - The redirect URLs (optional).
   * @param {string} [args.branding] - The checkout style (optional).
   * @param {GeinsSettings} [args.geinsSettings] - The Geins settings (optional).
   * @returns {Promise<string | undefined>} A promise that resolves to the generated token or undefined.
   */
  createToken(args?: GenerateCheckoutTokenOptions): Promise<string | undefined>;

  /**
   * Generates checkout parameters by merging current parameters with default CHECKOUT_PARAMETERS
   * @param currentParameters - Map of current parameters to merge with defaults
   * @returns A new Map containing merged checkout parameters
   * @example
   * const params = new Map([['key', 'value']]);
   * const mergedParams = generateExternalCheckoutUrlParameters(params);
   */
  generateExternalCheckoutUrlParameters(currentParameters: Map<string, string>): Map<string, string>;
}

export class CheckoutService extends BaseApiService implements CheckoutServiceInterface {
  private readonly dataResolver;
  private _settings: OMSSettings;

  constructor(
    apiClient: ApiClientGetter,
    geinsSettings: GeinsSettings,
    _settings: OMSSettings,
  ) {
    super(apiClient, geinsSettings);
    this._settings = _settings;
    this.dataResolver = new CheckoutDataResolver(geinsSettings, _settings);
  }

  async get(args?: GetCheckoutOptions): Promise<CheckoutType | undefined> {
    const data = this.dataResolver.resolveGetCheckoutOptions(args);
    try {
      const variables = {
        cartId: data.cartId,
        checkout: {
          paymentId: data.paymentMethodId,
          shippingId: data.shippingMethodId,
          ...data.checkoutOptions,
        },
        marketId: data.checkoutMarketId || this._geinsSettings.market,
      };

      const options = {
        query: queries.checkoutCreate,
        variables: this.generateVars(variables),
        requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
      };

      const queryResult = await this.runMutation(options);
      return parseCheckout(queryResult, this._geinsSettings.locale);
    } catch (error) {
      throw new CheckoutError('Error getting checkout', GeinsErrorCode.CHECKOUT_FAILED, error);
    }
  }

  async validate(args: CreateOrderOptions): Promise<ValidateOrderCreationResponseType | undefined> {
    const resolvedArgs = { ...args };

    if (!resolvedArgs.cartId) {
      throw new GeinsError('Missing cartId', GeinsErrorCode.INVALID_ARGUMENT);
    }

    if (!resolvedArgs.checkoutOptions) {
      throw new GeinsError('Missing checkout options', GeinsErrorCode.INVALID_ARGUMENT);
    }

    const variables = {
      cartId: resolvedArgs.cartId,
      checkout: resolvedArgs.checkoutOptions,
      marketId: resolvedArgs.checkoutMarketId || this._geinsSettings.market,
    };

    const options: GraphQLQueryOptions = {
      query: queries.checkoutValidate,
      variables: this.createVariables(variables),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    try {
      const data = await this.runQuery(options);
      return parseValidateOrderConditions(data);
    } catch (e) {
      throw new CheckoutError('Error validating order', GeinsErrorCode.CHECKOUT_FAILED, e);
    }
  }

  async validateOrder(
    args: ValidateOrderConditionsArgs,
  ): Promise<ValidateOrderConditionsResponseType | undefined> {
    const resolvedArgs = { ...args };

    if (!resolvedArgs.cartId) {
      throw new GeinsError('Missing cartId', GeinsErrorCode.INVALID_ARGUMENT);
    }

    const variables = {
      cartId: resolvedArgs.cartId,
      email: resolvedArgs.email,
      marketId: this._geinsSettings.market,
    };

    const options: GraphQLQueryOptions = {
      query: queries.checkoutValidate,
      variables: this.createVariables(variables),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    try {
      const data = await this.runQuery(options);
      return parseValidateOrderConditions(data);
    } catch (e) {
      throw new CheckoutError('Error validating order', GeinsErrorCode.CHECKOUT_FAILED, e);
    }
  }

  async createOrder(args: CreateOrderOptions): Promise<CreateOrderResponseType | undefined> {
    const resolvedArgs = { ...args };

    if (!resolvedArgs.cartId) {
      throw new GeinsError('Missing cartId', GeinsErrorCode.INVALID_ARGUMENT);
    }

    if (!resolvedArgs.checkoutOptions) {
      throw new GeinsError('Missing checkout options', GeinsErrorCode.INVALID_ARGUMENT);
    }

    const variables = {
      cartId: resolvedArgs.cartId,
      checkout: resolvedArgs.checkoutOptions,
      marketId: resolvedArgs.checkoutMarketId || this._geinsSettings.market,
    };

    const options: GraphQLQueryOptions = {
      query: queries.orderCreate,
      variables: this.createVariables(variables),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    try {
      const data = await this.runQuery(options);
      return parseOrder(data, this._geinsSettings.locale);
    } catch (e) {
      return {
        created: false,
        message: parseErrorMessage(e as Error),
      } as CreateOrderResponseType;
    }
  }

  async summary(args: { orderId: string; paymentMethod: string }): Promise<CheckoutSummaryType | undefined> {
    if (!args.orderId) {
      throw new GeinsError('Missing orderId', GeinsErrorCode.INVALID_ARGUMENT);
    }

    if (!args.paymentMethod) {
      throw new GeinsError('Missing paymentMethod', GeinsErrorCode.INVALID_ARGUMENT);
    }

    const variables = {
      id: args.orderId,
      paymentType: args.paymentMethod,
    };

    const options: GraphQLQueryOptions = {
      query: queries.checkoutSummaryGet,
      variables: this.createVariables(variables),
    };

    try {
      const data = await this.runQuery(options);
      return parseCheckoutSummary(data, this._geinsSettings.locale);
    } catch (e) {
      console.error('ERROR', e);
      throw new CheckoutError('Error getting summary', GeinsErrorCode.CHECKOUT_FAILED, e);
    }
  }

  async createToken(args?: GenerateCheckoutTokenOptions): Promise<string | undefined> {
    const resolvedArgs = this.dataResolver.resolveCheckoutTokenOptions(args);
    const obj = {
      cartId: resolvedArgs.cartId,
      user: resolvedArgs.user,
      checkoutSettings: {
        isCartEditable: resolvedArgs?.isCartEditable ?? false,
        copyCart: resolvedArgs?.copyCart ?? true,
        selectedPaymentMethodId: resolvedArgs.selectedPaymentMethodId,
        selectedShippingMethodId: resolvedArgs.selectedShippingMethodId,
        availablePaymentMethodIds: resolvedArgs.availablePaymentMethodIds,
        availableShippingMethodIds: resolvedArgs.availableShippingMethodIds,
        customerType: resolvedArgs.customerType,
        redirectUrls: resolvedArgs.redirectUrls,
        branding: resolvedArgs.branding,
      },
      geinsSettings: resolvedArgs.geinsSettings,
    } as CheckoutTokenPayload;
    return encodeJWT(obj as unknown as Record<string, unknown>);
  }

  generateExternalCheckoutUrlParameters(currentParameters: Map<string, string>): Map<string, string> {
    return UrlProcessor.generateParameters(currentParameters);
  }

  static async parseToken(token: string): Promise<CheckoutTokenPayload | undefined> {
    const decodedToken = decodeJWT(token);
    if (!decodedToken) {
      return undefined;
    }
    return decodedToken.payload as CheckoutTokenPayload;
  }

  private generateVars(variables: Record<string, unknown>) {
    return this.createVariables(variables);
  }
}
