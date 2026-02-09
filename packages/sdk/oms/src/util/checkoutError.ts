import { GeinsError, GeinsErrorCode } from '@geins/core';

/** Thrown when the checkout process fails. */
export class CheckoutError extends GeinsError {
  constructor(message: string, cause?: unknown) {
    super(message, GeinsErrorCode.CHECKOUT_FAILED, cause);
    this.name = 'CheckoutError';
  }
}
