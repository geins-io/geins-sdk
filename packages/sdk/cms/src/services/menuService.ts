import type { MenuVariables } from '@geins/types';
import { BaseApiService, logWrite } from '@geins/core';
import { queries } from '../graphql';

export class MenuService extends BaseApiService {
  private async generateVars(variables: MenuVariables) {
    if (!variables.menuLocationId) {
      throw new Error('LocationId is required');
    }
    const vars = this.createVariables(variables);
    return vars;
  }

  async getRaw(variables: MenuVariables) {
    const options = {
      query: queries.menu,
      variables: await this.generateVars(variables),
    };
    return await this.runQuery(options);
  }

  async get(variables: MenuVariables) {
    const options = {
      query: queries.menu,
      variables: await this.generateVars(variables),
    };
    return await this.runQueryParsed(options);
  }

  protected parseResult(result: any): any {
    if (!result || !result.data || !result.data.getMenuAtLocation) {
      throw new Error('Invalid result structure');
    }
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
      value: item.value,
      type: item.type,
      order: item.order,
      open: item.open,
      hidden: item.hidden,
      targetBlank: item.targetBlank,
      children: item.children ? item.children.map((child: any) => this.parseMenuItem(child)) : [],
    };
  }
}
