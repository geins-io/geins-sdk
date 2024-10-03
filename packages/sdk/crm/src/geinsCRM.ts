import { GeinsCore, BasePackage, buildEndpoints, logWrite } from '@geins/core';
import {
  AuthSettings,
  AuthClientConnectionModes,
  AuthCredentials,
  AuthResponse,
  GeinsSettings,
  GeinsUserGetType,
  GeinsUserInputTypeType,
  GeinsUserOrdersType,
  GeinsCustomerType,
  GeinsEventType,
} from '@geins/types';
import { AuthClientDirect, AuthClientProxy } from './auth';
import type { AuthInterface, UserInterface } from './types';
import {
  UserService,
  UserOrdersService,
  PasswordResetService,
} from './services';

class GeinsCRM extends BasePackage {
  private apiClient: any;
  private geinsSettings: GeinsSettings;
  private authClient: AuthClientDirect | AuthClientProxy;
  private userService: UserService | undefined;
  private passwordResetService: PasswordResetService | undefined;
  private userOrdersService: UserOrdersService | undefined;

  constructor(core: GeinsCore, authSettings: AuthSettings) {
    super(core);
    const { client, geinsSettings } = core;
    this.apiClient = client;
    this.geinsSettings = geinsSettings;

    if (authSettings.clientConnectionMode === AuthClientConnectionModes.Proxy) {
      const proxyUrl = authSettings.proxyUrl || '/api/auth';
      this.authClient = new AuthClientProxy(proxyUrl);
    } else if (
      authSettings.clientConnectionMode === AuthClientConnectionModes.Direct
    ) {
      const endpoints = buildEndpoints(
        geinsSettings.apiKey,
        geinsSettings.accountName,
        geinsSettings.environment,
      );
      this.authClient = new AuthClientDirect(
        endpoints.authSign,
        endpoints.auth,
      );
    } else {
      throw new Error('Invalid client connection mode');
    }
  }

  private async initUserService(): Promise<void> {
    this.userService = new UserService(this.apiClient, this.geinsSettings);
    if (!this.userService) {
      throw new Error('Failed to initialize user service');
    }
  }

  private async initPasswordService(): Promise<void> {
    this.passwordResetService = new PasswordResetService(
      this.apiClient,
      this.geinsSettings,
    );
    if (!this.passwordResetService) {
      throw new Error('Failed to initialize password reset service');
    }
  }

  private async initUserOrderService(): Promise<void> {
    this.userOrdersService = new UserOrdersService(
      this.apiClient,
      this.geinsSettings,
    );
    if (!this.userOrdersService) {
      throw new Error('Failed to initialize user order service');
    }
  }

  public spoofUser(token: string): string {
    this.authClient.logout();
    return this.authClient.spoofPreviewUser(token);
  }

  public async passwordResetRequest(email: string): Promise<any> {
    if (!this.passwordResetService) {
      await this.initPasswordService();
    }
    return this.passwordResetService?.request(email);
  }

  public async passwordResetCommit(
    resetKey: string,
    password: string,
  ): Promise<any> {
    if (!this.passwordResetService) {
      await this.initPasswordService();
    }
    return this.passwordResetService?.commit(resetKey, password);
  }

  get auth(): AuthInterface {
    if (!this.authClient) {
      throw new Error('AuthClient is not initialized');
    }
    return {
      login: this.authLogin.bind(this),
      logout: this.authLogout.bind(this),
      refresh: this.authClient.refresh.bind(this.authClient),
      getUser: this.authClient.getUser.bind(this.authClient),
      changePassword: this.authClient.changePassword.bind(this.authClient),
      newUser: this.authRegisterNewUser.bind(this),
    };
  }

  private async authLogin(
    credentials: AuthCredentials,
  ): Promise<AuthResponse | undefined> {
    if (!this.authClient) {
      throw new Error('AuthClient is not initialized');
    }
    const loginResult = await this.authClient.login(credentials);
    if (loginResult && loginResult.succeeded) {
      if (loginResult.tokens?.token) {
        this.core.setUserToken(loginResult.tokens?.token);
      }
    }
    this.pushEvent(
      {
        subject: GeinsEventType.USER_LOGIN,
        payload: {
          success: loginResult?.succeeded,
          user: credentials.username,
        },
      },
      GeinsEventType.USER_LOGIN,
    );
    return loginResult;
  }

