---
"@geins/types": minor
"@geins/core": minor
"@geins/crm": minor
"@geins/oms": minor
"@geins/cms": minor
---

Stateless SDK refactor, production hardening, and session layer

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
