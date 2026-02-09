import type { ContentAreaVariables, ContentAreaType } from '@geins/core';
import { BaseApiService, GeinsError, GeinsErrorCode } from '@geins/core';
import type { GraphQLQueryOptions } from '@geins/core';
import { queries } from '../graphql';
import * as contentParsers from '../parsers/contentParsers';

/** Service for fetching CMS content areas (widget collections) by area name and family. */
export class ContentAreaService extends BaseApiService {
  /**
   * Validates and enriches content area variables with defaults.
   * @throws {GeinsError} If areaName or family is missing.
   */
  private async generateVars(variables: ContentAreaVariables) {
    if (!variables.areaName || !variables.family) {
      throw new GeinsError('areaName and family is required', GeinsErrorCode.INVALID_ARGUMENT);
    }
    return this.createVariables(variables);
  }

  /**
   * Fetches a content area as raw GraphQL response data.
   * @param variables - Must include areaName and family.
   */
  async getRaw(variables: ContentAreaVariables) {
    const options: GraphQLQueryOptions = {
      query: queries.contentArea,
      variables: await this.generateVars(variables),
    };
    return await this.runQuery(options);
  }

  /**
   * Fetches a content area and returns a parsed {@link ContentAreaType}.
   * @param variables - Must include areaName and family.
   */
  async get(variables: ContentAreaVariables) {
    const options: GraphQLQueryOptions = {
      query: queries.contentArea,
      variables: await this.generateVars(variables),
    };
    return await this.runQueryParsed(options);
  }

  /** Parses the raw widget area response into a {@link ContentAreaType}. */
  protected parseResult(result: unknown): ContentAreaType {
    return contentParsers.parseContentArea(
      result as { data?: { widgetArea?: import('@geins/core').GeinsPageWidgetCollectionTypeType } },
    );
  }
}
