import { logWrite } from '@geins/core';
import { AuthClient } from './authClient';
import type { AuthResponse, AuthCredentials } from '@geins/types';

/**
 * A concrete implementation of the `AuthClient` class that interacts with an authentication API via HTTP requests.
 * This class is responsible for managing authentication processes such as login, logout, token refresh, and user management
 * by communicating with Geins authentication api through an proxy endpoint.
 *
 * @example
 * ```ts
 * const authClient = new AuthClientProxy('/api/auth');
 * const credentials = { username: 'user@example.com', password: 'password123' };
 * const response = await authClient.login(credentials);
 * console.log(response.succeeded); // true if login was successful
 * ```
 */
export class AuthClientProxy extends AuthClient {
  /**
   * The base endpoint for the authentication API.
   * Used to construct full API paths for authentication-related requests.
   */
  private readonly authEndpointApp: string;

  /**
   * Initializes a new instance of the `AuthClientProxy` class.
   *
   * @param authEndpointApp - The base endpoint URL for the authentication API.
   *
   * @example
   * ```ts
   * const authClient = new AuthClientProxy('/api/auth');
   * ```
   */
  constructor(authEndpointApp: string) {
    super();
    this.authEndpointApp = authEndpointApp;
  }

  /**
   * Sends an HTTP request to the authentication API and returns the response.
   *
   * @template T - The expected response type.
   * @param path - The API path to which the request is sent.
   * @param options - The options for the HTTP request, such as method, headers, and body.
   * @returns A promise resolving to the parsed JSON response body of type `T`.
   * @throws An error if the API request fails.
   *
   * @example
   * ```ts
   * const userData = await authClient.request<AuthResponse>('/login', {
   *   method: 'POST',
   *   body: JSON.stringify(credentials),
   * });
   * ```
   */
  private async request<T>(path: string, options: RequestInit): Promise<T> {
    const refreshToken = this.getCookieRefreshToken();

    if (!options.headers) {
      options.headers = { 'Content-Type': 'application/json' };
    }
    if (refreshToken) {
      options.headers = {
        ...options.headers,
        'x-auth-refresh-token': refreshToken,
      };
    }

    const response = await fetch(`${this.authEndpointApp}${path}`, {
      ...options,
    });

    const result = await response.json();
    if (!response.ok) {
      console.error(result.message || 'API request failed');
      throw new Error('API request failed');
    }

    if (result.body?.data?.tokens?.refreshToken) {
      this.setCookiesRefresh(result.body?.data?.tokens?.refreshToken);
    }

    return result.body?.data as T;
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
    const result = await this.request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

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
    const result = await this.request<any>('/logout', { method: 'GET' });
    this.clearCookies();
    return result.status === 200 ? true : false;
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
    const result = await this.request<AuthResponse>('/refresh', {
      method: 'GET',
    });
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
    const result = await this.request<AuthResponse>('/user', { method: 'GET' });
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
    const result = await this.request<AuthResponse>('/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (result.succeeded) {
      this.setCookiesLogin(result, credentials.rememberUser || false);
    }

    return result;
  }

  /**
   * Changes the user's password by sending a request to the authentication API.
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
    const result = await this.request<AuthResponse>('/password', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    return result || { succeeded: false };
  }
}
