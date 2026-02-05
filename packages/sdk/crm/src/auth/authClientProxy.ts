import { AUTH_HEADERS } from '@geins/core';
import type { AuthCredentials, AuthResponse } from '@geins/types';
import { AuthClient } from './authClient';

export class AuthClientProxy extends AuthClient {
  private static readonly FETCH_TIMEOUT_MS = 10_000;
  private _authEndpointApp: string;

  constructor(authEndpointApp: string) {
    super();
    this._authEndpointApp = authEndpointApp;
  }

  destroy(): void {
    this._authEndpointApp = '';
  }

  private async request<T>(path: string, options: RequestInit): Promise<T> {
    const refreshToken = this._refreshToken || this.getCookieRefreshToken();

    if (!options.headers) {
      options.headers = { 'Content-Type': 'application/json' };
    }
    if (refreshToken) {
      options.headers = {
        ...options.headers,
        [`${AUTH_HEADERS.REFRESH_TOKEN}`]: refreshToken,
      };
    }

    if (options.method === 'GET' || options.method === 'HEAD') {
      delete options.body;
    }

    const response = await fetch(`${this._authEndpointApp}${path}`, {
      ...options,
      signal: AbortSignal.timeout(AuthClientProxy.FETCH_TIMEOUT_MS),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error(result.message || 'API request failed');
      throw new Error('API request failed');
    }

    return result.body?.data as T;
  }

  protected async handleLogin(credentials: AuthCredentials): Promise<AuthResponse | undefined> {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  protected async handleRefresh(refreshToken: string): Promise<AuthResponse | undefined> {
    this._refreshToken = refreshToken;
    return this.request('/refresh', {
      method: 'POST',
    });
  }

  protected async handleGetUser(refreshToken: string, userToken?: string): Promise<AuthResponse | undefined> {
    this._refreshToken = refreshToken;
    return this.request('/user', {
      method: 'GET',
    });
  }

  protected async handleChangePassword(
    credentials: AuthCredentials,
    refreshToken: string,
  ): Promise<AuthResponse | undefined> {
    this._refreshToken = refreshToken;
    return this.request('/change-password', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  protected async handleRegister(credentials: AuthCredentials): Promise<AuthResponse | undefined> {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }
}
