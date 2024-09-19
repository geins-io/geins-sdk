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

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const result = await this.request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (result.succeeded) {
      this.setCookiesLogin(result, credentials.rememberUser || false);
    }

    return result;
  }

  async logout(): Promise<boolean> {
    const result = await this.request<any>('/logout', { method: 'GET' });
    this.clearCookies();
    return result.status === 200 ? true : false;
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

  protected async changePasswordImplementation(
    credentials: AuthCredentials,
  ): Promise<AuthResponse> {
    const result = await this.request<AuthResponse>('/password', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    return result || { succeeded: false };
  }
}
