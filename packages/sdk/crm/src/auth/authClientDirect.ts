import { logWrite } from '@geins/core';
import type { AuthResponse, AuthCredentials } from '@geins/types';
import { AuthClient } from './authClient';
import { AuthService } from './authService';

export class AuthClientDirect extends AuthClient {
  private authService: AuthService;

  constructor(signEndpoint: string, authEndpoint: string) {
    super();
    this.authService = new AuthService(signEndpoint, authEndpoint);
  }

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const result = await this.authService.login(credentials);

    if (result.succeeded) {
      this.setCookiesLogin(result, credentials.rememberUser || false);
    }

    return result;
  }

  async logout(): Promise<boolean> {
    const result = await this.authService.logout();
    this.clearCookies();
    return result.succeeded;
  }

  async refresh(): Promise<AuthResponse | undefined> {
    const refreshToken = this.getCookieRefreshToken();
    if (!refreshToken) {
      return undefined;
    }

    this.authService.setRefreshToken(refreshToken);

    const result = await this.authService.refresh();

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
    const result = await this.authService.register(credentials);

    if (result.succeeded) {
      this.setCookiesLogin(result, credentials.rememberUser || false);
    }

    return result;
  }

  protected async changePasswordImplementation(
    credentials: AuthCredentials,
  ): Promise<AuthResponse> {
    return await this.authService.changePassword(credentials);
  }
}
