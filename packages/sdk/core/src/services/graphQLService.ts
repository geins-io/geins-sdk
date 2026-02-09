import { gql } from '@apollo/client/core';
import type { ApolloQueryResult, FetchResult } from '@apollo/client/core';
import type { GeinsSettings } from '@geins/types';
import type { DocumentNode, OperationDefinitionNode, VariableDefinitionNode } from 'graphql';
import type { ApiClientGetter } from '../base/baseApiService';
import { GraphQLQueryOptions } from '../api-client/merchantApiClient';
import { BaseApiService } from '../base/baseApiService';
import { GeinsError, GeinsErrorCode } from '../errors/geinsError';

/**
 * GraphQLService class provides methods to interact with a GraphQL API.
 * It extends the BaseApiService and includes methods for querying and mutating data.
 */
export class GraphQLService extends BaseApiService {
  constructor(client: ApiClientGetter, geinsSettings: GeinsSettings) {
    super(client, geinsSettings);
  }
  // set property for development logging
  public log_to_console = false;

  protected verifyQueryOptions(options: GraphQLQueryOptions): GraphQLQueryOptions {
    const returnOptions = { ...options };
    if (!options.query && !options.queryAsString) {
      throw new GeinsError('Query or queryAsString is required', GeinsErrorCode.INVALID_ARGUMENT);
    }

    try {
      if (options.queryAsString && !options.query) {
        returnOptions.query = gql(options.queryAsString);
      }
    } catch (error) {
      throw new GeinsError('Error parsing string to query', GeinsErrorCode.PARSE_ERROR, error);
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

    returnOptions.variables = this.createVariables(returnOptions.variables ?? {});
    const queryVars =
      (queryDocument.definitions[0] as OperationDefinitionNode).variableDefinitions?.map(
        (v: VariableDefinitionNode) => v.variable.name.value,
      ) || [];

    const providedVars = Object.keys(returnOptions.variables);
    providedVars.forEach((v) => {
      if (queryVars && !queryVars.includes(v)) {
        delete returnOptions.variables![v];
      }
    });

    return returnOptions;
  }
  /**
   * Executes a GraphQL query with the provided options.
   * @param options - The options for the GraphQL query.
   * @returns A promise that resolves to the query result or null if an error occurs.
   */
  async query<T = unknown>(options: GraphQLQueryOptions): Promise<T> {
    const queryOptions = await this.verifyQueryOptions(options);

    if ((this.log_to_console || options.log_to_console) && this._geinsSettings.environment !== 'prod') {
      console.log('[Geins] queryOptions:', queryOptions);
    }
    const raw = await this.runQuery(queryOptions);
    const result = this.cleanObject(raw as unknown as Record<string, unknown>);
    return this.parseResult(result) as T;
  }

  /**
   * Executes a GraphQL mutation with the provided options.
   * @param options - The options for the GraphQL mutation.
   * @returns A promise that resolves to the mutation result or null if an error occurs.
   */
  async mutation<T = unknown>(options: GraphQLQueryOptions): Promise<T> {
    if ((this.log_to_console || options.log_to_console) && this._geinsSettings.environment !== 'prod') {
      console.log('[Geins] mutation options:', options);
    }

    const result = await this.runMutation(options);
    return this.parseResult(result) as T;
  }

  protected parseResult(result: unknown): unknown {
    const data = result as Record<string, unknown> | null;
    if (data?.data) {
      return data.data;
    }
    if (data?.errors) {
      throw new GeinsError('GraphQL errors', GeinsErrorCode.GRAPHQL_ERROR, data.errors);
    }
    return null;
  }
}
