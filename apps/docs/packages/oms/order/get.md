---
title: Get Order
description: How to get an order in the Geins OMS Package
tags:
  - sdk
  - oms
  - order
  - get-order
---

### Get Order

The `get` method retrieves an order summary based on the public order ID. This is useful for looking up order details after an order has been placed.

To get an order summary, use the `get` method:

```typescript
const orderSummary = await geinsOMS.order.get({
  publicOrderId: 'your-public-order-id',
});
```

### Configured rows

Each row of `orderSummary.cart.items` carries its product's type in `product.type`, such as `product` or `configurable`. A configured row is one whose `product.type` is `configurable`. It carries its `configuration`, the `summary` and the committed `sections` where the API recorded them, with `articleNumber`, `discountPercent` and `weightPerUnit`, but `configuration` is `undefined` on a configured row when the API could not read it from the provider, so never tell a configured row by its `configuration`. `configuration` is also `undefined` on a row that is not configured. An order row has no committed id, so `configurationId` and `configuration.committedConfigurationId` are `undefined` on every row.

```typescript
const configured = orderSummary?.cart?.items.filter((row) => row.product?.type === 'configurable') ?? [];
```
