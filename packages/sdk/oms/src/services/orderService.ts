import type { GeinsSettings, OMSSettings, OrderSummaryType } from '@geins/core';
import { BaseApiService, FetchPolicyOptions, GeinsError, GeinsErrorCode, OrderError } from '@geins/core';
import type { ApiClientGetter, GraphQLQueryOptions } from '@geins/core';
import { queries } from '../graphql';
import { parseOrderSummary } from '../parsers';

/** Contract for the order service. */
export interface OrderServiceInterface {
  /**
   * Retrieves an order summary based on the public order ID.
   *
   * @param args.publicOrderId - The public order ID.
   * @param args.checkoutMarketId - Optional market override.
   */
  get(args: { publicOrderId: string; checkoutMarketId?: string }): Promise<OrderSummaryType | undefined>;
}

/** Service for retrieving order summaries by public order ID. */
export class OrderService extends BaseApiService implements OrderServiceInterface {
  constructor(
    apiClient: ApiClientGetter,
    geinsSettings: GeinsSettings,
  ) {
    super(apiClient, geinsSettings);
  }

  /**
   * Retrieves a parsed order summary by public order ID.
   * @param args.publicOrderId - The public-facing order identifier.
   * @param args.checkoutMarketId - Optional market override; defaults to settings market.
   * @returns The parsed order summary, or undefined if not found.
   * @throws {OrderError} If the query fails.
   */
  async get(args: {
    publicOrderId: string;
    checkoutMarketId?: string;
  }): Promise<OrderSummaryType | undefined> {
    if (!args.publicOrderId) {
      throw new GeinsError('Missing publicOrderId', GeinsErrorCode.INVALID_ARGUMENT);
    }

    const variables = {
      publicOrderId: args.publicOrderId,
      marketId: args.checkoutMarketId || this._geinsSettings.market,
    };

    const options: GraphQLQueryOptions = {
      query: queries.orderGet,
      variables: this.createVariables(variables),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    try {
      const data = await this.runQuery(options);
      return parseOrderSummary(data, this._geinsSettings.locale);
    } catch (e) {
      throw new OrderError('Error getting order', GeinsErrorCode.ORDER_FAILED, e);
    }
  }
}
