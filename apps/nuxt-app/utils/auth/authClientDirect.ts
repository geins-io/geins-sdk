import { logWrite } from '@geins/core';
import type { AuthResponse, AuthCredentials } from '@geins/types';
import { AuthClient } from './authClient';
import { AuthService } from './authService';
import { log } from 'console';

export class AuthClientDirect extends AuthClient {
  private authService: AuthService;

  constructor(signEndpoint: string, authEndpoint: string) {
    super();
    this.authService = new AuthService(signEndpoint, authEndpoint);
  }

  async login(credentials: AuthCredentials): Promise<AuthResponse | undefined> {
    const result = await this.authService.login(credentials);

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
    const result = await this.authService.changePassword(
      credentials,
      refreshToken,
    );

    if (result.succeeded) {
      this.setCookiesLogin(result, credentials.rememberUser || false);
    }
    return result;
  }

  async refresh(): Promise<AuthResponse | undefined> {
    const refreshToken = this.getCookieRefreshToken();
    if (!refreshToken) {
      return undefined;
    }

    const result = await this.authService.refresh(refreshToken);
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
    if (!refreshToken) {
      return undefined;
    }
    const userToken = this.getCookieUserToken();
    const result = await this.authService.getUser(refreshToken, userToken);
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

  async logout(): Promise<boolean> {
    const refreshToken = this.getCookieRefreshToken();
    if (!refreshToken) {
      return true;
    }
    const result = await this.authService.logout(refreshToken);
    this.clearCookies();
    return result.succeeded;
  }

  async register(credentials: AuthCredentials): Promise<AuthResponse> {
    throw new Error('Method not implemented.');
  }
}
