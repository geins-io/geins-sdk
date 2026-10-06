import type { ApiClientGetter, GraphQLQueryOptions } from '@geins/core';
import { BaseApiService, FetchPolicyOptions, toConfigurationError } from '@geins/core';
import type {
  CommittedConfigurationType,
  CommittedOrderLinesType,
  ConfigurationCallOptions,
  ConfigurationChangeInputType,
  ConfigurationRenewalType,
  ConfigurationType,
  ConfiguredCartItemInputType,
  ConfiguredCartItemUpdateInputType,
  ConfiguredCartLinesType,
  ConfiguredOrderLinesType,
  GeinsSettings,
  RequestContext,
} from '@geins/types';
import { queries } from '../graphql';
import {
  parseCommittedConfiguration,
  parseCommittedOrderLines,
  parseConfiguration,
  parseConfiguredCartLines,
  parseConfiguredOrderLines,
} from '../parsers/configurationParser';

/**
 * The CPQ (configure, price, quote) area of the merchant API: configuration
 * sessions, their commit, and the cart and order reads that carry a configured
 * line. Stateless, like the cart service.
 *
 * Every call runs without the Apollo cache: a session's nodes carry template
 * ids that repeat across sessions, so normalising them would mix one session
 * into another. A mutation is never retried: a commit or a configured add sent
 * twice is two lines. Every failure is a {@link ConfigurationError} carrying the
 * provider's codes.
 */
export class ConfigurationService extends BaseApiService {
  constructor(apiClient: ApiClientGetter, geinsSettings: GeinsSettings) {
    super(apiClient, geinsSettings);
  }

  // --- Sessions ---

  /** Start a session for a product, by its Geins product id or its article number. */
  async create(
    input: { productId?: number; articleNumber?: string; quantity: number },
    requestContext?: RequestContext,
    options?: ConfigurationCallOptions,
  ): Promise<ConfigurationType | null> {
    const data = await this.mutate(queries.configurationCreate, input, requestContext, options);
    return parseConfiguration(data?.createConfiguration);
  }

  async get(
    configurationId: string,
    requestContext?: RequestContext,
    options?: ConfigurationCallOptions,
  ): Promise<ConfigurationType | null> {
    const data = await this.query(queries.configurationGet, { configurationId }, requestContext, options);
    return parseConfiguration(data?.getConfiguration);
  }

  /** Apply a batch of changes, in order; answers the whole re-evaluated document. */
  async applyChanges(
    configurationId: string,
    changes: ConfigurationChangeInputType[],
    requestContext?: RequestContext,
    options?: ConfigurationCallOptions,
  ): Promise<ConfigurationType | null> {
    const data = await this.mutate(
      queries.configurationApplyChanges,
      { configurationId, changes },
      requestContext,
      options,
    );
    return parseConfiguration(data?.applyConfigurationChanges);
  }

  async renew(
    configurationId: string,
    requestContext?: RequestContext,
    options?: ConfigurationCallOptions,
  ): Promise<ConfigurationRenewalType | null> {
    const data = await this.mutate(queries.configurationRenew, { configurationId }, requestContext, options);
    const renewal = data?.renewConfiguration as { expiresAt?: unknown } | null | undefined;
    return typeof renewal?.expiresAt === 'string' ? { expiresAt: renewal.expiresAt } : null;
  }

  /** Freeze the session into a committed configuration a cart line can carry. */
  async commit(
    configurationId: string,
    requestContext?: RequestContext,
    options?: ConfigurationCallOptions,
  ): Promise<CommittedConfigurationType | null> {
    const data = await this.mutate(queries.configurationCommit, { configurationId }, requestContext, options);
    return parseCommittedConfiguration(data?.commitConfiguration);
  }

  /** Release a session; answers whether it was released. */
  async delete(
    configurationId: string,
    requestContext?: RequestContext,
    options?: ConfigurationCallOptions,
  ): Promise<boolean | null> {
    const data = await this.mutate(queries.configurationDelete, { configurationId }, requestContext, options);
    const released = data?.deleteConfiguration;
    return typeof released === 'boolean' ? released : null;
  }

  /** Open a new session from a configured cart line, its changes replayed. */
  async reopenCartItem(
    cartId: string,
    itemId: string,
    requestContext?: RequestContext,
    options?: ConfigurationCallOptions,
  ): Promise<ConfigurationType | null> {
    const data = await this.mutate(
      queries.configurationReopenCartItem,
      { cartId, itemId },
      requestContext,
      options,
    );
    return parseConfiguration(data?.reopenCartItemConfiguration);
  }

