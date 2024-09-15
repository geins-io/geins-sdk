// https://docs.geins.io/docs/api/merchant/objects/brand-list-type
// import type { MenuVariables, MenuType } from '@geins/types';
import { BaseApiService } from '@geins/core';
import { queries } from '../graphql';
//import { parseMenuItem } from '../util/contentParsers';
export class MenuService extends BaseApiService {
  private async generateVars(variables: any) {
    const vars = this.createVariables(variables);
    return vars;
  }
  async getRaw(variables: any) {
    const vars = await this.generateVars(variables);
    throw new Error('Not implemented');
    //return await this.runQuery(queries.menu, vars);
  }
  async get(variables: any) {
    const vars = await this.generateVars(variables);
    throw new Error('Not implemented');
    //return await this.runQueryParsed(queries.menu, vars);
  }

  protected parseResult(result: any): any {
    return result;
  }
}
