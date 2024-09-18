/*
  SERVER OR/AND CLIENT
*/

import type { AuthResponse, AuthCredentials, AuthTokens } from '@geins/types';
import { AuthServiceClient } from './authServiceClient';
import { authClaimsTokenSerializeToObject } from './authHelpers';
import { AUTH_COOKIES, CookieService, logWrite } from '@geins/core';

const EXPIRES_SOON_THRESHOLD = 90;

export class AuthService {
  private signEndpoint: string;
  private authEndpoint: string;
  private client: AuthServiceClient | undefined;
  private cookieService: CookieService;

  constructor(signEndpoint: string, authEndpoint: string) {
    this.signEndpoint = signEndpoint;
    this.authEndpoint = authEndpoint;
    this.cookieService = new CookieService();
    this.initClient();
  }

  public setRefreshToken(refreshToken: string): void {
    this.ensureClientInitialized();
    this.client!.setRefreshToken(refreshToken);
  }

  private initClient(): void {
    this.client = new AuthServiceClient(this.authEndpoint, this.signEndpoint);
  }

  public async login(credentials: AuthCredentials): Promise<AuthResponse> {
    this.ensureClientInitialized();

    try {
      await this.client!.connect(credentials, 'login');

      const authResponse = await this.getUser();

      let refreshToken = authResponse?.tokens?.refreshToken ?? '';
      if (refreshToken) {
        this.refreshCookieTokenSet(refreshToken);
      }

      return authResponse || { succeeded: false };
    } catch (error) {
      return this.handleError('Login failed', error);
    }
  }

  public async logout(): Promise<AuthResponse> {
    this.ensureClientInitialized();

    try {
      await this.client!.connect(undefined, 'logout');
      this.client = undefined;
      return { succeeded: true };
    } catch (error) {
      return this.handleError('Logout failed', error);
    }
  }

  public async refresh(token?: string): Promise<AuthResponse> {
    this.ensureClientInitialized();
    try {
      if (!this.client) {
        throw new Error('AuthServiceClient is not initialized');
      }
      if (token) {
        this.client.setRefreshToken(token);
      }
      await this.client.connect();
      const userToken = this.client.getToken();
      const tokens: AuthTokens = {
        token: userToken,
        refreshToken: this.client.getRefreshToken(),
        maxAge: this.client.getMaxAge(),
        expired: false,
      };

      return { succeeded: !!userToken, tokens };
    } catch (error) {
      return this.handleError('Token refresh failed', error);
    }
  }

  public async changePassword(
    credentials: AuthCredentials,
  ): Promise<AuthResponse> {
    this.ensureClientInitialized();

    try {
      await this.client!.connect(credentials, 'password');

      const tokens: AuthTokens = {
        token: this.client!.getToken(),
        refreshToken: this.client!.getRefreshToken(),
      };

      return { succeeded: true, tokens };
    } catch (error) {
      return this.handleError('Password change failed', error);
    }
  }

  public async register(credentials: AuthCredentials): Promise<AuthResponse> {
    this.ensureClientInitialized();

    try {
      await this.client!.connect(credentials, 'register');
      const authResponse = await this.getUser();
      return { succeeded: !!authResponse };
    } catch (error) {
      return this.handleError('Registration failed', error);
    }
  }

  static async getUserObjectFromToken(
    claimsToken: string,
    refreshToken?: string,
  ): Promise<AuthResponse | undefined> {
    try {
      const userFromToken = authClaimsTokenSerializeToObject(claimsToken);
      if (!userFromToken) return undefined;

      const now = Math.floor(Date.now() / 1000);
      const expiresIn = parseInt(userFromToken.exp || '0') - now;
      const expiresSoon = expiresIn < EXPIRES_SOON_THRESHOLD;

      return {
        succeeded: true,
        user: {
          authenticated: !userFromToken.expired,
          userId: userFromToken.sid || '',
          username: userFromToken.name || 'unknown',
          customerType: (userFromToken.customerType || 'unknown').toUpperCase(),
          memberDiscount: userFromToken.memberDiscount || '0',
          memberType: userFromToken.memberType || 'unknown',
          memberId: userFromToken.memberId || '0',
        },
        tokens: {
          token: claimsToken,
          expires: parseInt(userFromToken.exp || '0'),
          expired: now >= parseInt(userFromToken.exp || '0'),
          expiresSoon,
          expiresIn,
          refreshToken: refreshToken,
        },
      };
    } catch (error) {
      return undefined;
    }
  }

  public async getUser(token?: string): Promise<AuthResponse | undefined> {
    token = token || this.client?.getToken();
    if (!token) {
      if (this.client) {
        if (this.refreshToken) {
          this.client.setRefreshToken(this.refreshToken);
        }
        await this.client?.connect();
        token = await this.client?.getToken();
      } else {
        return undefined;
      }
    }

    const authResponse = await AuthService.getUserObjectFromToken(
      token,
      this.refreshToken,
    );

    if (authResponse && this.client) {
      authResponse.tokens!.refreshToken = this.client.getRefreshToken();
    }

    return authResponse;
  }

  public get refreshToken(): string | undefined {
    this.ensureClientInitialized();
    let refreshToken;

    if (this.client) {
      refreshToken = this.client.getRefreshToken();
      if (refreshToken) {
        this.refreshCookieTokenSet(refreshToken);
        return refreshToken;
      }
    }
    return this.refreshCookieTokenGet();
  }

  private ensureClientInitialized(): void {
    if (!this.client) {
      this.initClient();
    }
    if (!this.client) {
      throw new Error('AuthServiceClient is not initialized');
    }
  }

  public refreshCookieTokenSet(refreshToken: string): void {
    this.cookieService.set({
      name: AUTH_COOKIES.REFRESH_TOKEN,
      payload: refreshToken,
      httpOnly: true,
    });
  }

  public refreshCookieTokenGet(): string {
    return this.cookieService.get(AUTH_COOKIES.REFRESH_TOKEN);
  }

  private handleError(message: string, error: unknown): any {
    console.error(message, error);
    return { succeeded: false, error: { message, details: error } };
  }
}
