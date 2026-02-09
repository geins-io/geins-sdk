# @geins/oms

## 0.6.0

### Minor Changes

- d2e6dc5: Stateless SDK refactor, production hardening, and session layer

  **Stateless core refactor:**

  - `CartService` rewritten as fully stateless — every method takes a `cartId` parameter and returns the full `CartType`. No stored cart ID, no cookies, no in-memory cache.
  - `AuthClient` made stateless — no cookie reads/writes, no stored tokens. All auth state flows through method parameters.
  - `GeinsCRM` made stateless — removed `setAuthTokens()`, `clearAuthAndUser()`, `spoofUser()`. Auth interface methods now require explicit token parameters.
  - `UserService` methods now require `userToken` parameter instead of reading from instance state.
  - `GeinsOMS` simplified — removed `RuntimeContext` dependency.
  - Removed ~1,400 lines of cookie management, instance state, and side-effect code from core services.

  **Typed error hierarchy:**

  - `GeinsError` base class with `GeinsErrorCode` enum (16 error codes)
  - Domain errors: `AuthError`, `TokenExpiredError`, `TokenRefreshError`, `CartError`, `CheckoutError`, `OrderError`
  - Network errors: `NetworkRequestError`, `TimeoutError`, `RateLimitError`, `RetryExhaustedError`
  - All `throw new Error()` replaced with typed SDK errors across all packages

  **Pluggable storage:**

  - `StorageInterface` abstraction replacing hardcoded `CookieService` in sessions
  - `CookieStorageAdapter` (default browser), `MemoryStorage` (tests/server)
  - Constants renamed: `AUTH_COOKIES` → `AUTH_STORAGE_KEYS`, `CART_COOKIES` → `CART_STORAGE_KEYS`

  **CrmSession improvements:**

  - Auto token refresh with JWT expiry check (no network call)
  - Refresh deduplication — concurrent calls share a single API request
  - Cross-tab token sync via `BroadcastChannel`
  - Auth state events: `USER_LOGIN`, `USER_LOGOUT`, `SESSION_REFRESH`, `SESSION_EXPIRED`

  **CartSession improvements:**

  - Cart events: `CART_ADD`, `CART_REMOVE`, `CART_UPDATE`, `CART_CLEAR`
  - `CartSession.associateUser()` for linking anonymous carts to users after login
  - Cart operations wrapped in typed `CartError`

  **API surface cleanup:**

  - Replaced `export *` barrels with explicit named exports in `@geins/core`
  - Removed ~30 internal symbols from public API (stores, link factories, internal services)
  - `@geins/crm` exports only `GeinsCRM` and `CrmSession` (auth internals no longer public)

  **Init pattern standardization:**

  - All domain packages (`GeinsCMS`, `GeinsCRM`, `GeinsOMS`) use lazy getter pattern for service initialization
  - All domain packages implement `destroy()` lifecycle method for cleanup

  **Package structure:**

  - Domain packages declare `@geins/core` as `peerDependency` instead of regular dependency
  - Standardized Rollup configs across all packages (shared structure, terser, externals)

  **Test infrastructure:**

  - Split test configs: `jest.config.unit.js` (no env vars needed) and `jest.config.integration.js`
  - Added coverage collection with `coverageThreshold` enforcement
  - Added unit tests for parsers (cart, checkout, order, shared, content, channel) and services
  - JSDoc added to all exported functions and classes

  **Documentation:**

  - New error handling guide (`guide/error-handling.md`)
  - New TypeScript usage guide (`guide/typescript.md`)

  **Breaking changes:**

  - `CartService` methods now require `cartId` parameter (no implicit cookie reads)
  - `AuthClient.refresh()` and `getUser()` require `refreshToken` parameter
  - `GeinsCRM.auth` interface methods require explicit token parameters
  - `UserService.get()` / `create()` / `update()` require `userToken` parameter
  - `AUTH_COOKIES` → `AUTH_STORAGE_KEYS`, `CART_COOKIES` → `CART_STORAGE_KEYS`
  - `AUTH_COOKIES_MAX_AGE` → `AUTH_STORAGE_MAX_AGE`, `CART_COOKIES_MAX_AGE` → `CART_STORAGE_MAX_AGE`
  - `CrmSession` / `CartSession` constructors accept optional options objects
  - `CheckoutError` extends `GeinsError` instead of `Error` (still `instanceof Error`)
  - Auth internals (`AuthService`, `AuthClient`, `authHelpers`) no longer exported from `@geins/crm`
  - `@geins/core` barrel no longer exports internal stores, link factories, or utility classes

