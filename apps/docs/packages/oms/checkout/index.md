# Checkout

The `CheckoutService` provides methods to interact with the checkout process. The checkout process is the process whe you retrive the cart and validate it before the payment.

## Overview

The `CheckoutService` provides a straightforward way to interact with the checkout process. It includes the following features:

- **Checkout Methods**:

  - **Get Checkout**: Get the checkout for the cart with diffrent options.
  - **Validate Checkout**: Validate the the cart and checkout options before creating the order.
  - **Get Summary**: Get the summary of the checkout process.

- **Tokens**:
  - **Create**: Create a token to be usesd to send the user to another checkout application.
  - **Parse**: Parse the token to get the checkout options.

## Features

Convert a cart to an order by using the `CheckoutService`.

### Checkout Process

The checkout process is the process of converting a cart to an order that can be processed and fulfilled. The process is very simple and straightforward.

1. **Get Checkout**: Get the checkout for the cart with different options.
2. **Validate Checkout**: Validate the cart and checkout options before creating the order. _(optional)_
3. **Get Summary**: Get the summary of the checkout process.

Read about the [Checkout Process](/packages/oms/checkout/process) in detail.

### Tokens

The `CheckoutService` provides methods to create and parse tokens. Tokens are used to send the user to another checkout application. The token is a JWT token that contains the checkout options and the current cart to be checked out.

#### Create

To create a token to be used to send the user to another checkout application, use the `create` method. The method takes in the cartId or uses the cart that is currently active on the user client and returns a token string.

```typescript
const token = await geinsOMS.checkout.createToken();
```

Read the JSdoc for more information about the `createToken` method and its arguments.

#### Parse

To parse the token and get the checkout options, use the `parse` method. The method takes in the token string and returns `CheckoutTokenPayload` object.

```typescript
const checkout = await geinsOMS.checkout.parseToken(token);
```

Read the JSdoc for more information about the `parseToken` method.
