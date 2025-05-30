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
  publicOrderId: 'your-public-order-id'
});
```
