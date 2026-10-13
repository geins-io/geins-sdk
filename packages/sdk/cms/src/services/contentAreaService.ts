import type { ContentAreaType, ContentAreaVariables } from '@geins/core';
import { BaseApiService, GeinsError, GeinsErrorCode } from '@geins/core';
import type { GeinsCallOptions, RequestContext } from '@geins/types';
import { queries } from '../graphql';
import * as contentParsers from '../parsers/contentParsers';

/** Service for fetching CMS content areas (widget collections) by area name and family. */
export class ContentAreaService extends BaseApiService {
  /**
   * Fetches a content area as raw GraphQL response data.
   * @param variables - Must include areaName and family.
   * @param requestContext - Optional per-request overrides (locale/market/channel/userToken).
   */
  async getRaw(variables: ContentAreaVariables, requestContext?: RequestContext) {
    if (!variables.areaName || !variables.family) {
      throw new GeinsError('areaName and family is required', GeinsErrorCode.INVALID_ARGUMENT);
    }
    return await this.runQuery(this.createQueryOptions(queries.contentArea, variables, requestContext));
  }

  /**
   * Fetches a content area and returns a parsed {@link ContentAreaType}.
   * @param variables - Must include areaName and family.
   * @param requestContext - Optional per-request overrides (locale/market/channel/userToken).
   * @param options - Optional per-call options, such as this call's `timeoutMs`.
   */
  async get(variables: ContentAreaVariables, requestContext?: RequestContext, options?: GeinsCallOptions) {
    if (!variables.areaName || !variables.family) {
      throw new GeinsError('areaName and family is required', GeinsErrorCode.INVALID_ARGUMENT);
    }
    return await this.runQueryParsed(
      this.withCallOptions(this.createQueryOptions(queries.contentArea, variables, requestContext), options),
    );
  }

  /** Parses the raw widget area response into a {@link ContentAreaType}. */
  protected parseResult(result: unknown): ContentAreaType {
    return contentParsers.parseContentArea(
      result as { data?: { widgetArea?: import('@geins/core').GeinsPageWidgetCollectionTypeType } },
    );
  }
}
