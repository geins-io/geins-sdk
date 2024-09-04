/**
 * Interface representing the authentication credentials required for user login.
 */
export interface AuthCredentials {
  /**
   * The username of the user attempting to authenticate.
   */
  username: string;

  /**
   * The password of the user attempting to authenticate.
   */
  password: string;

  /**
   * The new password for the user, used when updating or resetting a password.
   * This field is optional.
   */
  newPassword?: string;

  /**
   * A boolean indicating whether the user should be remembered on this device.
   * Defaults to `false` if not provided.
   */
  rememberUser?: boolean;
}

/**
 * Interface representing the response from an authentication attempt.
 */
export interface AuthResponse {
  /**
   * A boolean indicating whether the authentication attempt was successful.
   */
  succeeded: boolean;

  /**
   * The authenticated user information, if the authentication was successful.
   * This field is optional.
   */
  user?: AuthUser;

  /**
   * The tokens provided upon successful authentication, used for session management.
   * This field is optional.
   */
  tokens?: AuthTokens;
}

/**
 * Interface representing the authentication tokens used for session management.
 */
export interface AuthTokens {
  /**
   * The primary token used for authenticating subsequent API requests.
   * This field is optional.
   */
  token?: string;

  /**
   * The refresh token used to obtain a new primary token when the current one expires.
   * This field is optional.
   */
  refreshToken?: string;

  /**
   * The maximum age (in seconds) for the session before it expires.
   * This field is optional.
   */
  maxAge?: number;

  /**
   * A boolean indicating whether the token has already expired.
   * This field is optional.
   */
  expired?: boolean;

  /**
   * The expiration timestamp (in milliseconds since Unix epoch) of the token.
   * This field is optional.
   */
  expires?: number;

  /**
   * The number of seconds until the token expires.
   * This field is optional.
   */
  expiresIn?: number;

  /**
   * A boolean indicating whether the token is about to expire soon.
   * This field is optional.
   */
  expiresSoon?: boolean;
}

/**
 * Interface representing the authenticated user information.
 */
export interface AuthUser {
  /**
   * A boolean indicating whether the user is authenticated.
   * This field is optional.
   */
  authenticated?: boolean;

  /**
   * The unique identifier of the authenticated user.
   * This field is optional.
   */
  userId?: string;

  /**
   * The username of the authenticated user.
   * This field is optional.
   */
  username?: string;

  /**
   * The type of customer (e.g., regular, premium) the authenticated user is.
   * This field is optional.
   */
  customerType?: string;

  /**
   * The discount percentage (if any) available to the authenticated user.
   * This field is optional.
   */
  memberDiscount?: string;

  /**
   * The type of membership (e.g., silver, gold) the authenticated user has.
   * This field is optional.
   */
  memberType?: string;

  /**
   * The unique identifier of the membership the authenticated user holds.
   * This field is optional.
   */
  memberId?: string;
}
