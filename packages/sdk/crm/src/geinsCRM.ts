import { GeinsCore, BasePackage, buildEndpoints } from '@geins/core';
import {
  AuthSettings,
  AuthClientConnectionModes,
  AuthCredentials,
  AuthResponse,
  AuthTokens,
  GeinsUserInputTypeType,
  GeinsUserOrdersType,
  GeinsCustomerType,
  GeinsEventType,
  GeinsUserType,
} from '@geins/types';
import { AuthClientDirect, AuthClientProxy, AuthService } from './auth';
import type { AuthInterface, UserInterface } from './types';
import { UserService, UserOrdersService, PasswordResetService } from './services';

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

  public spoofUser(token: string): string {
    this._authClient.logout();
    return this._authClient.spoofPreviewUser(token);
  }

  public async passwordResetRequest(email: string): Promise<any> {
    if (!this._passwordResetService) {
      await this.initPasswordService();
    }
    return this._passwordResetService?.request(email);
  }

  public async passwordResetCommit(resetKey: string, password: string): Promise<any> {
    if (!this._passwordResetService) {
      await this.initPasswordService();
    }
    return this._passwordResetService?.commit(resetKey, password);
  }

  get auth(): AuthInterface {
    if (!this._authClient) {
      throw new Error('AuthClient is not initialized');
    }
    return {
      login: this.authLogin.bind(this),
      logout: this.authLogout.bind(this),
      refresh: this.authRefresh.bind(this),
      getUser: this.authGetUser.bind(this),
      changePassword: this._authClient.changePassword.bind(this._authClient),
      newUser: this.authRegisterNewUser.bind(this),
      authorized: this.authAuthorized.bind(this),
    };
  }

  private async authAuthorized(refreshToken?: string): Promise<boolean> {
    if (!this._authClient) {
      throw new Error('AuthClient is not initialized');
    }

    // check if refreshToken is argument
    if (refreshToken) {
      this._authClient.setRefreshToken(refreshToken);
    }
    // try to to get user with refreshToken
    const user = await this._authClient.getUser(refreshToken);
    if (user?.succeeded && user.tokens) {
      this.setAuthTokens(user.tokens);
    } else {
      this._authClient.clearAuth();
    }
    return user?.succeeded ?? false;
  }

  private async authLogin(credentials: AuthCredentials): Promise<AuthResponse | undefined> {
    if (!this._authClient) {
      throw new Error('AuthClient is not initialized');
    }
    const loginResult = await this._authClient.login(credentials);
    if (loginResult && loginResult.succeeded && loginResult.tokens?.token) {
      const loginResult = await this._authClient.login(credentials);
      if (loginResult?.succeeded && loginResult.tokens?.token) {
        this.setAuthTokens(loginResult.tokens);
      } else {
      this._authClient.clearAuth();
    }
    this.pushEvent(
      {
        subject: GeinsEventType.USER_LOGIN,
        payload: {
          success: loginResult?.succeeded,
          tokens: loginResult?.tokens,
          user: credentials.username,
        },
      },
      GeinsEventType.USER_LOGIN,
    );
    return loginResult;
  }

  private authLogout(): Promise<AuthResponse | undefined> {
    if (!this._authClient) {
      throw new Error('AuthClient is not initialized');
    }
    this.pushEvent({ subject: GeinsEventType.USER_LOGOUT, payload: {} }, GeinsEventType.USER_LOGOUT);
    return this._authClient.logout();
  }

  private async authRefresh(refreshToken?: string): Promise<AuthResponse | undefined> {
    const result = await this._authClient.refresh(refreshToken);
    if (result && result.succeeded && result.tokens?.token) {
      this.setAuthTokens(result.tokens);
    }
    return result;
  }

  private async authGetUser(refreshToken?: string, userToken?: string): Promise<AuthResponse | undefined> {
    const result = await this._authClient.getUser(refreshToken, userToken);
    if (result && result.succeeded && result.tokens?.token) {
      this.setAuthTokens(result.tokens);
    }
    return result;
  }

  private async authRegisterNewUser(
    credentials: AuthCredentials,
    user?: GeinsUserInputTypeType,
  ): Promise<AuthResponse | undefined> {
    if (!this._authClient) {
      throw new Error('AuthClient is not initialized');
    }
    // logout user if already logged in
    await this._authClient.logout();

    // user will be registered and logged in
    const registerResult = await this._authClient.register(credentials);

    // if not successful registerd in auth throw error
    if (!registerResult?.succeeded) {
      throw new Error('Failed to register user');
    }

    const userToken = registerResult.tokens?.token;
    if (!userToken) {
      throw new Error('Failed to get user token');
    }

    const refreshToken = registerResult.tokens?.refreshToken;
    if (!refreshToken) {
      throw new Error('Failed to get refresh token');
    }
    this.core.setUserToken(userToken);
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

      const userResult = await this.userCreate(registerUserAs, userToken);

      if (!userResult) {
        throw new Error('Failed to create user in MC');
      }
    }

    return this._authClient.getUser(refreshToken, userToken);
  }

  get user(): UserInterface {
    return {
      get: this.userGet.bind(this),
      update: this.userUpdate.bind(this),
      orders: this.userOrders.bind(this),
      remove: this.userRemove.bind(this),
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

  private async userCreate(user: GeinsUserInputTypeType, userToken?: string | undefined): Promise<any> {
    if (!this._userService) {
      await this.initUserService();
    }

    return this._userService?.create(user, userToken);
  }

  private async userUpdate(user: GeinsUserInputTypeType): Promise<any> {
    if (!this._userService) {
      await this.initUserService();
    }
    this.pushEvent({ subject: GeinsEventType.USER_UPDATE, payload: user }, GeinsEventType.USER_UPDATE);
    return this._userService?.update(user);
  }

  private async userOrders(): Promise<GeinsUserOrdersType | undefined> {
    if (!this._userOrdersService) {
      await this.initUserOrderService();
    }
    return this._userOrdersService?.get();
  }

  private async userRemove(): Promise<any> {
    this.pushEvent({ subject: GeinsEventType.USER_DELETE, payload: {} }, GeinsEventType.USER_DELETE);
    throw new Error('Method not implemented.');
  }
}

export { GeinsCRM };
