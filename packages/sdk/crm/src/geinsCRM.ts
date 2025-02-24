import { BasePackage, buildEndpoints, GeinsCore } from '@geins/core';
import {
  AuthClientConnectionModes,
  AuthCredentials,
  AuthResponse,
  AuthSettings,
  AuthTokens,
  GeinsCustomerType,
  GeinsEventType,
  GeinsUserInputTypeType,
  GeinsUserOrdersType,
  GeinsUserType,
} from '@geins/types';
import { AuthClientDirect, AuthClientProxy } from './auth';
import { PasswordResetService, UserOrdersService, UserService } from './services';
import type { AuthInterface, UserInterface } from './types';

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
      throw new Error('Invalid client connection mode');
    }
  }

  destroy(): void {
    this._authClient.destroy();
    this._userService?.destroy();
    this._passwordResetService?.destroy();
    this._userOrdersService?.destroy();
  }

  private async initUserService(): Promise<void> {
    this._userService = new UserService(() => this._apiClient(), this._geinsSettings);

    if (!this._userService) {
      throw new Error('Failed to initialize user service');
    }
  }

  private async initPasswordService(): Promise<void> {
    this._passwordResetService = new PasswordResetService(() => this._apiClient(), this._geinsSettings);
    if (!this._passwordResetService) {
      throw new Error('Failed to initialize password reset service');
    }
  }

  private async initUserOrderService(): Promise<void> {
    this._userOrdersService = new UserOrdersService(() => this._apiClient(), this._geinsSettings);
    if (!this._userOrdersService) {
      throw new Error('Failed to initialize user order service');
    }
  }

  public setAuthTokens(tokens: AuthTokens): void {
    if (tokens?.token) {
      this.core.setUserToken(tokens?.token);
    }
    if (tokens?.refreshToken) {
      this._authClient.setRefreshToken(tokens.refreshToken);
    }
  }

  public clearAuthAndUser(): void {
    this.core?.setUserToken(undefined);
    this._authClient?.clearAuth();
    this._apiClient()?.clearCacheAndRefetchQueries();
  }

  public spoofUser(token: string): string {
    this._authClient.logout();
    return this._authClient.spoofPreviewUser(token);
  }

  get auth(): AuthInterface {
    if (!this._authClient) {
      throw new Error('AuthClient is not initialized');
    }
    return {
      get: this.authGetUser.bind(this),
      login: this.authLogin.bind(this),
      logout: this.authLogout.bind(this),
      refresh: this.authRefresh.bind(this),
      authorized: this.authAuthorized.bind(this),
    };
  }

  private handleAuthResponse(authResponse: AuthResponse | undefined, clearAuthOnFail: boolean = true): void {
    if (authResponse?.succeeded && authResponse.tokens?.token) {
      this.setAuthTokens(authResponse.tokens);
    } else if (clearAuthOnFail) {
      this.clearAuthAndUser();
    }
  }

  private async authAuthorized(refreshToken?: string): Promise<boolean> {
    // check if refreshToken is argument
    if (refreshToken) {
      this._authClient.setRefreshToken(refreshToken);
    }

    // try to to get user with refreshToken
    const authResponse = await this._authClient.getUser(refreshToken);
    this.handleAuthResponse(authResponse);

    return authResponse?.succeeded ?? false;
  }

  private async authLogin(credentials: AuthCredentials): Promise<AuthResponse | undefined> {
    const authResponse = await this._authClient.login(credentials);
    this.handleAuthResponse(authResponse);

    if (authResponse?.succeeded) {
      this._apiClient()?.clearCacheAndRefetchQueries();
    }

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
      console.warn('Failed to push USER_LOGIN event:', error);
    }

    return authResponse;
  }

  private async authLogout(): Promise<AuthResponse | undefined> {
    this.clearAuthAndUser();
    try {
      this.pushEvent({ subject: GeinsEventType.USER_LOGOUT, payload: {} }, GeinsEventType.USER_LOGOUT);
    } catch (error) {
      console.warn('Failed to push USER_LOGOUT event:', error);
    }

    return this._authClient.logout();
  }

  private async authRefresh(refreshToken?: string): Promise<AuthResponse | undefined> {
    const authResponse = await this._authClient.refresh(refreshToken);
    this.handleAuthResponse(authResponse);

    return authResponse;
  }

  private async authGetUser(refreshToken?: string, userToken?: string): Promise<AuthResponse | undefined> {
    const authResponse = await this._authClient.getUser(refreshToken, userToken);
    this.handleAuthResponse(authResponse);

    return authResponse;
  }

  get user(): UserInterface {
    if (!this._authClient) {
      throw new Error('AuthClient is not initialized');
    }
    return {
      get: this.userGet.bind(this),
      update: this.userUpdate.bind(this),
      create: this.userRegisterAndCreate.bind(this),
      remove: this.userRemove.bind(this),
      password: {
        change: this.userChangePassword.bind(this),
        requestReset: this.userPasswordResetRequest.bind(this),
        commitReset: this.userPasswordResetCommit.bind(this),
      },
      orders: {
        get: this.userOrders.bind(this),
      },
    };
  }

  private async userGet(): Promise<GeinsUserType | undefined> {
    if (!this._userService) {
      await this.initUserService();
    }

    // check if core has token
    const userTokenFromCore = this.getCore().getUserToken();
    if (!userTokenFromCore) {
      return undefined;
    }
    return this._userService?.get();
  }

  private async userUpdate(user: GeinsUserInputTypeType): Promise<any> {
    if (!this._userService) {
      await this.initUserService();
    }

    // Unwrap the Proxy
    const unwrappedUser: GeinsUserInputTypeType = JSON.parse(JSON.stringify(user));

    try {
      this.pushEvent(
        { subject: GeinsEventType.USER_UPDATE, payload: unwrappedUser },
        GeinsEventType.USER_UPDATE,
      );
    } catch (error) {
      console.warn('Failed to push USER_UPDATE event:', error);
    }

    return this._userService?.update(user);
  }

  private async userRegisterAndCreate(
    credentials: AuthCredentials,
    user?: GeinsUserInputTypeType,
  ): Promise<AuthResponse | undefined> {
    // logout user if already logged in
    await this.authLogout();

    // user will be registered and logged in
    const authResponse = await this._authClient.register(credentials);
    this.handleAuthResponse(authResponse);

    if (!authResponse?.succeeded) {
      return authResponse;
    }

    if (user) {
      const userResult = await this.userUpdate(user);
      if (!userResult) {
        throw new Error('Failed to update user with information');
      }
    } else {
      const registerUserAs: GeinsUserInputTypeType = {
        newsletter: false,
        customerType: GeinsCustomerType.PersonType,
      };

      const userResult = await this.userCreate(registerUserAs);

      if (!userResult) {
        throw new Error('Failed to create user in MC');
      }
    }

    const { refreshToken, token } = authResponse?.tokens || {};
    return this._authClient.getUser(refreshToken, token);
  }

  private async userCreate(user: GeinsUserInputTypeType): Promise<any> {
    if (!this._userService) {
      await this.initUserService();
    }

    return this._userService?.create(user);
  }

  private async userRemove(): Promise<any> {
    this.pushEvent({ subject: GeinsEventType.USER_DELETE, payload: {} }, GeinsEventType.USER_DELETE);
    if (!this._userService) {
      await this.initUserService();
    }

    return this._userService?.delete();
  }

  private async userOrders(): Promise<GeinsUserOrdersType | undefined> {
    if (!this._userOrdersService) {
      await this.initUserOrderService();
    }
    return this._userOrdersService?.get();
  }

  private async userChangePassword(credentials: AuthCredentials): Promise<AuthResponse | undefined> {
    const authResponse = await this._authClient.changePassword(credentials);
    this.handleAuthResponse(authResponse, false);

    return authResponse;
  }

  private async userPasswordResetRequest(email: string): Promise<any> {
    if (!this._passwordResetService) {
      await this.initPasswordService();
    }
    return this._passwordResetService?.request(email);
  }

  private async userPasswordResetCommit(resetKey: string, password: string): Promise<any> {
    if (!this._passwordResetService) {
      await this.initPasswordService();
    }
    return this._passwordResetService?.commit(resetKey, password);
  }
}

export { GeinsCRM };