  // --- Configured cart lines ---

  /** Add a committed configuration as a cart line; answers the cart's lines. */
  async addCartItem(
    cartId: string,
    item: ConfiguredCartItemInputType,
    requestContext?: RequestContext,
    options?: ConfigurationCallOptions,
  ): Promise<ConfiguredCartLinesType | null> {
    const data = await this.mutate(
      queries.configurationAddCartItem,
      {
        id: cartId,
        item: { skuId: item.skuId, quantity: item.quantity, configurationId: item.configurationId },
      },
      requestContext,
      options,
    );
    return parseConfiguredCartLines(data?.addToCart);
  }

  /** Swap a cart line onto another committed configuration; answers the cart's lines. */
  async updateCartItem(
    cartId: string,
    item: ConfiguredCartItemUpdateInputType,
    requestContext?: RequestContext,
    options?: ConfigurationCallOptions,
  ): Promise<ConfiguredCartLinesType | null> {
    const data = await this.mutate(
      queries.configurationUpdateCartItem,
      { id: cartId, item: { id: item.id, quantity: item.quantity, configurationId: item.configurationId } },
      requestContext,
      options,
    );
    return parseConfiguredCartLines(data?.updateCartItem);
  }

  /** A cart's lines with each configured line's committed id and summary. */
  async getCartLines(
    cartId: string,
    requestContext?: RequestContext,
    options?: ConfigurationCallOptions,
  ): Promise<ConfiguredCartLinesType | null> {
    const data = await this.query(queries.configurationGetCartLines, { id: cartId }, requestContext, options);
    return parseConfiguredCartLines(data?.getCart);
  }

  // --- Orders ---

  /** An order's rows by position, each with its product's type and, when configured, its summary. */
  async getOrderLines(
    publicOrderId: string,
    requestContext?: RequestContext,
    options?: ConfigurationCallOptions,
  ): Promise<ConfiguredOrderLinesType | null> {
    const data = await this.query(
      queries.configurationGetOrderLines,
      { publicOrderId },
      requestContext,
      options,
    );
    return parseConfiguredOrderLines(data?.getOrderPublic);
  }

  /** An order's rows by position, each with the structure it was committed with. */
  async getOrderLineChoices(
    publicOrderId: string,
    requestContext?: RequestContext,
    options?: ConfigurationCallOptions,
  ): Promise<CommittedOrderLinesType | null> {
    const data = await this.query(
      queries.configurationGetOrderLineChoices,
      { publicOrderId },
      requestContext,
      options,
    );
    return parseCommittedOrderLines(data?.getOrderPublic);
  }

  // --- Transport ---

  private options(
    query: GraphQLQueryOptions['query'] & {},
    vars: Record<string, unknown>,
    requestContext: RequestContext | undefined,
    context: Record<string, unknown>,
  ): GraphQLQueryOptions {
    return {
      ...this.createQueryOptions(query, vars, requestContext),
      requestOptions: {
        fetchPolicy: FetchPolicyOptions.NO_CACHE,
        ...(Object.keys(context).length > 0 ? { context } : {}),
      },
    };
  }

  private async query(
    query: GraphQLQueryOptions['query'] & {},
    vars: Record<string, unknown>,
    requestContext?: RequestContext,
    options?: ConfigurationCallOptions,
  ): Promise<Record<string, unknown> | null | undefined> {
    const context = options?.timeoutMs ? { timeoutMs: options.timeoutMs } : {};
    // Built outside the try: a settings error is the caller's, not the provider's.
    const queryOptions = this.options(query, vars, requestContext, context);
    try {
      const result = await this.runQuery(queryOptions);
      return result.data as Record<string, unknown> | null | undefined;
    } catch (error) {
      throw toConfigurationError(error);
    }
  }

  private async mutate(
    query: GraphQLQueryOptions['query'] & {},
    vars: Record<string, unknown>,
    requestContext?: RequestContext,
    options?: ConfigurationCallOptions,
  ): Promise<Record<string, unknown> | null | undefined> {
    const context = { retry: false, ...(options?.timeoutMs ? { timeoutMs: options.timeoutMs } : {}) };
    const mutationOptions = this.options(query, vars, requestContext, context);
    try {
      const result = await this.runMutation(mutationOptions);
      return result.data as Record<string, unknown> | null | undefined;
    } catch (error) {
      throw toConfigurationError(error);
    }
  }
}
