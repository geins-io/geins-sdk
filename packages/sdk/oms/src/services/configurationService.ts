import type { ApiClientGetter, GraphQLQueryOptions } from '@geins/core';
import {
  BaseApiService,
  FetchPolicyOptions,
  toConfigurationError,
  toConfigurationErrorWithData,
} from '@geins/core';
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

type Wire = Record<string, unknown> | null | undefined;

/**
 * The CPQ (configure, price, quote) area of the merchant API: configuration
 * sessions, their commit, and the cart and order reads that carry a configured
 * line. Stateless, like the cart service.
 *
 * Every call runs without the Apollo cache: a session's nodes carry template
 * ids that repeat across sessions, so normalising them would mix one session
 * into another. A mutation is never retried: a configured add sent twice is two
 * cart lines, because configured lines never merge. Every failure is a
 * {@link ConfigurationError} carrying the provider's codes, typed by the method's
 * own answer: when the API answered data alongside the errors, the error's
 * `data` holds it, parsed as the method answers it.
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
    return this.mutate(queries.configurationCreate, input, requestContext, options, (data) =>
      parseConfiguration(data?.createConfiguration),
    );
  }

  async get(
    configurationId: string,
    requestContext?: RequestContext,
    options?: ConfigurationCallOptions,
  ): Promise<ConfigurationType | null> {
    return this.query(queries.configurationGet, { configurationId }, requestContext, options, (data) =>
      parseConfiguration(data?.getConfiguration),
    );
  }

  /** Apply a batch of changes, in order; answers the whole re-evaluated document. */
  async applyChanges(
    configurationId: string,
    changes: ConfigurationChangeInputType[],
    requestContext?: RequestContext,
    options?: ConfigurationCallOptions,
  ): Promise<ConfigurationType | null> {
    return this.mutate(
      queries.configurationApplyChanges,
      { configurationId, changes },
      requestContext,
      options,
      (data) => parseConfiguration(data?.applyConfigurationChanges),
    );
  }

  async renew(
    configurationId: string,
    requestContext?: RequestContext,
    options?: ConfigurationCallOptions,
  ): Promise<ConfigurationRenewalType | null> {
    return this.mutate(queries.configurationRenew, { configurationId }, requestContext, options, (data) => {
      const renewal = data?.renewConfiguration as { expiresAt?: unknown } | null | undefined;
      return typeof renewal?.expiresAt === 'string' ? { expiresAt: renewal.expiresAt } : null;
    });
  }

  /**
   * Freeze the session into a committed configuration a cart line can carry.
   * In a market of another currency than the session's, the API commits anyway
   * and answers `ConfigurationCurrencyMismatch`: the error's `data` holds the
   * committed configuration, without a price.
   */
  async commit(
    configurationId: string,
    requestContext?: RequestContext,
    options?: ConfigurationCallOptions,
  ): Promise<CommittedConfigurationType | null> {
    return this.mutate(queries.configurationCommit, { configurationId }, requestContext, options, (data) =>
      parseCommittedConfiguration(data?.commitConfiguration),
    );
  }

  /** Release a session; answers whether it was released. */
  async delete(
    configurationId: string,
    requestContext?: RequestContext,
    options?: ConfigurationCallOptions,
  ): Promise<boolean | null> {
    return this.mutate(queries.configurationDelete, { configurationId }, requestContext, options, (data) => {
      const released = data?.deleteConfiguration;
      return typeof released === 'boolean' ? released : null;
    });
  }

  /** Open a new session from a configured cart line, its changes replayed. */
  async reopenCartItem(
    cartId: string,
    itemId: string,
    requestContext?: RequestContext,
    options?: ConfigurationCallOptions,
  ): Promise<ConfigurationType | null> {
    return this.mutate(
      queries.configurationReopenCartItem,
      { cartId, itemId },
      requestContext,
      options,
      (data) => parseConfiguration(data?.reopenCartItemConfiguration),
    );
  }

  // --- Configured cart lines ---

  /** Add a committed configuration as a cart line; answers the cart's lines. */
  async addCartItem(
    cartId: string,
    item: ConfiguredCartItemInputType,
    requestContext?: RequestContext,
    options?: ConfigurationCallOptions,
  ): Promise<ConfiguredCartLinesType | null> {
    return this.mutate(
      queries.configurationAddCartItem,
      {
        id: cartId,
        item: { skuId: item.skuId, quantity: item.quantity, configurationId: item.configurationId },
      },
      requestContext,
      options,
      (data) => parseConfiguredCartLines(data?.addToCart),
    );
  }

  /**
   * Swap a cart line onto another committed configuration; answers the cart's
   * lines. With `configurationId: ""` the line keeps `configurationId: ""` and
   * loses its configuration. When the API refuses the new configuration, the
   * error's `data` holds the cart's lines, unchanged.
   */
  async updateCartItem(
    cartId: string,
    item: ConfiguredCartItemUpdateInputType,
    requestContext?: RequestContext,
    options?: ConfigurationCallOptions,
  ): Promise<ConfiguredCartLinesType | null> {
    return this.mutate(
      queries.configurationUpdateCartItem,
      { id: cartId, item: { id: item.id, quantity: item.quantity, configurationId: item.configurationId } },
      requestContext,
      options,
      (data) => parseConfiguredCartLines(data?.updateCartItem),
    );
  }

  /** A cart's lines with each configured line's committed id and summary. */
  async getCartLines(
    cartId: string,
    requestContext?: RequestContext,
    options?: ConfigurationCallOptions,
  ): Promise<ConfiguredCartLinesType | null> {
    return this.query(queries.configurationGetCartLines, { id: cartId }, requestContext, options, (data) =>
      parseConfiguredCartLines(data?.getCart),
    );
  }

  // --- Orders ---

  /**
   * An order's rows by position, each with its product's type and, when configured, its summary.
   * @deprecated `order.get` reads the same fields on each row in the order read itself.
   */
  async getOrderLines(
    publicOrderId: string,
    requestContext?: RequestContext,
    options?: ConfigurationCallOptions,
  ): Promise<ConfiguredOrderLinesType | null> {
    return this.query(
      queries.configurationGetOrderLines,
      { publicOrderId },
      requestContext,
      options,
      (data) => parseConfiguredOrderLines(data?.getOrderPublic),
    );
  }

  /** An order's rows by position, each with the structure it was committed with. */
  async getOrderLineChoices(
    publicOrderId: string,
    requestContext?: RequestContext,
    options?: ConfigurationCallOptions,
  ): Promise<CommittedOrderLinesType | null> {
    return this.query(
      queries.configurationGetOrderLineChoices,
      { publicOrderId },
      requestContext,
      options,
      (data) => parseCommittedOrderLines(data?.getOrderPublic),
    );
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
        // An answer with errors can carry data a caller needs, such as the
        // unchanged cart of a refused update; Apollo's default drops it.
        errorPolicy: 'all',
        ...(Object.keys(context).length > 0 ? { context } : {}),
      },
    };
  }

  /** The parsed answer, or the answer's errors thrown with it. */
  private answer<T>(
    result: { data?: unknown; errors?: Parameters<typeof toConfigurationErrorWithData>[0] },
    read: (data: Wire) => T | null,
  ): T | null {
    const parsed = read(result.data as Wire);
    if (result.errors?.length) {
      throw toConfigurationErrorWithData(result.errors, parsed);
    }
    return parsed;
  }

  private async query<T>(
    query: GraphQLQueryOptions['query'] & {},
    vars: Record<string, unknown>,
    requestContext: RequestContext | undefined,
    options: ConfigurationCallOptions | undefined,
    read: (data: Wire) => T | null,
  ): Promise<T | null> {
    const context = options?.timeoutMs ? { timeoutMs: options.timeoutMs } : {};
    // Built outside the try: a settings error is the caller's, not the provider's.
    const queryOptions = this.options(query, vars, requestContext, context);
    let result;
    try {
      result = await this.runQuery(queryOptions);
    } catch (error) {
      throw toConfigurationError(error);
    }
    return this.answer(result, read);
  }

  private async mutate<T>(
    query: GraphQLQueryOptions['query'] & {},
    vars: Record<string, unknown>,
    requestContext: RequestContext | undefined,
    options: ConfigurationCallOptions | undefined,
    read: (data: Wire) => T | null,
  ): Promise<T | null> {
    const context = { retry: false, ...(options?.timeoutMs ? { timeoutMs: options.timeoutMs } : {}) };
    const mutationOptions = this.options(query, vars, requestContext, context);
    let result;
    try {
      result = await this.runMutation(mutationOptions);
    } catch (error) {
      throw toConfigurationError(error);
    }
    return this.answer(result, read);
  }
}
