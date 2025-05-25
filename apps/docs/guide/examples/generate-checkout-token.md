# Create a Checkout Token

If you want to use [Geins Checkout](https://github.com/geins-io/geins-checkout), you will need to create a checkout token. This token will be used by the checkout to load the cart and checkout information. The token can also carry the look and feel of your brand during the checkout process.

:::tip :bulb: TIP
If you want to try the checkout out right now, you can use the [Checkout Token Generator](/guide/checkout-token-generator).
:::

## Generate with @geins/oms

You can generate a checkout token using the `@geins/oms` package. Below is a code example that demonstrates how to set up your Geins settings, retrieve your cart, and generate a checkout token.

[Checkout Token Generator](/guide/checkout-token-generator)

### Code Example

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

// Get your cart
const cart: CartType = await geinsOMS.cart.get();

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
