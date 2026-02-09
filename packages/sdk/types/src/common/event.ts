/**
 * Event message interface
 * @interface
 * @name GeinsEventMessage
 * @property {string} subject - Event subject
 * @property {any} payload - Event payload
 * @property {boolean} [broadcast] - Broadcast event over windows and tabs
 * @example
 * {
 *  subject: 'USER_LOGIN',
 *  payload: {
 *   user: 'luke.skywalker@tatooine.com',
 *  },
 * broadcast: true,
 * }
 */
export interface GeinsEventMessage {
  subject: string;
  payload: unknown;
  broadcast?: boolean;
}

/**
 * Event type
 * Events emitted by the SDK to listen to
 * @enum
 * @name GeinsEventType
 */
export enum GeinsEventType {
  /** Parent event for all user-related events */
  USER = 'USER',
  /** User logged in successfully */
  USER_LOGIN = 'USER_LOGIN',
  /** User logged out */
  USER_LOGOUT = 'USER_LOGOUT',
  /** User profile was updated */
  USER_UPDATE = 'USER_UPDATE',
  /** User account was deleted */
  USER_DELETE = 'USER_DELETE',

  /** Parent event for all cart-related events */
  CART = 'CART',
  /** Item added to cart */
  CART_ADD = 'CART_ADD',
  /** Item removed from cart */
  CART_REMOVE = 'CART_REMOVE',
  /** Cart item quantity updated */
  CART_UPDATE = 'CART_UPDATE',
  /** All items cleared from cart */
  CART_CLEAR = 'CART_CLEAR',

  /** Parent event for all session-related events */
  SESSION = 'SESSION',
  /** Auth token was refreshed successfully */
  SESSION_REFRESH = 'SESSION_REFRESH',
  /** Session expired — refresh failed, user must re-authenticate */
  SESSION_EXPIRED = 'SESSION_EXPIRED',
}
