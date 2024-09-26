import {
  MerchantApiClient,
  FetchPolicy,
} from '../api-client/merchantApiClient';
import { gql } from '@apollo/client';

export class OpenAPIClientService {
  private merchantApiClient: MerchantApiClient;

  constructor(apiUrl: string, apiKey: string, fetchPolicy?: FetchPolicy) {
    // Initialize MerchantApiClient
    this.merchantApiClient = new MerchantApiClient(apiUrl, apiKey, fetchPolicy);
  }

  /**
   * Generic method to run any GraphQL query
   * @param query - The GraphQL query string or gql query object
   * @param variables - Variables to pass to the query
   * @param options - Optional options for fetch policy, polling, etc.
   * @returns The result of the query
   */
  async runQuery<T = any, V = any>(
    query: string | ReturnType<typeof gql>,
    variables?: V,
    options: any = {},
  ): Promise<T | null> {
    try {
      const result = await this.merchantApiClient.runQuery(
        query,
        variables,
        options,
      );
      return result.data as T;
    } catch (error) {
      console.error('Query error:', error);
      return null;
    }
  }

  /**
   * Generic method to run any GraphQL mutation
   * @param mutation - The GraphQL mutation string or gql mutation object
   * @param variables - Variables to pass to the mutation
   * @param options - Optional options for fetch policy, polling, etc.
   * @returns The result of the mutation
   */
  async runMutation<T = any, V = any>(
    mutation: string | ReturnType<typeof gql>,
    variables?: V,
    options: any = {},
  ): Promise<T | null> {
    try {
      const result = await this.merchantApiClient.runMutation(
        mutation,
        variables,
        options,
      );
      return result.data as T;
    } catch (error) {
      console.error('Mutation error:', error);
      return null;
    }
  }
}
