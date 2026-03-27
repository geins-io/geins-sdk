import type { GeinsSettings, GeinsUserOrdersType, RequestContext } from '@geins/types';
import { BaseApiService } from '@geins/core';
import type { ApiClientGetter, GraphQLQueryOptions } from '@geins/core';
import { queries } from '../graphql';

/** Service for fetching the authenticated user's order history. */
export class UserOrdersService extends BaseApiService {
  constructor(apiClient: ApiClientGetter, geinsSettings: GeinsSettings) {
    super(apiClient, geinsSettings);
  }

  /** Enriches variables with default locale, market, and channel. */
  private generateVars(variables: Record<string, unknown>, requestContext?: RequestContext): Record<string, unknown> {
    return this.createVariables({ ...variables, ...requestContext });
  }

  /**
   * Fetches the authenticated user's orders.
   * @param userToken - The user's authentication token.
   * @param requestContext - Optional per-request locale/market/channel overrides.
   * @returns The user's orders, or undefined if none found.
   */
  async get(userToken: string, requestContext?: RequestContext): Promise<GeinsUserOrdersType | undefined> {
    const options: GraphQLQueryOptions = {
      query: queries.userOrders,
      variables: this.generateVars({}, requestContext),
      userToken,
    };
    return this.runQueryParsed<GeinsUserOrdersType>(options);
  }

  /** Extracts the orders array from the getOrders response. */
  protected parseResult(result: unknown): GeinsUserOrdersType | undefined {
    const r = result as { data?: { getOrders?: GeinsUserOrdersType } };
    if (!r?.data?.getOrders) {
      return undefined;
    }
    return r.data.getOrders;
  }
}
