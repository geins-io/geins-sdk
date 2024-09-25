import { GeinsCore, BasePackage, buildEndpoints, logWrite } from '@geins/core';
import {
  AuthSettings,
  AuthClientConnectionModes,
  AuthCredentials,
  AuthResponse,
  GeinsUserGetType,
  GeinsUserInputTypeType,
  GeinsUserOrdersType,
  GeinsCustomerType,
} from '@geins/types';
import { AuthClientDirect, AuthClientProxy } from './auth';
import type { AuthInterface, UserInterface } from './types';
import {
  UserService,
  UserOrdersService,
  PasswordResetService,
} from './services';

class GeinsCRM extends BasePackage {
  private client: any;
  private credentials: any;
  private authClient: AuthClientDirect | AuthClientProxy;
  private userService: UserService | undefined;
  private passwordResetService: PasswordResetService | undefined;
  private userOrdersService: UserOrdersService | undefined;

  constructor(core: GeinsCore, authSettings: AuthSettings) {
    super(core);
    const { client, credentials } = core;
    this.client = client;
    this.credentials = credentials;

    if (authSettings.clientConnectionMode === AuthClientConnectionModes.Proxy) {
      const proxyUrl = authSettings.proxyUrl || '/api/auth';
      this.authClient = new AuthClientProxy(proxyUrl);
    } else if (
      authSettings.clientConnectionMode === AuthClientConnectionModes.Direct
    ) {
      const endpoints = buildEndpoints(
        credentials.apiKey,
        credentials.accountName,
        credentials.environment,
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
    this.userService = new UserService(this.client, this.credentials);
    if (!this.userService) {
      throw new Error('Failed to initialize user service');
    }
  }

  private async initPasswordService(): Promise<void> {
    this.passwordResetService = new PasswordResetService(
      this.client,
      this.credentials,
    );
    if (!this.passwordResetService) {
      throw new Error('Failed to initialize password reset service');
    }
  }

  private async initUserOrderService(): Promise<void> {
    this.userOrdersService = new UserOrdersService(
      this.client,
      this.credentials,
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
      login: this.authClient.login.bind(this.authClient),
      logout: this.authClient.logout.bind(this.authClient),
      refresh: this.authClient.refresh.bind(this.authClient),
      getUser: this.authClient.getUser.bind(this.authClient),
      changePassword: this.authClient.changePassword.bind(this.authClient),
      newUser: this.authRegisterNewUser.bind(this),
    };
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
    // Remove logWrite statement
    // update user to MC with information
    if (user) {
      const userResult = await this.userUpdate(user);
      logWrite('userResult', userResult);
      if (!userResult) {
        throw new Error('Failed to update user with information');
      }
    }
    // no info just crate a new user in MC
    else {
      const registerUserAs: GeinsUserInputTypeType = {
        newsletter: false,
        customerType: GeinsCustomerType.PersonType,
      };

      const userResult = await this.userCreate(registerUserAs);

      if (!userResult) {
        throw new Error('Failed to create user in MC');
      }
    }
    // get user

    return this.authClient.getUser();
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
    const userFromCookies = this.authUserGetFromCookieTokens();
    if (!userFromCookies || userFromCookies.tokens?.expired) {
      return undefined;
    }
    return this.userService?.get();
  }

  private async userCreate(user: GeinsUserInputTypeType): Promise<any> {
    if (!this.userService) {
      await this.initUserService();
    }
    return this.userService?.create(user);
  }

  private async userUpdate(user: GeinsUserInputTypeType): Promise<any> {
    if (!this.userService) {
      await this.initUserService();
    }
    return this.userService?.update(user);
  }

  private async userOrders(): Promise<GeinsUserOrdersType | null | undefined> {
    if (!this.userOrdersService) {
      await this.initUserOrderService();
    }
    return this.userOrdersService?.get();
  }

  private async userRemove(): Promise<any> {
    throw new Error('Method not implemented.');
  }
}

export { GeinsCRM };
