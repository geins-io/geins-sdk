import type { ContentPageType, ContentPageVariables } from '@geins/core';
import { BaseApiService, GeinsError, GeinsErrorCode } from '@geins/core';
import type { GeinsCallOptions, RequestContext } from '@geins/types';
import { queries } from '../graphql';
import * as contentParsers from '../parsers/contentParsers';

/** Service for fetching CMS content pages by alias. */
export class ContentPageService extends BaseApiService {
  /**
   * Fetches a content page as raw GraphQL response data.
   * @param variables - Must include alias.
   * @param requestContext - Optional per-request overrides (locale/market/channel/userToken).
   */
  async getRaw(variables: ContentPageVariables, requestContext?: RequestContext) {
    if (!variables.alias) {
      throw new GeinsError('Alias is required', GeinsErrorCode.INVALID_ARGUMENT);
    }
    return await this.runQuery(this.createQueryOptions(queries.page, variables, requestContext));
  }

  /**
   * Fetches a content page and returns a parsed {@link ContentPageType}.
   * @param variables - Must include alias.
   * @param requestContext - Optional per-request overrides (locale/market/channel/userToken).
   * @param options - Optional per-call options, such as this call's `timeoutMs`.
   */
  async get(variables: ContentPageVariables, requestContext?: RequestContext, options?: GeinsCallOptions) {
    if (!variables.alias) {
      throw new GeinsError('Alias is required', GeinsErrorCode.INVALID_ARGUMENT);
    }
    return await this.runQueryParsed(
      this.withCallOptions(this.createQueryOptions(queries.page, variables, requestContext), options),
    );
  }

  /** Parses the raw widget area response into a {@link ContentPageType}. */
  protected parseResult(result: unknown): ContentPageType {
    return contentParsers.parseContentPage(
      result as { data?: { widgetArea?: import('@geins/core').GeinsPageWidgetCollectionTypeType } },
    );
  }
}
