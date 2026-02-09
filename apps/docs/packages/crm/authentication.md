---
title: Authentication
description: How to work with authentication in the Geins CRM Package
tags:
  - sdk
  - crm
  - authentication
  - login
  - logout
---

# Authentication

The `@geins/crm` package provides stateless authentication methods. All auth state (tokens) flows through method parameters — no cookies or stored tokens on the core instance.

For browser-side cookie management, use the `CrmSession` wrapper.

## Auth Methods

### Login

Returns an `AuthResponse` with tokens. No side effects on the CRM instance.

```typescript
const credentials = {
  username: 'user@example.com',
  password: 'password123',
  rememberUser: true,
};

const loginResult = await geinsCRM.auth.login(credentials);

if (loginResult?.succeeded) {
  const userToken = loginResult.tokens!.token!;
  const refreshToken = loginResult.tokens!.refreshToken!;
  // Store these tokens in your app (cookies, session, etc.)
}
```

### Logout

```typescript
const result = await geinsCRM.auth.logout();
```

### Token Refresh

Requires an explicit `refreshToken` parameter:

```typescript
const refreshResult = await geinsCRM.auth.refresh(refreshToken);

if (refreshResult?.succeeded) {
  const newUserToken = refreshResult.tokens!.token!;
  const newRefreshToken = refreshResult.tokens!.refreshToken!;
  // Update stored tokens
}
```

### Get Auth User

Retrieves the authenticated user using a refresh token, optionally with a user token for JWT validation:

```typescript
const authResponse = await geinsCRM.auth.getUser(refreshToken, userToken);

if (authResponse?.succeeded) {
  console.log('User:', authResponse.user?.username);
}
```

### Check Authorization

Checks if a refresh token is valid:

```typescript
const isAuthorized = await geinsCRM.auth.authorized(refreshToken);

if (isAuthorized) {
  console.log('User is authorized');
}
```

### Register New User

```typescript
const registerResult = await geinsCRM.user.create(
  { username: 'newuser@example.com', password: 'password123' },
  { newsletter: false, customerType: GeinsCustomerType.PersonType },
);

if (registerResult?.succeeded) {
  const userToken = registerResult.tokens!.token!;
  // User is now registered and authenticated
}
```

## Server-Side Usage

On the server, you manage token storage yourself (httpOnly cookies, session store, etc.):

```typescript
// In an API route handler
export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, 'refresh-token');

  if (!refreshToken) {
    throw createError({ statusCode: 401 });
  }

  const authResponse = await geinsCRM.auth.getUser(refreshToken);

  if (!authResponse?.succeeded) {
    throw createError({ statusCode: 401 });
  }

  const userToken = authResponse.tokens!.token!;
  const user = await geinsCRM.user.get(userToken);

  return user;
});
```

## Client-Side Usage (Session Layer)

The `CrmSession` wrapper handles token persistence, automatic refresh, and event emission.

### Basic Usage

```typescript
import { CrmSession } from '@geins/crm';

const session = new CrmSession(geinsCRM);

// Login — stores tokens, emits USER_LOGIN
await session.login(credentials);

// getUser() auto-refreshes expired tokens transparently
if (session.isAuthenticated) {
  const user = await session.getUser();
}

// Refresh — deduplicated (concurrent calls share one API call)
await session.refresh();

// Logout — clears tokens, emits USER_LOGOUT
session.logout();
```

### Session Options

```typescript
import { CrmSession } from '@geins/crm';
import { MemoryStorage } from '@geins/core';
import type { EventService } from '@geins/core';

const session = new CrmSession(geinsCRM, {
  storage: new MemoryStorage(),  // or CookieStorageAdapter (default)
  events: geinsCore.events,      // optional — enables event emission
});
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storage` | `StorageInterface` | `CookieStorageAdapter` | Where tokens are persisted |
| `events` | `EventService` | `undefined` | Enables auth state change events |

### Auto Token Refresh

`getUser()` and `updateUser()` check the JWT expiry locally before making API calls. If the token is expired or expiring within 90 seconds, the session transparently refreshes it.

Concurrent refresh calls are deduplicated — three simultaneous `getUser()` calls trigger only one refresh API call.

### Events

When an `EventService` is provided, the session emits events using `GeinsEventType`:

| Event | When |
|-------|------|
| `USER_LOGIN` | Successful login |
| `USER_LOGOUT` | Logout called |
| `SESSION_REFRESH` | Token refreshed successfully |
| `SESSION_EXPIRED` | Refresh failed — session is dead |

Parent events (`USER`, `SESSION`) are also emitted following the SDK convention.

```typescript
import { GeinsEventType } from '@geins/types';

geinsCore.events.listenerAdd((data) => {
  console.log('Session refreshed:', data);
}, GeinsEventType.SESSION_REFRESH);

geinsCore.events.listenerAdd((data) => {
  console.log('Session expired — redirect to login');
}, GeinsEventType.SESSION_EXPIRED);
```

### Error Handling

Failed refresh operations throw typed errors:

```typescript
import { TokenExpiredError, TokenRefreshError } from '@geins/core';

try {
  const user = await session.getUser();
} catch (error) {
  if (error instanceof TokenExpiredError) {
    // Session is dead — redirect to login
  }
}
```

## Token Flow

```
1. Login → AuthResponse { tokens: { token, refreshToken }, user }
2. Store tokens (cookies/session/etc.)
3. Use userToken for user operations: user.get(userToken)
4. Use refreshToken for auth operations: auth.refresh(refreshToken)
5. On token expiry → auto-refresh via ensureValidToken() → new tokens
6. On refresh failure → SESSION_EXPIRED event + TokenExpiredError
```