## 0.5.1

### Patch Changes

- d6e1de5: SDK hardening: server-aware fetch policy, per-operation token override, fetch timeouts, error context preservation, GraphQLService error propagation, operator precedence fix, JWT decode security warnings
- Updated dependencies [d6e1de5]
  - @geins/core@0.5.1

## 0.5.0

### Minor Changes

- f7d750a: Updates for geins-checkout
- 9d8fec2: Docs
- f2aec68: Fixes for geins-checkout
- 0.5.0 release

### Patch Changes

- Updated dependencies [f7d750a]
- Updated dependencies [9d8fec2]
- Updated dependencies [f2aec68]
- Updated dependencies
  - @geins/core@0.5.0

## 0.4.3

### Patch Changes

- b28b7d7: Added interactivity to docs
- Updated dependencies [b28b7d7]
  - @geins/core@0.4.3

## 0.4.2-canary-f89b9fa822bf743ef392241754ecc42bf3175823

### Patch Changes

- ff99952: patch eventservice
- f89b9fa: Replaced node-cache and added destory() to baseService
- Updated dependencies [ff99952]
- Updated dependencies [f89b9fa]
  - @geins/core@0.4.2-canary-f89b9fa822bf743ef392241754ecc42bf3175823

## 0.4.1

### Patch Changes

- 8510539: refactor of checkout
- Updated dependencies [8510539]
  - @geins/core@0.4.1

## 0.4.0

### Minor Changes

- d623a63: oms package final

### Patch Changes

- Updated dependencies [d623a63]
  - @geins/core@0.4.0

## 0.3.10-canary-9e45fd154702919aa27d04abc76e4e7d581975ff

### Patch Changes

- 15537bf: added docs and fixed up types
- 3e745f6: jwt token update
- c93670a: release
- 9e45fd1: pkg
- 37d6ca3: next
- f3ed786: next rel
- Updated dependencies [15537bf]
- Updated dependencies [3e745f6]
- Updated dependencies [c93670a]
- Updated dependencies [9e45fd1]
- Updated dependencies [37d6ca3]
- Updated dependencies [f3ed786]
  - @geins/core@0.3.10-canary-9e45fd154702919aa27d04abc76e4e7d581975ff

## 0.3.10-canary-041e5f03d0f47a30733c0c2fba70ccb3dba3e26b

### Patch Changes

- 041e5f0: shipping fixed
- Updated dependencies [041e5f0]
  - @geins/core@0.3.10-canary-041e5f03d0f47a30733c0c2fba70ccb3dba3e26b

<<<<<<< HEAD

## 0.3.10-canary-b4f384b9deaf8c6c36d7279cdb6a62d1dc40d78e

### Patch Changes

- docs
- Updated dependencies
  - @geins/core@0.3.10-canary-b4f384b9deaf8c6c36d7279cdb6a62d1dc40d78e

## 0.3.10-canary-b4f384b9deaf8c6c36d7279cdb6a62d1dc40d78e

=======

## 0.3.10-canary-a231b735f9866e06454595f24a08fc6b6c352bc4

> > > > > > > 5516347da530cf07ac1dead6be1323755f456167

### Patch Changes

- b4f384b: add checkout features
- Updated dependencies [b4f384b]
  <<<<<<< HEAD
  - @geins/core@0.3.10-canary-b4f384b9deaf8c6c36d7279cdb6a62d1dc40d78e

## 0.3.10-canary-9566e63dbbf7d2ef3cd4faef831e0343f15a3121

### Patch Changes

- docs
- Updated dependencies
  - # @geins/core@0.3.10-canary-9566e63dbbf7d2ef3cd4faef831e0343f15a3121
  - @geins/core@0.3.10-canary-a231b735f9866e06454595f24a08fc6b6c352bc4
    > > > > > > > 5516347da530cf07ac1dead6be1323755f456167

## 0.3.9

### Patch Changes

- 7394055: cart added
- Updated dependencies [7394055]
  - @geins/core@0.3.9

## 0.3.9-canary-dfd2af2585c08c969e5961c149739a9b0213095f

### Patch Changes

- rel
- Updated dependencies
  - @geins/core@0.3.9-canary-dfd2af2585c08c969e5961c149739a9b0213095f
