import { AuthClient } from './authClient';
import { AuthService } from './authService';
import type { AuthResponse, AuthCredentials } from '@geins/types';

/**
 * A concrete implementation of the `AuthClient` class that directly interacts with the `AuthService`.
 * This class handles authentication operations such as login, logout, token refresh, user retrieval,
 * and registration by communicating with Geins authentication API.
 *
 * @example
 * ```ts
 * const authClient = new AuthClientDirect('https://example.com/sign', 'https://example.com/auth');
 * const credentials = { username: 'user@example.com', password: 'password123' };
 * const response = await authClient.login(credentials);
 * console.log(response.succeeded); // true if login was successful
 * ```
 */
export class AuthClientDirect extends AuthClient {
  /**
   * The service used to perform authentication operations such as login, logout, etc.
   */
  private authService: AuthService;

  /**
   * Initializes a new instance of the `AuthClientDirect` class.
   *
   * @param signEndpoint - The endpoint URL used for signing requests.
   * @param authEndpoint - The endpoint URL used for authentication requests.
   *
   * @example
   * ```ts
   * const authClient = new AuthClientDirect('https://example.com/sign', 'https://example.com/auth');
   * ```
   */
  constructor(signEndpoint: string, authEndpoint: string) {
    super();
    this.authService = new AuthService(signEndpoint, authEndpoint);
  }

  /**
   * Logs in a user using the provided credentials.
   *
   * @param credentials - The authentication credentials.
   * @returns A promise resolving to the authentication response.
   *
   * @example
   * ```ts
   * const credentials = { username: 'user@example.com', password: 'password123' };
   * const response = await authClient.login(credentials);
   * if (response.succeeded) {
   *   console.log('Login successful!');
   * }
   * ```
   */
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const result = await this.authService.login(credentials);

    if (result.succeeded) {
      this.setCookiesLogin(result, credentials.rememberUser || false);
    }

    return result;
  }

  /**
   * Logs out the current user.
   *
   * @returns A promise resolving to a boolean indicating whether the logout was successful.
   *
   * @example
   * ```ts
   * const success = await authClient.logout();
   * if (success) {
   *   console.log('Logout successful!');
   * }
   * ```
   */
  async logout(): Promise<boolean> {
    const result = await this.authService.logout();
    this.clearCookies();
    return result.succeeded;
  }

  /**
   * Refreshes the authentication tokens if they are about to expire or have expired.
   *
   * @returns A promise resolving to the authentication response or undefined if the refresh fails.
   *
   * @example
   * ```ts
   * const response = await authClient.refresh();
   * if (response && response.tokens) {
   *   console.log('Tokens refreshed!');
   * }
   * ```
   */
  async refresh(): Promise<AuthResponse | undefined> {
    const result = await this.authService.refresh();

    if (result && result.tokens?.refreshToken) {
      this.setCookiesRefresh(result.tokens.refreshToken);
    }

    return result;
  }

  /**
   * Retrieves the currently authenticated user.
   *
   * @returns A promise resolving to the authentication response or undefined if no user is authenticated.
   *
   * @example
   * ```ts
   * const user = await authClient.getUser();
   * if (user) {
   *   console.log('Authenticated user:', user);
   * } else {
   *   console.log('No user is currently authenticated.');
   * }
   * ```
   */
  async getUser(): Promise<AuthResponse | undefined> {
    const result = await this.authService.getUser();
    if (result && result.succeeded && result.tokens?.token) {
      if (result.tokens.expired) {
        this.clearCookies();
        return undefined;
      } else if (result.tokens.expiresSoon) {
        await this.refresh();
      }
    } else {
      this.clearCookies();
    }

    return result;
  }

  /**
   * Registers a new user using the provided credentials.
   *
   * @param credentials - The registration credentials.
   * @returns A promise resolving to the authentication response.
   *
   * @example
   * ```ts
   * const credentials = { username: 'newuser@example.com', password: 'password123' };
   * const response = await authClient.register(credentials);
   * if (response.succeeded) {
   *   console.log('Registration successful!');
   * }
   * ```
   */
  async register(credentials: AuthCredentials): Promise<AuthResponse> {
    const result = await this.authService.register(credentials);

    if (result.succeeded) {
      this.setCookiesLogin(result, credentials.rememberUser || false);
    }

    return result;
  }

  /**
   * Changes the user's password by calling the authentication service.
   *
   * @param credentials - The authentication credentials, including the new password.
   * @returns A promise resolving to the authentication response after the password change.
   *
   * @example
   * ```ts
   * const credentials = { username: 'user@example.com', password: 'oldPassword', newPassword: 'newPassword123' };
   * const response = await authClient.changePasswordImplementation(credentials);
   * if (response.succeeded) {
   *   console.log('Password changed successfully!');
   * }
   * ```
   */
  protected async changePasswordImplementation(
    credentials: AuthCredentials,
  ): Promise<AuthResponse> {
    return await this.authService.changePassword(credentials);
  }
}
