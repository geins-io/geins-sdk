import { CookieService } from '../services/cookieService';
import { AUTH_COOKIES } from '../constants';
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  DocumentNode,
  FetchPolicy,
  ApolloQueryResult,
  FetchResult, // Import FetchResult
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

interface RequestOptions {
  fetchPolicy?: FetchPolicy;
  pollInterval?: number;
  context?: any;
  [key: string]: any;
}

export class MerchantApiClient {
  private cookieService: CookieService | undefined;
  private client: ApolloClient<NormalizedCacheObject>;
  private userToken?: string;
  fetchPolicy: FetchPolicy = FetchPolicyOptions.CACHE_FIRST;
  pollInterval: number = 0;

  constructor(
    apiUrl: string,
    apiKey: string,
    userToken?: string,
    fetchPolicy?: FetchPolicy,
  ) {
    this.client = this.createClient(apiUrl, apiKey);
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
    return this.client;
  }

  clearCache() {
    this.client.clearStore();
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
    const loggedInUser =
      this.userToken ||
      userToken ||
      this.cookieService?.get(AUTH_COOKIES.USER_AUTH);

    const operationObj: any = {
      [operationType]: document,
      variables,
      fetchPolicy: this.getFetchPolicy(operationType, options.fetchPolicy),
      pollInterval: options.pollInterval || this.pollInterval,
    };

    if (loggedInUser) {
      operationObj.context = {
        headers: {
          Authorization: `Bearer ${loggedInUser}`,
        },
      };
    }

    return operationObj;
  }

  async runQuery<
    TData = any,
    TVariables extends OperationVariables = OperationVariables,
  >(
    query: DocumentNode,
    variables: TVariables = {} as TVariables,
    options: RequestOptions = {},
  ): Promise<ApolloQueryResult<TData>> {
    const q = this.getOperationObject(
      OperationType.QUERY,
      query,
      variables,
      options,
    );
    return this.client.query<TData, TVariables>(q);
  }

  async runMutation<
    TData = any,
    TVariables extends OperationVariables = OperationVariables,
  >(
    mutation: DocumentNode,
    variables: TVariables = {} as TVariables,
    options: RequestOptions = {},
    userToken?: string | undefined,
  ): Promise<FetchResult<TData>> {
    // Correct return type
    const q = this.getOperationObject(
      OperationType.MUTATION,
      mutation,
      variables,
      options,
      userToken,
    );
    return this.client.mutate<TData, TVariables>(q);
  }
}
