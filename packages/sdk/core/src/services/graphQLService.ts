import type { GeinsSettings } from '@geins/types';
import { BaseApiService } from '../base/baseApiService';
import { GraphQLQueryOptions } from '../api-client/merchantApiClient';
import { DocumentNode, OperationDefinitionNode } from 'graphql';
import { gql } from '@apollo/client/core';

/**
 * GraphQLService class provides methods to interact with a GraphQL API.
 * It extends the BaseApiService and includes methods for querying and mutating data.
 */
export class GraphQLService extends BaseApiService {
  constructor(client: any, geinsSettings: GeinsSettings) {
    super(client, geinsSettings);
  }
  // set property for development logging
  public log_to_console = false;

  protected verifyQueryOptions(options: GraphQLQueryOptions): GraphQLQueryOptions {
    const returnOptions = { ...options };
    if (!options.query && !options.queryAsString) {
      throw new Error('Query or queryAsString is required');
    }

    try {
      if (options.queryAsString && !options.query) {
        returnOptions.query = gql(options.queryAsString);
      }
    } catch (error) {
      throw new Error('Error parsing string to query');
    }

    const queryDocument = returnOptions.query as DocumentNode;
    const definition = queryDocument.definitions[0] as OperationDefinitionNode;

    if (
      !definition ||
      definition.kind !== 'OperationDefinition' ||
      !((definition.variableDefinitions?.length ?? 0) > 0)
    ) {
      return returnOptions;
    }

    returnOptions.variables = this.createVariables(returnOptions.variables);
    const queryVars =
      (queryDocument.definitions[0] as OperationDefinitionNode).variableDefinitions?.map(
        (v: any) => v.variable.name.value,
      ) || [];

    const providedVars = Object.keys(returnOptions.variables);
    providedVars.forEach(v => {
      if (queryVars && !queryVars.includes(v)) {
        delete returnOptions.variables[v];
      }
    });

    return returnOptions;
  }
  /**
   * Executes a GraphQL query with the provided options.
   * @param options - The options for the GraphQL query.
   * @returns A promise that resolves to the query result or null if an error occurs.
   */
  async query<T = any>(options: GraphQLQueryOptions): Promise<T | null> {
    try {
      const queryOptions = await this.verifyQueryOptions(options);

      if ((this.log_to_console || options.log_to_console) && this._geinsSettings.environment !== 'prod') {
        console.log('[Geins] queryOptions:', queryOptions);
      }
      const result = this.cleanObject(await this.runQuery(queryOptions));
      const parsedResult = this.parseResult(result);
      return parsedResult as T;
    } catch (error) {
      console.error('Query error:', error);
      return null;
    }
  }

  /**
   * Executes a GraphQL mutation with the provided options.
   * @param options - The options for the GraphQL mutation.
   * @returns A promise that resolves to the mutation result or null if an error occurs.
   */
  async mutation<T = any>(options: GraphQLQueryOptions): Promise<T | null> {
    try {
      if ((this.log_to_console || options.log_to_console) && this._geinsSettings.environment !== 'prod') {
        console.log('[Geins] mutation options:', options);
      }

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
