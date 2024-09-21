import { GeinsCore, BasePackage, buildEndpoints, logWrite } from '@geins/core';
import {
  AuthSettings,
  AuthClientConnectionMode,
  AuthCredentials,
  AuthResponse,
  UserInputType,
  UserCustomerType,
} from '@geins/types';
import { AuthClientDirect, AuthClientProxy } from './auth';
import { UserService } from './services/userService';

export interface AuthInterface {
  login(credentials: AuthCredentials): Promise<AuthResponse | undefined>;
  logout(): Promise<AuthResponse | undefined>;
  refresh(): Promise<AuthResponse | undefined>;
  getUser(): Promise<AuthResponse | undefined>;
  isLoggedIn(): Promise<Boolean>;
  newUser(
    credentials: AuthCredentials,
    user?: UserInputType,
  ): Promise<AuthResponse | undefined>;
}
export interface UserInterface {
  get(): Promise<AuthResponse | undefined>;
}

class GeinsCRM extends BasePackage {
  public userService: UserService;
  private authClient: AuthClientDirect | AuthClientProxy;

  constructor(core: GeinsCore, authSettings: AuthSettings) {
    super(core);
    const { client, credentials } = core;
    this.userService = new UserService(client, credentials);

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

  get auth(): AuthInterface {
    if (!this.authClient) {
      throw new Error('AuthClient is not initialized');
    }
    return {
      login: this.authClient.login.bind(this.authClient),
      logout: this.authClient.logout.bind(this.authClient),
      refresh: this.authClient.refresh.bind(this.authClient),
      getUser: this.authClient.getUser.bind(this.authClient),
      newUser: this.authRegisterNewUser.bind(this),
      isLoggedIn: this.authUserLoggedIn.bind(this),
    };
  }

  private async authUserLoggedIn(): Promise<Boolean> {
    if (!this.authClient) {
      throw new Error('AuthClient is not initialized');
    }
    // see if cookies are present
    const tokens = this.authClient.getCookieTokens();
    if (!tokens.token || !tokens.refreshToken) {
      return false;
    }

    // see if token time is expired
    const user = await this.authClient.getUserFromCookie(
      tokens.token,
      tokens.refreshToken,
    );
    if (!user) {
      return false;
    }
    if (user.tokens?.expired) {
      return false;
    }
    return true;
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
      const userResult = await this.userService.update(user);
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

      const userResult = await this.userService.create(registerUserAs);

      if (!userResult) {
        throw new Error('Failed to create user in MC');
      }
    }
    // get user

    return this.authClient.getUser();
  }

  get user(): UserInterface {
    if (!this.authClient) {
      throw new Error('AuthClient is not initialized');
    }
    return {
      get: this.userGet.bind(this),
    };
  }

  private async userGet(): Promise<AuthResponse | undefined> {
    if (!this.authClient) {
      throw new Error('AuthClient is not initialized');
    }

    // see if cookies are present

    // see if token time is expired

    // get user from graphql

    return this.authClient.getUser();
  }
}

export { GeinsCRM };
