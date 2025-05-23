---
title: Promotion Code
description: How to work with promotion code in the Geins OMS Package
tags:
  - sdk
  - oms
  - cart
  - promotions
  - promotion-code
  - promotion-code-applied
  - promotion-code-removed
  - promotion-code-applied-successfully
  - promotion-code-removed-successfully
  - promotion-code-applied-failed
---

# Promotion Code

When activateting a promotion code on the cart, the prices will be `recalculated` with new prices and discounts. 

## Apply

Applies a promotion code to the cart, adjusting prices and discounts accordingly.

```typescript
const result = await geinsOMS.cart.promotions.apply('PROMO_CODE');
if(result === true){
    console.log("Promotion code applied successfully");
}
```

::: info :nerd_face: Take note
User can only have one promotion code applied at a time. If a new promotion code is applied, the previous one will be removed.
:::

## Remove

Removes an existing promotion code from the cart, recalculating prices and discounts.

```typescript
const result = await geinsOMS.cart.promotions.remove();
if(result === true){
    console.log("Promotion code removed successfully");
}
```