  private authLogout(): Promise<AuthResponse | undefined> {
    if (!this.authClient) {
      throw new Error('AuthClient is not initialized');
    }
    this.pushEvent(
      { subject: GeinsEventType.USER_LOGOUT, payload: {} },
      GeinsEventType.USER_LOGOUT,
    );
    return this.authClient.logout();
  }

  private authUserGetFromCookieTokens(): AuthResponse | undefined {
    if (!this.authClient) {
      throw new Error('AuthClient is not initialized');
    }
    // see if cookies are present
    const tokens = this.authClient.getCookieTokens();
    if (!tokens.token || !tokens.refreshToken) {
      this.authClient.clearCookies();
      return undefined;
    }
    return this.authClient.getUserFromCookie(tokens.token, tokens.refreshToken);
  }

  private async authRegisterNewUser(
    credentials: AuthCredentials,
    user?: GeinsUserInputTypeType,
  ): Promise<AuthResponse | undefined> {
    if (!this.authClient) {
      throw new Error('AuthClient is not initialized');
    }
    // logout user if already logged in
    await this.authClient.logout();

    // user will be registered and logged in
    const registerResult = await this.authClient.register(credentials);

    // if not successful registerd in auth throw error
    if (!registerResult?.succeeded) {
      throw new Error('Failed to register user');
    }

    const userToken = registerResult.tokens?.token;
    const refreshToken = registerResult.tokens?.refreshToken;
    if (user) {
      const userResult = await this.userUpdate(user, userToken);
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

    return this.authClient.getUser(refreshToken, userToken);
  }

  get user(): UserInterface {
    return {
      authorized: this.userAuthorized.bind(this),
      get: this.userGet.bind(this),
      update: this.userUpdate.bind(this.userService),
      orders: this.userOrders.bind(this),
      remove: this.userRemove.bind(this),
    };
  }

  private userAuthorized(): Boolean {
    if (!this.authClient) {
      throw new Error('AuthClient is not initialized');
    }
    // see if cookies are present
    const tokens = this.authClient.getCookieTokens();
    if (!tokens.token || !tokens.refreshToken) {
      this.authClient.clearCookies();
      return false;
    }

    // see if token time is expired
    const user = this.authUserGetFromCookieTokens();
    if (!user) {
      return false;
    }

    if (!user || user.tokens?.expired) {
      this.authClient.clearCookies();
      return false;
    }
    return true;
  }

  private async userGet(): Promise<GeinsUserGetType | null | undefined> {
    if (!this.userService) {
      await this.initUserService();
    }

    // see if cookies are present
    //const userFromCookies = this.authUserGetFromCookieTokens();

    //console.log('userGet', userFromCookies);
    logWrite('userGet', this.core.getUserToken());
    return this.userService?.get();
  }

  private async userCreate(
    user: GeinsUserInputTypeType,
    userToken?: string | undefined,
  ): Promise<any> {
    if (!this.userService) {
      await this.initUserService();
    }
    return this.userService?.create(user, userToken);
  }

  private async userUpdate(
    user: GeinsUserInputTypeType,
    userToken?: string | undefined,
  ): Promise<any> {
    if (!this.userService) {
      await this.initUserService();
    }
    this.pushEvent(
      { subject: GeinsEventType.USER_UPDATE, payload: user },
      GeinsEventType.USER_UPDATE,
    );
    return this.userService?.update(user, userToken);
  }

  private async userOrders(): Promise<GeinsUserOrdersType | null | undefined> {
    if (!this.userOrdersService) {
      await this.initUserOrderService();
    }
    return this.userOrdersService?.get();
  }

  private async userRemove(): Promise<any> {
    this.pushEvent(
      { subject: GeinsEventType.USER_DELETE, payload: {} },
      GeinsEventType.USER_DELETE,
    );
    throw new Error('Method not implemented.');
  }
}

export { GeinsCRM };
