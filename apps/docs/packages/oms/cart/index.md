---
title: Cart
description: How to work with the cart in the Geins OMS Package
tags:
  - sdk
  - oms
  - cart
---

# Cart

The `CartService` in the Geins SDK OMS package is a **stateless service** for managing shopping carts. Every method takes a `cartId` (where applicable) and returns the full `CartType`. It holds no per-request state, making it safe for server-side shared singletons.

For browser-side convenience (cookie persistence, quantity increment/decrement), use the `CartSession` wrapper.

## Overview

The `CartService` provides:

- **Cart Lifecycle**: Create, fetch, complete, and copy carts.
- **Item Management**: Add, update, and delete items.
- **Promotion Codes**: Apply and remove promotional codes.
- **Shipping Fees**: Configure shipping charges.
- **Merchant Data**: Store custom metadata on the cart.
- **Cart Copying**: Create new carts based on existing ones.
- **Cart Completion**: Mark carts as read-only after checkout.

## Stateless API

```typescript
const geinsOMS = new GeinsOMS(geinsCore);
const cart = geinsOMS.cart; // CartService instance (stateless)
```

All methods return the full `CartType`:

```typescript
type CartType = {
  id: string;
  items: CartItemType[];
  freeShipping: boolean;
  readonly completed: boolean;
  readonly merchantData?: string;
  readonly promoCode?: string;
  readonly fixedDiscount: number;
  readonly appliedCampaigns: CampaignRuleType[];
  readonly summary: CartSummaryType;
};
```

## Cart Management

### Create

Creates a new cart and returns it with a generated ID.

```typescript
const cart = await geinsOMS.cart.create();
console.log(`Cart created with id: ${cart.id}`);
```

### Get

Fetches an existing cart by ID.

```typescript
const cart = await geinsOMS.cart.get(cartId);
console.log(`Cart has ${cart.items.length} items`);
```

### Complete

Marks a cart as completed (read-only). A completed cart cannot be modified.

```typescript
const cart = await geinsOMS.cart.complete(cartId);
console.log(`Cart completed: ${cart.completed}`); // true
```

::: warning
Make sure not to complete a cart before the user has finished the checkout process. A completed cart cannot be modified.
:::

### Copy

Creates a new cart based on an existing one. Returns the new cart.

```typescript
const newCart = await geinsOMS.cart.copy(cartId, { resetPromotions: true });
console.log(`Copied cart ID: ${newCart.id}`);
```

::: tip
Use this in combination with merchant data to add features like "share cart as wishlist" to your application.
:::

## Item Methods

All item methods take `cartId` as the first argument and return the full updated `CartType`.

### Add Item

```typescript
const cart = await geinsOMS.cart.addItem(cartId, {
  skuId: 1234,
  quantity: 1,
});
```

### Update Item

Sets an item to an exact quantity:

```typescript
const cart = await geinsOMS.cart.updateItem(cartId, {
  skuId: 1234,
  quantity: 3,
  message: 'Gift wrapping please',
});
```

### Delete Item

Removes an item entirely (by item ID):

```typescript
const cart = await geinsOMS.cart.deleteItem(cartId, itemId);
```

See the [Items](./items.md) page for full details.

## Modifier Methods

### Promotion Code

```typescript
// Apply
const cart = await geinsOMS.cart.setPromotionCode(cartId, 'SUMMER20');

// Remove
const cart = await geinsOMS.cart.removePromotionCode(cartId);
```

### Shipping Fee

```typescript
const cart = await geinsOMS.cart.setShippingFee(cartId, 59);
```

### Merchant Data

```typescript
const data = JSON.stringify({ extraData: 'test', extraNumber: 123 });
const cart = await geinsOMS.cart.setMerchantData(cartId, data);
```

## Session Layer (Browser)

For browser apps, `CartSession` wraps the stateless `CartService` with pluggable storage, event emission, typed errors, and convenience methods.

### Basic Usage

```typescript
import { CartSession } from '@geins/oms';

const session = new CartSession(geinsOMS.cart, locale);

// Reads cartId from storage, or creates a new cart
await session.get();

// Convenience: increments quantity if item already exists
await session.items.add({ skuId: 1234 });

// Convenience: decrements quantity
await session.items.remove({ skuId: 1234 });

// Direct access to cached cart
const items = session.items.get();

// Clear session (removes storage and cache)
session.remove();
```

### Session Options

```typescript
import { CartSession } from '@geins/oms';
import { MemoryStorage } from '@geins/core';

const session = new CartSession(geinsOMS.cart, locale, {
  storage: new MemoryStorage(),  // or CookieStorageAdapter (default)
  events: geinsCore.events,      // optional — enables cart events
});
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storage` | `StorageInterface` | `CookieStorageAdapter` | Where cart ID is persisted |
| `events` | `EventService` | `undefined` | Enables cart state change events |

### Events

When an `EventService` is provided, the session emits events using `GeinsEventType`:

| Event | When |
|-------|------|
| `CART_ADD` | Item added |
| `CART_REMOVE` | Item removed or deleted |
| `CART_UPDATE` | Item quantity updated |
| `CART_CLEAR` | All items cleared |

Parent event `CART` is also emitted alongside each specific event.

```typescript
import { GeinsEventType } from '@geins/types';

geinsCore.events.listenerAdd((data) => {
  console.log('Cart changed:', data);
}, GeinsEventType.CART);
```

### Associate User

Link an anonymous cart to a user identity after login:

```typescript
await cartSession.associateUser({
  userId: authResponse.user.userId,
  username: authResponse.user.username,
  customerType: authResponse.user.customerType,
});
```

This stores user info in the cart's merchant data, preserving any existing merchant data.

### Error Handling

Cart operations throw typed `CartError` on failure:

```typescript
import { CartError } from '@geins/core';

try {
  await session.items.add({ skuId: 1234 });
} catch (error) {
  if (error instanceof CartError) {
    console.error(error.code, error.message);
  }
}
```

The session layer is **not safe for server-side shared singletons** — use one instance per browser session.
