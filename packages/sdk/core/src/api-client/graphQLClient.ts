import {
  DocumentNode,
  FetchPolicy,
  FetchResult,
  ApolloQueryResult,
  OperationVariables,
} from '@apollo/client';
import { MerchantApiClient } from './merchantApiClient';

export class GraphQLClient {
  private merchantApiClient: MerchantApiClient;

  constructor(apiUrl: string, apiKey: string, fetchPolicy?: FetchPolicy) {
    // Initialize MerchantApiClient with the given fetchPolicy
    this.merchantApiClient = new MerchantApiClient(apiUrl, apiKey, fetchPolicy);
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
  >(
    query: DocumentNode,
    variables?: TVariables,
    options: {
      fetchPolicy?: FetchPolicy;
      [key: string]: any;
    } = {},
  ): Promise<TData | null> {
    try {
      const result: ApolloQueryResult<TData> =
        await this.merchantApiClient.runQuery<TData, TVariables>(
          query,
          variables,
          options,
        );
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
  >(
    mutation: DocumentNode,
    variables?: TVariables,
    options: {
      fetchPolicy?: FetchPolicy;
      [key: string]: any;
    } = {},
  ): Promise<TData | null> {
    try {
      const result: FetchResult<TData> =
        await this.merchantApiClient.runMutation<TData, TVariables>(
          mutation,
          variables,
          options,
        );
      return result.data ? result.data : null;
    } catch (error) {
      console.error('Mutation error:', error);
      return null;
    }
  }
}
