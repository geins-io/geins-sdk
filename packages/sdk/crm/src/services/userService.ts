import type { UserQuery } from '@geins/types';
import { BaseApiService, logWrite, UserInputType } from '@geins/core';
import { queries, mutaions } from '../graphql';
export class UserService extends BaseApiService {
  private async generateVars(variables: any) {
    return this.createVariables(variables);
  }

  private async generateMutationVars(variables: any) {
    if (variables.user && variables.user.entityId) {
      variables.user.personalId = variables.user.entityId;
      delete variables.user.entityId;
    }
    if (variables.user) {
      const newsletter = !!(variables.user.newsletter === 'true');
      variables.user.newsletter = newsletter;
    }
    return this.createVariables(variables);
  }

  async getRaw(): Promise<any> {
    const vars = await this.generateVars({});
    return this.runQuery(queries.userGet, vars);
  }

  async get(): Promise<UserQuery['getUser'] | null> {
    const vars = await this.generateVars({});
    return this.runQueryParsed(queries.userGet, vars);
  }

  async create(user: UserInputType): Promise<any> {
    const variables = { user };
    const vars = await this.generateMutationVars(variables);
    return this.runMutation(mutaions.userRegister, vars);
  }

  async update(user: UserInputType): Promise<any> {
    const variables = { user };
    const vars = await this.generateMutationVars(variables);
    return this.runMutation(mutaions.userUpdate, vars);
  }

  async delete(): Promise<any> {
    var vars = await this.generateVars({});
    return this.runMutation(mutaions.userDelete, vars);
  }

  protected parseResult(data: any): UserQuery['getUser'] | null {
    // Validate that the data exists and contains the 'getUser' field
    if (!data || !data.data || !data.data.getUser) {
      throw new Error('Invalid user data');
    }

    return data.data.getUser as UserQuery['getUser'];
  }
}
