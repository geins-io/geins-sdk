---
title: Create Order
description: How to create an order in the Geins OMS Package
tags:
  - sdk
  - oms
  - order
  - create-order
---

### Create Order

The `create` method creates a new order based on a cart ID and checkout information. This is typically the final step in the checkout process after validating the checkout data.

To create an order, use the `create` method:

```typescript
const checkoutInput = {
  paymentId: 1,
  shippingId: 1,
  skipShippingValidation: false,
  message: 'Order notes',
  acceptedConsents: ['consent1', 'consent2'],
  shippingAddress: {
    street: 'Shipping Street',
    city: 'Shipping City',
    zip: '12345',
    country: 'SE',
  },
  billingAddress: {
    street: 'Billing Street',
    city: 'Billing City',
    zip: '12345',
    country: 'SE',
  },
  identityNumber: '123456789',
  email: 'customer@example.com',
  checkoutUrls: {
    termsUrl: 'https://example.com/terms',
    confirmationUrl: 'https://example.com/confirmation',
    // Add other required URLs
  }
};

// if client context and cartId is stored in a cookie
const order = await geinsOMS.order.create({
  checkout: checkoutInput
});

// if server context and you have the cartId
const order = await geinsOMS.order.create({
  cartId: 'your-cart-id',
  checkout: checkoutInput
});
```

The returned object will be of type `PlaceOrderResponseType` containing the created order information.

::: tip :bulb: Tip
Make sure to validate the checkout data using the `CheckoutService.validate()` method before creating an order to ensure all required information is present and valid.
:::
