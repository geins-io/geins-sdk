import {
  ApolloClient,
  ApolloQueryResult,
  DocumentNode,
  FetchPolicy,
  FetchResult,
  gql,
  InMemoryCache,
  NormalizedCacheObject,
  OperationVariables,
} from '@apollo/client/core';
import { AUTH_COOKIES } from '../constants';
import { CookieService } from '../services/cookieService';

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
  context?: any;
  [key: string]: any;
}

export interface MerchantApiClientOptions {
  apiUrl: string;
  apiKey: string;
  fetchPolicy?: FetchPolicy;
  userToken?: string;
}

export interface GraphQLQueryOptions {
  query?: DocumentNode | string | undefined;
  queryAsString?: string | undefined;
  variables?: any;
  requestOptions?: RequestOptions;
  log_to_console?: boolean;
}

export class MerchantApiClient {
  private _cookieService: CookieService | undefined;
  private _apolloClient: ApolloClient<NormalizedCacheObject>;
  private _userToken?: string;
  fetchPolicy: FetchPolicy = FetchPolicyOptions.CACHE_FIRST;
  pollInterval: number = 0;

  constructor(options: MerchantApiClientOptions) {
    const { apiUrl, apiKey, userToken, fetchPolicy } = options;
    this._apolloClient = this.createClient(apiUrl, apiKey);
    this._cookieService = new CookieService();
    if (userToken) {
      this._userToken = userToken;
    }
    if (fetchPolicy) {
      this.fetchPolicy = fetchPolicy;
    }
  }

  public updateToken(newToken?: string) {
    this._userToken = newToken;
  }
  public get userToken() {
    return this._userToken;
  }

  createClient(apiUrl: string, apiKey: string) {
    const cache = new InMemoryCache({
      typePolicies: {
        CartType: {
          fields: {
            items: {
              merge(existing, incoming) {
                return incoming;
              },
            },
            appliedCampaigns: {
              merge(existing, incoming) {
                return incoming;
              },
            },
          },
        },
      },
    });

    return new ApolloClient({
      uri: apiUrl,
      cache: cache,
      headers: {
        Accept: 'application/json',
        'x-apikey': apiKey,
      },
    });
  }

  getClient(): ApolloClient<NormalizedCacheObject> | undefined {
    return this._apolloClient;
  }

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

  private getOperationObject(operationType: OperationType, operationOptions: GraphQLQueryOptions) {
    const { query, queryAsString, variables, requestOptions } = operationOptions;
    const queryDocument = query || gql(queryAsString || '');
    const options = requestOptions || {};
    const token = this._userToken || this._cookieService?.get(AUTH_COOKIES.USER_AUTH);

    if (!queryDocument) {
      throw new Error('Query is required');
    }

    const operationObj: any = {
      [operationType]: queryDocument,
      variables,
      fetchPolicy: this.getFetchPolicy(operationType, options.fetchPolicy),
      pollInterval: options.pollInterval || this.pollInterval,
    };

    if (token) {
      operationObj.context = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    }

    return operationObj;
  }

  async runQuery<TData = any, TVariables extends OperationVariables = OperationVariables>(
    options: GraphQLQueryOptions,
  ): Promise<ApolloQueryResult<TData>> {
    const q = this.getOperationObject(OperationType.QUERY, options);
    return this._apolloClient.query<TData, TVariables>(q);
  }

  async runMutation<TData = any, TVariables extends OperationVariables = OperationVariables>(
    options: GraphQLQueryOptions,
  ): Promise<FetchResult<TData>> {
    const q = this.getOperationObject(OperationType.MUTATION, options);

    try {
      return this._apolloClient.mutate<TData, TVariables>(q);
    } catch (error) {}
    return {} as FetchResult<TData>;
  }
}
