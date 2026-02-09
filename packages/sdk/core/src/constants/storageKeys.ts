/** Storage keys for auth session data. */
export const AUTH_STORAGE_KEYS = {
  USER: 'geins-user',
  USER_AUTH: 'geins-auth',
  USER_TYPE: 'geins-user-type',
  USER_MAX_AGE: 'geins-user-maxage',
  REFRESH_TOKEN: 'geins-auth-refresh-token',
} as const;

/** Storage keys for cart session data. */
export const CART_STORAGE_KEYS = {
  CART_ID: 'geins-cart-id',
} as const;

/** Default max-age values (in seconds) for auth storage entries. */
export const AUTH_STORAGE_MAX_AGE = {
  /** 30 minutes */
  DEFAULT: 1800,
  /** 7 days */
  REMEMBER_USER: 604800,
} as const;

/** Default max-age values (in seconds) for cart storage entries. */
export const CART_STORAGE_MAX_AGE = {
  /** 7 days */
  DEFAULT: 604800,
} as const;
