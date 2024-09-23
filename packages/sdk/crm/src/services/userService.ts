import type { UserType } from '@geins/types';
import { BaseApiService, logWrite, UserInputType } from '@geins/core';
import { queries } from '../graphql';
import * as userParsers from '../parsers/userParsers';
export class UserService extends BaseApiService {
  private async generateVars(variables: any) {
    if (variables.user && variables.user.entityId) {
      variables.user.personalId = variables.user.entityId;
      delete variables.user.entityId;
    }
    if (variables.user) {
      const newsletter = variables.user.newsletter === 'true' ? true : false;
      variables.user.newsletter = newsletter;
    }
    return this.createVariables(variables);
  }
  async getRaw(variables: any): Promise<any> {
    const vars = await this.generateVars(variables);
    throw new Error('Method not implemented.');
  }

  async get(): Promise<UserType> {
    const vars = await this.generateVars({});
    logWrite('get vars', vars);
    return this.runQueryParsed(queries.userGet, vars);
  }

  async create(user: UserInputType): Promise<any> {
    const variables = { user };
    const vars = await this.generateVars(variables);
    return this.runMutation(queries.userRegister, vars);
  }

  async update(user: UserInputType): Promise<any> {
    const variables = { user };
    const vars = await this.generateVars(variables);
    return this.runMutation(queries.userUpdate, vars);
  }

  protected parseResult(result: any): UserType {
    return userParsers.parseUser(result);
  }
}
