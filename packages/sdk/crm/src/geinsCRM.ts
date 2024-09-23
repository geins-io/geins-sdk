import { GeinsCore, BasePackage, buildEndpoints, logWrite } from '@geins/core';
import {
  AuthSettings,
  AuthClientConnectionMode,
  AuthCredentials,
  AuthResponse,
  UserInputType,
  UserCustomerType,
  UserType,
} from '@geins/types';
import { AuthClientDirect, AuthClientProxy } from './auth';
import type { AuthInterface, UserInterface } from './types';
import { UserService } from './services/userService';

class GeinsCRM extends BasePackage {
  private client: any;
  private credentials: any;

  private userService: UserService | undefined;
  private authClient: AuthClientDirect | AuthClientProxy;

  constructor(core: GeinsCore, authSettings: AuthSettings) {
    super(core);
    const { client, credentials } = core;
    this.client = client;
    this.credentials = credentials;

    if (authSettings.clientConnectionMode === AuthClientConnectionMode.Proxy) {
      const proxyUrl = authSettings.proxyUrl || '/api/auth';
      this.authClient = new AuthClientProxy(proxyUrl);
    } else if (
      authSettings.clientConnectionMode === AuthClientConnectionMode.Direct
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
    user?: UserInputType,
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
    logWrite('user', user);
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
      const registerUserAs = {
        newsletter: false,
        customerType: UserCustomerType.Private,
      } as UserInputType;

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
      isLoggedIn: this.userLoggedIn.bind(this),
      get: this.userGet.bind(this),
      update: this.userUpdate.bind(this.userService),
      orders: this.userOrders.bind(this),
      balance: this.userBalance.bind(this),
      adress: this.userAddress.bind(this),
      remove: this.userRemove.bind(this),
    };
  }

  private userLoggedIn(): Boolean {
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

  private async userGet(): Promise<UserType | undefined> {
    if (!this.userService) {
      this.initUserService();
    }

    // see if cookies are present
    const userFromCookies = this.authUserGetFromCookieTokens();
    if (!userFromCookies || userFromCookies.tokens?.expired) {
      return undefined;
    }

    return this.userService?.get();
  }

  private async userCreate(user: UserInputType): Promise<any> {
    if (!this.userService) {
      this.initUserService();
    }
    return this.userService?.create(user);
  }

  private async userUpdate(user: UserInputType): Promise<any> {
    if (!this.userService) {
      this.initUserService();
    }
    return this.userService?.update(user);
  }

  private async userOrders(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  private async userBalance(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  private async userAddress(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  private async userRemove(): Promise<any> {
    throw new Error('Method not implemented.');
  }
}

export { GeinsCRM };
