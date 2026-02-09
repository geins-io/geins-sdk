import type { GeinsSettings } from '@geins/types';
import type { MerchantApiClient } from '../api-client/merchantApiClient';
import { GraphQLQueryOptions } from '../api-client/merchantApiClient';
import { GeinsError, GeinsErrorCode } from '../errors/geinsError';

/** Function that returns a MerchantApiClient instance. */
export type ApiClientGetter = () => MerchantApiClient;

/**
 * Abstract base class for all API services.
 * Provides shared utilities for query execution, variable preparation, and result parsing.
 */
export abstract class BaseApiService {
  protected _apiClient: ApiClientGetter | undefined;
  protected _geinsSettings: GeinsSettings;
  protected _channelId: string;

  /**
   * @param apiClient - Getter function that returns the MerchantApiClient.
   * @param geinsSettings - SDK settings including channel, tld, locale, and market.
   * @throws {GeinsError} If channel is not set in settings.
   */
  constructor(apiClient: ApiClientGetter, geinsSettings: GeinsSettings) {
    this._apiClient = apiClient;

    if (!geinsSettings.channel) {
      throw new GeinsError('Channel is required', GeinsErrorCode.INVALID_ARGUMENT);
    }

    this._geinsSettings = geinsSettings;
    this._channelId = `${geinsSettings.channel}|${geinsSettings.tld}`;
  }

  /** Releases the API client reference, making this service instance unusable. */
  destroy(): void {
    this._apiClient = undefined;
  }

  /**
   * Merges caller-provided variables with default languageId, marketId, and channelId from settings.
   * @param vars - Variables to enrich with defaults.
   * @returns The enriched variables object.
   * @throws {GeinsError} If locale or market is missing when not provided in vars.
   */
  protected createVariables(vars: Record<string, unknown>): Record<string, unknown> {
    const variables: Record<string, unknown> = { ...vars };

    if (!variables.languageId) {
      if (!this._geinsSettings.locale) {
        throw new GeinsError('Language is required', GeinsErrorCode.INVALID_ARGUMENT);
      }
      variables.languageId = this._geinsSettings.locale;
    }

    if (!variables.marketId) {
      if (!this._geinsSettings.market) {
        throw new GeinsError('Market is required', GeinsErrorCode.INVALID_ARGUMENT);
      }
      variables.marketId = this._geinsSettings.market;
    }

    if (!variables.channelId) {
      variables.channelId = this._channelId;
    }

    return variables;
  }

  /**
   * Executes a GraphQL query via the API client.
   * @param options - Query and variables to execute.
   * @throws {GeinsError} If the API client is not initialized.
   */
  protected async runQuery(options: GraphQLQueryOptions) {
    if (!this._apiClient) {
      throw new GeinsError('Merchant API Client is not set', GeinsErrorCode.NOT_INITIALIZED);
    }
    return this._apiClient().runQuery(options);
  }

  /**
   * Executes a GraphQL query, then cleans and parses the result via {@link parseResult}.
   * @returns The parsed and typed result.
   */
  protected async runQueryParsed<T>(options: GraphQLQueryOptions): Promise<T> {
    const raw = await this.runQuery(options);
    const result = this.cleanObject(raw as unknown as Record<string, unknown>);
    const parsedResult = this.parseResult(result);
    return parsedResult as T;
  }

  /**
   * Executes a GraphQL mutation via the API client.
   * @param options - Mutation query and variables to execute.
   * @throws {GeinsError} If the API client is not initialized.
   */
  protected async runMutation(options: GraphQLQueryOptions) {
    if (!this._apiClient) {
      throw new GeinsError('Merchant API Client is not set', GeinsErrorCode.NOT_INITIALIZED);
    }
    return this._apiClient().runMutation(options);
  }

  /** Parses a raw query result. Override in subclasses for custom parsing. */
  protected parseResult(result: unknown): unknown {
    return result;
  }

  /**
   * Recursively removes `__typename` properties from a GraphQL response object.
   * @param obj - The object to clean.
   * @returns A shallow copy with `__typename` keys stripped at all levels.
   */
  protected cleanObject<T extends Record<string, unknown>>(obj: T): Partial<T> {
    const cleanedObj = Object.entries(obj).reduce(
      (acc, [key, value]) => {
        // Skip __typename properties
        if (key.startsWith('__typename')) {
          return acc;
        }

        // Check if the value is an array, and clean each object inside it
        if (Array.isArray(value)) {
          acc[key] = value.map((item) => (item && typeof item === 'object' ? this.cleanObject(item as Record<string, unknown>) : item));
        }
        // Recursively clean if the value is a non-null object
        else if (value && typeof value === 'object') {
          acc[key] = this.cleanObject(value as Record<string, unknown>);
        }
        // Otherwise, keep the value as-is
        else {
          acc[key] = value;
        }

        return acc;
      },
      {} as Record<string, unknown>,
    );

    return cleanedObj as Partial<T>;
  }
}
