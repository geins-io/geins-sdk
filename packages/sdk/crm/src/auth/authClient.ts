import { CookieService, AUTH_COOKIES, logWrite } from '@geins/core';
import type { AuthResponse, AuthCredentials } from '@geins/types';
import { authClaimsTokenSerializeToObject } from './authHelpers';
import { AuthService } from './authService';

export abstract class AuthClient {
  protected cookieService: CookieService;

  constructor() {
    this.cookieService = new CookieService();
  }

  abstract login(
    credentials: AuthCredentials,
  ): Promise<AuthResponse | undefined>;

  abstract refresh(): Promise<AuthResponse | undefined>;
  abstract changePassword(
    credentials: AuthCredentials,
  ): Promise<AuthResponse | undefined>;

  abstract getUser(): Promise<AuthResponse | undefined>;

  abstract register(
    credentials: AuthCredentials,
  ): Promise<AuthResponse | undefined>;

  public async logout(): Promise<AuthResponse | undefined> {
    this.clearCookies();
    return { succeeded: true };
  }

  protected async getUserFromCookie(
    token?: string,
    refreshToken?: string,
  ): Promise<AuthResponse | undefined> {
    token = token || this.getCookieUserToken();
    refreshToken = refreshToken || this.getCookieRefreshToken();
    if (!token || !refreshToken) {
      return undefined;
    }

    return AuthService.getUserObjectFromToken(token, refreshToken);
  }

  // get cookie values
  protected getCookieUser(): string {
    return this.cookieService.get(AUTH_COOKIES.USER);
  }

  protected getCookieRefreshToken(): string {
    return this.cookieService.get(AUTH_COOKIES.REFRESH_TOKEN);
  }

  protected getCookieUserToken(): string {
    return this.cookieService.get(AUTH_COOKIES.USER_AUTH);
  }

  protected getCookieMaxAge(): number {
    const maxAge = this.cookieService.get(AUTH_COOKIES.USER_MAX_AGE);
    if (!maxAge) {
      return 1800;
    }
    return parseInt(maxAge, 10);
  }

  // set cookie values
  protected setCookiesLogin(
    authResponse: AuthResponse,
    rememberUser: boolean,
  ): void {
    const maxAge = rememberUser ? 604800 : 1800; // 7 days or 30 minutes
    const { user, tokens } = authResponse;

    this.cookieService.set({
      name: AUTH_COOKIES.USER_MAX_AGE,
      payload: maxAge.toString(),
      maxAge,
    });

    if (tokens?.refreshToken) {
      this.setCookieRefreshToken(tokens?.refreshToken, maxAge);
    }

    if (tokens?.token) {
      this.setCookieUserToken(tokens.token, maxAge);
    }

    if (user?.username) {
      this.cookieService.set({
        name: AUTH_COOKIES.USER,
        payload: user.username,
        maxAge,
      });
    }

    if (user?.customerType) {
      this.cookieService.set({
        name: AUTH_COOKIES.USER_TYPE,
        payload: user.customerType,
        maxAge,
      });
    }
  }

  protected setCookieRefreshToken(token: string, maxAge?: number): void {
    if (!maxAge) {
      maxAge = this.getCookieMaxAge();
    }
    this.cookieService.set({
      name: AUTH_COOKIES.REFRESH_TOKEN,
      payload: token,
      maxAge,
      // httpOnly: true,
    });
  }

  protected setCookieUserToken(token: string, maxAge?: number): void {
    if (!maxAge) {
      maxAge = this.getCookieMaxAge();
    }
    this.cookieService.set({
      name: AUTH_COOKIES.USER_AUTH,
      payload: token,
      maxAge,
    });
  }

  public clearCookies(): void {
    Object.values(AUTH_COOKIES).forEach((cookieName) => {
      this.cookieService.remove(cookieName);
    });
  }

  // spoof user for preview
  public spoofPreviewUser(token: string): void {
    this.clearCookies();
    const maxAge = 1800;
    const spoofedUser = authClaimsTokenSerializeToObject(token);

    const username = spoofedUser?.spoofedBy || 'preview@geins.io';
    const spoofDate = spoofedUser?.spoofDate;

    this.cookieService.set({
      name: AUTH_COOKIES.USER,
      payload: username,
      maxAge,
    });

    this.cookieService.set({
      name: AUTH_COOKIES.USER_AUTH,
      payload: token,
      maxAge,
    });

    this.cookieService.set({
      name: AUTH_COOKIES.USER_MAX_AGE,
      payload: maxAge.toString(),
      maxAge,
    });
  }

  public spoofPreveiwUser(token: string): void {
    this.clearCookies();
    const maxAge = 1800;
    const spoofedUser = authClaimsTokenSerializeToObject(token);

    const username = spoofedUser?.spoofedBy || 'preview@geins.io';
    const spoofDate = spoofedUser?.spoofDate;

    this.cookieService.set({
      name: AUTH_COOKIES.USER,
      payload: username,
      maxAge,
    });

    this.cookieService.set({
      name: AUTH_COOKIES.USER_AUTH,
      payload: token,
      maxAge,
    });

    this.cookieService.set({
      name: AUTH_COOKIES.USER_MAX_AGE,
      payload: maxAge.toString(),
      maxAge,
    });
  }
}
