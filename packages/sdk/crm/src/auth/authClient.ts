import type { AuthResponse, AuthCredentials } from '@geins/types';
import { CookieService, AUTH_COOKIES, logWrite } from '@geins/core';
import { authClaimsTokenSerializeToObject } from './authHelpers';

/**
 * Abstract class representing an authentication client.
 * Provides base functionality for managing authentication processes,
 * such as login, logout, and password change.
 */
export abstract class AuthClient {
  /**
   * A service for managing cookies, used for storing authentication-related data.
   */
  protected cookieService: CookieService;

  /**
   * Initializes a new instance of the `AuthClient` class.
   */
  constructor() {
    this.cookieService = new CookieService();
  }
  // preview user
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

  /**
   * Abstract method to be implemented by subclasses to handle user login.
   *
   * @param credentials - The authentication credentials.
   * @returns A promise resolving to the authentication response.
   */
  abstract login(credentials: AuthCredentials): Promise<AuthResponse>;

  /**
   * Abstract method to be implemented by subclasses to handle user logout.
   *
   * @returns A promise resolving to a boolean indicating whether the logout was successful.
   */
  abstract logout(): Promise<boolean>;

  /**
   * Abstract method to be implemented by subclasses to handle token refresh.
   *
   * @returns A promise resolving to the authentication response or undefined if the refresh fails.
   */
  abstract refresh(): Promise<AuthResponse | undefined>;

  /**
   * Abstract method to be implemented by subclasses to retrieve the currently authenticated user.
   *
   * @returns A promise resolving to the authentication response or undefined if no user is authenticated.
   */
  abstract getUser(): Promise<AuthResponse | undefined>;

  /**
   * Changes the password for the authenticated user.
   *
   * @param credentials - The authentication credentials, including the new password.
   * @returns A promise resolving to the authentication response after the password change.
   * @throws An error if the new password is not provided.
   */
  public async changePassword(
    credentials: AuthCredentials,
  ): Promise<AuthResponse> {
    if (!credentials.newPassword) {
      throw new Error('New password is required');
    }
    return await this.changePasswordImplementation(credentials);
  }

  /**
   * Abstract method to be implemented by subclasses to handle the password change process.
   *
   * @param credentials - The authentication credentials, including the new password.
   * @returns A promise resolving to the authentication response after the password change.
   */
  protected abstract changePasswordImplementation(
    credentials: AuthCredentials,
  ): Promise<AuthResponse>;

  /**
   * Sets the authentication cookies after a successful login.
   *
   * @param authResponse - The response from the authentication containing user and token data.
   * @param rememberUser - A boolean indicating whether to remember the user on this device.
   */
  protected setCookiesLogin(
    authResponse: AuthResponse,
    rememberUser: boolean,
  ): void {
    const maxAge = rememberUser ? 604800 : 1800; // 7 days or 30 minutes
    const { user, tokens } = authResponse;

    if (tokens?.refreshToken) {
      this.setCookiesRefresh(tokens?.refreshToken);
    }

    if (user?.username) {
      this.cookieService.set({
        name: AUTH_COOKIES.USER,
        payload: user.username,
        maxAge,
      });
    }

    if (tokens?.token) {
      this.cookieService.set({
        name: AUTH_COOKIES.USER_AUTH,
        payload: tokens.token,
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

    this.cookieService.set({
      name: AUTH_COOKIES.USER_MAX_AGE,
      payload: maxAge.toString(),
      maxAge,
    });
  }

  /**
   * Updates the authentication token cookie when refreshing the session.
   *
   * @param userToken - The new authentication token.
   */
  protected setCookiesRefresh(userToken: string): void {
    const maxAgeCookie = this.cookieService.get(AUTH_COOKIES.USER_MAX_AGE);
    const maxAge = maxAgeCookie ? parseInt(maxAgeCookie, 10) : 1800;
    this.cookieService.set({
      name: AUTH_COOKIES.REFRESH_TOKEN,
      payload: userToken,
      maxAge,
      // httpOnly: true,
    });
  }

  protected getCookieRefreshToken(): string {
    return this.cookieService.get(AUTH_COOKIES.REFRESH_TOKEN);
  }

  /**
   * Clears all authentication-related cookies, effectively logging out the user.
   */
  public clearCookies(): void {
    Object.values(AUTH_COOKIES).forEach((cookieName) => {
      this.cookieService.remove(cookieName);
    });
  }
}
