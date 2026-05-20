---
title: Create Order
description: How to create an order in the Geins OMS Package
tags:
  - sdk
  - oms
  - checkout
  - create-order
---

# Create Order

To create an order into Geins you need a `cart` and the `checkout options`.

::: warning :warning: Important
Don't use this if you are using an external checkout flow. This is only for custom checkout flows. Geins backend handles with hooks from payment gateway if checkout is an iframe or alike.
:::

## Overview

- Before order is created the checkout will be validated.
- Validation will only ceckl
- If the checkout is valid the order will be created.
- A successful order creation will return the `CreateOrderResponseType` which contains all the necessary information next steps of the checkout process.

::: warning :warning: Important
The validation performed before creating the order is **not** the same as the validation performed by the [`validate method`](validate.md).
:::

## Options

The create order options are required to create an order. The options are as follows:

```typescript [@geins/types]
type CreateOrderOptions = {
  cartId: string;
  checkoutOptions: CheckoutInputType;
  checkoutMarketId?: string;
  requestContext?: RequestContext; // carries userToken
};
```

### Authentication

Pass the buyer's `userToken` via `requestContext` whenever the user
is signed in. Without it the mutation runs anonymously, so Geins
applies the channel's regular price on the order line even if the
cart line carried a CRM price-list override. The SDK reads no cookies
or storage of its own.

```typescript
const result = await geinsOMS.checkout.createOrder({
  cartId,
  checkoutOptions,
  requestContext: { userToken },
});
```

### Consumer vs company (B2B) addresses

`checkoutOptions` accepts two mutually exclusive shapes per address
side. Pick exactly one per side:

| Customer type | Use these fields |
|---|---|
| Consumer (`PERSON`) | `billingAddress`, `shippingAddress` (literal `AddressInputType`) |
| Company (`ORGANIZATION`) | `billingAddressId`, `shippingAddressId` (string ids referring to the company's predefined addresses) |

Geins rejects literal addresses on a company checkout and rejects
addressIds on a consumer checkout. Resolve the company's predefined
addresses via `geinsCRM.company.get(userToken)` and pass the matching
`addressId` values in.

## Return Object

The return object is of type a `CreateOrderResponseType`:

```typescript [@geins/types]
export type CreateOrderResponseType = {
  created?: boolean;
  orderId?: string;
  publicId?: string;
  message?: string;
};
```

- `created` - A boolean value indicating if the order was created successfully or not.
- `orderId` - The order ID that is created in Geins. This is not preset if the order was not created.
- `publicId` - Might be empty depending on flow of the payment gateway. This is not preset if the order was not created.
- `message` - Only present if the order was not created. This will contain a message indicating why the order was not created.

## Example

```typescript
const myCheckoutOptions = getCheckoutOptions();
const createOrderResult = await geinsOMS.checkout.createOrder({
  cartId: 'cart-id',
  checkoutOptions: myCheckoutOptions,
});

if (createOrderResult.created) {
  console.log('Order created successfully:', createOrderResult);
} else {
  console.log('Order creation failed:', createOrderResult.message);
}
```
