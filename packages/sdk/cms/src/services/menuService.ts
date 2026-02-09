import type { MenuVariables, MenuItemType, MenuType, MenuServiceResult } from '@geins/types';
import type { GeinsMenuItemTypeType } from '@geins/types';
import { BaseApiService, GeinsError, GeinsErrorCode } from '@geins/core';
import type { GraphQLQueryOptions } from '@geins/core';
import { queries } from '../graphql';

/** Service for fetching CMS navigation menus by location ID. */
export class MenuService extends BaseApiService {
  /**
   * Validates and enriches menu variables with defaults.
   * @throws {GeinsError} If menuLocationId is missing.
   */
  private async generateVars(variables: MenuVariables) {
    if (!variables.menuLocationId) {
      throw new GeinsError('LocationId is required', GeinsErrorCode.INVALID_ARGUMENT);
    }
    const vars = this.createVariables(variables);
    return vars;
  }

  /**
   * Fetches a menu as raw GraphQL response data.
   * @param variables - Must include menuLocationId.
   */
  async getRaw(variables: MenuVariables) {
    const options: GraphQLQueryOptions = {
      query: queries.menu,
      variables: await this.generateVars(variables),
    };
    return await this.runQuery(options);
  }

  /**
   * Fetches a menu and returns a parsed {@link MenuType} with nested menu items.
   * @param variables - Must include menuLocationId.
   */
  async get(variables: MenuVariables) {
    const options: GraphQLQueryOptions = {
      query: queries.menu,
      variables: await this.generateVars(variables),
    };
    return await this.runQueryParsed(options);
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
