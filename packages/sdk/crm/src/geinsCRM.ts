import { BasePackage, buildEndpoints, GeinsCore, GeinsError, GeinsErrorCode } from '@geins/core';
import {
  AuthClientConnectionModes,
  AuthCredentials,
  AuthResponse,
  AuthSettings,
  GeinsCustomerType,
  GeinsEventType,
  GeinsUserInputTypeType,
  GeinsUserOrdersType,
  GeinsUserType,
} from '@geins/types';
import { AuthClientDirect, AuthClientProxy } from './auth';
import { PasswordResetService, UserOrdersService, UserService } from './services';
import type { AuthInterface, UserInterface } from './types';

/**
 * Stateless CRM package.
 * No stored tokens or user state — all auth/user state flows through method parameters.
 * Cookie persistence is handled by CrmSession (session layer).
 */
class GeinsCRM extends BasePackage {
  private _authClient: AuthClientDirect | AuthClientProxy;
  private _userService!: UserService;
  private _passwordResetService!: PasswordResetService;
  private _userOrdersService!: UserOrdersService;

  constructor(core: GeinsCore, authSettings: AuthSettings) {
    super(core);
    const { geinsSettings } = core;

    if (authSettings.clientConnectionMode === AuthClientConnectionModes.Proxy) {
      const proxyUrl = authSettings.proxyUrl || '/api/auth';
      this._authClient = new AuthClientProxy(proxyUrl);
    } else if (authSettings.clientConnectionMode === AuthClientConnectionModes.Direct) {
      const endpoints = buildEndpoints(
        geinsSettings.apiKey,
        geinsSettings.accountName,
        geinsSettings.environment,
      );
      this._authClient = new AuthClientDirect(endpoints.authSign, endpoints.auth);
    } else {
      throw new GeinsError('Invalid client connection mode', GeinsErrorCode.INVALID_ARGUMENT);
    }
  }

  destroy(): void {
    this._authClient.destroy();
    this._userService?.destroy();
    this._passwordResetService?.destroy();
    this._userOrdersService?.destroy();
  }

  private get userService(): UserService {
    if (!this._userService) {
      this._userService = new UserService(() => this._apiClient(), this._geinsSettings);
    }
    return this._userService;
  }

  private get passwordResetService(): PasswordResetService {
    if (!this._passwordResetService) {
      this._passwordResetService = new PasswordResetService(() => this._apiClient(), this._geinsSettings);
    }
    return this._passwordResetService;
  }

  private get userOrdersService(): UserOrdersService {
    if (!this._userOrdersService) {
      this._userOrdersService = new UserOrdersService(() => this._apiClient(), this._geinsSettings);
    }
    return this._userOrdersService;
  }

  /**
   * Stateless auth interface.
   * All methods require tokens to be passed explicitly.
   */
  get auth(): AuthInterface {
    return {
      login: (credentials: AuthCredentials) => this.authLogin(credentials),
      logout: () => this._authClient.logout(),
      refresh: (refreshToken: string) => this._authClient.refresh(refreshToken),
      getUser: (refreshToken: string, userToken?: string) => this._authClient.getUser(refreshToken, userToken),
      authorized: async (refreshToken: string) => {
        const response = await this._authClient.getUser(refreshToken);
        return response?.succeeded ?? false;
      },
    };
  }

  private async authLogin(credentials: AuthCredentials): Promise<AuthResponse | undefined> {
    const authResponse = await this._authClient.login(credentials);

    try {
      this.pushEvent(
        {
          subject: GeinsEventType.USER_LOGIN,
          payload: {
            success: authResponse?.succeeded,
            user: credentials.username,
          },
        },
        GeinsEventType.USER_LOGIN,
      );
    } catch (error) {
      // Event emission is best-effort — swallow failures silently
    }

    return authResponse;
  }

  /**
   * Stateless user interface.
   * All read/write methods require a userToken for authorization.
   */
  get user(): UserInterface {
    return {
      get: (userToken: string) => this.userGet(userToken),
      update: (user: GeinsUserInputTypeType, userToken: string) => this.userUpdate(user, userToken),
      create: (credentials: AuthCredentials, user?: GeinsUserInputTypeType) =>
        this.userRegisterAndCreate(credentials, user),
      remove: (userToken: string) => this.userRemove(userToken),
      password: {
        change: (credentials: AuthCredentials, refreshToken: string) =>
          this._authClient.changePassword(credentials, refreshToken),
        requestReset: (email: string) => this.userPasswordResetRequest(email),
        commitReset: (resetKey: string, password: string) => this.userPasswordResetCommit(resetKey, password),
      },
      orders: {
        get: (userToken: string) => this.userOrders(userToken),
      },
    };
  }

  private async userGet(userToken: string): Promise<GeinsUserType | undefined> {
    return this.userService.get(userToken);
  }

  private async userUpdate(user: GeinsUserInputTypeType, userToken: string): Promise<GeinsUserType | undefined> {
    // Unwrap potential Proxy objects
    const unwrappedUser: GeinsUserInputTypeType = JSON.parse(JSON.stringify(user));

    try {
      this.pushEvent(
        { subject: GeinsEventType.USER_UPDATE, payload: unwrappedUser },
        GeinsEventType.USER_UPDATE,
      );
    } catch (error) {
      // Event emission is best-effort — swallow failures silently
    }

    return this.userService.update(user, userToken);
  }

  private async userRegisterAndCreate(
    credentials: AuthCredentials,
    user?: GeinsUserInputTypeType,
  ): Promise<AuthResponse | undefined> {
    const authResponse = await this._authClient.register(credentials);

    if (!authResponse?.succeeded || !authResponse.tokens?.token) {
      return authResponse;
    }

    const token = authResponse.tokens.token;

    if (user) {
      await this.userUpdate(user, token);
    } else {
      await this.userService.create(
        { newsletter: false, customerType: GeinsCustomerType.PersonType },
        token,
      );
    }

    return this._authClient.getUser(authResponse.tokens.refreshToken!, token);
  }

  private async userRemove(userToken: string): Promise<boolean> {
    try {
      this.pushEvent({ subject: GeinsEventType.USER_DELETE, payload: {} }, GeinsEventType.USER_DELETE);
    } catch (error) {
      // Event emission is best-effort — swallow failures silently
    }
    return this.userService.delete(userToken);
  }

  private async userOrders(userToken: string): Promise<GeinsUserOrdersType | undefined> {
    return this.userOrdersService.get(userToken);
  }

  private async userPasswordResetRequest(email: string): Promise<boolean> {
    const result = await this.passwordResetService.request(email);
    return !!result;
  }

  private async userPasswordResetCommit(resetKey: string, password: string): Promise<boolean> {
    const result = await this.passwordResetService.commit(resetKey, password);
    return !!result;
  }
}

export { GeinsCRM };
