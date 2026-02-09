import { GeinsError, GeinsErrorCode } from '../src/errors/geinsError';
import {
  NetworkRequestError,
  TimeoutError,
  RateLimitError,
  RetryExhaustedError,
} from '../src/errors/networkError';

describe('Network error hierarchy', () => {
  it('NetworkRequestError is instanceof GeinsError and Error', () => {
    const err = new NetworkRequestError('test', GeinsErrorCode.NETWORK_ERROR, 'req-123');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(GeinsError);
    expect(err).toBeInstanceOf(NetworkRequestError);
    expect(err.name).toBe('NetworkRequestError');
    expect(err.code).toBe(GeinsErrorCode.NETWORK_ERROR);
    expect(err.requestId).toBe('req-123');
  });

  it('TimeoutError has correct code and properties', () => {
    const err = new TimeoutError('req-456', 30000);
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(GeinsError);
    expect(err).toBeInstanceOf(NetworkRequestError);
    expect(err).toBeInstanceOf(TimeoutError);
    expect(err.name).toBe('TimeoutError');
    expect(err.code).toBe(GeinsErrorCode.REQUEST_TIMEOUT);
    expect(err.requestId).toBe('req-456');
    expect(err.timeoutMs).toBe(30000);
    expect(err.message).toContain('req-456');
    expect(err.message).toContain('30000ms');
  });

  it('RateLimitError has correct code and retryAfterMs', () => {
    const err = new RateLimitError('req-789', 5000);
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(GeinsError);
    expect(err).toBeInstanceOf(NetworkRequestError);
    expect(err).toBeInstanceOf(RateLimitError);
    expect(err.name).toBe('RateLimitError');
    expect(err.code).toBe(GeinsErrorCode.RATE_LIMITED);
    expect(err.requestId).toBe('req-789');
    expect(err.retryAfterMs).toBe(5000);
    expect(err.message).toContain('retry after 5000ms');
  });

  it('RateLimitError works without retryAfterMs', () => {
    const err = new RateLimitError('req-abc');
    expect(err.retryAfterMs).toBeUndefined();
    expect(err.message).not.toContain('retry after');
  });

  it('RetryExhaustedError has correct code and attempts', () => {
    const cause = new Error('network down');
    const err = new RetryExhaustedError('req-xyz', 3, cause);
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(GeinsError);
    expect(err).toBeInstanceOf(NetworkRequestError);
    expect(err).toBeInstanceOf(RetryExhaustedError);
    expect(err.name).toBe('RetryExhaustedError');
    expect(err.code).toBe(GeinsErrorCode.RETRY_EXHAUSTED);
    expect(err.requestId).toBe('req-xyz');
    expect(err.attempts).toBe(3);
    expect(err.cause).toBe(cause);
    expect(err.message).toContain('3 attempts');
  });

  it('NetworkRequestError preserves cause', () => {
    const original = new TypeError('fetch failed');
    const err = new NetworkRequestError(
      'wrapped',
      GeinsErrorCode.NETWORK_ERROR,
      'req-cause',
      original,
    );
    expect(err.cause).toBe(original);
  });
});
