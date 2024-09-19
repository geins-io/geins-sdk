import { logWrite, AUTH_HEADERS } from '@geins/core';
import type { AuthResponse, AuthCredentials } from '@geins/types';
import { AuthClient } from './authClient';
import { AuthService } from './authService';

export class AuthClientProxy extends AuthClient {
  private readonly authEndpointApp: string;

  constructor(authEndpointApp: string) {
    super();
    this.authEndpointApp = authEndpointApp;
  }

  private async request<T>(path: string, options: RequestInit): Promise<T> {
    const refreshToken = this.getCookieRefreshToken();

    if (!options.headers) {
      options.headers = { 'Content-Type': 'application/json' };
    }
    if (refreshToken) {
      options.headers = {
        ...options.headers,
        [`${AUTH_HEADERS.REFRESH_TOKEN}`]: refreshToken,
      };
    }

    const response = await fetch(`${this.authEndpointApp}${path}`, {
      ...options,
    });

    const result = await response.json();
    if (!response.ok) {
      console.error(result.message || 'API request failed');
      throw new Error('API request failed');
    }

    if (result.body?.data?.tokens?.refreshToken) {
      this.setCookieRefreshToken(result.body?.data?.tokens?.refreshToken);
    }

    return result.body?.data as T;
  }

  async login(credentials: AuthCredentials): Promise<AuthResponse | undefined> {
    const result = await this.request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (!result) {
      return undefined;
    }

    if (result.succeeded) {
      this.setCookiesLogin(result, credentials.rememberUser || false);
    }
    logWrite('login', result);

    return result;
  }

  async changePassword(
    credentials: AuthCredentials,
  ): Promise<AuthResponse | undefined> {
    const refreshToken = this.getCookieRefreshToken();
    if (!refreshToken) {
      return undefined;
    }
    const result = await this.request<AuthResponse>('/password', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (!result) {
      return undefined;
    }

    // set cookies
    if (result.succeeded) {
      this.setCookiesLogin(result, credentials.rememberUser || false);
    }
    return result;
  }

  async logout(): Promise<boolean> {
    this.clearCookies();
    return true;
  }

  async refresh(): Promise<AuthResponse | undefined> {
    const result = await this.request<AuthResponse>('/refresh', {
      method: 'GET',
    });

    if (!result || !result.succeeded) {
      return undefined;
    }

    if (result && result.tokens?.refreshToken) {
      this.setCookieRefreshToken(result.tokens.refreshToken);
    }

    if (result && result.succeeded && result.tokens?.token) {
      this.setCookieUserToken(result.tokens.token);
    }

    return result;
  }

  async getUser(): Promise<AuthResponse | undefined> {
    const refreshToken = this.getCookieRefreshToken();
    logWrite('getUser', refreshToken);
    if (!refreshToken) {
      return undefined;
    }
    const userToken = this.getCookieUserToken();
    const user = await AuthService.getUserObjectFromToken(
      userToken,
      refreshToken,
    );
    if (!user) {
      return undefined;
    }
    if (user.tokens?.expiresSoon) {
      const result = await this.request<AuthResponse>('/user', {
        method: 'GET',
      });

      if (!result || !result.succeeded) {
        return undefined;
      }

      if (result && result.tokens?.refreshToken) {
        this.setCookieRefreshToken(result.tokens.refreshToken);
      }

      if (result && result.succeeded && result.tokens?.token) {
        this.setCookieUserToken(result.tokens.token);
      }
      return result;
    }
    return user;
  }

  async register(credentials: AuthCredentials): Promise<AuthResponse> {
    const result = await this.request<AuthResponse>('/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (result.succeeded) {
      this.setCookiesLogin(result, credentials.rememberUser || false);
    }

    return result;
  }
}
