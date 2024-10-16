import { CookieService, AUTH_COOKIES, AUTH_COOKIES_MAX_AGE } from '@geins/core';
import type { AuthResponse, AuthCredentials, AuthTokens, AuthUser } from '@geins/types';
import { authClaimsTokenSerializeToObject } from './authHelpers';
import { AuthService } from './authService';

export abstract class AuthClient {
  protected _cookieService: CookieService;
  protected _refreshToken: string | undefined;

  constructor() {
    this._cookieService = new CookieService();
  }

  // abstract methods
  protected abstract handleLogin(credentials: AuthCredentials): Promise<AuthResponse | undefined>;
  protected abstract handleRefresh(refreshToken?: string): Promise<AuthResponse | undefined>;
  protected abstract handleGetUser(
    refreshToken?: string,
    userToken?: string,
  ): Promise<AuthResponse | undefined>;
  protected abstract handleChangePassword(
    credentials: AuthCredentials,
    refreshToken: string,
  ): Promise<AuthResponse | undefined>;
  protected abstract handleRegister(credentials: AuthCredentials): Promise<AuthResponse | undefined>;

  // base methods
  async login(credentials: AuthCredentials): Promise<AuthResponse | undefined> {
    const authResponse = await this.handleLogin(credentials);

    if (authResponse?.succeeded) {
      this.setCookiesLogin(authResponse, credentials.rememberUser || false);
    }

    return authResponse;
  }

  async refresh(refreshToken?: string): Promise<AuthResponse | undefined> {
    this._refreshToken = refreshToken || this.getCookieRefreshToken();

    if (!this._refreshToken) {
      return undefined;
    }

    const authResponse = await this.handleRefresh(this._refreshToken);

    if (authResponse?.succeeded && authResponse.tokens) {
      this.refreshLoginCookies(authResponse);
    }

    return authResponse;
  }

