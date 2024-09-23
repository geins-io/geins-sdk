import type { UserType } from '@geins/types';
import { BaseApiService, logWrite, UserInputType } from '@geins/core';
import { queries } from '../graphql';
import * as userParsers from '../parsers/userParsers';
export class UserService extends BaseApiService {
  private async generateVars(variables: any) {
    return this.createVariables(variables);
  }

  async getRaw(variables: any): Promise<any> {
    const vars = await this.generateVars(variables);
    return this.runQuery(queries.userGet, vars);
  }

  async get(): Promise<UserType> {
    const vars = await this.generateVars({});
    return this.runQueryParsed(queries.userGet, vars);
  }

  protected parseResult(result: any): UserType {
    throw new Error('Method not implemented.');
  }
}
