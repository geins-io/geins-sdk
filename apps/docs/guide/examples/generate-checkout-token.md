# Generate a checkout token

::: warning :warning: Warning
This is a work in progress and not yet available.
:::

If you want to use [Geins Checkout](https://github.com/geins-io/geins-checkout), you will need to create a checkout token. This token will be used by the checkout to load the cart and customer information. The token can also carry the look and feel of your brand during the checkout process.

## Example: Generate a Checkout Token

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
const geinsOMS = new GeinsOMS(geinsSettings);

const cart: CartType = await geinsOMS.cart.get();

const checkoutSettings: CheckoutSettings = {
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
    icon: '',
    logo: 'https://www.my-store.com/logo.svg',
    styles: {
      logoSize: '2rem',
      radius: '5px',
      background: '#f7f7f7',
      foreground: '#131313',
      card: '#ffffff',
      cardForeground: '#131313',
      accent: '#131313',
      accentForeground: '#ffffff',
      border: '#ebebeb',
      sale: '#11890c',
      error: '#b80000',
    },
  },
};

const checkoutTokenOptions: GenerateCheckoutTokenOptions = {
  cartId: cart.id,
  user: {}, // You can pass in the user object here to pre-fill the checkout
  checkoutSettings,
};

// Generate checkout token
const token = await geinsOMS.createCheckoutToken(checkoutTokenOptions);
window.open(`https://checkout.geins.services/${token}`);
```

### Types

```typescript


## Generate a checkout token

Follow these steps to generate a token for the checkout:

### 1. Set up your Geins Settings

<GeinsToggle margin-top="20px">
    <template #trigger>
        <GeinsStatus />
    </template>
    <GeinsSettingsForm />
</GeinsToggle>

### 2. Create a Cart

<GeinsToggle margin-top="20px">
    <template #trigger>
        <GeinsStatus for="geins-cart" name="Geins cart" />
    </template>
    <GeinsCartForm />
</GeinsToggle>

### 3. Generate a checkout token

<GeinsCheckoutTokenForm />
```
