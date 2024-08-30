import { AuthService } from './authService';
import { CookieService, AUTH_COOKIES } from '@geins/core';
import { authClaimsTokenSerializeToObject } from './helpers';
import { clear } from 'console';

export interface Credentials {
  username: string;
  password: string;
  newPassword?: string;
  rememberUser?: boolean | undefined;
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
    const user = result.body.data;
    //console.log('loginProxy() result:', user);
    return user;
  }

  private async loginClientSide(credentials: Credentials) {
    if (!this.authService) {
      throw new Error('AuthService not initialized');
    }
    const result = await this.authService.login(credentials);
    //console.log('loginClientSide() result:', result);
    return result;
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

    this.setCookiesLogin(user, credentials.rememberUser || false);
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

  private async getUserProxy() {
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

  private async getUserClientSide(): Promise<any> {
    let user: any = {};
    if (!this.authService) {
      return user;
    }
    try {
      user = await this.authService.getUser();
    } catch (error) {
      console.error('Failed to get user:', error);
    }

    // if user is missing token, get it from cookie
    if (!user?.token || user?.token === '') {
      const token = this.cookieService.get(AUTH_COOKIES.USER_AUTH);
      ////console.log('this.cookieService.get(AUTH_COOKIES.USER_AUTH)', token);
      user = await this.authService?.getUser(token);
    }

    ////console.log('getUserClientSide() user:', user);
    // use the auth cookie to get the user
    // check expires and refresh if needed

    return user;
  }

  async getUser(): Promise<any> {
    let user =
      this.connectionType === ConnectionType.Proxy
        ? await this.getUserProxy()
        : await this.getUserClientSide();

    // handle token expiration here
    if (user && user.token) {
      if (!user.expiered && user.expiresSoon) {
        const result = await this.refresh();
        user = await this.authService?.getUserObjectFromToken(result);
      } else if (user.expiered) {
        console.log('EXPIRED TOKEN');
        this.clearCookies();
      }
    }
    return user;
  }

  // COOOKIES
  private setCookiesLogin(user: any, rememberUser: boolean) {
    const maxAge = rememberUser ? 604800 : 1800; // 7 days or 30 minutes - This is matching the lifetime of the refresh cookie from the auth service
    //  const exp = 5;
    // console.log('expires:', expires);
    this.cookieService.set({
      name: AUTH_COOKIES.USER,
      payload: user.username,
      maxAge: maxAge,
    });
    this.cookieService.set({
      name: AUTH_COOKIES.USER_AUTH,
      payload: user.token,
      maxAge: maxAge,
    });
    this.cookieService.set({
      name: AUTH_COOKIES.USER_TYPE,
      payload: user.customerType,
      maxAge: maxAge,
    });
    this.cookieService.set({
      name: AUTH_COOKIES.USER_MAX_AGE,
      payload: maxAge.toString(),
      maxAge: maxAge,
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
    this.cookieService.remove(AUTH_COOKIES.USER_MAX_AGE);
  }

  // CLAIM
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
