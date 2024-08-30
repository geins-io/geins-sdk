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
    const result = await this.authService.refresh();
    return result.token;
  }

  async refresh() {
    const result =
      this.connectionType === ConnectionType.Proxy
        ? await this.refreshProxy()
        : await this.refreshClientSide();
    this.setCookiesRefresh(result);
    return result;
  }

  async passwordReset() {
    // password reset logic
  }

  async register() {
    // register logic
  }

  ///// COOOKIES

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

  private setCookiesRefresh(userToken: any) {
    this.cookieService.set({
      name: AUTH_COOKIES.USER_AUTH,
      payload: userToken,
    });
  }

  private clearCookies() {
    this.cookieService.remove(AUTH_COOKIES.USER);
    this.cookieService.remove(AUTH_COOKIES.USER_AUTH);
    this.cookieService.remove(AUTH_COOKIES.USER_TYPE);
  }

  // CLAIMs

  kvpClaims(serializedClaims: string) {
    const keyValuePairs = serializedClaims.split(';').map((pair) => {
      let [key, value] = pair.split('=');
      if (key.includes('/')) {
        key = key.split('/').pop() || '';
      }
      key = key.charAt(0).toLowerCase() + key.slice(1);
      return { key, value };
    });

    const obj: { [key: string]: string } = keyValuePairs.reduce(
      (accumulator, current) => {
        accumulator[current.key] = current.value;
        return accumulator;
      },
      {} as { [key: string]: string },
    );

    return obj;
  }

  claims(token: string) {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) {
        throw new Error('Invalid token format: missing payload');
      }
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedString = atob(base64);
      return JSON.parse(decodedString);
    } catch (error) {
      console.error('Failed to decode token claims:', error);
      return null;
    }
  }

  serializedClaims(token: string) {
    const claims = this.claims(token);
    if (!claims) return '';
    return Object.entries(claims)
      .map(([key, value]) =>
        Array.isArray(value)
          ? value.map((v) => `${key}=${v}`).join(';')
          : `${key}=${value}`,
      )
      .join(';');
  }
}
