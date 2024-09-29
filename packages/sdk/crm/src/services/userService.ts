import type { GeinsUserGetType, GeinsSettings } from '@geins/types';
import {
  BaseApiService,
  logWrite,
  GeinsUserInputTypeType,
  SimpleCache,
} from '@geins/core';
import { queries, mutaions } from '../graphql';
export class UserService extends BaseApiService {
  private cache: SimpleCache<GeinsUserGetType>;
  constructor(client: any, geinsSettings: GeinsSettings) {
    super(client, geinsSettings);
    this.cache = new SimpleCache<GeinsUserGetType>(5 * 60 * 1000); // 5 minutes cache
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
    return this.runQuery(queries.userGet, vars);
  }

  async get(): Promise<GeinsUserGetType | null> {
    const cacheKey = 'current_user';
    const cachedUser = this.cache.get(cacheKey);
    if (cachedUser) {
      return cachedUser;
    }

    const vars = await this.generateVars({});
    const user = await this.runQueryParsed<GeinsUserGetType>(
      queries.userGet,
      vars,
    );
    if (user) {
      this.cache.set(cacheKey, user);
    }
    return user;
  }

  async create(user: GeinsUserInputTypeType): Promise<any> {
    const variables = { user };
    const vars = await this.generateMutationVars(variables);
    return this.runMutation(mutaions.userRegister, vars);
  }

  async update(user: GeinsUserInputTypeType): Promise<any> {
    const variables = { user };
    const vars = await this.generateMutationVars(variables);
    this.cache.delete('current_user'); // Invalidate cache on update
    return this.runMutation(mutaions.userUpdate, vars);
  }

  async delete(): Promise<any> {
    var vars = await this.generateVars({});
    return this.runMutation(mutaions.userDelete, vars);
  }

  protected parseResult(data: any): GeinsUserGetType | null {
    // Validate that the data exists and contains the 'getUser' field
    if (!data || !data.data || !data.data.getUser) {
      throw new Error('Invalid user data');
    }

    return data.data.getUser as GeinsUserGetType;
  }
}
