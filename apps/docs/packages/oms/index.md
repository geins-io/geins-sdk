---
title: OMS Package
description: How to work with the Geins OMS Package
tags:
  - sdk
  - oms
---

# @geins/oms

## Introduction

The `@geins/oms` package provides functionalities for managing shopping carts and checkout processes. It includes features such as cart creation, item management, promotion code handling.

## Overview

The `@geins/oms` package allows you to add shopping cart and checkout functionalities to your application. It includes the following features:

- [Cart](./cart/index.md)

- [Checkout](./checkout/index.md)

- [Order](./order/index.md)

- [Merchant Data](./merchant-data.md)

## Setting Up @geins/oms

### Prerequisites

- `@geins/core` package linked in the workspace.

### Installation

::: code-group

```sh [npm]
$ npm add -D @geins/oms
```

```sh [pnpm]
$ pnpm add -D @geins/oms
```

```sh [yarn]
$ yarn add -D @geins/oms
```

```sh [bun]
$ bun add -D @geins/oms
```

:::

## Quick Start

### Server-Side (Stateless)

The core `CartService` is fully stateless — safe for server-side shared singletons. Every method takes a `cartId` and returns the full `CartType`.

```ts
import { GeinsCore } from '@geins/core';
import { GeinsOMS } from '@geins/oms';

const geinsCore = new GeinsCore(mySettings);
const geinsOMS = new GeinsOMS(geinsCore);

// Create a cart
const cart = await geinsOMS.cart.create();

// Add item
const updatedCart = await geinsOMS.cart.addItem(cart.id, {
  skuId: 1234,
  quantity: 1,
});

// Checkout — cartId is always explicit
const checkout = await geinsOMS.checkout.get({ cartId: cart.id });

const checkoutOptions = {
  paymentId: 1,
  email: 'john.doe@example.com',
  billingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    addressLine1: '1312 Chestnut St',
    city: 'San Francisco',
    zip: '94123',
    state: 'CA',
    country: 'US',
  },
};

const validationResult = await geinsOMS.checkout.validate({
  cartId: cart.id,
  checkoutOptions,
});

if (validationResult?.isValid) {
  const order = await geinsOMS.checkout.createOrder({
    cartId: cart.id,
    checkoutOptions,
  });
  console.log('Order created:', order);
}
```

### Client-Side (Session Layer)

For browser apps, the `CartSession` wrapper adds cookie persistence and quantity convenience methods on top of the stateless core.

```ts
import { GeinsCore } from '@geins/core';
import { GeinsOMS, CartSession } from '@geins/oms';

const geinsCore = new GeinsCore(mySettings);
const geinsOMS = new GeinsOMS(geinsCore);

// Create a session — stores cartId in cookie
const session = new CartSession(geinsOMS.cart, geinsCore.geinsSettings.locale);

// Session remembers the cart across page loads
await session.get(); // reads cartId from cookie, or creates new cart

// Convenience methods handle quantity logic
await session.items.add({ skuId: 1234 }); // increments if already in cart
await session.items.remove({ skuId: 1234 }); // decrements quantity
await session.promotionCode.apply('SUMMER20');
```

## Architecture

```
Stateless Core (server-safe)
├── CartService    — cart.get(cartId), cart.addItem(cartId, input)
├── CheckoutService — checkout.get({ cartId }), checkout.createOrder(...)
└── OrderService   — order.get(orderId)

Session Layer (browser convenience)
└── CartSession    — cookie persistence, quantity increment/decrement
```

The stateless core holds **no per-request state** — it's safe to share as a singleton across concurrent requests in server environments like Nuxt, Next.js, or Express. The session layer is intended for browser-side use only (one instance per user session).

## Settings

`GeinsOMS` class takes in an options object with the `omsSettings` property of type `OMSSettings`:

```typescript
type OMSSettings = {
  context?: RuntimeContext;
  merchantDataTemplate?: unknown;
  defaultPaymentId?: number;
  defaultShippingId?: number;
  checkoutUrls?: CheckoutRedirectsType;
};
```

- `defaultPaymentId`: The default payment method ID for checkout.
- `defaultShippingId`: The default shipping method ID for checkout.
- `checkoutUrls`: URLs to redirect the user to after the checkout process.

### Cart

Cart is a stateless service that provides methods to manage shopping carts. Every mutation takes a `cartId` and returns the full updated `CartType`.

Read more about `Cart` [here](./cart/index.md)

### Checkout

Checkout handles the checkout process — validation, order creation, token generation.

Read more about `Checkout` [here](./checkout/index.md).
