# Cart Shipping Fee

## Using manualy Shipping Fees

You can manually set the shipping fee for a cart using the `setShippingFee` method. This method allows you to specify the shipping fee amount and currency for a cart. This is only applicable if Geins is set to use manual shipping fees. 

::: info :nerd_face: Take note

The shipping fee is not automatically calculated by Geins. You must manually set the shipping fee for each cart. This is only for refrence purpose. The real shipping fee will be calculated by the Geins system.

:::

### Setting the shipping fee for a cart:

```typescript 
  const cart = geinsOMS.cart;
  await cart.shipping.shippingFee.set(59);
```
