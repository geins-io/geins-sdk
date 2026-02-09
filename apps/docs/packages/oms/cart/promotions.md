---
title: Promotion Code
description: How to work with promotion code in the Geins OMS Package
tags:
  - sdk
  - oms
  - cart
  - promotions
---

# Promotion Code

When applying a promotion code to the cart, prices are recalculated with new discounts.

## Apply

Applies a promotion code to the cart and returns the updated cart with recalculated prices.

```typescript
const cart = await geinsOMS.cart.setPromotionCode(cartId, 'PROMO_CODE');
console.log(`Discount: ${cart.summary.total.discountIncVat}`);
```

::: info
A user can only have one promotion code applied at a time. If a new promotion code is applied, the previous one is replaced.
:::

## Remove

Removes the promotion code from the cart and returns the updated cart.

```typescript
const cart = await geinsOMS.cart.removePromotionCode(cartId);
```

## Session Layer

With `CartSession`, promotion codes are managed through the convenience API:

```typescript
await session.promotionCode.apply('PROMO_CODE');
await session.promotionCode.remove();
```
