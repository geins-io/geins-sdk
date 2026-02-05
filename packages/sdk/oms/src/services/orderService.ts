import type { GeinsSettings, OMSSettings, OrderSummaryType } from '@geins/core';
import { BaseApiService, FetchPolicyOptions } from '@geins/core';
import { GeinsOMS } from '../geinsOMS';
import { queries } from '../graphql';
import { parseOrderSummary } from '../parsers';

export interface OrderServiceInterface {
  /**
   * Retrieves an order summary based on the public order ID.
   *
   * @param {Object} args - The arguments object.
   * @param {string} args.publicOrderId - The public order ID.
   * @returns {Promise<OrderSummaryType | undefined>} A promise that resolves to the order summary or undefined.
   */
  get(args: { publicOrderId: string }): Promise<OrderSummaryType | undefined>;
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

  async get(args: {
    publicOrderId: string;
    checkoutMarketId?: string;
  }): Promise<OrderSummaryType | undefined> {
    if (!args.publicOrderId) {
      throw new Error('Missing publicOrderId');
    }

    const variables = {
      publicOrderId: args.publicOrderId,
      marketId: args.checkoutMarketId || this._geinsSettings.market,
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
      throw new Error('Error getting order', { cause: e });
    }
  }
}
