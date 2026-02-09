/** Authentication credentials required for user login. */
export interface AuthCredentials {
  /** The username of the user attempting to authenticate. */
  username: string;

  /** The password of the user attempting to authenticate. */
  password: string;

  /** New password, used when updating or resetting a password. */
  newPassword?: string;

  /** Whether the user should be remembered on this device. Defaults to `false`. */
  rememberUser?: boolean;
}

/** Response from an authentication attempt. */
export interface AuthResponse {
  /** Whether the authentication attempt was successful. */
  succeeded: boolean;

  /** Authenticated user information, if successful. */
  user?: AuthUser;

  /** Tokens provided upon successful authentication. */
  tokens?: AuthTokens;
}

/** Authentication tokens used for session management. */
export interface AuthTokens {
  /** Primary token for authenticating subsequent API requests. */
  token?: string;

  /** Refresh token used to obtain a new primary token when the current one expires. */
  refreshToken?: string;

  /** Maximum session age in seconds before expiry. */
  maxAge?: number;

  /** Whether the token has already expired. */
  expired?: boolean;

  /** Expiration timestamp in milliseconds since Unix epoch. */
  expires?: number;

  /** Seconds until the token expires. */
  expiresIn?: number;

  /** Whether the token is about to expire soon. */
  expiresSoon?: boolean;
}

/** Authenticated user information. */
export interface AuthUser {
  /** Whether the user is authenticated. */
  authenticated?: boolean;

  /** Unique identifier of the authenticated user. */
  userId?: string;

  /** Username of the authenticated user. */
  username?: string;

  /** Customer type (e.g., regular, premium). */
  customerType?: string;

  /** Discount percentage available to the user. */
  memberDiscount?: string;

  /** Membership type (e.g., silver, gold). */
  memberType?: string;

  /** Unique identifier of the user's membership. */
  memberId?: string;
}

export interface AuthUserToken {
  maxAge: number;
  token: string;
  refreshToken: string;
}

export interface AuthSignature {
  identity: string;
  signature: string;
  timestamp: string;
}

export enum AuthClientConnectionModes {
  Proxy = 'Proxy',
  Direct = 'Direct',
}

export type AuthClientConnectionMode = keyof typeof AuthClientConnectionModes;

/** Authentication settings used by the client. */
export interface AuthSettings {
  /** Client connection mode used for authentication. */
  clientConnectionMode: AuthClientConnectionMode;
  /** URL of the proxy server. Defaults to `/api/auth` if not provided. */
  proxyUrl?: string;
}
