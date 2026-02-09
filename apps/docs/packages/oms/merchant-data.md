---
title: Merchant Data
description: How to work with the merchant data in the Geins OMS Package
tags:
  - sdk
  - oms
  - merchant-data
---

# Merchant Data

## Overview

Use merchant data to store additional information coupled with the cart. This can store information about the current user, the merchant, or any custom data needed by your application. When a cart transforms into an order, the merchant data is transferred to the order.

## Setting Merchant Data

The stateless `CartService` accepts merchant data as a JSON string:

```typescript
const data = JSON.stringify({ extraData: 'test', extraNumber: 123 });
const cart = await geinsOMS.cart.setMerchantData(cartId, data);
```

## Reading Merchant Data

Merchant data is available on the returned `CartType`:

```typescript
const cart = await geinsOMS.cart.get(cartId);
const merchantData = cart.merchantData; // string
if (merchantData) {
  const parsed = JSON.parse(merchantData);
  console.log(parsed.extraData); // 'test'
}
```

## Type Safety

For type safety, define your merchant data type and use it consistently:

```typescript
type MyMerchantData = {
  extraData: string;
  extraNumber?: number;
};

// When setting
const data: MyMerchantData = { extraData: 'test', extraNumber: 123 };
await geinsOMS.cart.setMerchantData(cartId, JSON.stringify(data));

// When reading
const cart = await geinsOMS.cart.get(cartId);
const parsed = JSON.parse(cart.merchantData!) as MyMerchantData;
```

## Session Layer

With `CartSession`, merchant data is managed through convenience methods:

```typescript
// Set
await session.merchantData.set(JSON.stringify({ extraData: 'test' }));

// Get (from cached cart)
const data = session.merchantData.get();
```
