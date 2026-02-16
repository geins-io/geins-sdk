---
title: Checkout Token
description: How to generate a checkout token using the Geins SDK
tags:
  - sdk
  - checkout
  - generate-token
  - token
  - oms
  - types
---

# Checkout Token

If you want to use [Geins Checkout](https://github.com/geins-io/geins-checkout), you will need to create a checkout token. This token will be used by the checkout to load the cart and checkout information. The token can also carry the look and feel of your brand during the checkout process.

:::tip :bulb: TIP
You might want to copy the cart before generating the token. This is useful if you want several customers to be able to checkout a predefined cart. You can do this by setting the `copyCart` option to `true` in the `GenerateCheckoutTokenOptions`.
:::

## Checkout Token Options

| Option                     | Type                    | Description                                                                                                     |
| -------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------- |
| `cartId`                   | `string`                | The ID of the cart to use for the checkout.                                                                     |
| `customerType`             | `CustomerType`          | The type of customer. Can be either `PERSON` or `ORGANIZATION`.                                                 |
| `user`                     | `GeinsUserType`         | The user object containing details like email and address.                                                      |
| `copyCart`                 | `boolean`               | If true, the cart will be copied. Useful if you want several customers to be able to checkout a predefined cart |
| `selectedPaymentMethodId`  | `number`                | The ID of the selected payment method.                                                                          |
| `selectedShippingMethodId` | `number`                | The ID of the selected shipping method.                                                                         |
| `redirectUrls`             | `CheckoutRedirectsType` | The redirect URLs for the checkout, see below for specifications.                                               |
| `branding`                 | `CheckoutBrandingType`  | The branding options for the checkout, see below for specifications.                                            |

### Types

```typescript
type GenerateCheckoutTokenOptions = {
  cartId: string;
  customerType?: CustomerType;
  user?: GeinsUserType;
  copyCart?: boolean;
  selectedPaymentMethodId?: number;
  selectedShippingMethodId?: number;
  redirectUrls?: CheckoutRedirectsType;
  branding?: CheckoutBrandingType;
  geinsSettings?: GeinsSettings;
};

enum CustomerType {
  PERSON = 'PERSON',
  ORGANIZATION = 'ORGANIZATION',
}
```

## Branding Options

| Option                    | Type     | Description                                                                                                 | Default Value |
| ------------------------- | -------- | ----------------------------------------------------------------------------------------------------------- | ------------- |
| `title`                   | `string` | The title of the checkout page. Will not be shown if a logo is added but is always used for the meta title. | `''`          |
| `icon`                    | `string` | URL for the icon shown to the left of the logo/title. Displayed in a circle as 48x48px.                     | `''`          |
| `logo`                    | `string` | URL for your logo.                                                                                          | `''`          |
| `styles.logoSize`         | `string` | Height of the logo. The width will be automatic.                                                            | `'2rem'`      |
| `styles.radius`           | `string` | Radius of UI elements.                                                                                      | `'0.5rem'`    |
| `styles.background`       | `string` | The first background color.                                                                                 | `'#f7f7f7'`   |
| `styles.foreground`       | `string` | Color for text and icons used on the first background color.                                                | `'#131313'`   |
| `styles.card`             | `string` | Secondary background color.                                                                                 | `'#ffffff'`   |
| `styles.cardForeground`   | `string` | Color for text and icons used on the secondary background color.                                            | `'#131313'`   |
| `styles.accent`           | `string` | Color used on buttons and other accent elements.                                                            | `'#131313'`   |
| `styles.accentForeground` | `string` | Color for text and icons used on accent elements.                                                           | `'#ffffff'`   |
| `styles.border`           | `string` | Color for borders.                                                                                          | `'#ebebeb'`   |
| `styles.sale`             | `string` | Color used for sale prices in the cart.                                                                     | `'#e60000'`   |
| `styles.error`            | `string` | Color used for error messages.                                                                              | `'#b00020'`   |

### Types

```typescript
type CheckoutBrandingType = {
  title?: string;
  icon?: string;
  logo?: string;
  styles?: CheckoutStyleType;
};

type CheckoutStyleType = {
  logoSize?: string;
  radius?: string;
  background?: string;
  foreground?: string;
  card?: string;
  cardForeground?: string;
  accent?: string;
  accentForeground?: string;
  border?: string;
  sale?: string;
  error?: string;
};
```

## Redirect URLs Options

| Option     | Type     | Description                                                                                                                                                                |
| ---------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cancel`   | `string` | URL to go to if the user cancels/exits the checkout. Will show a small arrow link next to the icon/logo.                                                                   |
| `continue` | `string` | If supplied, will show a button to continue shopping on the confirmation page.                                                                                             |
| `terms`    | `string` | Will display a Terms & Conditions link on the checkout page.                                                                                                               |
| `privacy`  | `string` | Will display a Privacy Policy link on the checkout page.                                                                                                                   |
| `success`  | `string` | URL to redirect to after successful checkout. Leave empty to use the default (recommended). If using a custom URL, you will need a custom implementation to complete cart. |

### Types

```typescript
type CheckoutRedirectsType = {
  terms?: string;
  privacy?: string;
  success?: string;
  cancel?: string;
  continue?: string;
};
```

## Example usage

Here is an example of how to generate a checkout token using the `@geins/oms` package. This example demonstrates how to set up your Geins settings, retrieve your cart, and generate a checkout token.

:::tip :bulb: TIP
If you want to try the checkout out right now, you can use the [Checkout Token Generator](/guide/checkout-token-generator)
:::

```typescript
import { GeinsCore } from '@geins/core';
import { GeinsOMS } from '@geins/oms';
import type { GenerateCheckoutTokenOptions, GeinsSettings, CartType } from '@geins/types';

// Setup your Geins settings
const geinsSettings: GeinsSettings = {
  apiKey: 'your-api-key', // xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  accountName: 'your-account-name', // 'name'
  channel: 'your-channel-id', // '1'
  tld: 'your-tld', // 'com'
  locale: 'your-locale', // 'en-US'
  market: 'your-market', // 'us'
};

// Initialize GeinsCore and GeinsOMS
const geinsCore = new GeinsCore(geinsSettings);
const geinsOMS = new GeinsOMS(geinsCore);

// Create a cart and add items
const newCart = await geinsOMS.cart.create();
await geinsOMS.cart.addItem(newCart.id, { skuId: 12345, quantity: 1 });
const cart: CartType = await geinsOMS.cart.get(newCart.id);

// Setup your checkout
const checkoutTokenOptions: GenerateCheckoutTokenOptions = {
  cartId: cart.id,
  user: { email: 'user@test.se' },
  selectedPaymentMethodId: 23,
  selectedShippingMethodId: 1,
  copyCart: true,
  customerType: 'PERSON',
  redirectUrls: {
    cancel: 'https://www.my-store.com/cart',
    continue: 'https://www.my-store.com',
    terms: 'https://www.my-store.com/terms',
  },
  branding: {
    title: 'My Store',
    logo: 'https://www.my-store.com/logo.svg',
    styles: {
      logoSize: '2.5rem',
      radius: '5px',
      accent: '#ffcc00',
      accentForeground: '#000000',
    },
  },
};

// Generate checkout token
const token = await geinsOMS.createCheckoutToken(checkoutTokenOptions);

// Redirect to the checkout page
window.open(`https://checkout.geins.services/${token}`);
```
