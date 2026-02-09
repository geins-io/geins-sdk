# Error Handling

All SDK errors extend `GeinsError`, which itself extends the native `Error` class. Every error carries a machine-readable `code` and an optional `cause` for chaining.

## Error Hierarchy

```
Error
└── GeinsError                  (code, cause)
    ├── AuthError               (auth failures)
    │   ├── TokenExpiredError   (JWT expired)
    │   └── TokenRefreshError   (refresh call failed)
    ├── CartError               (cart operations)
    ├── CheckoutError           (checkout operations)
    ├── OrderError              (order operations)
    └── NetworkRequestError     (requestId)
        ├── TimeoutError        (timeoutMs)
        ├── RateLimitError      (retryAfterMs)
        └── RetryExhaustedError (attempts)
```

## Error Codes

Every `GeinsError` has a `code` property from the `GeinsErrorCode` enum:

| Code | Thrown by | Meaning |
|------|-----------|---------|
| `AUTH_FAILED` | `AuthError` | Invalid credentials or auth operation failure |
| `AUTH_TOKEN_EXPIRED` | `TokenExpiredError` | JWT expired, user must re-authenticate |
| `AUTH_TOKEN_REFRESH_FAILED` | `TokenRefreshError` | Refresh request failed |
| `AUTH_NOT_AUTHENTICATED` | `AuthError` | Operation requires auth but no token available |
| `CART_NOT_FOUND` | `CartError` | Cart ID does not exist |
| `CART_ITEM_NOT_FOUND` | `CartError` | Item not in cart |
| `CART_OPERATION_FAILED` | `CartError` | Add/update/delete mutation failed |
| `CHECKOUT_FAILED` | `CheckoutError` | Checkout operation failed |
| `ORDER_FAILED` | `OrderError` | Order retrieval or creation failed |
| `INVALID_ARGUMENT` | `GeinsError` | Bad parameter (missing cartId, etc.) |
| `NOT_INITIALIZED` | `GeinsError` | SDK not set up (missing core, settings) |
| `PARSE_ERROR` | `GeinsError` | Failed to parse API response |
| `GRAPHQL_ERROR` | `GeinsError` | GraphQL returned errors |
| `SERVICE_UNAVAILABLE` | `GeinsError` | Backend is down |
| `REQUEST_TIMEOUT` | `TimeoutError` | Request exceeded timeout |
| `RATE_LIMITED` | `RateLimitError` | Server returned HTTP 429 |
| `RETRY_EXHAUSTED` | `RetryExhaustedError` | All retry attempts failed |
| `NETWORK_ERROR` | `NetworkRequestError` | Connection refused, DNS failure, etc. |

## Catching Errors

### Catch all SDK errors

```typescript
import { GeinsError } from '@geins/core';

try {
  await oms.cart.get(cartId);
} catch (error) {
  if (error instanceof GeinsError) {
    console.error(`[${error.code}] ${error.message}`);
  }
}
```

### Catch by domain

```typescript
import { CartError, CheckoutError, AuthError } from '@geins/core';

try {
  await oms.checkout.createOrder(args);
} catch (error) {
  if (error instanceof CheckoutError) {
    // checkout-specific handling
  } else if (error instanceof CartError) {
    // cart-specific handling
  }
}
```

### Catch by code

```typescript
import { GeinsError, GeinsErrorCode } from '@geins/core';

try {
  await oms.cart.get(cartId);
} catch (error) {
  if (error instanceof GeinsError) {
    switch (error.code) {
      case GeinsErrorCode.CART_NOT_FOUND:
        // create a new cart
        break;
      case GeinsErrorCode.GRAPHQL_ERROR:
        // log and retry
        break;
      default:
        throw error;
    }
  }
}
```

### Handle auth token lifecycle

```typescript
import { TokenExpiredError, TokenRefreshError } from '@geins/core';

try {
  const user = await crm.auth.getUser(refreshToken);
} catch (error) {
  if (error instanceof TokenExpiredError) {
    // session is dead — redirect to login
    redirectToLogin();
  } else if (error instanceof TokenRefreshError) {
    // refresh failed — retry or redirect
    console.error('Refresh failed:', error.cause);
  }
}
```

### Handle network errors

```typescript
import { TimeoutError, RateLimitError, RetryExhaustedError } from '@geins/core';

try {
  await oms.cart.get(cartId);
} catch (error) {
  if (error instanceof TimeoutError) {
    console.warn(`Timeout after ${error.timeoutMs}ms (request: ${error.requestId})`);
  } else if (error instanceof RateLimitError) {
    console.warn(`Rate limited, retry after ${error.retryAfterMs}ms`);
  } else if (error instanceof RetryExhaustedError) {
    console.error(`Failed after ${error.attempts} attempts`);
  }
}
```

## Error Cause Chain

All errors support a `cause` property for chaining the underlying error:

```typescript
try {
  await oms.cart.addItem(cartId, item);
} catch (error) {
  if (error instanceof GeinsError && error.cause) {
    console.error('Root cause:', error.cause);
  }
}
```

## Best Practices

1. **Catch `GeinsError` at your API boundary** — wrap SDK calls in try/catch at the service layer, not in every component.

2. **Use `instanceof` over `code` checks** when the error type matters more than the specific code. `instanceof AuthError` catches all auth errors including `TokenExpiredError`.

3. **Let unexpected errors propagate** — only catch what you can handle. Re-throw unknown errors.

4. **Check `cause` for debugging** — the original error from fetch or GraphQL is preserved in `cause`.

5. **Use `code` for user-facing messages** — map error codes to localized messages rather than showing raw error strings.
