import type { ContentPageVariables, ContentPageType } from '@geins/core';
import { BaseApiService, GeinsError, GeinsErrorCode } from '@geins/core';
import type { GraphQLQueryOptions } from '@geins/core';
import { queries } from '../graphql';
import * as contentParsers from '../parsers/contentParsers';

/** Service for fetching CMS content pages by alias. */
export class ContentPageService extends BaseApiService {
  /**
   * Validates and enriches content page variables with defaults.
   * @throws {GeinsError} If alias is missing.
   */
  private async generateVars(variables: ContentPageVariables) {
    if (!variables.alias) {
      throw new GeinsError('Alias is required', GeinsErrorCode.INVALID_ARGUMENT);
    }
    return this.createVariables(variables);
  }

  /**
   * Fetches a content page as raw GraphQL response data.
   * @param variables - Must include alias.
   */
  async getRaw(variables: ContentPageVariables) {
    const options: GraphQLQueryOptions = {
      query: queries.page,
      variables: await this.generateVars(variables),
    };
    return await this.runQuery(options);
  }

  /**
   * Fetches a content page and returns a parsed {@link ContentPageType}.
   * @param variables - Must include alias.
   */
  async get(variables: ContentPageVariables) {
    const options: GraphQLQueryOptions = {
      query: queries.page,
      variables: await this.generateVars(variables),
    };
    return await this.runQueryParsed(options);
  }

  /** Parses the raw widget area response into a {@link ContentPageType}. */
  protected parseResult(result: unknown): ContentPageType {
    return contentParsers.parseContentPage(
      result as { data?: { widgetArea?: import('@geins/core').GeinsPageWidgetCollectionTypeType } },
    );
  }
}
