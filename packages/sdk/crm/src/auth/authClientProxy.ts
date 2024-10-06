import { AUTH_HEADERS } from '@geins/core';
import type { AuthResponse, AuthCredentials } from '@geins/types';
import { AuthClient } from './authClient';
import { AuthService } from './authService';

export class AuthClientProxy extends AuthClient {
  private _authEndpointApp: string;

  constructor(authEndpointApp: string) {
    super();
    this._authEndpointApp = authEndpointApp;
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

    const response = await fetch(`${this._authEndpointApp}${path}`, {
      ...options,
    });

    const result = await response.json();
    if (!response.ok) {
      console.error(result.message || 'API request failed');
      throw new Error('API request failed');
    }

    return result.body?.data as T;
  }

  // login and set cookies
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

  async changePassword(credentials: AuthCredentials): Promise<AuthResponse | undefined> {
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

    // set new tokens
    if (result.succeeded) {
      this.setCookiesLogin(result, credentials.rememberUser || false);
    }
    return result;
  }

  async refresh(refreshToken?: string): Promise<AuthResponse | undefined> {
    this._refreshToken = refreshToken || this.getCookieRefreshToken();

    if (!this._refreshToken) {
      this.clearAuthCookies();
      return undefined;
    }

    const result = await this.request<AuthResponse>('/refresh', {
      method: 'GET',
    });

    if (!result || !result.succeeded) {
      this.clearAuthCookies();
      return undefined;
    }

    if (result.tokens) {
      this.refreshLoginCookies(result.tokens);
    }

    return result;
  }

  async getUser(refreshToken?: string, userToken?: string): Promise<AuthResponse | undefined> {
    const tokens = this.getCurrentTokens(refreshToken, userToken);

    // Handle refresh token
    this._refreshToken = tokens.refreshToken;
    if (!tokens.refreshToken) {
      this.clearAuthCookies();
      return undefined;
    }

    let userFromToken = undefined;

    if (tokens.userToken && tokens.refreshToken) {
      userFromToken = await AuthService.getUserObjectFromToken(tokens.userToken, tokens.refreshToken);

      if (!userFromToken) {
        this.clearAuthCookies();
        return undefined;
      }
    }

    if ((this._refreshToken && !userToken) || userFromToken?.tokens?.expiresSoon) {
      const result = await this.request<AuthResponse>('/user', {
        method: 'GET',
      });

      if (!result || !result.succeeded) {
        this.clearAuthCookies();
        return undefined;
      }
      // update tokens
      if (result.tokens) {
        this.refreshLoginCookies(result.tokens);
      }

      return result;
    }

    return userFromToken;
  }
  async getUser2(refreshToken?: string, userToken?: string): Promise<AuthResponse | undefined> {
    // current tokens
    const tokens = this.getCurrentTokens(refreshToken, userToken);

    // check so that refresh-token is present
    this._refreshToken = tokens.refreshToken;
    if (!tokens.refreshToken) {
      this.clearAuthCookies();
      this._refreshToken = undefined;
      return undefined;
    }

    // both tokens are arguements try to get from token
    if (tokens.refreshToken && tokens.userToken) {
      let authResponse = await AuthService.getUserObjectFromToken(tokens.userToken, tokens.refreshToken);
      console.log('getUser authResponse', authResponse);
      // no authResponse returned, clear cookies and return undefined
      if (!authResponse) {
        this.clearAuthCookies();
        this._refreshToken = undefined;
        return undefined;
      }

      // authRespone was returned, check if tokens are about to expire, if so refresh
      if (authResponse?.tokens?.expiresSoon) {
        // get new authResponse
        authResponse = await this.request<AuthResponse>('/user', {
          method: 'GET',
        });
        if (!authResponse || !authResponse.succeeded) {
          this.clearAuthCookies();
          this._refreshToken = undefined;
          return undefined;
        }
        // update tokens
        if (authResponse.tokens) {
          this._refreshToken = tokens.refreshToken;
          this.refreshLoginCookies(authResponse.tokens);
        }
        // return authResponse
        return authResponse;
      } else {
        return authResponse;
      }
    }

    // only refresh-token is present, and userToken was not passed as argument, force refresh
    if (tokens.refreshToken && !userToken) {
      const authResponse = await this.request<AuthResponse>('/user', {
        method: 'GET',
      });

      if (!authResponse || !authResponse.succeeded) {
        this.clearAuthCookies();
        this._refreshToken = undefined;
        return undefined;
      }
      // update tokens
      if (authResponse.tokens) {
        this._refreshToken = tokens.refreshToken;
        this.refreshLoginCookies(authResponse.tokens);
      }
      return authResponse;
    }
    return undefined;
  }

  async register(credentials: AuthCredentials): Promise<AuthResponse | undefined> {
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
