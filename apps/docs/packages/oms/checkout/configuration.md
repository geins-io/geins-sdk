# Checkout Configuration

Use the `OMSSettings` to set the default payment, redirect URL's etc. This will make the checkout process easier since you don't have to pass in the `paymentMethodId` and `shippingMethodId` every time you want to get a checkout.

## Types

```typescript
type OMSSettings = {
  context: RuntimeContext;
  merchantDataTemplate?: unknown;
  defaultPaymentId?: number;
  defaultShippingId?: number;
  checkoutUrls?: CheckoutRedirectsType;
};

type CheckoutRedirectsType = {
  terms?: string;
  success?: string;
  change?: string;
  cancel?: string;
  error?: string;
};
```

## Example

```typescript
const myTemplate: MyMerchantDataTemplate = {
  extraData: '',
  extraNumber: 0,
};

const myOMSSettings: OMSSettings = {
  context: RuntimeContext.HYBRID, // will eg. set cookies if `window` is available
  merchantDataTemplate: myTemplate,
  defaultPaymentId: 1,
  defaultShippingId: 1,
  checkoutUrls: {
    success: 'https://example.com/success',
    cancel: 'https://example.com/cancel',
    error: 'https://example.com/error',
  },
};

const geinsCore = new GeinsCore(myCoreSettings);
const geinsOMS = new GeinsOMS(geinsCore, myOMSSettings);

const checkout = await geinsOMS.checkout.get();
```
