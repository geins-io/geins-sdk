/*
  SERVER OR/AND CLIENT
*/
import { AuthError, GeinsError, GeinsErrorCode } from '@geins/core';
import type { AuthCredentials, AuthResponse } from '@geins/types';
import { authClaimsTokenSerializeToObject } from './authHelpers';
import { AuthServiceClient } from './authServiceClient';

const EXPIRES_SOON_THRESHOLD = 90;

/**
 * High-level auth service that orchestrates login, registration, token refresh,
 * and password changes via {@link AuthServiceClient}. Parses JWT tokens into
 * {@link AuthResponse} objects with user data and expiry metadata.
 */
export class AuthService {
  private signEndpoint: string;
  private authEndpoint: string;
  private client: AuthServiceClient | undefined;

  constructor(signEndpoint: string, authEndpoint: string) {
    this.signEndpoint = signEndpoint;
    this.authEndpoint = authEndpoint;
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
      throw new GeinsError('AuthServiceClient is not initialized', GeinsErrorCode.NOT_INITIALIZED);
    }
  }

  destroy(): void {
    if (this.client) {
      this.client.destroy();
    }
    this.client = undefined;
  }

  /**
   * Authenticates a user with username/password via challenge–response flow.
   * @param credentials - The user's login credentials.
   * @returns An {@link AuthResponse} with user data and tokens, or a failed response.
   */
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

  /**
   * Retrieves the authenticated user. If a userToken is provided, parses it locally;
   * if the token is expiring soon, refreshes via the API instead.
   * @param refreshToken - The refresh token for re-authentication.
   * @param userToken - Optional JWT user token to parse locally.
   */
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

  /**
   * Changes the user's password.
   * @param credentials - Must include username, password (current), and newPassword.
   * @param refreshToken - The current refresh token.
   */
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

  /**
   * Refreshes the session using a refresh token, returning new tokens and user data.
   * @param refreshToken - The current refresh token.
   */
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

  /**
   * Registers a new user account.
   * @param credentials - The username and password for the new account.
   */
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

  /**
   * Parses a JWT user token into an {@link AuthResponse} with user data and expiry info.
   * Does NOT verify the token signature — see {@link authClaimTokenParse}.
   * @param userToken - The JWT user token.
   * @param refreshToken - Optional refresh token to include in the response.
   */
  static getUserObjectFromToken(userToken: string, refreshToken?: string): AuthResponse {
    try {
      const userFromToken = authClaimsTokenSerializeToObject(userToken);
      if (!userFromToken) {
        throw new AuthError('Failed to parse user token', GeinsErrorCode.PARSE_ERROR);
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
      throw new AuthError('Failed to parse user token', GeinsErrorCode.PARSE_ERROR);
    }
  }

  // error handler
  private handleError(message: string, error: unknown): AuthResponse {
    return { succeeded: false };
  }
}
