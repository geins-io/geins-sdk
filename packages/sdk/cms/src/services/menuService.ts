import type { MenuVariables } from '@geins/types';
import { BaseApiService, logWrite } from '@geins/core';
import { queries } from '../graphql';
//import { parseMenuItem } from '../parsers/contentParsers';
export class MenuService extends BaseApiService {
  private async generateVars(variables: MenuVariables) {
    if (!variables.menuLocationId) {
      throw new Error('LocationId is required');
    }
    const vars = this.createVariables(variables);
    return vars;
  }
  async getRaw(variables: MenuVariables) {
    const vars = await this.generateVars(variables);
    return await this.runQuery(queries.menu, vars);
  }
  async get(variables: MenuVariables) {
    const vars = await this.generateVars(variables);
    return await this.runQueryParsed(queries.menu, vars);
  }

  protected parseResult(result: any): any {
    if (!result || !result.data || !result.data.getMenuAtLocation) {
      throw new Error('Invalid result structure');
    }
    logWrite('parseResult menu', result);
    const menu = result.data.getMenuAtLocation;

    const parsedResult = {
      id: menu.id,
      title: menu.title,
      menuItems: menu.menuItems.map((item: any) => this.parseMenuItem(item)),
    };

    return parsedResult;
  }

  protected parseMenuItem(item: any): any {
    return {
      id: item.id,
      label: item.label,
      title: item.title,
      canonicalUrl: item.canonicalUrl,
      type: item.type,
      order: item.order,
      open: item.open,
      hidden: item.hidden,
      targetBlank: item.targetBlank,
      children: item.children
        ? item.children.map((child: any) => this.parseMenuItem(child))
        : [],
    };
  }
}
