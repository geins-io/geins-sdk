import { GeinsError, GeinsErrorCode } from './geinsError';

/** Thrown when a checkout operation fails (get, validate, create order, summary, etc.). */
export class CheckoutError extends GeinsError {
  /**
   * @param message - Human-readable description of the checkout failure.
   * @param code - Error code, defaults to {@link GeinsErrorCode.CHECKOUT_FAILED}.
   * @param cause - Optional underlying error that triggered this checkout error.
   */
  constructor(
    message: string,
    code: GeinsErrorCode = GeinsErrorCode.CHECKOUT_FAILED,
    cause?: unknown,
  ) {
    super(message, code, cause);
    this.name = 'CheckoutError';
  }
}

/** Thrown when an order retrieval or operation fails. */
export class OrderError extends GeinsError {
  /**
   * @param message - Human-readable description of the order failure.
   * @param code - Error code, defaults to {@link GeinsErrorCode.ORDER_FAILED}.
   * @param cause - Optional underlying error that triggered this order error.
   */
  constructor(
    message: string,
    code: GeinsErrorCode = GeinsErrorCode.ORDER_FAILED,
    cause?: unknown,
  ) {
    super(message, code, cause);
    this.name = 'OrderError';
  }
}
