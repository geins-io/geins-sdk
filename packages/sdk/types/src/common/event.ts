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
  payload: any;
  broadcast?: boolean;
}

/**
 * Event type
 * Events emitted by the SDK to listen to
 * @enum
 * @name GeinsEventType
 */
export enum GeinsEventType {
  // User
  USER = 'USER',
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_UPDATE = 'USER_UPDATE',
  USER_DELETE = 'USER_DELETE',

  // Cart
  CART = 'CART',
  CART_ADD = 'CART_ADD',
  CART_REMOVE = 'CART_REMOVE',
  CART_UPDATE = 'CART_UPDATE',
  CART_CLEAR = 'CART_CLEAR',
}
