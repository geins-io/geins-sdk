import { AuthService } from './authService';
import { CookieService, AUTH_COOKIES } from '@geins/core';
import { authClaimsTokenSerializeToObject } from './helpers';


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
    const b = JSON.stringify(credentials);


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
    const authReponse =
      this.connectionType === ConnectionType.Proxy
        ? await this.loginProxy(credentials)
        : await this.loginClientSide(credentials);


    if (!authReponse) {
      throw new Error('Invalid credentials');
    }

    this.setCookiesLogin(authReponse.data, credentials.rememberUser || false);
    return authReponse.data;
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
    return result.data.token;
  }

  async refresh() {
    const result =
      this.connectionType === ConnectionType.Proxy
        ? await this.refreshProxy()
        : await this.refreshClientSide();

    this.setCookiesRefresh(result);
    return result;
  }

  private async changePasswordProxy(credentials: Credentials) {
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

  private async changePasswordClientSide(credentials: Credentials) {
    if (!this.authService) {
      throw new Error('AuthService not initialized');
    }
    return await this.authService.changePassword(credentials);
  }

  async changePassword(credentials: Credentials) {
    if (!credentials.newPassword) {
      throw new Error('New password is required');
    }

    const result =
      this.connectionType === ConnectionType.Proxy
        ? await this.changePasswordProxy(credentials)
        : await this.changePasswordClientSide(credentials);

    if (!result) {
      throw new Error('Change password failed');
    }
    return

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

    if (!user?.token || user?.token === '') {
      const token = this.cookieService.get(AUTH_COOKIES.USER_AUTH);
      user = await this.authService?.getUser(token);
    }

    return user;
  }

  async getUser(): Promise<any> {
    let user =
      this.connectionType === ConnectionType.Proxy
        ? await this.getUserProxy()
        : await this.getUserClientSide();

    // handle token expiration here
    if (user && user.token) {
      if (!user.expired && user.expiresSoon) {
        const result = await this.refresh();
        user = await this.authService?.getUserObjectFromToken(result);
      } else if (user.expired) {
        this.clearCookies();
      }
    }
    return user;
  }


  private setCookiesLogin(user: AuthUser, rememberUser: boolean) {
    const maxAge = rememberUser ? 604800 : 1800; // 7 days or 30 minutes - This is matching the lifetime of the refresh cookie from the auth service
    if(user.username) {
      this.cookieService.set({
        name: AUTH_COOKIES.USER,
        payload: user.username,
        maxAge: maxAge,
      });
    }
    if(user.token) {
      this.cookieService.set({
        name: AUTH_COOKIES.USER_AUTH,
        payload: user.token,
        maxAge: maxAge,
      });
    }
    if(user.customerType) {
      this.cookieService.set({
        name: AUTH_COOKIES.USER_TYPE,
        payload: user.customerType,
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
