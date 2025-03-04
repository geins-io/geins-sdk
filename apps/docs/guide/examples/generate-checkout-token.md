# Generate a checkout token

::: warning :warning: Warning
This is a work in progress and not yet available.
:::

If you want to use managed version of [Geins Checkout](https://github.com/geins-io/geins-checkout) you will need to create a checkout token. This token will be used by the checkout to load the cart and customer information. The token can also carry the look and feel of your brand during the checkout process.

## Example: Generate a checkout token

```typescript
import { GeinsCore } from '@geins/core';
import { GeinsOMS } from '@geins/oms';
import type { GenerateCheckoutTokenOptions } from '@geins/types';

const geinsSettings = {
  apiKey: 'your-api-key', // xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  accountName: 'your-account-name', // 'name'
  channel: 'your-channel-id', // '1'
  tld: 'your-tld', // 'com'
  locale: 'your-locale', // 'en-US'
  market: 'your-market', // 'us'
};

const geinsCore = new GeinsCore(geinsSettings);
const geinsOMS = new GeinsOMS(geinsSettings);

const checkoutTokenOptions: GenerateCheckoutTokenOptions = {
  cartId: 'my-cart-id',
};

// generate checkout token
const token = await geinsOMS.createCheckoutToken(checkoutTokenOptions);
window.open(`https://checkout.geins.services/${token}`);
```

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
