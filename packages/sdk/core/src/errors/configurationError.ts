import { ApolloError } from '@apollo/client/core';
import type { GraphQLFormattedError } from 'graphql';
import { GeinsError, GeinsErrorCode } from './geinsError';

/** The codes the CPQ area is known to send, for autocomplete; any other string can arrive. */
export type ConfigurationErrorCode =
  | 'ConfigurationNotFound'
  | 'ConfigurationGone'
  | 'MissingCustomerNumber'
  | 'ConfigurationFailed'
  | 'ConfigurationMismatch'
  | 'LoginRequired'
  | 'ConfigurationNotReopenable'
  | 'CartItemNotConfigured'
  | 'CartBelongsToAnotherCompany'
  | 'NotAvailable'
  | 'InvalidProductReference'
  | 'ProductNotFound'
  | 'ConfigurationCurrencyMismatch'
  | (string & {});

/** One GraphQL error of the answer: its `extensions.code`, when it has one, and its message. */
export interface ConfigurationProviderError {
  code?: ConfigurationErrorCode;
  message: string;
}

export interface ConfigurationErrorDetails<TData = unknown> {
  /** Every GraphQL error in the answer, in order. */
  providerErrors: ConfigurationProviderError[];
  /** The status Apollo reported: any non-2xx, or a 2xx whose body was not JSON. */
  status?: number;
  cause?: unknown;
  /** What the API answered alongside the errors, parsed as the call answers it. */
  data?: TData;
}

/**
 * Thrown when a configuration (CPQ) operation fails. The provider's codes are
 * carried as sent rather than mapped onto {@link GeinsErrorCode}, so a caller
 * can branch on a code the SDK does not know. The message is fixed: the cause
 * can hold the request's URL.
 *
 * `TData` is the answer of the call that threw, which `data` holds when the API
 * sent one alongside the errors; each configuration call names its own.
 *
 * Everything is a field, not a getter: built for ES5, an `Error` subclass is a
 * plain `Error` at run time, without the subclass's prototype.
 */
export class ConfigurationError<TData = unknown> extends GeinsError {
  readonly providerErrors: ConfigurationProviderError[];
  /** Every provider code in the answer, verbatim and in order. */
  readonly providerCodes: ConfigurationErrorCode[];
  /** The first provider code, if any. */
  readonly providerCode?: ConfigurationErrorCode;
  /** The message of the first GraphQL error, if any. */
  readonly providerMessage?: string;
  readonly status?: number;
  /**
   * What the API answered alongside the errors, when it answered anything:
   * the unchanged cart lines of a refused `updateCartItem`, or the committed
   * configuration, without a price, of a commit in a market of another currency.
   */
  readonly data?: TData;

  constructor({ providerErrors, status, cause, data }: ConfigurationErrorDetails<TData>) {
    super('The configuration request failed', GeinsErrorCode.CONFIGURATION_FAILED, cause);
    this.name = 'ConfigurationError';
    this.providerErrors = providerErrors;
    this.providerCodes = providerErrors
      .map(({ code }) => code)
      .filter((code): code is ConfigurationErrorCode => code !== undefined);
    this.providerCode = this.providerCodes[0];
    this.providerMessage = providerErrors[0]?.message;
    this.status = status;
    this.data = data;
  }
}

interface GraphQLErrorLike {
  message?: unknown;
  extensions?: { code?: unknown } | null;
}

function record(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === 'object' ? (value as Record<string, unknown>) : undefined;
}

function graphQLErrors(value: unknown): GraphQLErrorLike[] {
  return Array.isArray(value) ? value.filter((item): item is GraphQLErrorLike => !!record(item)) : [];
}

/**
 * Whether a value is a {@link ConfigurationError}. Use it rather than
 * `instanceof`, which the ES5 build cannot answer for an `Error` subclass.
 * `TData` is taken on trust: pass the answer type of the call that threw.
 */
export function isConfigurationError<TData = unknown>(value: unknown): value is ConfigurationError<TData> {
  if (value instanceof ConfigurationError) return true;
  const error = record(value);
  return error?.name === 'ConfigurationError' && Array.isArray(error.providerErrors);
}

/**
 * A failure from the merchant API as a {@link ConfigurationError}. Apollo puts
 * GraphQL errors in two places: `graphQLErrors` for a 2xx answer, and the
 * network error's parsed body (`networkError.result.errors`) for a non-2xx one.
 */
export function toConfigurationError<TData = unknown>(
  error: unknown,
  data?: TData,
): ConfigurationError<TData> {
  if (isConfigurationError<TData>(error)) return error;

  const apollo = record(error);
  const network = record(apollo?.networkError);
  const errors = [...graphQLErrors(apollo?.graphQLErrors), ...graphQLErrors(record(network?.result)?.errors)];
  const status = network?.statusCode;

  return new ConfigurationError({
    providerErrors: errors.map((item) => {
      const code = item.extensions?.code;
      return { ...(typeof code === 'string' ? { code } : {}), message: String(item.message) };
    }),
    ...(typeof status === 'number' ? { status } : {}),
    cause: network ? apollo?.networkError : error,
    ...(data !== undefined ? { data } : {}),
  });
}

/**
 * The errors of a 2xx answer read with errorPolicy `all`, as the same error
 * Apollo's default policy throws for them, plus the answer they came with.
 */
export function toConfigurationErrorWithData<TData>(
  errors: ReadonlyArray<GraphQLFormattedError>,
  data: TData | null,
): ConfigurationError<TData> {
  return toConfigurationError(new ApolloError({ graphQLErrors: errors }), data ?? undefined);
}
