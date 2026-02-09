import {
  ApolloClient,
  ApolloLink,
  ApolloQueryResult,
  DocumentNode,
  FetchPolicy,
  FetchResult,
  gql,
  InMemoryCache,
  NormalizedCacheObject,
  OperationVariables,
  createHttpLink,
} from '@apollo/client/core';
import { RetryLink } from '@apollo/client/link/retry';
import { GeinsLogLevel } from '@geins/types';
import type { GeinsSettings, GeinsRetryConfig } from '@geins/types';
import { isServerContext, Logger } from '../utils';
import { createRequestIdLink } from './links/requestIdLink';
import { createIdempotencyLink } from './links/idempotencyLink';
import { createLoggingLink } from './links/loggingLink';
import { createTimeoutLink } from './links/timeoutLink';
import { createInterceptorLink } from './links/interceptorLink';
import { createTelemetryLink, TelemetryCollector } from './links/telemetryLink';

export enum FetchPolicyOptions {
  CACHE_FIRST = 'cache-first',
  NETWORK_ONLY = 'network-only',
  CACHE_ONLY = 'cache-only',
  NO_CACHE = 'no-cache',
  STANDBY = 'standby',
}

export enum OperationType {
  QUERY = 'query',
  MUTATION = 'mutation',
}

export interface RequestOptions {
  fetchPolicy?: FetchPolicyOptions;
  pollInterval?: number;
  context?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface MerchantApiClientOptions {
  apiUrl: string;
  apiKey: string;
  fetchPolicy?: FetchPolicy;
  settings?: GeinsSettings;
}

export interface GraphQLQueryOptions {
  query?: DocumentNode | string | undefined;
  queryAsString?: string | undefined;
  variables?: Record<string, unknown>;
  requestOptions?: RequestOptions;
  log_to_console?: boolean;
  userToken?: string;
}

/**
 * Apollo-based GraphQL client for the Geins Merchant API.
 * Configures the link chain (request ID, idempotency, logging, retry, etc.)
 * and exposes {@link runQuery} / {@link runMutation} for executing operations.
 */
export class MerchantApiClient {
  private _apolloClient: ApolloClient<NormalizedCacheObject>;
  private _telemetry: TelemetryCollector | null = null;
  fetchPolicy: FetchPolicy = isServerContext()
    ? FetchPolicyOptions.NO_CACHE
    : FetchPolicyOptions.CACHE_FIRST;
  pollInterval: number = 0;

  constructor(options: MerchantApiClientOptions) {
    const { apiUrl, apiKey, fetchPolicy, settings } = options;
    this._apolloClient = this.createClient(apiUrl, apiKey, settings);
    if (fetchPolicy) {
      this.fetchPolicy = fetchPolicy;
    }
  }

  createClient(apiUrl: string, apiKey: string, settings?: GeinsSettings) {
    const cache = new InMemoryCache({
      typePolicies: {
        CartType: {
          fields: {
            items: {
              merge(_existing: unknown, incoming: unknown) {
                return incoming;
              },
            },
            appliedCampaigns: {
              merge(_existing: unknown, incoming: unknown) {
                return incoming;
              },
            },
          },
        },
      },
    });

    const link = this.createLinkChain(apiUrl, apiKey, settings);

    return new ApolloClient({
      link,
      cache,
    });
  }

  private createLinkChain(apiUrl: string, apiKey: string, settings?: GeinsSettings): ApolloLink {
    const requestConfig = settings?.requestConfig;
    const links: ApolloLink[] = [];

    // 1. RequestIdLink — always on (also sets x-sdk-version)
    links.push(createRequestIdLink());

    // 2. IdempotencyLink — always on (only sets header on mutations)
    links.push(createIdempotencyLink());

    // 3. LoggingLink — always on (Logger gates output via logLevel)
    const logger = new Logger(settings?.logLevel ?? GeinsLogLevel.NONE);
    links.push(createLoggingLink(logger));

    // 4. InterceptorLink — only if interceptors configured
    if (requestConfig?.interceptors) {
      links.push(createInterceptorLink(requestConfig.interceptors));
    }

    // 5. TimeoutLink — only if timeoutMs > 0
    const timeoutMs = requestConfig?.timeoutMs ?? 0;
    if (timeoutMs > 0) {
      links.push(createTimeoutLink(timeoutMs));
    }

    // 6. TelemetryLink — only if telemetry config provided and not disabled
    if (requestConfig?.telemetry) {
      this._telemetry = new TelemetryCollector(requestConfig.telemetry);
      links.push(createTelemetryLink(this._telemetry));
    }

    // 7. RetryLink — only if retry config provided and not disabled
    if (requestConfig?.retry) {
      links.push(this.createRetryLink(requestConfig.retry));
    }

    // 8. HttpLink — terminating link
    const httpLink = createHttpLink({
      uri: apiUrl,
      headers: {
        Accept: 'application/json',
        'x-apikey': apiKey,
      },
    });
    links.push(httpLink);

    return ApolloLink.from(links);
  }

