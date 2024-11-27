import { CookieService } from '../services/cookieService';
import { AUTH_COOKIES } from '../constants';
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  DocumentNode,
  FetchPolicy,
  ApolloQueryResult,
  FetchResult,
  OperationVariables,
} from '@apollo/client/core';
import { gql } from '@apollo/client/core';

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
  fetchPolicy?: FetchPolicy;
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
    return new ApolloClient({
      uri: apiUrl,
      cache: new InMemoryCache(),
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
    return this._apolloClient.mutate<TData, TVariables>(q);
  }
}
