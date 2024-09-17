import type { AuthResponse, AuthCredentials, AuthTokens } from '@geins/types';
import { AuthServiceClient } from './authServiceClient';
import { authClaimsTokenSerializeToObject } from './authHelpers';
import { AUTH_COOKIES, CookieService } from '@geins/core';

const EXPIRES_SOON_THRESHOLD = 60;
export class AuthService {
  private signEndpoint: string;
  private authEndpoint: string;
  private client: AuthServiceClient | undefined;
  private cookieService: CookieService;

  /**
   * Creates an instance of AuthService.
   * @param {string} signEndpoint - The endpoint for signing requests.
   * @param {string} authEndpoint - The endpoint for authentication requests.
   * @example
   * const authService = new AuthService('https://api.example.com/sign', 'https://api.example.com/auth');
   */
  constructor(signEndpoint: string, authEndpoint: string) {
    this.signEndpoint = signEndpoint;
    this.authEndpoint = authEndpoint;
    this.cookieService = new CookieService();
    this.initClient();
  }

  /**
   * Sets the refresh token for the current session.
   * @param {string} refreshToken - The refresh token to be used.
   * @throws Will throw an error if the client is not initialized.
   * @example
   * authService.setRefreshToken('your-refresh-token');
   */
  public setRefreshToken(refreshToken: string): void {
    this.ensureClientInitialized();
    this.client!.setRefreshToken(refreshToken);
  }

  /**
   * Initializes the AuthServiceClient.
   * @private
   */
  private initClient(): void {
    this.client = new AuthServiceClient(this.authEndpoint, this.signEndpoint);
  }

  /**
   * Logs in a user with the provided credentials.
   * @param {AuthCredentials} credentials - The credentials for logging in.
   * @returns {Promise<AuthResponse>} - The authentication response.
   * @example
   * const response = await authService.login({ username: 'user', password: 'pass' });
   * if (response.succeeded) {
   *   console.log('Login successful');
   * }
   */
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

  /**
   * Logs out the current user.
   * @returns {Promise<AuthResponse>} - The logout response.
   * @example
   * const response = await authService.logout();
   * if (response.succeeded) {
   *   console.log('Logout successful');
   * }
   */
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

  /**
   * Refreshes the authentication tokens.
   * @returns {Promise<AuthResponse>} - The token refresh response.
   * @example
   * const response = await authService.refresh();
   * if (response.succeeded) {
   *   console.log('Token refreshed', response.tokens);
   * }
   */
  public async refresh(): Promise<AuthResponse> {
    this.ensureClientInitialized();
    try {
      await this.client!.connect();
      const tokens: AuthTokens = {
        token: this.client!.getToken(),
        refreshToken: this.client!.getRefreshToken(),
        maxAge: this.client!.getMaxAge(),
        expired: false,
      };

      return { succeeded: true, tokens };
    } catch (error) {
      return this.handleError('Token refresh failed', error);
    }
  }

  /**
   * Changes the user's password.
   * @param {AuthCredentials} credentials - The credentials for changing the password.
   * @returns {Promise<AuthResponse>} - The password change response.
   * @example
   * const response = await authService.changePassword({ username: 'user', oldPassword: 'oldPass', newPassword: 'newPass' });
   * if (response.succeeded) {
   *   console.log('Password changed successfully');
   * }
   */
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

  /**
   * Registers a new user with the provided credentials.
   * @param {AuthCredentials} credentials - The credentials for registration.
   * @returns {Promise<AuthResponse>} - The registration response.
   * @example
   * const response = await authService.register({ username: 'newUser', password: 'password' });
   * if (response.succeeded) {
   *   console.log('Registration successful');
   * }
   */
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

  /**
   * Retrieves the user object from the provided token.
   * @private
   * @param {string} claimsToken - The JWT token containing user claims.
   * @returns {Promise<AuthResponse | undefined>} - The user object if the token is valid, undefined otherwise.
   */
  private async getUserObjectFromToken(
    claimsToken: string,
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
          refreshToken: this.refreshToken,
        },
      };
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Retrieves the current user's details using the stored token.
   * @param {string} [token] - Optional token to retrieve user details. If not provided, uses the stored token.
   * @returns {Promise<AuthResponse | undefined>} - The user details if available.
   * @example
   * const user = await authService.getUser();
   * if (user?.succeeded) {
   *   console.log('User details:', user.user);
   * }
   */
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

    const authResponse = await this.getUserObjectFromToken(token);

    if (authResponse && this.client) {
      authResponse.tokens!.refreshToken = this.client.getRefreshToken();
    }

    return authResponse;
  }

  /**
   * Retrieves the current refresh token.
   * @returns {string | undefined} - The refresh token if available.
   * @example
   * const refreshToken = authService.refreshToken;
   * if (refreshToken) {
   *   console.log('Current refresh token:', refreshToken);
   * }
   */
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

  /**
   * Ensures that the AuthServiceClient is initialized before use.
   * @private
   * @throws Will throw an error if the client is not initialized.
   */
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
