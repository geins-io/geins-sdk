import { logWrite, AUTH_HEADERS, GeinsCore } from '@geins/core';
import type { AuthResponse, AuthCredentials } from '@geins/types';
import { AuthClient } from './authClient';
import { AuthService } from './authService';

export class AuthClientProxy extends AuthClient {
  private readonly authEndpointApp: string;
  public readonly core: GeinsCore;
  /**
   * Global refresh token for sending as header to proxy and renewing the authentication session.
   * Used to obtain a new access token without requiring user re-authentication.
   */
  private refreshToken: string | undefined;

  constructor(core: GeinsCore, authEndpointApp: string) {
    super();
    this.authEndpointApp = authEndpointApp;
    this.core = core;
  }

  private async request<T>(path: string, options: RequestInit): Promise<T> {
    const refreshToken = this.refreshToken || this.getCookieRefreshToken();

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

  async refresh(): Promise<AuthResponse | undefined> {
    this.refreshToken = this.getCookieRefreshToken();
    const result = await this.request<AuthResponse>('/refresh', {
      method: 'GET',
    });

    if (!result || !result.succeeded) {
      this.clearCookies();
      return undefined;
    }

    this.refreshCookies(result);

    return result;
  }

  async getUser(
    refreshToken?: string,
    userToken?: string,
  ): Promise<AuthResponse | undefined> {
    const tokens = this.getCurrentTokens(refreshToken, userToken);

    // Handle refresh token
    this.refreshToken = tokens.refreshToken;
    if (!tokens.refreshToken) {
      this.clearCookies();
      return undefined;
    }

    let user = undefined;
    if (tokens.userToken && tokens.refreshToken) {
      user = await AuthService.getUserObjectFromToken(
        tokens.userToken,
        tokens.refreshToken,
      );
      if (!user) {
        this.clearCookies();
        return undefined;
      }
    }

    if (tokens.userToken) {
      this.core.userToken = tokens.userToken;
    }

    if ((this.refreshToken && !userToken) || user?.tokens?.expiresSoon) {
      const result = await this.request<AuthResponse>('/user', {
        method: 'GET',
      });

      if (!result || !result.succeeded) {
        this.clearCookies();
        return undefined;
      }

      this.refreshCookies(result);

      return result;
    }
    return user;
  }

  async register(
    credentials: AuthCredentials,
  ): Promise<AuthResponse | undefined> {
    const result = await this.request<AuthResponse>('/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (!result) {
      return undefined;
    }

    if (result.succeeded) {
      this.setCookiesLogin(result, credentials.rememberUser || false);
    }

    return result;
  }
}
