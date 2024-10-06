import type { AuthResponse, AuthCredentials } from '@geins/types';
import { AuthClient } from './authClient';
import { AuthService } from './authService';

export class AuthClientDirect extends AuthClient {
  private _authService: AuthService;

  constructor(signEndpoint: string, authEndpoint: string) {
    super();
    this._authService = new AuthService(signEndpoint, authEndpoint);
  }

  // login and set cookies
  async login(credentials: AuthCredentials): Promise<AuthResponse | undefined> {
    const result = await this._authService.login(credentials);

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
    const result = await this._authService.changePassword(credentials, refreshToken);

    // set new tokens
    if (result.succeeded) {
      this.setCookiesLogin(result, credentials.rememberUser || false);
    }
    return result;
  }

  async refresh(refreshToken?: string): Promise<AuthResponse | undefined> {
    this._refreshToken = refreshToken || this.getCookieRefreshToken();

    if (!refreshToken) {
      this.clearAuthCookies();
      return undefined;
    }

    if (!refreshToken) {
      return undefined;
    }

    const result = await this._authService.refresh(this._refreshToken);

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
    this._refreshToken = tokens.refreshToken;

    if (!tokens.refreshToken) {
      this.clearAuthAndRefreshToken();
      return undefined;
    }

    if (tokens.userToken && tokens.refreshToken) {
      return this.handleUserTokenScenario({
        userToken: tokens.userToken,
        refreshToken: tokens.refreshToken,
      });
    }

    return this.handleRefreshTokenOnlyScenario(tokens.refreshToken);
  }

  private clearAuthAndRefreshToken(): void {
    this.clearAuthCookies();
    this._refreshToken = undefined;
  }

  private async handleUserTokenScenario(tokens: {
    refreshToken: string;
    userToken: string;
  }): Promise<AuthResponse | undefined> {
    let authResponse = await AuthService.getUserObjectFromToken(tokens.userToken, tokens.refreshToken);

    if (!authResponse) {
      this.clearAuthAndRefreshToken();
      return undefined;
    }

    if (authResponse.tokens?.expiresSoon) {
      return this.refreshUserTokens(tokens);
    }

    return authResponse;
  }

  private async refreshUserTokens(tokens: {
    refreshToken: string;
    userToken: string;
  }): Promise<AuthResponse | undefined> {
    const authResponse = await this._authService.getUser(tokens.refreshToken, tokens.userToken);

    if (!authResponse || !authResponse.succeeded) {
      this.clearAuthAndRefreshToken();
      return undefined;
    }

    if (authResponse.tokens) {
      this._refreshToken = tokens.refreshToken;
      this.refreshLoginCookies(authResponse.tokens);
    }

    return authResponse;
  }

  private async handleRefreshTokenOnlyScenario(refreshToken: string): Promise<AuthResponse | undefined> {
    const authResponse = await this._authService.getUser(refreshToken);

    if (!authResponse || !authResponse.succeeded) {
      this.clearAuthAndRefreshToken();
      return undefined;
    }

    if (authResponse.tokens) {
      this._refreshToken = refreshToken;
      this.refreshLoginCookies(authResponse.tokens);
    }

    return authResponse;
  }

  async register(credentials: AuthCredentials): Promise<AuthResponse | undefined> {
    const result = await this._authService.register(credentials);

    if (!result) {
      return undefined;
    }

    if (result.succeeded) {
      this.setCookiesLogin(result, credentials.rememberUser || false);
    }

    return result;
  }
}
