import type { MenuVars, MenuType, MenuItemType } from '@geins/types';
import { BaseApiService } from '@geins/core';
import { queries } from '../graphql';
export class MenuService extends BaseApiService {
  private async generateVars(variables: MenuVars) {
    if (!variables.menuLocationId) {
      throw new Error('LocationId is required');
    }
    const vars = this.createVariables(variables);
    return vars;
  }
  async get(variables: MenuVars) {
    const vars = await this.generateVars(variables);
    return await this.runQuery(queries.menu, vars);
  }
  async getParsed(variables: MenuVars) {
    const vars = await this.generateVars(variables);
    return await this.runQueryParsed(queries.menu, vars);
  }

  protected parseResult(result: any): MenuType {
    if (!result || !result.data || !result.data.getMenuAtLocation) {
      throw new Error('Invalid result structure');
    }

    const menu = result.data.getMenuAtLocation;
    // Extract menu items and any other relevant information
    const parsedResult = {
      title: menu.title,
      menuItems: menu.menuItems.map((item: any) => this.parseMenuItem(item)),
    };

    return parsedResult;
  }

  // Helper method to recursively parse menu items
  private parseMenuItem(item: any): MenuItemType {
    return {
      id: item.id,
      label: item.label,
      title: item.title,
      canonicalUrl: item.canonicalUrl,
      type: item.type,
      order: item.order,
      targetBlank: item.targetBlank,
      children: item.children
        ? item.children.map((child: any) => this.parseMenuItem(child))
        : [],
    };
  }
}
