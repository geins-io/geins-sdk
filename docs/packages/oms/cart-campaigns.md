# Applied Campaigns


This is information about the applied campaigns on the `cart`. Campaigns can either be applied automatically like a `cart campaign` or manually like a `promotion code`.

## Get Applied Campaigns

The `appliedCampaigns` property both on the `CartObject` and on each `CartItem` object provides a method to get the applied campaigns on the cart.


::: tip :bulb: Tip

Use this to show the user the campaigns that have been applied to each item in the cart in your UI. This will provide the user with a better understanding of the discounts they are receiving.

:::



### Get Applied Campaigns on Cart
Example:
```typescript

const cart = await geinsOMS.cart.get();
// loop through the applied campaigns
for (const campaign of cart?.appliedCampaigns ?? []) {
  console.log(campaign);
}

```


### Get Applied Campaigns on Cart Item
Example:
```typescript

const cartItems = await geinsOMS.cart.items.get();
// loop through the applied campaigns
for (const item of cartItems ?? []) {
  for (const campaign of item?.campaign?.appliedCampaigns ?? []) {
    console.log(`item: ${item.id} has applied campaign:`, campaign);
  }
}
```
