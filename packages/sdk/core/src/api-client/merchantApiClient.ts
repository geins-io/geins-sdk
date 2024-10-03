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
  userToken?: string;
  fetchPolicy?: FetchPolicy;
}

export interface GraphQLQueryOptions {
  query?: any;
  variables?: any;
  requestOptions?: RequestOptions;
  userToken?: string;
}

export class MerchantApiClient {
  private cookieService: CookieService | undefined;
  private apolloClient: ApolloClient<NormalizedCacheObject>;
  private userToken?: string;
  fetchPolicy: FetchPolicy = FetchPolicyOptions.CACHE_FIRST;
  pollInterval: number = 0;

  constructor(options: MerchantApiClientOptions) {
    const { apiUrl, apiKey, userToken, fetchPolicy } = options;
    this.apolloClient = this.createClient(apiUrl, apiKey);
    this.cookieService = new CookieService();
    this.userToken = userToken;
    if (fetchPolicy) {
      this.fetchPolicy = fetchPolicy;
    }
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
    return this.apolloClient;
  }

  clearCache() {
    this.apolloClient.clearStore();
  }

  private getFetchPolicy(
    operationType: OperationType,
    selectedFetchPolicy: FetchPolicy | undefined,
  ) {
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

  private getOperationObject(
    operationType: OperationType,
    document: DocumentNode,
    variables: OperationVariables = {},
    options: RequestOptions = {},
    userToken?: string | undefined,
  ) {
    const token =
      this.userToken ||
      userToken ||
      this.cookieService?.get(AUTH_COOKIES.USER_AUTH);

    const operationObj: any = {
      [operationType]: document,
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

  async runQuery<
    TData = any,
    TVariables extends OperationVariables = OperationVariables,
  >(options: GraphQLQueryOptions): Promise<ApolloQueryResult<TData>> {
    const { query, variables, requestOptions, userToken } = options;
    const q = this.getOperationObject(
      OperationType.QUERY,
      query,
      variables,
      requestOptions,
    );

    return this.apolloClient.query<TData, TVariables>(q);
  }

  async runMutation<
    TData = any,
    TVariables extends OperationVariables = OperationVariables,
  >(options: GraphQLQueryOptions): Promise<FetchResult<TData>> {
    const { query, variables, requestOptions, userToken } = options;
    const q = this.getOperationObject(
      OperationType.MUTATION,
      query,
      variables,
      requestOptions,
      userToken,
    );
    return this.apolloClient.mutate<TData, TVariables>(q);
  }
}
