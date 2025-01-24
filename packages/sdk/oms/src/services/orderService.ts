import { GeinsOMS } from '../geinsOMS';
import { queries } from '../graphql';
import { BaseApiService, FetchPolicyOptions } from '@geins/core';
import type {
  GeinsSettings,
  OMSSettings,
  CheckoutInputType,
  OrderSummaryType,
  PlaceOrderResponseType,
} from '@geins/core';
import { parseOrder, parseOrderSummary } from '../parsers';

export interface OrderServiceInterface {
  /**
   * Retrieves an order summary based on the public order ID.
   *
   * @param {Object} args - The arguments object.
   * @param {string} args.publicOrderId - The public order ID.
   * @returns {Promise<OrderSummaryType | undefined>} A promise that resolves to the order summary or undefined.
   */
  get(args: { publicOrderId: string }): Promise<OrderSummaryType | undefined>;

  /**
   * Creates a new order based on the cart ID and checkout information.
   *
   * @param {Object} args - The arguments object.
   * @param {string} args.cartId - The cart ID.
   * @param {CheckoutInputType} args.checkout - The checkout input data.
   * @returns {Promise<PlaceOrderResponseType | undefined>} A promise that resolves to the place order response or undefined.
   */
  create(args: { cartId: string; checkout: CheckoutInputType }): Promise<PlaceOrderResponseType | undefined>;
}
export class OrderService extends BaseApiService implements OrderServiceInterface {
  constructor(
    apiClient: any,
    geinsSettings: GeinsSettings,
    _settings: OMSSettings,
    private _parent?: GeinsOMS,
  ) {
    super(apiClient, geinsSettings);
  }

  async get(args: { publicOrderId: string }): Promise<OrderSummaryType | undefined> {
    if (!args.publicOrderId) {
      throw new Error('Missing publicOrderId');
    }

    const variables = {
      publicOrderId: args.publicOrderId,
    };

    const options: any = {
      query: queries.orderGet,
      variables: this.createVariables(variables),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    try {
      const data = await this.runQuery(options);
      return parseOrderSummary(data, this._geinsSettings.locale);
    } catch (e) {
      throw new Error('Error getting order');
    }
  }

  async create(args: {
    cartId?: string;
    checkout: CheckoutInputType;
  }): Promise<PlaceOrderResponseType | undefined> {
    const { cartId, checkout } = args;

    if (!cartId) {
      const parentCartId = this._parent?.cart.id;
      if (parentCartId) {
        args.cartId = parentCartId;
      } else {
        throw new Error('Missing cartId');
      }
    }

    if (!checkout) {
      throw new Error('Missing checkout');
    }

    const variables = {
      cartId,
      checkout,
    };

    const options: any = {
      query: queries.orderCreate,
      variables: this.createVariables(variables),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    try {
      const data = await this.runQuery(options);
      return parseOrder(data, this._geinsSettings.locale);
    } catch (e) {
      throw new Error('Error creating order');
    }
  }
}
