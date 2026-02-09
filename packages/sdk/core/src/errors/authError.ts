import { GeinsError, GeinsErrorCode } from './geinsError';

/**
 * Authentication error. Thrown when an auth operation fails.
 * Base class for more specific auth errors like {@link TokenExpiredError}.
 */
export class AuthError extends GeinsError {
  /**
   * @param message - Human-readable description of the authentication failure.
   * @param code - Error code, defaults to {@link GeinsErrorCode.AUTH_FAILED}.
   * @param cause - Optional underlying error that triggered this auth error.
   */
  constructor(
    message: string,
    code: GeinsErrorCode = GeinsErrorCode.AUTH_FAILED,
    cause?: unknown,
  ) {
    super(message, code, cause);
    this.name = 'AuthError';
  }
}

/**
 * Thrown when a JWT token has expired and cannot be refreshed.
 * Indicates the session is dead and the user must re-authenticate.
 */
export class TokenExpiredError extends AuthError {
  /**
   * @param message - Description of the expiration, defaults to `'Token has expired'`.
   * @param cause - Optional underlying error.
   */
  constructor(message = 'Token has expired', cause?: unknown) {
    super(message, GeinsErrorCode.AUTH_TOKEN_EXPIRED, cause);
    this.name = 'TokenExpiredError';
  }
}

/**
 * Thrown when a token refresh API call fails (network error, server error, etc.).
 * The original error is available via the `cause` property.
 */
export class TokenRefreshError extends AuthError {
  /**
   * @param message - Description of the refresh failure, defaults to `'Token refresh failed'`.
   * @param cause - Optional underlying error from the refresh request.
   */
  constructor(message = 'Token refresh failed', cause?: unknown) {
    super(message, GeinsErrorCode.AUTH_TOKEN_REFRESH_FAILED, cause);
    this.name = 'TokenRefreshError';
  }
}
