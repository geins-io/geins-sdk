# Create a checkout token

If you want to use Geins Chekcout you will need to create a checkout token. This token is used to authenticate the user and create a new order.

## Example: Create a checkout token

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
  market: 'your-market', // '1'
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

<GeinsSettings margin-top="20px" />

### 2. Create a cart

<GeinsSettings margin-top="20px" />

### 3. Generate a checkout token

<CheckoutTokenGenerator />
