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

  async login2(credentials: AuthCredentials): Promise<AuthResponse> {
    const result = await this.authService.login2(credentials);

    // set cookies
    if (result.succeeded) {
      this.setCookiesLogin(result, credentials.rememberUser || false);
    }

    return result;
  }

  async newPassword(
    credentials: AuthCredentials,
  ): Promise<AuthResponse | undefined> {
    const refreshToken = this.getCookieRefreshToken();
    if (!refreshToken) {
      return undefined;
    }
    logWrite('newPassword credentials', credentials);
    logWrite('newPassword refreshToken', refreshToken);

    const result = await this.authService.newPassword(
      credentials,
      refreshToken,
    );
    logWrite('newPassword result', result);

    // set cookies
    /*    if (result.succeeded) {
      this.setCookiesLogin(result, credentials.rememberUser || false);
    }
 */
    return result;
  }

  async refresh2(): Promise<AuthResponse | undefined> {
    const refreshToken = this.getCookieRefreshToken();
    if (!refreshToken) {
      return undefined;
    }

    const result = await this.authService.refresh2(refreshToken);
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

  async getUser2(): Promise<AuthResponse | undefined> {
    const refreshToken = this.getCookieRefreshToken();
    if (!refreshToken) {
      return undefined;
    }
    const userToken = this.getCookieUserToken();
    const result = await this.authService.getUser2(refreshToken, userToken);
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

  async logout2(): Promise<boolean> {
    const refreshToken = this.getCookieRefreshToken();
    if (!refreshToken) {
      return true;
    }
    const result = await this.authService.logout2(refreshToken);
    //this.clearCookies();
    return result.succeeded;
  }

  /*
----------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------
*/

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const result = await this.authService.login(credentials);

    if (result.succeeded) {
      this.setCookiesLogin(result, credentials.rememberUser || false);
    }

    return result;
  }

  async logout(): Promise<boolean> {
    const refreshToken = this.getCookieRefreshToken();
    if (!refreshToken) {
      return true;
    }
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
