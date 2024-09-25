import type { MenuVariables, MenuType } from '@geins/types';
import { BaseApiService } from '@geins/core';
import { queries } from '../graphql';
import { parseMenuItem } from '../parsers/contentParsers';
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

  protected parseResult(result: any): MenuType {
    if (!result || !result.data || !result.data.getMenuAtLocation) {
      throw new Error('Invalid result structure');
    }

    const menu = result.data.getMenuAtLocation;

    const parsedResult = {
      title: menu.title,
      menuItems: menu.menuItems.map((item: any) => parseMenuItem(item)),
    };

    return parsedResult;
  }
}
