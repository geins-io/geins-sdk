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

To get a checkout object, simply use the `get` method:
```typescript
// if client context and cartId is stored in a cookie
const checkout = await geinsOMS.checkout.get();

// if server context and you have the cartId
const checkout = await geinsOMS.checkout.get({cartId});
```

The returned object will be of the type `CheckoutType` and contain all the information needed to create a checkout session `external` or `internal`.
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



::: tip :bulb: Tip
Use the `get` method args to prefill the checkout object with user data and/or preselected options.
:::

#### Validate

The `validate` method validates the checkout options before creating the order. You can use this method to check if the checkout options are valid. It is important to call the get method before calling the validate method with valid payment and shipping options. 

The validate method arguments are cartId and a checkout object that looks like this:
```typescript
type CheckoutInputType = {
    paymentId?: number;
    shippingId?: number;
    skipShippingValidation: boolean;
    externalShippingId?: string;
    pickupPoint?: string;
    desiredDeliveryDate?: Date;
    message?: string;
    acceptedConsents?: string[];
    shippingAddress?: AddressInputType;
    billingAddress?: AddressInputType;
    identityNumber?: string;
    email?: string;
    customerType?: CustomerType;
    externalShippingFee?: number;
    merchantData?: string;
};
```

To valiadate the checkout object, simply use the `validate` method:

```typescript

const checkoutInput = {
    paymentId: 1,
    shippingId: 1,
    skipShippingValidation: false,
    message: 'message from user',
    acceptedConsents: ['consent1', 'consent2'],
    shippingAddress: {
        street: 'street',
        city: 'city',
        zip: 'zip',
        country: 'country',
    },
    billingAddress: {
        street: 'street',
        city: 'city',
        zip: 'zip',
        country: 'country',
    },
    identityNumber: '123456789',
    email: 'my@email.com'
};

const result = await geinsOMS.checkout.validate({cartId, checkout});

if (result.isValid) {
    console.log('Checkout is valid');
} else {
    console.error('Checkout is not valid', result.erromessagers);
}
```


### Tokens
The `CheckoutService` provides methods to create and parse tokens. Tokens are used to send the user to another checkout application. The token is a JWT token that contains the checkout options and the current cart to be checkout.

#### Create
To create a token to be used to send the user to another checkout application, use the `create` method. The method takes in the cartId and the checkout object and returns a token string.

```typescript

const token = await geinsOMS.checkout.tokenCreate();

```
Read the JSdoc for more information about the `tokenCreate` method and its arguments.


#### Parse

To parse the token and get the checkout options, use the `parse` method. The method takes in the token string and returns `CheckoutTokenPayload` object.

```typescript

const checkout = await geinsOMS.checkout.tokenParse(token);

```
Read the JSdoc for more information about the `tokenParse` method.




