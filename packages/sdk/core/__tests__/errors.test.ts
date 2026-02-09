import {
  GeinsError,
  GeinsErrorCode,
  AuthError,
  TokenExpiredError,
  TokenRefreshError,
  CartError,
} from '../src/errors';

describe('Error hierarchy', () => {
  it('GeinsError is instanceof Error', () => {
    const err = new GeinsError('test', GeinsErrorCode.SERVICE_UNAVAILABLE);
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(GeinsError);
    expect(err.name).toBe('GeinsError');
    expect(err.code).toBe(GeinsErrorCode.SERVICE_UNAVAILABLE);
    expect(err.message).toBe('test');
  });

  it('AuthError is instanceof GeinsError and Error', () => {
    const err = new AuthError('auth failed');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(GeinsError);
    expect(err).toBeInstanceOf(AuthError);
    expect(err.name).toBe('AuthError');
    expect(err.code).toBe(GeinsErrorCode.AUTH_FAILED);
  });

  it('TokenExpiredError is instanceof AuthError', () => {
    const err = new TokenExpiredError();
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(GeinsError);
    expect(err).toBeInstanceOf(AuthError);
    expect(err).toBeInstanceOf(TokenExpiredError);
    expect(err.name).toBe('TokenExpiredError');
    expect(err.code).toBe(GeinsErrorCode.AUTH_TOKEN_EXPIRED);
    expect(err.message).toBe('Token has expired');
  });

  it('TokenRefreshError is instanceof AuthError', () => {
    const cause = new Error('network');
    const err = new TokenRefreshError('refresh failed', cause);
    expect(err).toBeInstanceOf(AuthError);
    expect(err).toBeInstanceOf(TokenRefreshError);
    expect(err.name).toBe('TokenRefreshError');
    expect(err.code).toBe(GeinsErrorCode.AUTH_TOKEN_REFRESH_FAILED);
    expect(err.cause).toBe(cause);
  });

  it('CartError is instanceof GeinsError but not AuthError', () => {
    const err = new CartError('cart op failed');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(GeinsError);
    expect(err).toBeInstanceOf(CartError);
    expect(err).not.toBeInstanceOf(AuthError);
    expect(err.name).toBe('CartError');
    expect(err.code).toBe(GeinsErrorCode.CART_OPERATION_FAILED);
  });

  it('CartError accepts custom error code', () => {
    const err = new CartError('not found', GeinsErrorCode.CART_NOT_FOUND);
    expect(err.code).toBe(GeinsErrorCode.CART_NOT_FOUND);
  });

  it('GeinsError preserves cause', () => {
    const original = new TypeError('bad type');
    const err = new GeinsError('wrapped', GeinsErrorCode.INVALID_ARGUMENT, original);
    expect(err.cause).toBe(original);
  });
});
