---
title: Server-Side Usage
description: How to use the Geins SDK in server-side environments
---

# Server-Side Usage

The Geins SDK is designed with a **stateless core** that's safe for server-side shared singletons. This guide covers patterns for using the SDK in server frameworks like Nuxt, Next.js, and Express.

## Architecture

```
┌─────────────────────────────────────────────┐
│  Stateless Core (server-safe)               │
│  Instances hold config only                 │
│  All state passed per-call                  │
│  Returns full objects from mutations        │
├─────────────────────────────────────────────┤
│  GeinsCore      — API client, settings      │
│  CartService    — cart.get(cartId) → Cart   │
│  GeinsCRM       — user.get(token) → User    │
│  AuthClient     — login(creds) → Response   │
│  GeinsCMS       — pages, content areas      │
└──────────────────┬──────────────────────────┘
                   │ wraps
┌──────────────────▼──────────────────────────┐
│  Session Layer (browser convenience)        │
│  Stores cartId in cookie, tokens in memory  │
│  Delegates to stateless core                │
├─────────────────────────────────────────────┤
│  CartSession    — session.items.add()       │
│  CrmSession     — session.login()           │
└─────────────────────────────────────────────┘
```

## Key Principle

**No per-request state on instances.** Cart IDs, user tokens, and refresh tokens are never stored on the SDK instances. They're passed as parameters to every method call, and full objects are returned from every mutation.

This means a single `GeinsOMS` or `GeinsCRM` instance can safely handle requests from thousands of concurrent users without data leakage.

## Setup

Create SDK instances once at app startup:

```typescript
import { GeinsCore } from '@geins/core';
import { GeinsOMS } from '@geins/oms';
import { GeinsCRM } from '@geins/crm';
import { GeinsCMS } from '@geins/cms';

// Create once — shared across all requests
const geinsCore = new GeinsCore({
  apiKey: process.env.GEINS_API_KEY,
  accountName: process.env.GEINS_ACCOUNT,
  environment: 'production',
  channel: process.env.GEINS_CHANNEL,
  locale: 'en-US',
  market: 'us',
  requestConfig: {
    timeoutMs: 30000,
    retry: { maxRetries: 3 },
  },
});

const geinsOMS = new GeinsOMS(geinsCore);
const geinsCRM = new GeinsCRM(geinsCore, { clientConnectionMode: 'Direct' });
const geinsCMS = new GeinsCMS(geinsCore);
```

## Cart Operations

Every cart method takes `cartId` as the first argument:

```typescript
// Create a new cart
const cart = await geinsOMS.cart.create();
// cart.id is the new cart ID — store it in the user's session/cookie

// Add item — returns full updated cart
const updated = await geinsOMS.cart.addItem(cartId, {
  skuId: 1234,
  quantity: 1,
});

// Update item quantity
const updated = await geinsOMS.cart.updateItem(cartId, {
  skuId: 1234,
  quantity: 3,
});

// Delete item
const updated = await geinsOMS.cart.deleteItem(cartId, itemId);

// Apply promotion code
const updated = await geinsOMS.cart.setPromotionCode(cartId, 'SUMMER20');

// Complete cart (makes it read-only)
const completed = await geinsOMS.cart.complete(cartId);
```

## Authentication

All auth methods require tokens as explicit parameters:

```typescript
// Login — returns tokens, no side effects
const result = await geinsCRM.auth.login({
  username: email,
  password: password,
});
// result.tokens.token = userToken (JWT)
// result.tokens.refreshToken = refreshToken

// Refresh — requires explicit refreshToken
const refreshed = await geinsCRM.auth.refresh(refreshToken);

// Check authorization
const isAuthed = await geinsCRM.auth.authorized(refreshToken);

// Get auth user
const authUser = await geinsCRM.auth.getUser(refreshToken, userToken);
```

## User Operations

All user methods require `userToken`:

```typescript
// Get user profile
const user = await geinsCRM.user.get(userToken);

// Update user
const updated = await geinsCRM.user.update(userData, userToken);

// Get user orders
const orders = await geinsCRM.user.orders.get(userToken);
```

## Nuxt Example

```typescript
// server/utils/geins.ts
const geinsCore = new GeinsCore(config);
export const geinsOMS = new GeinsOMS(geinsCore);
export const geinsCRM = new GeinsCRM(geinsCore, { clientConnectionMode: 'Direct' });

// server/api/cart/[id].get.ts
export default defineEventHandler(async (event) => {
  const cartId = getRouterParam(event, 'id');
  return geinsOMS.cart.get(cartId!);
});

// server/api/cart/add-item.post.ts
export default defineEventHandler(async (event) => {
  const { cartId, skuId, quantity } = await readBody(event);
  return geinsOMS.cart.addItem(cartId, { skuId, quantity });
});

// server/api/user/me.get.ts
export default defineEventHandler(async (event) => {
  const userToken = getCookie(event, 'user-token');
  if (!userToken) throw createError({ statusCode: 401 });
  return geinsCRM.user.get(userToken);
});
```

## When to Use Session Layer

The session layer (`CartSession`, `CrmSession`) is for **browser-side apps only**:

| Feature | Stateless Core | Session Layer |
|---------|---------------|---------------|
| Server-safe | Yes | No |
| Cookie management | Manual | Automatic |
| Token storage | Manual | Automatic |
| Quantity increment/decrement | Manual | Built-in |
| Multi-tenant safe | Yes | No |
| Concurrent request safe | Yes | No |

Use the **stateless core** for:
- Server-side rendering (SSR)
- API routes
- Server middleware
- Multi-tenant apps
- Any shared singleton context

Use the **session layer** for:
- Client-side SPA
- Browser-only features
- Quick prototyping
