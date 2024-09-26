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
} from '@apollo/client';

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
  fetchPolicy: FetchPolicy = FetchPolicyOptions.CACHE_FIRST;
  pollInterval: number = 0;

  constructor(apiUrl: string, apiKey: string, fetchPolicy?: FetchPolicy) {
    this.client = this.createClient(apiUrl, apiKey);
    this.cookieService = new CookieService();
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

  private getOperationObject(
    operationType: OperationType,
    document: DocumentNode,
    variables: OperationVariables = {},
    options: RequestOptions = {},
  ) {
    const loggedInUser = this.cookieService?.get(AUTH_COOKIES.USER_AUTH);

    const operationObj: any = {
      [operationType]: document, // 'query' or 'mutation'
      variables,
      fetchPolicy: options.fetchPolicy || this.fetchPolicy,
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
  ): Promise<FetchResult<TData>> {
    // Correct return type
    const q = this.getOperationObject(
      OperationType.MUTATION,
      mutation,
      variables,
      options,
    );
    return this.client.mutate<TData, TVariables>(q);
  }
}
