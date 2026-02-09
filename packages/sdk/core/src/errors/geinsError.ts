/**
 * Error codes for classifying SDK errors.
 * @enum
 */
export enum GeinsErrorCode {
  /** Authentication failed (invalid credentials, etc.) */
  AUTH_FAILED = 'AUTH_FAILED',
  /** JWT token has expired */
  AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
  /** Token refresh request failed */
  AUTH_TOKEN_REFRESH_FAILED = 'AUTH_TOKEN_REFRESH_FAILED',
  /** Operation requires authentication but no token is available */
  AUTH_NOT_AUTHENTICATED = 'AUTH_NOT_AUTHENTICATED',
  /** Cart was not found */
  CART_NOT_FOUND = 'CART_NOT_FOUND',
  /** Cart item was not found */
  CART_ITEM_NOT_FOUND = 'CART_ITEM_NOT_FOUND',
  /** A cart mutation (add, update, delete) failed */
  CART_OPERATION_FAILED = 'CART_OPERATION_FAILED',
  /** Checkout process failed */
  CHECKOUT_FAILED = 'CHECKOUT_FAILED',
  /** Order operation failed */
  ORDER_FAILED = 'ORDER_FAILED',
  /** An invalid argument was provided */
  INVALID_ARGUMENT = 'INVALID_ARGUMENT',
  /** SDK not properly initialized (missing settings, client, etc.) */
  NOT_INITIALIZED = 'NOT_INITIALIZED',
  /** Failed to parse API response or data */
  PARSE_ERROR = 'PARSE_ERROR',
  /** GraphQL query or mutation returned errors */
  GRAPHQL_ERROR = 'GRAPHQL_ERROR',
  /** The backend service is unavailable */
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  /** Request timed out */
  REQUEST_TIMEOUT = 'REQUEST_TIMEOUT',
  /** Rate limited by the server (HTTP 429) */
  RATE_LIMITED = 'RATE_LIMITED',
  /** All retry attempts exhausted */
  RETRY_EXHAUSTED = 'RETRY_EXHAUSTED',
  /** Network-level error (connection refused, DNS failure, etc.) */
  NETWORK_ERROR = 'NETWORK_ERROR',
}

/**
 * Base error class for the Geins SDK.
 * All SDK-specific errors extend this class, so consumers can catch
 * `GeinsError` to handle any SDK error uniformly.
 *
 * @example
 * ```typescript
 * try {
 *   await session.getUser();
 * } catch (error) {
 *   if (error instanceof GeinsError) {
 *     console.error(error.code, error.message);
 *   }
 * }
 * ```
 */
export class GeinsError extends Error {
  /**
   * @param message - Human-readable description of the error.
   * @param code - Machine-readable error code from {@link GeinsErrorCode}.
   * @param cause - Optional underlying error or value that caused this error.
   */
  constructor(
    message: string,
    public readonly code: GeinsErrorCode,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'GeinsError';
  }
}