  private createRetryLink(retryConfig: GeinsRetryConfig): RetryLink {
    const {
      maxRetries = 3,
      initialDelayMs = 300,
      maxDelayMs = 10000,
      jitter = true,
    } = retryConfig;

    return new RetryLink({
      delay: {
        initial: initialDelayMs,
        max: maxDelayMs,
        jitter,
      },
      attempts: {
        max: maxRetries + 1, // RetryLink counts the initial attempt
        retryIf: (error: unknown) => {
          if (!error) return false;

          const err = error as Record<string, unknown>;
          const response = err.response as Record<string, unknown> | undefined;
          const statusCode = (err.statusCode as number | undefined) ?? (response?.status as number | undefined);

          // 429 — rate limited, always retry
          if (statusCode === 429) return true;

          // No status code — network error (DNS, connection refused), retry
          if (!statusCode) return true;

          // 5xx — server error, retry
          if (statusCode >= 500) return true;

          // 4xx (except 429) — client error, don't retry
          return false;
        },
      },
    });
  }

  /** Returns the underlying Apollo Client instance. */
  getClient(): ApolloClient<NormalizedCacheObject> | undefined {
    return this._apolloClient;
  }

  /** Telemetry collector instance, or `null` when telemetry is disabled. */
  get telemetry(): TelemetryCollector | null {
    return this._telemetry;
  }

  /** Clear the Apollo in-memory cache and refetch all active queries. */
  public clearCacheAndRefetchQueries() {
    this._apolloClient.resetStore();
  }

  private getFetchPolicy(operationType: OperationType, selectedFetchPolicy: FetchPolicy | undefined) {
    if (operationType === OperationType.QUERY) {
      if (selectedFetchPolicy) {
        return selectedFetchPolicy;
      } else {
        return this.fetchPolicy;
      }
    } else if (operationType === OperationType.MUTATION) {
      return FetchPolicyOptions.NETWORK_ONLY;
    }

    if (
      selectedFetchPolicy === FetchPolicyOptions.NO_CACHE ||
      selectedFetchPolicy === FetchPolicyOptions.NETWORK_ONLY
    ) {
      return selectedFetchPolicy;
    }

    return FetchPolicyOptions.NETWORK_ONLY;
  }

  private buildContext(userToken?: string): Record<string, unknown> | undefined {
    if (!userToken) return undefined;
    return {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
  }

  /** Execute a GraphQL query against the Merchant API. */
  async runQuery<TData = unknown, TVariables extends OperationVariables = OperationVariables>(
    options: GraphQLQueryOptions,
  ): Promise<ApolloQueryResult<TData>> {
    const { query: queryDoc, queryAsString, variables, requestOptions, userToken } = options;
    const queryDocument = (queryDoc || gql(queryAsString || '')) as DocumentNode;
    const opts = requestOptions || {};

    return this._apolloClient.query<TData, TVariables>({
      query: queryDocument,
      variables: variables as TVariables,
      fetchPolicy: this.getFetchPolicy(OperationType.QUERY, opts.fetchPolicy),
      pollInterval: opts.pollInterval || this.pollInterval,
      context: this.buildContext(userToken),
    });
  }

  /** Execute a GraphQL mutation against the Merchant API. */
  async runMutation<TData = unknown, TVariables extends OperationVariables = OperationVariables>(
    options: GraphQLQueryOptions,
  ): Promise<FetchResult<TData>> {
    const { query: queryDoc, queryAsString, variables, requestOptions, userToken } = options;
    const mutation = (queryDoc || gql(queryAsString || '')) as DocumentNode;
    const opts = requestOptions || {};

    return this._apolloClient.mutate<TData, TVariables>({
      mutation,
      variables: variables as TVariables,
      fetchPolicy: this.getFetchPolicy(OperationType.MUTATION, opts.fetchPolicy) as 'network-only' | 'no-cache',
      context: this.buildContext(userToken),
    });
  }
}
