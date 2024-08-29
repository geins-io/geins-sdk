import { AuthService } from './authService';
import { CookieService, AUTH_COOKIES } from '@geins/core';

interface Credentials {
  username: string;
  password: string;
  newPassword?: string;
  rememberUser?: boolean;
}

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

  private async loginProxy(credentials: Credentials) {
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

  private async loginClientSide(credentials: Credentials) {
    if (!this.authService) {
      throw new Error('AuthService not initialized');
    }
    return await this.authService.login(credentials);
  }

  async login(credentials: Credentials) {
    const user =
      this.connectionType === ConnectionType.Proxy
        ? await this.loginProxy(credentials)
        : await this.loginClientSide(credentials);

    if (!user || !user.authenticated) {
      throw new Error('Invalid credentials');
    }

    this.setCookiesLogin(user);
    return user;
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
    return result.status === 200;
  }

  private async refreshClientSide() {
    if (!this.authService) {
      throw new Error('AuthService not initialized');
    }
    return await this.authService.refresh();
  }

  async refresh() {
    const result =
      this.connectionType === ConnectionType.Proxy
        ? await this.refreshProxy()
        : await this.refreshClientSide();

    console.log('--refresh', result);
    return result;
  }

  authenticateded() {
    // authenticated logic
  }

  passwordReset() {
    // password reset logic
  }

  private setCookiesLogin(user: any) {
    this.cookieService.set({
      name: AUTH_COOKIES.USER,
      payload: user.username,
    });
    this.cookieService.set({
      name: AUTH_COOKIES.USER_AUTH,
      payload: user.token,
    });
    this.cookieService.set({
      name: AUTH_COOKIES.USER_TYPE,
      payload: user.customerType,
    });
  }

  private clearCookies() {
    this.cookieService.remove(AUTH_COOKIES.USER);
    this.cookieService.remove(AUTH_COOKIES.USER_AUTH);
    this.cookieService.remove(AUTH_COOKIES.USER_TYPE);
  }
}
