---
title: Cart Shipping Fee
description: How to work with the cart shipping fee in the Geins OMS Package
tags:
  - sdk
  - oms
  - cart
  - shipping
---

# Cart Shipping Fee

## Use Manual Shipping Fees

You can manually set the shipping fee for a cart using `setShippingFee`. This is only applicable if Geins is configured to use manual shipping fees.

::: info
The shipping fee set here is for reference purposes. The actual shipping fee is calculated by the Geins system during checkout.
:::

### Setting the shipping fee

```typescript
const cart = await geinsOMS.cart.setShippingFee(cartId, 59);
```

Returns the full updated `CartType` with the new fee applied.

### Session Layer

With `CartSession`:

```typescript
await session.shippingFee.set(59);
```
