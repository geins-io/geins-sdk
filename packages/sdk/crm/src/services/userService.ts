import type { GeinsUserGetType, GeinsSettings } from '@geins/types';
import {
  BaseApiService,
  logWrite,
  GeinsUserInputTypeType,
  SimpleCache,
  MerchantApiClient,
} from '@geins/core';
import { queries, mutations } from '../graphql';
export class UserService extends BaseApiService {
  private cache: SimpleCache<GeinsUserGetType>;
  constructor(apiClient: MerchantApiClient, geinsSettings: GeinsSettings) {
    super(apiClient, geinsSettings);
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
    const options = {
      query: queries.userGet,
      variables: vars,
    };
    return this.runQuery(options);
  }

  async get(): Promise<GeinsUserGetType | null> {
    const cacheKey = 'current_user';
    const cachedUser = this.cache.get(cacheKey);
    if (cachedUser) {
      return cachedUser;
    }
    const options = {
      query: queries.userGet,
      variables: await this.generateVars({}),
    };
    const user = await this.runQueryParsed<GeinsUserGetType>(options);
    if (user) {
      this.cache.set(cacheKey, user);
    }
    return user;
  }

  async create(
    user: GeinsUserInputTypeType,
    userToken?: string | undefined,
  ): Promise<any> {
    const options = {
      query: mutations.userRegister,
      variables: await this.generateMutationVars({ user }),
      userToken,
    };
    return this.runMutation(options);
  }

  async update(
    user: GeinsUserInputTypeType,
    userToken?: string | undefined,
  ): Promise<any> {
    const options = {
      query: mutations.userUpdate,
      variables: await this.generateMutationVars({ user }),
      userToken,
    };
    this.cache.delete('current_user');
    return this.runMutation(options);
  }

  async delete(): Promise<any> {
    const options = {
      query: mutations.userDelete,
      variables: await this.generateVars({}),
    };
    return this.runMutation(options);
  }

  protected parseResult(data: any): GeinsUserGetType | null {
    // Validate that the data exists and contains the 'getUser' field
    if (!data || !data.data || !data.data.getUser) {
      throw new Error('Invalid user data');
    }

    return data.data.getUser as GeinsUserGetType;
  }
}
