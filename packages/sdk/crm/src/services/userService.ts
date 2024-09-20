//import { ContentAreaVariables, ContentAreaType } from '@geins/core';
import { BaseApiService, logWrite } from '@geins/core';
import { queries } from '../graphql';
//import * as contentParsers from '../util/contentParsers';
export class UserService extends BaseApiService {
  private async generateVars(variables: any) {
    if (!variables.areaName || !variables.family) {
      throw new Error('areaName and family is required');
    }
    return this.createVariables(variables);
  }
  async getRaw(variables: any) {
    const vars = await this.generateVars(variables);
    throw new Error('Method not implemented.');
  }

  async get(variables: any) {
    const vars = await this.generateVars(variables);
    throw new Error('Method not implemented.');
  }

  async update(variables: any): any {
    const vars = await this.generateVars(variables);
    logWrite('update', vars);
    return this.runQueryParsed(queries.updateUser, vars);
  }

  protected parseResult(result: any): any {
    throw new Error('Method not implemented.');
  }
}
