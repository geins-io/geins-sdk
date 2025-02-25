# Create a checkout token

If you want to use Geins Chekcout you will need to create a checkout token. This token is used to authenticate the user and create a new order.

## Example: Create a checkout token

```typescript
import { GeinsCore } from '@geins/core';
import { GeinsOMS } from '@geins/oms';
import type { GenerateCheckoutTokenOptions } from '@geins/types';

const geinsSettings = {
  apiKey: 'your-api-key',
  accountName: 'your-account-name',
  channel: 'your-channel-id',
  tld: 'your-tld',
  locale: 'your-locale',
  market: 'your-market',
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

<CheckoutTokenGenerator />
