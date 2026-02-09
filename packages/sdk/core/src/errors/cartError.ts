import { GeinsError, GeinsErrorCode } from './geinsError';

/**
 * Thrown when a cart operation fails (add, update, delete, create, etc.).
 * Use the `code` property to distinguish between specific failure types.
 */
export class CartError extends GeinsError {
  /**
   * @param message - Human-readable description of the cart failure.
   * @param code - Error code, defaults to {@link GeinsErrorCode.CART_OPERATION_FAILED}.
   * @param cause - Optional underlying error that triggered this cart error.
   */
  constructor(
    message: string,
    code: GeinsErrorCode = GeinsErrorCode.CART_OPERATION_FAILED,
    cause?: unknown,
  ) {
    super(message, code, cause);
    this.name = 'CartError';
  }
}
