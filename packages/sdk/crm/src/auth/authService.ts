/*
  SERVER OR/AND CLIENT
*/
import { CookieService } from '@geins/core';
import type { AuthCredentials, AuthResponse } from '@geins/types';
import { authClaimsTokenSerializeToObject } from './authHelpers';
import { AuthServiceClient } from './authServiceClient';

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
  // initialize client
  private initClient(): void {
    this.client = new AuthServiceClient(this.authEndpoint, this.signEndpoint);
  }
  // helper to make sure client is initialized
  private ensureClientInitialized(): void {
    if (!this.client) {
      this.initClient();
    }
    if (!this.client) {
      throw new Error('AuthServiceClient is not initialized');
    }
  }

  destroy(): void {
    if (this.client) {
      this.client.destroy();
    }
    this.client = undefined;
  }

  // login in user
  public async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      this.ensureClientInitialized();

      const result = await this.client!.login(
        credentials.username,
        credentials.password,
        credentials.rememberUser,
      );

      return AuthService.getUserObjectFromToken(result.token, result.refreshToken);
    } catch (error) {
      return this.handleError('Login failed', error);
    }
  }

  // get user if userToken is provided parse from token if not use refresh token to get user
  public async getUser(refreshToken: string, userToken?: string): Promise<AuthResponse> {
    try {
      if (userToken) {
        const authResponse = AuthService.getUserObjectFromToken(userToken, refreshToken);
        if (!authResponse) {
          return { succeeded: false };
        }
        if (authResponse.tokens?.expiresSoon) {
          return await this.refresh(refreshToken);
        }

        return authResponse;
      } else {
        return await this.refresh(refreshToken);
      }
    } catch (error) {
      return this.handleError('Get user failed', error);
    }
  }

  // change password
  public async changePassword(credentials: AuthCredentials, refreshToken: string): Promise<AuthResponse> {
    if (!credentials.newPassword || !refreshToken) {
      return { succeeded: false };
    }
    try {
      this.ensureClientInitialized();
      const result = await this.client!.changePassword(credentials, refreshToken);
      if (!result.token) {
        return { succeeded: false };
      }
      const authResponse = AuthService.getUserObjectFromToken(result.token, result.refreshToken);
      if (!authResponse) {
        return { succeeded: false };
      }
      return authResponse;
    } catch (error) {
      return this.handleError('Token refresh failed', error);
    }
  }

  // get new refresh token and token
  public async refresh(refreshToken: string): Promise<AuthResponse> {
    if (!refreshToken) {
      return { succeeded: false };
    }

    try {
      this.ensureClientInitialized();
      const result = await this.client!.renewRefreshtoken(refreshToken);
      if (!result.token) {
        return { succeeded: false };
      }
      const authResponse = AuthService.getUserObjectFromToken(result.token, result.refreshToken);
      if (!authResponse) {
        return { succeeded: false };
      }
      return authResponse;
    } catch (error) {
      return this.handleError('Token refresh failed', error);
    }
  }

  // register new user
  public async register(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      this.ensureClientInitialized();
      const result = await this.client!.register(credentials.username, credentials.password);

      if (!result) {
        return { succeeded: false };
      }

      return AuthService.getUserObjectFromToken(result.token, result.refreshToken);
    } catch (error) {
      return this.handleError('Register new user failed', error);
    }
  }

  // serialize user from jwt token
  static getUserObjectFromToken(userToken: string, refreshToken?: string): AuthResponse {
    try {
      const userFromToken = authClaimsTokenSerializeToObject(userToken);
      if (!userFromToken) {
        throw new Error('Failed to parse user token');
      }

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
          token: userToken,
          expires: parseInt(userFromToken.exp || '0'),
          expired: now >= parseInt(userFromToken.exp || '0'),
          expiresSoon,
          expiresIn,
          refreshToken: refreshToken,
        },
      };
    } catch (error) {
      throw new Error('Failed to parse user token');
    }
  }

  // error handler
  private handleError(message: string, error: unknown): any {
    return { succeeded: false, error: { message, details: error } };
  }
}
