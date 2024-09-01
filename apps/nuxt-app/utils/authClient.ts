import { AuthService, type AuthResponse } from './authService';
import { CookieService, AUTH_COOKIES } from '@geins/core';
import { authClaimsTokenSerializeToObject } from './helpers';

export enum ConnectionType {
  Proxy = 'Proxy',
  ClientSide = 'ClienSide',
}

export class AuthClient {
  private AUTH_ENDPOINT_APP = '/api/auth';
  private authService: AuthService | null = null;
  private cookieService: CookieService = new CookieService();

  constructor(
    private connectionType: ConnectionType,
    private signEndpoint?: string,
    private authEndpoint?: string,
  ) {
    if (connectionType === ConnectionType.ClientSide) {
      if (!signEndpoint || !authEndpoint) {
        throw new Error('An endpoint that can verify identities is required');
      }
      this.initAuthService(signEndpoint, authEndpoint);
    }
  }

  initAuthService(signEndpoint: string, authEndpoint: string) {
    this.authService = new AuthService(signEndpoint, authEndpoint);
  }

  async token() {
    const result = await fetch(this.AUTH_ENDPOINT_APP + '/token', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    }).then((res) => res.json());

    if (result.status !== 200) {
      return;
    }

    // GET THE SET COOKIE

    if (!result.body || !result.body.data) {
      return;
    }
    return result.body.data;
  }

  async nothing() {
    const result = await fetch(this.AUTH_ENDPOINT_APP + '/nothing', {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json());

    if (result.status !== 200) {
      return;
    }

    // GET THE SET COOKIE

    if (!result.body || !result.body.data) {
      return;
    }
    return result.body.data;
  }

  private async loginProxy(credentials: AuthCredentials) {
    const result = await fetch(this.AUTH_ENDPOINT_APP + '/login', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    }).then((res) => res.json());

    if (result.status !== 200) {
      return;
    }

    if (!result.body || !result.body.data) {
      return;
    }
    return result.body.data;
  }

  private async loginClientSide(credentials: AuthCredentials) {
    if (!this.authService) {
      throw new Error('AuthService not initialized');
    }
    return await this.authService.login(credentials);
  }

  async login(credentials: AuthCredentials) {
    const authReponse =
      this.connectionType === ConnectionType.Proxy
        ? await this.loginProxy(credentials)
        : await this.loginClientSide(credentials);
    if (!authReponse) {
      throw new Error('Invalid credentials');
    }

    this.setCookiesLogin(authReponse, credentials.rememberUser || false);
    return authReponse;
  }

  private async logoutProxy() {
    const result = await fetch(this.AUTH_ENDPOINT_APP + '/logout', {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json());
    return result.status === 200;
  }

  private async logoutClientSide() {
    if (!this.authService) {
      throw new Error('AuthService not initialized');
    }
    return await this.authService.logout();
  }

  async logout() {
    this.clearCookies();
    const result =
      this.connectionType === ConnectionType.Proxy
        ? await this.logoutProxy()
        : await this.logoutClientSide();

    if (!result) {
      throw new Error('Logout failed');
    }
    return result;
  }

  private async refreshProxy() {
    const result = await fetch(this.AUTH_ENDPOINT_APP + '/refresh', {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json());

    if (result.status !== 200) {
      return;
    }

    if (!result.body || !result.body.data) {
      return;
    }

    return result.body.data;
  }

  private async refreshClientSide() {
    if (!this.authService) {
      throw new Error('AuthService not initialized');
    }
    return await this.authService.refresh();
  }

  async refresh() {
    const authResponse =
      this.connectionType === ConnectionType.Proxy
        ? await this.refreshProxy()
        : await this.refreshClientSide();

    if (authResponse && authResponse.tokens && authResponse.tokens.token) {
      this.setCookiesRefresh(authResponse.tokens.token);
    }
    return authResponse;
  }

  private async changePasswordProxy(credentials: AuthCredentials) {
    const result = await fetch(this.AUTH_ENDPOINT_APP + '/password', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    }).then((res) => res.json());
    if (result.status !== 200) {
      return;
    }
    if (!result.body || !result.body.data) {
      return;
    }

    return result.body.data;
  }

  private async changePasswordClientSide(credentials: AuthCredentials) {
    if (!this.authService) {
      throw new Error('AuthService not initialized');
    }
    return await this.authService.changePassword(credentials);
  }

  async changePassword(credentials: AuthCredentials): Promise<boolean> {
    if (!credentials.newPassword) {
      throw new Error('New password is required');
    }

    const result =
      this.connectionType === ConnectionType.Proxy
        ? await this.changePasswordProxy(credentials)
        : await this.changePasswordClientSide(credentials);

    if (!result) {
      return false;
    }
    console.log('[authClient.ts] - changePassword() result', result);
    if (result.succeeded) {
      return true;
    } else {
      return false;
    }
  }

  private async getUserProxy() {
    const result = await fetch(this.AUTH_ENDPOINT_APP + '/user', {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json());

    if (result.status !== 200) {
      return;
    }

    if (!result.body || !result.body.data) {
      return;
    }

    return result.body.data;
  }

  private async getUserClientSide(): Promise<AuthResponse> {
    let authResponse: AuthResponse = { succeeded: false };
    if (!this.authService) {
      return authResponse;
    }
    try {
      const userAuthResponse = await this.authService.getUser();
      if (
        userAuthResponse &&
        userAuthResponse.user &&
        userAuthResponse.tokens
      ) {
        authResponse = userAuthResponse;
      }
    } catch (error) {
      console.error('Failed to get user:', error);
    }

    if (!authResponse.tokens?.token || authResponse.tokens?.token === '') {
      const token = this.cookieService.get(AUTH_COOKIES.USER_AUTH);
      authResponse = (await this.authService?.getUser(token)) || authResponse;
    }

    return authResponse;
  }

  async getUser(): Promise<any> {
    let authResponse =
      this.connectionType === ConnectionType.Proxy
        ? await this.getUserProxy()
        : await this.getUserClientSide();

    if (!authResponse || !authResponse.succeeded) {
      this.clearCookies();
      return;
    }

    if (authResponse && authResponse.tokens.token) {
      if (authResponse.tokens.expired) {
        this.clearCookies();
        return;
      } else if (authResponse.tokens.expiresSoon) {
        const refreshResult = await this.refresh();
      }
    }

    return authResponse.user;
  }

  async registerProxy(credentials: AuthCredentials) {
    const result = await fetch(this.AUTH_ENDPOINT_APP + '/register', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    }).then((res) => res.json());

    if (result.status !== 200) {
      return;
    }

    if (!result.body || !result.body.data) {
      return;
    }

    return result.body.data;
  }

  async registerClientSide(credentials: AuthCredentials) {
    if (!this.authService) {
      throw new Error('AuthService not initialized');
    }
    return await this.authService.register(credentials);
  }

  async register(credentials: AuthCredentials) {
    const result =
      this.connectionType === ConnectionType.Proxy
        ? await this.registerProxy(credentials)
        : await this.registerClientSide(credentials);

    if (!result) {
      throw new Error('Logout failed');
    }
    return result;
  }

  private setCookiesLogin(authReponse: AuthResponse, rememberUser: boolean) {
    const maxAge = rememberUser ? 604800 : 1800; // 7 days or 30 minutes - This is matching the lifetime of the refresh cookie from the auth service
    if (authReponse.user && authReponse.user.username) {
      this.cookieService.set({
        name: AUTH_COOKIES.USER,
        payload: authReponse.user.username,
        maxAge: maxAge,
      });
    }
    if (authReponse.tokens && authReponse.tokens.token) {
      this.cookieService.set({
        name: AUTH_COOKIES.USER_AUTH,
        payload: authReponse.tokens.token,
        maxAge: maxAge,
      });
    }
    if (authReponse.user && authReponse.user.customerType) {
      this.cookieService.set({
        name: AUTH_COOKIES.USER_TYPE,
        payload: authReponse.user.customerType,
        maxAge: maxAge,
      });
    }
    this.cookieService.set({
      name: AUTH_COOKIES.USER_MAX_AGE,
      payload: maxAge.toString(),
      maxAge: maxAge,
    });
  }

  private setCookiesRefresh(userToken: any) {
    let maxAge = 1800;
    const maxAgeCookie = this.cookieService.get(AUTH_COOKIES.USER_MAX_AGE);
    if (maxAgeCookie) {
      maxAge = parseInt(maxAgeCookie);
    }

    this.cookieService.set({
      name: AUTH_COOKIES.USER_AUTH,
      payload: userToken,
      maxAge: maxAge,
    });
  }

  private clearCookies() {
    this.cookieService.remove(AUTH_COOKIES.USER);
    this.cookieService.remove(AUTH_COOKIES.USER_AUTH);
    this.cookieService.remove(AUTH_COOKIES.USER_TYPE);
    this.cookieService.remove(AUTH_COOKIES.USER_MAX_AGE);
  }
}
