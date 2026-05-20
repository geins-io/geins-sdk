import type { GeinsSettings, OMSSettings, OrderSummaryType, RequestContext } from '@geins/core';
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
   * @param requestContext - Optional per-request locale/market overrides.
   */
  get(args: { publicOrderId: string; checkoutMarketId?: string }, requestContext?: RequestContext): Promise<OrderSummaryType | undefined>;
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
   * @param requestContext - Optional per-request locale/market overrides.
   * @returns The parsed order summary, or undefined if not found.
   * @throws {OrderError} If the query fails.
   */
  async get(args: {
    publicOrderId: string;
    checkoutMarketId?: string;
  }, requestContext?: RequestContext): Promise<OrderSummaryType | undefined> {
    if (!args.publicOrderId) {
      throw new GeinsError('Missing publicOrderId', GeinsErrorCode.INVALID_ARGUMENT);
    }

    const options = this.buildOptions(
      queries.orderGet,
      {
        publicOrderId: args.publicOrderId,
        marketId: args.checkoutMarketId || this._geinsSettings.market,
      },
      requestContext,
    );

    try {
      const data = await this.runQuery(options);
      return parseOrderSummary(data, this._geinsSettings.locale);
    } catch (e) {
      throw new OrderError('Error getting order', GeinsErrorCode.ORDER_FAILED, e);
    }
  }

  /**
   * Build order query options, routing userToken into the request
   * options (so the API sends an Authorization header) and merging
   * the remaining context fields into the GraphQL variables. Order
   * lookup runs NO_CACHE because order state is per-user.
   *
   * Without this routing the order query runs unauthenticated and
   * Geins applies anonymous pricing on the order line, masking the
   * customer's CRM price-list overrides on read.
   */
  private buildOptions(
    query: GraphQLQueryOptions['query'],
    vars: Record<string, unknown>,
    requestContext?: RequestContext,
  ): GraphQLQueryOptions {
    const { userToken, ...contextVars } = requestContext ?? {};
    return {
      query,
      variables: this.createVariables({ ...vars, ...contextVars }),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
      ...(userToken ? { userToken } : {}),
    };
  }
}
