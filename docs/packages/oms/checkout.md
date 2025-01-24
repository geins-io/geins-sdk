# Checkout

The `CheckoutService` provides methods to interact with the checkout process. The checkout process is the process whe you retrive the cart and validate it before the payment.

## Overview

The `CheckoutService` provides a straightforward way to interact with the checkout process. It includes the following features:

- **Checkout Methods**: 
  - **Get Checkout**: Get the checkout for the cart with diffrent options.
  - **Validate Checkout**: Validate the the cart and checkout options before creating the order.

- **Tokens**: 
  - **Create**: Create a token to be usesd to send the user to another checkout application.
  - **Parse**: Parse the token to get the checkout options.
  

## Features
Convert a cart to an order by using the `CheckoutService`. 

### Checkout Process

Use the `CheckoutService` to interact with the checkout process. The checkout process is the process of converting a cart to an order. The `CheckoutService` provides methods to get the checkout for the cart and validate the checkout options before creating the order.

#### Get

The `get` method retrieves the checkout for the cart. You can use this method to get the checkout options for the cart.

form this you can generate a checkout page. 

type returned is `CheckoutType`:

```typescript
type CheckoutType = {
    email?: string;
    identityNumber?: string;
    cart?: CartType;
    billingAddress?: AddressType;
    shippingAddress?: AddressType;
    consents?: ConsentType[];
    paymentOptions?: PaymentOptionType[];
    shippingOptions?: ShippingOptionType[];
    shippingData?: string;
    checkoutStatus?: CheckoutStatus;
};
```

Usage: 

```typescript

const checkout = await geinsOMS.checkout.get();

```






#### Validate

### Tokens

#### Create

#### Parse





