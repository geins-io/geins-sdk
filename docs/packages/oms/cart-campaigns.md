# Applied Campaigns


This is information about the applied campaigns on the `cart`.

## Get Applied Campaigns

The `appliedCampaigns` property both on the `CartObject` and on each `CartItem` object provides a method to get the applied campaigns on the cart.


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
