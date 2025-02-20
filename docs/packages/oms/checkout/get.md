# Get Checkout

To get a checkout, you need to provide a `cartId`. This means that you need to have a cart created before you can start the checkout process. The `cart` can not be empty or be of a status that is `completed`. The Get Checkout will return a `CheckoutType` which contains all the necessary information for the checkout process.

## Quick Start
```typescript

const checkout = await geinsOMS.checkout.get({ cartId: 'cart-id'});
if(checkout) {
    console.log(checkout);
}

```


## Options
You can pass in options to make the checkout come with certain options. The options are as follows:
- `cartId` - The cart id of the cart you want to checkout
- `paymentMethodId?` - The id of the payment method to be used for checkout
- `shippingMethodId?` - The id of the shipping method to be used for checkout
- `checkoutOptions?` - The options for the checkout process. This will contain all the necessary information when checkoing out. This is also used to override the default options for the checkout process.

## Types
```typescript [@geins/types]
/**
 * Get checkout options
 */
type GetCheckoutOptions = {
  cartId: string;
  paymentMethodId?: number;
  shippingMethodId?: number;
  checkoutOptions?: CheckoutInputType;
};

/**
 * Get Checkout Input Type
 */
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
  checkoutUrls?: CheckoutUrlsInputType;
};
```

There is one type that is important to understand if you are using external payment gateways. This is the `CheckoutUrlsInputType` which is used to redirect the user to the correct page after the checkout is completed. The `CheckoutUrlsInputType` is as follows:

```typescript [@geins/types]
type CheckoutUrlsInputType = {
  redirectUrl?: string;
  checkoutPageUrl?: string;
  termsPageUrl?: string;
};
```

- `redirectUrl` - The URL to redirect the user to after a successful checkout so that the user can see the order confirmation
- `checkoutPageUrl` - The URL to redirect the user to after an error in the checkout or if the user cancels the checkout
- `termsPageUrl` - The URL to to the terms page

::: info :nerd_face: Take note
The `CheckoutUrlsInputType` is only used if you are using an external payment gateway. If you are using the standard payment gateway, then you don't need to use this.
:::



## Return Object

The return object is a `CheckoutType` which contains all the necessary information for the checkout process. The `CheckoutType` is as looks below:

```typescript [@geins/types]
type CheckoutType = {
  email?: string;
  identityNumber?: string;
  cart?: CartType;
  billingAddress?: AddressType;
  shippingAddress?: AddressType;
  paymentOptions?: PaymentOptionType[];
  shippingOptions?: ShippingOptionType[];
  shippingData?: string;
  checkoutStatus?: CheckoutStatus;
};
```

Most of the returned object is self explanatory. But there are some things that need to be explained further:

### Payment Options
This is a list of payment options that the user can choose from. This will also indicate if the payment is selected by the user or not. 

```typescript [@geins/types]
enum PaymentOptionCheckoutType {
  STANDARD = 'STANDARD',
  EXTERNAL = 'EXTERNAL',
}

type PaymentOptionType = {
  id: number;
  name?: string;
  displayName?: string;
  logo?: string;
  feeIncVat: number;
  feeExVat: number;
  isDefault: boolean;
  isSelected: boolean;
  checkoutType?: PaymentOptionCheckoutType;
  paymentType?: string;
  paymentData?: string;
};
```
- `paymentData` - Contians the payment data that is needed for the payment gateway. This is used to make sure that the payment gateway can be used to make the payment. If the payment option is not selected by the user, then this will be empty.
- `checkoutType` - This is used to indicate if the payment is a standard payment or an external payment. 
- `feeIncVat` - The fee including VAT
- `feeExVat` - The fee excluding VAT

::: tip :bulb: Tip
Some external payment gateways expect you to render their payment options. If the `checkoutType` is `EXTERNAL` then you need to render the payment options for the user. Use the `paymentData` to render the payment options. This is usually a html snippet that you can render in your frontend.
:::




## Examples

### Get all options of the checkout

This example shows how to get a checkout with only the `cartId`, this will return the checkout with the default options.

```typescript
const checkout = await geinsOMS.checkout.get({ cartId: 'cart-id'});
if(checkout) {
    console.log(checkout);
}
```

### Selected payment method

This example shows how to get a checkout with the `cartId` and a selected payment method, which will return the checkout with the specified options.

```typescript
const checkout = await geinsOMS.checkout.get({ cartId: 'cart-id', paymentMethodId: 18});
if(checkout) {
    console.log(checkout);
}
```

### Provide billing address

This example shows how to get a checkout with the `cartId`, a selected shipping method and a billing address. This will return the checkout with the specified options.

```typescript
const billingAddress = {
    name: 'John Doe',
    street: 'Street 1',
    zip: '1234',
    city: 'City',
    country: 'Country'
};  
const checkout = await geinsOMS.checkout.get({ cartId: 'cart-id', shippingMethodId: 18, checkoutOptions: { billingAddress }});
if(checkout) {
    console.log(checkout);
}
```

## Offer multiple payment methods 
When you offer multiple payment methods and shipping methods, you can use the `paymentMethodId` and `shippingMethodId` to get the checkout with the selected payment and shipping method.

Most common is to start out with just one cartId and then get the checkout. This will return the checkout with the default options. If you want to override the default options, you can pass in the `paymentMethodId`, `shippingMethodId` and `checkoutOptions` to the get checkout function.

```typescript
const checkout = await geinsOMS.checkout.get({ cartId: 'cart-id'});
if(!checkout) {
    throw new Error('Could not get checkout');
}
// ... parse checkout and render the checkout
```

When you are using multiple payment methods and shipping methods, pass in the `paymentMethodId` to get paymentdata for the selected payment method.

```typescript

const checkout = await geinsOMS.checkout.get({ cartId: 'cart-id', paymentMethodId: 18});
if(!checkout) {
    throw new Error('Could not get checkout');
}
// ... parse checkout and render the checkout
``` 

::: tip :bulb: Tip
If you are using external payment gateways, you need to render the payment options for the user. Use the `paymentData` to render the payment options. This is usually a html snippet that you can render in your frontend.
:::
