import { BaseApiService, GeinsError, GeinsErrorCode } from '@geins/core';
import type {
  GeinsCallOptions,
  GeinsMenuItemTypeType,
  MenuItemType,
  MenuServiceResult,
  MenuType,
  MenuVariables,
  RequestContext,
} from '@geins/types';
import { MENU_DEPTH_MAX, menuQuery } from '../graphql/menuQuery';

/** Service for fetching CMS navigation menus by location ID. */
export class MenuService extends BaseApiService {
  /**
   * Fetches a menu as raw GraphQL response data.
   * @param variables - Must include menuLocationId; `depth` is optional, see {@link MenuVariables}.
   * @param requestContext - Optional per-request overrides (locale/market/channel/userToken).
   */
  async getRaw(variables: MenuVariables, requestContext?: RequestContext) {
    return await this.runQuery(this.menuQueryOptions(variables, requestContext));
  }

  /**
   * Fetches a menu and returns a parsed {@link MenuType} with nested menu items.
   * @param variables - Must include menuLocationId; `depth` is optional, see {@link MenuVariables}.
   * @param requestContext - Optional per-request overrides (locale/market/channel/userToken).
   * @param options - Optional per-call options, such as this call's `timeoutMs`.
   */
  async get(variables: MenuVariables, requestContext?: RequestContext, options?: GeinsCallOptions) {
    return await this.runQueryParsed(
      this.withCallOptions(this.menuQueryOptions(variables, requestContext), options),
    );
  }

  /**
   * Query options for a menu read: the document for the requested depth, and the
   * variables without `depth`, which shapes the document and is not a query variable.
   * @throws {GeinsError} If menuLocationId is missing or depth is not an integer from 1 to {@link MENU_DEPTH_MAX}.
   */
  private menuQueryOptions(variables: MenuVariables, requestContext?: RequestContext) {
    const { depth, ...queryVariables } = variables;
    if (!queryVariables.menuLocationId) {
      throw new GeinsError('LocationId is required', GeinsErrorCode.INVALID_ARGUMENT);
    }
    if (depth !== undefined && !(Number.isInteger(depth) && depth >= 1 && depth <= MENU_DEPTH_MAX)) {
      throw new GeinsError(
        `Menu depth must be an integer from 1 to ${MENU_DEPTH_MAX}`,
        GeinsErrorCode.INVALID_ARGUMENT,
      );
    }
    return this.createQueryOptions(menuQuery(depth), queryVariables, requestContext);
  }

  /**
   * Parses the raw GraphQL menu response into a {@link MenuType}.
   * @throws {GeinsError} If the result structure is invalid.
   */
  protected parseResult(result: unknown): MenuType {
    const r = result as MenuServiceResult;
    if (!r?.data?.getMenuAtLocation) {
      throw new GeinsError('Invalid result structure', GeinsErrorCode.PARSE_ERROR);
    }
    const menu = r.data.getMenuAtLocation;
    return {
      id: menu.id,
      title: menu.title ?? '',
      menuItems: menu.menuItems
        ? menu.menuItems
            .filter((item): item is GeinsMenuItemTypeType => item != null)
            .map((item) => this.parseMenuItem(item))
        : [],
    };
  }

  /**
   * Recursively converts a raw GraphQL menu item into a {@link MenuItemType}.
   * @param item - The raw menu item from the API response.
   */
  protected parseMenuItem(item: GeinsMenuItemTypeType): MenuItemType {
    return {
      id: item.id,
      label: item.label ?? undefined,
      title: item.title ?? undefined,
      canonicalUrl: item.canonicalUrl ?? undefined,
      value: item.value ?? undefined,
      type: item.type,
      order: item.order,
      open: item.open,
      hidden: item.hidden,
      targetBlank: item.targetBlank,
      children: item.children
        ? item.children
            .filter((child): child is GeinsMenuItemTypeType => child != null)
            .map((child) => this.parseMenuItem(child))
        : [],
    };
  }
}