  async getUser(refreshToken?: string, userToken?: string): Promise<AuthResponse | undefined> {
    const tokens = this.getCurrentTokens(refreshToken, userToken);
    this._refreshToken = tokens.refreshToken;

    if (!tokens.refreshToken) {
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

  async changePassword(
    credentials: AuthCredentials,
    refreshToken?: string,
  ): Promise<AuthResponse | undefined> {
    this._refreshToken = refreshToken || this.getCookieRefreshToken();

    if (!this._refreshToken) {
      return undefined;
    }

    const authResponse = await this.handleChangePassword(credentials, this._refreshToken);

    if (authResponse?.succeeded) {
      this.setCookiesLogin(authResponse, credentials.rememberUser || false);
    }
    return authResponse;
  }

  async register(credentials: AuthCredentials): Promise<AuthResponse | undefined> {
    const authResponse = await this.handleRegister(credentials);

    if (authResponse?.succeeded) {
      this.setCookiesLogin(authResponse, credentials.rememberUser || false);
    }

    return authResponse;
  }

  private async handleUserTokenScenario(tokens: {
    refreshToken: string;
    userToken: string;
  }): Promise<AuthResponse | undefined> {
    let authResponse = AuthService.getUserObjectFromToken(tokens.userToken, tokens.refreshToken);

    if (authResponse?.succeeded && authResponse.tokens?.expiresSoon) {
      return this.refreshUserTokens(tokens);
    }

    return authResponse;
  }

  private async refreshUserTokens(tokens: {
    refreshToken: string;
    userToken: string;
  }): Promise<AuthResponse | undefined> {
    const authResponse = await this.handleGetUser(tokens.refreshToken, tokens.userToken);

    if (authResponse?.succeeded && authResponse.tokens) {
      this._refreshToken = tokens.refreshToken;
      this.refreshLoginCookies(authResponse);
    }

    return authResponse;
  }

  private async handleRefreshTokenOnlyScenario(refreshToken: string): Promise<AuthResponse | undefined> {
    const authResponse = await this.handleGetUser(refreshToken);

    if (authResponse?.succeeded && authResponse.tokens) {
      this._refreshToken = refreshToken;
      this.refreshLoginCookies(authResponse);
    }

    return authResponse;
  }

  // cookie methods
  public async logout(): Promise<AuthResponse | undefined> {
    return { succeeded: true };
  }

  public getUserFromCookie(token?: string, refreshToken?: string): AuthResponse | undefined {
    token = token || this.getCookieUserToken();
    refreshToken = refreshToken || this.getCookieRefreshToken();

    if (!token || !refreshToken) {
      return undefined;
    }

    return AuthService.getUserObjectFromToken(token, refreshToken);
  }

  public getCookieTokens(): AuthTokens {
    return {
      token: this.getCookieUserToken(),
      refreshToken: this.getCookieRefreshToken(),
    };
  }

  public setRefreshToken(token: string): void {
    this._refreshToken = token;
  }

  protected getCookieUser(): string {
    return this._cookieService.get(AUTH_COOKIES.USER);
  }

  protected getCookieRefreshToken(): string {
    return this._cookieService.get(AUTH_COOKIES.REFRESH_TOKEN);
  }

  protected getCookieUserToken(): string {
    return this._cookieService.get(AUTH_COOKIES.USER_AUTH);
  }

  protected getCookieMaxAge(): number {
    const maxAge = this._cookieService.get(AUTH_COOKIES.USER_MAX_AGE);
    if (!maxAge) {
      return AUTH_COOKIES_MAX_AGE.DEFAULT;
    }
    return parseInt(maxAge, 10);
  }

  protected getCurrentTokens(
    refreshToken?: string,
    userToken?: string,
  ): { refreshToken: string | undefined; userToken: string | undefined } {
    const cookieRefreshToken = this.getCookieRefreshToken();
    const cookieUserToken = this.getCookieUserToken();
    return {
      refreshToken: refreshToken || cookieRefreshToken,
      userToken: userToken || cookieUserToken,
    };
  }

  protected setCookieRefreshToken(token: string, maxAge?: number): void {
    const setMaxAge = maxAge || this.getCookieMaxAge() || AUTH_COOKIES_MAX_AGE.DEFAULT;
    this._cookieService.set({
      name: AUTH_COOKIES.REFRESH_TOKEN,
      payload: token,
      maxAge: setMaxAge,
    });
  }

  protected setCookieUserToken(token: string, maxAge: number): void {
    const setMaxAge = maxAge || this.getCookieMaxAge() || AUTH_COOKIES_MAX_AGE.DEFAULT;
    this._cookieService.set({
      name: AUTH_COOKIES.USER_AUTH,
      payload: token,
      maxAge: setMaxAge,
    });
  }

  protected setCookiesTokens(tokens?: AuthTokens, maxAge?: number): void {
    if (!tokens) {
      return;
    }
    const setMaxAge = maxAge || this.getCookieMaxAge() || AUTH_COOKIES_MAX_AGE.DEFAULT;
    if (tokens?.refreshToken) {
      this.setCookieRefreshToken(tokens.refreshToken, setMaxAge);
    }
    if (tokens?.token) {
      this.setCookieUserToken(tokens.token, tokens.expiresIn || 900);
    }
  }

  protected setCookiesUser(authUser?: AuthUser, maxAge?: number): void {
    if (!authUser) {
      return;
    }
    const setMaxAge = maxAge || this.getCookieMaxAge() || AUTH_COOKIES_MAX_AGE.DEFAULT;

    this._cookieService.set({
      name: AUTH_COOKIES.USER_MAX_AGE,
      payload: setMaxAge.toString(),
      maxAge: setMaxAge,
    });

    if (authUser?.username) {
      this._cookieService.set({
        name: AUTH_COOKIES.USER,
        payload: authUser.username,
        maxAge: setMaxAge,
      });
    }

    if (authUser?.customerType) {
      this._cookieService.set({
        name: AUTH_COOKIES.USER_TYPE,
        payload: authUser.customerType,
        maxAge: setMaxAge,
      });
    }
  }

  protected setCookiesLogin(authResponse: AuthResponse, rememberUser: boolean): void {
    const maxAge = rememberUser ? AUTH_COOKIES_MAX_AGE.REMEMBER_USER : AUTH_COOKIES_MAX_AGE.DEFAULT;
    const { tokens, user } = authResponse;

    this.setCookiesUser(user, maxAge);
    this.setCookiesTokens(tokens, maxAge);
  }

  protected refreshLoginCookies(authResponse: AuthResponse): void {
    const { tokens, user } = authResponse;
    this.setCookiesUser(user);
    this.setCookiesTokens(tokens);
  }

  public clearAuth(): void {
    this.clearAuthCookies();
    this._refreshToken = undefined;
  }

  public clearAuthCookies(): void {
    Object.values(AUTH_COOKIES).forEach(cookieName => {
      this._cookieService.remove(cookieName);
    });
  }

  public spoofPreviewUser(token: string): string {
    this.clearAuthCookies();

    const maxAge = AUTH_COOKIES_MAX_AGE.DEFAULT;
    const spoofedUser = authClaimsTokenSerializeToObject(token);

    const username = spoofedUser?.spoofedBy || 'preview@geins.io';
    const spoofDate = spoofedUser?.spoofDate;
    const customerType = spoofedUser?.customerType || 'preview';

    this._cookieService.set({
      name: AUTH_COOKIES.USER,
      payload: username,
      maxAge,
    });

    this._cookieService.set({
      name: AUTH_COOKIES.USER_AUTH,
      payload: token,
      maxAge,
    });

    this._cookieService.set({
      name: AUTH_COOKIES.USER_TYPE,
      payload: customerType,
      maxAge,
    });

    this._cookieService.set({
      name: AUTH_COOKIES.USER_MAX_AGE,
      payload: maxAge.toString(),
      maxAge,
    });

    return JSON.stringify(spoofedUser);
  }
}
