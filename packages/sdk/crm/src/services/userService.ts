import type { GeinsSettings, GeinsUserType, GeinsUserInputTypeType } from '@geins/types';
import { BaseApiService, GeinsError, GeinsErrorCode } from '@geins/core';
import type { ApiClientGetter, GraphQLQueryOptions } from '@geins/core';
import { queries, mutations } from '../graphql';

/** Service for CRUD operations on user profiles (get, create, update, delete). */
export class UserService extends BaseApiService {
  constructor(apiClient: ApiClientGetter, geinsSettings: GeinsSettings) {
    super(apiClient, geinsSettings);
  }

  /** Enriches variables with default locale, market, and channel. */
  private generateVars(variables: Record<string, unknown>): Record<string, unknown> {
    return this.createVariables(variables);
  }

  /** Normalizes user mutation variables (maps entityId to personalId, coerces newsletter). */
  private generateMutationVars(variables: Record<string, unknown>): Record<string, unknown> {
    const user = variables.user as Record<string, unknown> | undefined;
    if (user?.entityId) {
      user.personalId = user.entityId;
      delete user.entityId;
    }
    if (user) {
      user.newsletter = !!(user.newsletter === 'true');
    }
    return this.createVariables(variables);
  }

  /**
   * Fetches the authenticated user's profile.
   * @param userToken - The user's authentication token.
   * @returns The user profile, or undefined if not found.
   */
  async get(userToken: string): Promise<GeinsUserType | undefined> {
    const options: GraphQLQueryOptions = {
      query: queries.userGet,
      variables: this.generateVars({}),
      userToken,
    };
    return this.runQueryParsed<GeinsUserType>(options);
  }

  /**
   * Registers a new user.
   * @param user - The user data to register.
   * @param userToken - The user's authentication token.
   * @returns The created user profile, or undefined on failure.
   */
  async create(user: GeinsUserInputTypeType, userToken: string): Promise<GeinsUserType | undefined> {
    const options: GraphQLQueryOptions = {
      query: mutations.userRegister,
      variables: this.generateMutationVars({ user }),
      userToken,
    };
    const result = await this.runMutation(options);
    return this.parseResult(result);
  }

  /**
   * Updates an existing user's profile.
   * @param user - The updated user data.
   * @param userToken - The user's authentication token.
   * @returns The updated user profile, or undefined on failure.
   */
  async update(user: GeinsUserInputTypeType, userToken: string): Promise<GeinsUserType | undefined> {
    const options: GraphQLQueryOptions = {
      query: mutations.userUpdate,
      variables: this.generateMutationVars({ user }),
      userToken,
    };
    const result = await this.runMutation(options);
    return this.parseResult(result);
  }

  /**
   * Deletes the authenticated user's account.
   * @param userToken - The user's authentication token.
   * @returns True if the deletion succeeded.
   */
  async delete(userToken: string): Promise<boolean> {
    const options: GraphQLQueryOptions = {
      query: mutations.userDelete,
      variables: this.generateVars({}),
      userToken,
    };
    const result = await this.runMutation(options);
    return !!result;
  }

  /**
   * Extracts the user object from a getUser or updateUser response.
   * @throws {GeinsError} If the response data is invalid.
   */
  protected parseResult(data: unknown): GeinsUserType | undefined {
    const d = data as { data?: { getUser?: GeinsUserType; updateUser?: GeinsUserType } };
    if (!d?.data) {
      throw new GeinsError('Invalid user data', GeinsErrorCode.PARSE_ERROR);
    }
    if (d.data.getUser) {
      return d.data.getUser;
    }
    if (d.data.updateUser) {
      return this.cleanObject(d.data.updateUser) as GeinsUserType;
    }
    return undefined;
  }
}
