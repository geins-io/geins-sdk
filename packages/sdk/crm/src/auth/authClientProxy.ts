import { AUTH_HEADERS, AuthError } from '@geins/core';
import type { AuthCredentials, AuthResponse } from '@geins/types';
import { AuthClient } from './authClient';

/**
 * Auth client that communicates through a server-side proxy (e.g. `/api/auth`).
 * Used in browser-side (Proxy) connection mode where the real auth endpoints
 * must not be exposed to the client.
 */
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

  private async request<T>(
    path: string,
    options: RequestInit,
    refreshToken?: string,
  ): Promise<T> {
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
      throw new AuthError('API request failed');
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
    return this.request('/refresh', { method: 'POST' }, refreshToken);
  }

  protected async handleGetUser(refreshToken: string, _userToken?: string): Promise<AuthResponse | undefined> {
    return this.request('/user', { method: 'GET' }, refreshToken);
  }

  protected async handleChangePassword(
    credentials: AuthCredentials,
    refreshToken: string,
  ): Promise<AuthResponse | undefined> {
    return this.request(
      '/change-password',
      { method: 'POST', body: JSON.stringify(credentials) },
      refreshToken,
    );
  }

  protected async handleRegister(credentials: AuthCredentials): Promise<AuthResponse | undefined> {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }
}
