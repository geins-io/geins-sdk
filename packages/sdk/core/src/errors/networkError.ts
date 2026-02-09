import { GeinsError, GeinsErrorCode } from './geinsError';

/**
 * Base error for network-level failures (timeouts, rate limits, retries).
 * Carries a {@link requestId} so failures can be correlated with specific HTTP requests.
 */
export class NetworkRequestError extends GeinsError {
  /**
   * @param message - Human-readable description of the network failure.
   * @param code - Machine-readable error code from {@link GeinsErrorCode}.
   * @param requestId - Identifier of the HTTP request that failed.
   * @param cause - Optional underlying error (e.g. a native fetch error).
   */
  constructor(
    message: string,
    code: GeinsErrorCode,
    public readonly requestId: string,
    cause?: unknown,
  ) {
    super(message, code, cause);
    this.name = 'NetworkRequestError';
  }
}

/** Thrown when an HTTP request exceeds the configured timeout duration. */
export class TimeoutError extends NetworkRequestError {
  /**
   * @param requestId - Identifier of the timed-out request.
   * @param timeoutMs - The timeout threshold in milliseconds that was exceeded.
   * @param cause - Optional underlying error.
   */
  constructor(
    requestId: string,
    public readonly timeoutMs: number,
    cause?: unknown,
  ) {
    super(
      `Request ${requestId} timed out after ${timeoutMs}ms`,
      GeinsErrorCode.REQUEST_TIMEOUT,
      requestId,
      cause,
    );
    this.name = 'TimeoutError';
  }
}

/**
 * Thrown when the server responds with HTTP 429 (Too Many Requests).
 * If the server provides a `Retry-After` header, it is exposed as {@link retryAfterMs}.
 */
export class RateLimitError extends NetworkRequestError {
  /**
   * @param requestId - Identifier of the rate-limited request.
   * @param retryAfterMs - Optional delay in milliseconds before the request may be retried.
   * @param cause - Optional underlying error.
   */
  constructor(
    requestId: string,
    public readonly retryAfterMs?: number,
    cause?: unknown,
  ) {
    super(
      `Request ${requestId} rate limited${retryAfterMs ? ` (retry after ${retryAfterMs}ms)` : ''}`,
      GeinsErrorCode.RATE_LIMITED,
      requestId,
      cause,
    );
    this.name = 'RateLimitError';
  }
}

/** Thrown when all retry attempts for a request have been exhausted without success. */
export class RetryExhaustedError extends NetworkRequestError {
  /**
   * @param requestId - Identifier of the request that exhausted retries.
   * @param attempts - Total number of attempts made before giving up.
   * @param cause - Optional underlying error from the last attempt.
   */
  constructor(
    requestId: string,
    public readonly attempts: number,
    cause?: unknown,
  ) {
    super(
      `Request ${requestId} failed after ${attempts} attempts`,
      GeinsErrorCode.RETRY_EXHAUSTED,
      requestId,
      cause,
    );
    this.name = 'RetryExhaustedError';
  }
}
