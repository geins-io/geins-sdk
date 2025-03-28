# Validate The Checkout

Before you let the user checkout you have the option to validate the checkout.

::: info :nerd_face: Take note
A checkout must been created with the `get` method before you can validate the checkout. Otherwise the validation will due to the lack of payment and shipping options.
:::

## Overview of the validation process

- Stock values are checked to ensure that the customer can checkout the items in the cart.
- If customers have been blacklisted validation will fail to prevent fraud or other malicious activities.
- Payment and shipping options are checked to ensure that the customer has selected a payment and shipping option.
- If the customer has not filled in the required fields the validation will fail.

::: tip :bulb: Tip
Validation is optional since checkout will validate the checkout before creating the order. But for a `better user experience` it is recommended to validate the checkout before creating the order especially if you have a custom checkout flow or are uncertain about the `stock levels` due to `high demand`.
:::

## Options

The validate options are the same as the options required to create an order. The options are as follows:

```typescript [@geins/types]
type CreateOrderOptions = {
  cartId: string;
  checkoutOptions: CheckoutInputType;
  checkoutMarketId?: string;
};
```

## Return Object

The return object is a `ValidateOrderCreationResponseType` which contains all the necessary information for the checkout process. The `ValidateOrderCreationResponseType` is as looks below:

```typescript [@geins/types]
type ValidateOrderCreationResponseType = {
  isValid?: boolean;
  message?: string;
  customerGroup?: string;
};
```

- `isValid` - A boolean value indicating if the checkout is valid or not.
- `message` - A message indicating why the checkout is not valid.
- `customerGroup` - The customer group of the customer that is checking out. Not always present in the response.

::: details :book: Message will contain one of the following messages if the checkout is not valid

- Customer is blacklisted
- Insufficient stock amount
- No cart was found with the ID <{cartId}>
- First name is required
- Last name is required
- Address is required
- City is required
- Zip is required
- Invalid Billing Country
- Invalid Shipping Country
- Payment must be selected
- Shipping must be selected
  :::

## Example

```typescript
const myCheckoutOptions = getCheckoutOptions();
const validationResult = await geinsOMS.checkout.validate({
  cartId: 'cart-id',
  checkoutOptions: myCheckoutOptions,
});

if (validationResult.isValid) {
  console.log('Checkout is valid');
} else {
  console.error('Checkout validation failed:', validationResult.message);
  throw new Error(validationResult.message);
}
```
