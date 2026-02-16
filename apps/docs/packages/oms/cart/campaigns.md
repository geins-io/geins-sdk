---
title: Applied Campaigns
description: How to work with applied campaigns in the Geins OMS Package
tags:
  - sdk
  - oms
  - cart
  - campaigns
  - applied-campaigns
  - cart-campaigns
  - cart-item-campaigns
  - cart-item-campaigns-applied
---

# Applied Campaigns

This is information about the applied campaigns on the `cart`. Campaigns can either be applied automatically like a `cart campaign` or manually like a `promotion code`.

## Get Applied Campaigns

The `appliedCampaigns` property both on the `CartObject` and on each `CartItem` object provides a method to get the applied campaigns on the cart.


::: tip :bulb: Tip

Use this to show the user the campaigns that have been applied to each item in the cart in your UI. This will provide the user with a better understanding of the discounts they are receiving.

:::



### Cart
Example:
```typescript
const cart = await geinsOMS.cart.get(cartId);
// loop through the applied campaigns
for (const campaign of cart?.appliedCampaigns ?? []) {
  console.log(campaign);
}
```


### Cart Item
Example:
```typescript
const cart = await geinsOMS.cart.get(cartId);
// loop through the applied campaigns on each item
for (const item of cart?.items ?? []) {
  for (const campaign of item?.campaign?.appliedCampaigns ?? []) {
    console.log(`item: ${item.id} has applied campaign:`, campaign);
  }
}
```
