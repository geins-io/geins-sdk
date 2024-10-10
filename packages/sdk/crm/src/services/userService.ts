import type { GeinsUserType, GeinsSettings } from '@geins/types';
import { BaseApiService, GeinsUserInputTypeType } from '@geins/core';
import { queries, mutations } from '../graphql';
export class UserService extends BaseApiService {
  constructor(apiClient: any, geinsSettings: GeinsSettings) {
    super(apiClient, geinsSettings);
  }
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
    const options = {
      query: queries.userGet,
      variables: vars,
    };
    return this.runQuery(options);
  }

  async get(): Promise<GeinsUserType | undefined> {
    const options = {
      query: queries.userGet,
      variables: await this.generateVars({}),
    };
    const user = await this.runQueryParsed<GeinsUserType>(options);

    return user;
  }

  async create(user: GeinsUserInputTypeType): Promise<any> {
    const options = {
      query: mutations.userRegister,
      variables: await this.generateMutationVars({ user }),
    };
    const result = this.runMutation(options);

    return result;
  }

  async update(user: GeinsUserInputTypeType): Promise<GeinsUserType> {
    const options = {
      query: mutations.userUpdate,
      variables: await this.generateMutationVars({ user }),
    };
    const result = await this.runMutation(options);
    return this.parseResult(result) as GeinsUserType;
  }

  async delete(): Promise<any> {
    const options = {
      query: mutations.userDelete,
      variables: await this.generateVars({}),
    };
    const result = await this.runMutation(options);
    return result;
  }

  protected parseResult(data: any): GeinsUserType | undefined {
    if (!data || !data.data) {
      throw new Error('Invalid user data');
    }
    if (data.data.getUser) {
      return data.data.getUser as GeinsUserType;
    }
    if (data.data.updateUser) {
      return this.cleanObject(data.data.updateUser) as GeinsUserType;
    }
    return undefined;
  }
}
