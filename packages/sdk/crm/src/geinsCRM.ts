import { GeinsCore, BasePackage, buildEndpoints, logWrite } from '@geins/core';
import {
  AuthSettings,
  AuthClientConnectionMode,
  AuthCredentials,
  AuthResponse,
  UserInputType,
} from '@geins/types';
import { AuthClientDirect, AuthClientProxy } from './auth';
import { UserService } from './services/userService';

export interface AuthInterface {
  login(credentials: AuthCredentials): Promise<AuthResponse | undefined>;
  logout(): Promise<AuthResponse | undefined>;
  refresh(): Promise<AuthResponse | undefined>;
  getUser(): Promise<AuthResponse | undefined>;
  newUser(
    credentials: AuthCredentials,
    user?: UserInputType,
  ): Promise<AuthResponse | undefined>;
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

  get Auth(): AuthInterface {
    if (!this.authClient) {
      throw new Error('AuthClient is not initialized');
    }
    return {
      login: this.authClient.login.bind(this.authClient),
      logout: this.authClient.logout.bind(this.authClient),
      refresh: this.authClient.refresh.bind(this.authClient),
      getUser: this.authClient.getUser.bind(this.authClient),
      newUser: this.authRegisterNewUser.bind(this),
    };
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

    if (!registerResult?.succeeded) {
      throw new Error('Failed to register user');
    }

    // update user to MC
    if (!user) {
      const userResult = await this.userService.update(user);
      if (!userResult) {
        throw new Error('Failed to update user');
      }
    }

    logWrite('Register result', registerResult);
    return registerResult;
  }
}

export { GeinsCRM };
