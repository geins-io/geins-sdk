import {
  DocumentNode,
  FetchPolicy,
  FetchResult,
  ApolloQueryResult,
  OperationVariables,
} from '@apollo/client';
import { MerchantApiClient, GraphQLQueryOptions } from './merchantApiClient';

interface GraphQLApiClientOptions {
  apiUrl: string;
  apiKey: string;
  userToken?: string;
  fetchPolicy?: FetchPolicy;
}

export class GraphQLClient {
  private merchantApiClient: MerchantApiClient;

  constructor(options: GraphQLApiClientOptions) {
    const { apiUrl, apiKey, fetchPolicy } = options;
    const merchantApiClientOptions = {
      apiUrl,
      apiKey,
      fetchPolicy,
    };
    this.merchantApiClient = new MerchantApiClient(merchantApiClientOptions);
  }

  /**
   * Generic method to run any GraphQL query
   * @param query - The GraphQL query DocumentNode or gql query object
   * @param variables - Variables to pass to the query
   * @param options - Optional options like fetchPolicy, pollInterval, etc.
   * @returns The result data of the query or null
   */
  async runQuery<
    TData = any,
    TVariables extends OperationVariables = OperationVariables,
  >(options: GraphQLQueryOptions): Promise<TData | null> {
    const { query, variables, requestOptions, userToken } = options;
    try {
      const result: ApolloQueryResult<TData> =
        await this.merchantApiClient.runQuery<TData, TVariables>(options);
      return result.data ? result.data : null;
    } catch (error) {
      console.error('Query error:', error);
      return null;
    }
  }

  /**
   * Generic method to run any GraphQL mutation
   * @param mutation - The GraphQL mutation DocumentNode or gql mutation object
   * @param variables - Variables to pass to the mutation
   * @param options - Optional options like fetchPolicy, etc.
   * @returns The result data of the mutation or null
   */
  async runMutation<
    TData = any,
    TVariables extends OperationVariables = OperationVariables,
  >(options: GraphQLQueryOptions): Promise<TData | null> {
    try {
      const result: FetchResult<TData> =
        await this.merchantApiClient.runMutation<TData, TVariables>(options);
      return result.data || null;
    } catch (error) {
      console.error('Mutation error:', error);
      return null;
    }
  }
}
