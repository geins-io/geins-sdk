import { CookieService, AUTH_COOKIES, AUTH_COOKIES_MAX_AGE } from '@geins/core';
import type { AuthResponse, AuthCredentials, AuthTokens } from '@geins/types';
import { authClaimsTokenSerializeToObject } from './authHelpers';
import { AuthService } from './authService';

export abstract class AuthClient {
  protected _cookieService: CookieService;
  protected _refreshToken: string | undefined;

  constructor() {
    this._cookieService = new CookieService();
  }

  abstract login(credentials: AuthCredentials): Promise<AuthResponse | undefined>;
  abstract refresh(refreshToken?: string): Promise<AuthResponse | undefined>;
  abstract changePassword(credentials: AuthCredentials): Promise<AuthResponse | undefined>;
  abstract getUser(refreshToken?: string, userToken?: string): Promise<AuthResponse | undefined>;
  abstract register(credentials: AuthCredentials): Promise<AuthResponse | undefined>;
  public async logout(): Promise<AuthResponse | undefined> {
    this.clearAuth();
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

  protected refreshLoginCookies(authResponse: AuthTokens): void {
    this.setCookiesTokens(authResponse);
  }

  // set cookie values
  protected setCookiesLogin(authResponse: AuthResponse, rememberUser: boolean): void {
    const maxAge = rememberUser ? AUTH_COOKIES_MAX_AGE.REMEMBER_USER : AUTH_COOKIES_MAX_AGE.DEFAULT;
    const { user, tokens } = authResponse;

    this._cookieService.set({
      name: AUTH_COOKIES.USER_MAX_AGE,
      payload: maxAge.toString(),
      maxAge,
    });

    if (user?.username) {
      this._cookieService.set({
        name: AUTH_COOKIES.USER,
        payload: user.username,
        maxAge,
      });
    }

    if (user?.customerType) {
      this._cookieService.set({
        name: AUTH_COOKIES.USER_TYPE,
        payload: user.customerType,
        maxAge,
      });
    }

    this.setCookiesTokens(tokens, maxAge);
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
      this.setCookieUserToken(tokens.token, setMaxAge);
    }
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
