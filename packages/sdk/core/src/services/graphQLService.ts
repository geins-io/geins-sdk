import type { GeinsSettings } from '@geins/types';
import { BaseApiService } from '../base/baseApiService';
import { GraphQLQueryOptions } from '../api-client/merchantApiClient';

export class GraphQLService extends BaseApiService {
  constructor(client: any, geinsSettings: GeinsSettings) {
    super(client, geinsSettings);
  }

  /**
   * Generic method to run any GraphQL query
   * @param query - The GraphQL query DocumentNode or gql query object
   * @param variables - Variables to pass to the query
   * @param options - Optional options like fetchPolicy, pollInterval, etc.
   * @returns The result data of the query or null
   */
  async query<T = any>(options: GraphQLQueryOptions): Promise<T | null> {
    try {
      const result = this.cleanObject(await this.runQuery(options));
      const parsedResult = this.parseResult(result);
      return parsedResult as T;
    } catch (error) {
      console.error('Query error:', error);
      return null;
    }
    return null;
  }

  /**
   * Generic method to run any GraphQL mutation
   * @param mutation - The GraphQL mutation DocumentNode or gql mutation object
   * @param variables - Variables to pass to the mutation
   * @param options - Optional options like fetchPolicy, etc.
   * @returns The result data of the mutation or null
   */
  async mutation<T = any>(options: GraphQLQueryOptions): Promise<T | null> {
    try {
      const result = await this.runMutation(options);
      const parsedResult = this.parseResult(result);
      return parsedResult as T;
    } catch (error) {
      console.error('Mutation error:', error);
      return null;
    }
  }
  protected parseResult(result: any): any {
    if (result.data) {
      return result.data;
    }
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
    }
    return null;
  }
}
