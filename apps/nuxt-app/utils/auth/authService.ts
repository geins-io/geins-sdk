/*
  SERVER OR/AND CLIENT
*/
import { AUTH_COOKIES, CookieService, logWrite } from '@geins/core';
import type { AuthResponse, AuthCredentials, AuthTokens } from '@geins/types';
import { AuthServiceClient } from './authServiceClient';
import { authClaimsTokenSerializeToObject } from './authHelpers';

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

  // login in user
  public async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      this.ensureClientInitialized();
      const result = await this.client!.login(
        credentials.username,
        credentials.password,
        credentials.rememberUser,
      );

      const authResponse = await AuthService.getUserObjectFromToken(
        result.token,
        result.refreshToken,
      );
      if (!authResponse) {
        // Removed unreachable code
      }
      return authResponse;
    } catch (error) {
      return this.handleError('Login failed', error);
    }
  }

  // get user if userToken is provided parse from token if not use refresh token to get user
  public async getUser(
    currentRefreshtoken: string,
    userToken?: string,
  ): Promise<AuthResponse> {
    try {
      if (userToken) {
        const authResponse = await AuthService.getUserObjectFromToken(
          userToken,
          currentRefreshtoken,
        );
        if (!authResponse) {
          return { succeeded: false };
        }
        if (authResponse.tokens?.expiresSoon) {
          return await this.refresh(currentRefreshtoken);
        }

        return authResponse;
      } else {
        return await this.refresh(currentRefreshtoken);
      }
    } catch (error) {
      return this.handleError('Get user failed', error);
    }
  }

  // change password
  public async changePassword(
    credentials: AuthCredentials,
    currentRefreshtoken: string,
  ): Promise<AuthResponse> {
    if (!credentials.newPassword || !currentRefreshtoken) {
      return { succeeded: false };
    }
    try {
      this.ensureClientInitialized();
      const result = await this.client!.changePassword(
        credentials,
        currentRefreshtoken,
      );
      if (!result.token) {
        return { succeeded: false };
      }
      const authResponse = await AuthService.getUserObjectFromToken(
        result.token,
        result.refreshToken,
      );
      if (!authResponse) {
        return { succeeded: false };
      }
      return authResponse;
    } catch (error) {
      return this.handleError('Token refresh failed', error);
    }
  }

  // get new refresh token and token
  public async refresh(currentRefreshtoken: string): Promise<AuthResponse> {
    if (!currentRefreshtoken) {
      return { succeeded: false };
    }

    try {
      this.ensureClientInitialized();
      const result = await this.client!.renewRefreshtoken(currentRefreshtoken);
      if (!result.token) {
        return { succeeded: false };
      }
      const authResponse = await AuthService.getUserObjectFromToken(
        result.token,
        result.refreshToken,
      );
      if (!authResponse) {
        return { succeeded: false };
      }
      return authResponse;
    } catch (error) {
      return this.handleError('Token refresh failed', error);
    }
  }

  // logout user
  public async logout(currentRefreshtoken: string): Promise<AuthResponse> {
    this.ensureClientInitialized();
    try {
      const result = await this.client!.logout(currentRefreshtoken);
      return { succeeded: result };
    } catch (error) {
      return this.handleError('Logout failed', error);
    }
  }

  // serialize user from jwt token
  static async getUserObjectFromToken(
    userToken: string,
    refreshToken?: string,
  ): Promise<AuthResponse> {
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
    console.error(message, error);
    return { succeeded: false, error: { message, details: error } };
  }
}
