# Order

The `OrderService` provides methods to interact with orders. It allows you to create new orders from carts and retrieve existing order information.

## Overview

The `OrderService` provides a straightforward way to interact with orders. It includes the following features:

- **Order Methods**: 
  - **Get Order**: Retrieve order summary information using a public order ID
  - **Create Order**: Create a new order from a cart and checkout information

## Features

### Get Order

The `get` method retrieves an order summary based on the public order ID. This is useful for looking up order details after an order has been placed.

To get an order summary, use the `get` method:

```typescript
const orderSummary = await geinsOMS.order.get({
  publicOrderId: 'your-public-order-id'
});
```

The returned object will be of type `OrderSummaryType` containing all the order information.

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
