
# Merchant Data

## Overview

Use the merchant data to store additional information you need to be coupled with the cart. This can be used to store information about the current user, the merchant, or any other information you need to be coupled with the cart. The `merchant data` is stored in the cart and can be accessed at any time during the cart lifecycle. When a `cart` transfoms into an `order` the `merchant data` is also transferred to the `order`.


## Templating

The `OMSSettings` object can include a merchantDataTemplate property. This property is used to define the template for the `merchant data`.

Best practice is to create a template for the `merchant data`. This template can be used to ensure that the `merchant data` is always in the correct format. The template can be of any type and can be used to store any information you need. 

```typescript
type MyMerchantDataTemplate = {
  extraData: string;
  extraNumber?: number;
};

const myTemplate: MyMerchantDataTemplate = {
  extraData: '',
  extraNumber: 0,
};

const mySettings =  { 
  omsSettings: {
    merchantDataTemplate: myTemplate,
  }
};

const geinsOMS = new GeinsOMS(geinsCore, mySettings);

```

::: info :nerd_face: Take note
The `merchantDataTemplate` is optional. If you do not provide a template, you can store any type of data in the `merchant data`.
:::

## Adding Data to the Cart

Adding merchant data to the cart is done using the `setMerchantData` method. This method allows you to set the merchant data for a cart. The merchant data must match the template defined in the `OMSSettings` object.

Lets say you have a template for the `merchant data` like this:

```typescript
type MyMerchantDataTemplate = {
  extraData: string;
  extraNumber?: number;
};
```

Into the cart you can set the `merchant data` like this:

```typescript
... 
// set merchant data
const geinsOMS = new GeinsOMS(geinsCore, mySettings);

// set the merchant data according to the template
geinsOMS.cart.merchantData.extraData = 'Some data';
geinsOMS.cart.merchantData.extraNumber = 123;

// or this way
geinsOMS.cart.merchantData = { extraData: 'Some data', extraNumber: 123};
```

To save the `merchant data` to the cart you need to call the `save` method:

```typescript
await geinsOMS.cart.merchantData.save();
```

If the `merchant data` does not match the template defined in the `OMSSettings` object, an error will be thrown.

::: warning :warning: Warning
This will result in an error because the `merchant data` does not match the template.
```typescript
type MyMerchantDataTemplate = {
  extraData: string;
  extraNumber?: number;
};

const geinsOMS = new GeinsOMS(geinsCore, mySettings);

try {
  // throws an error because the template is not matched
  geinsOMS.cart.merchantData = { properyNotInTemplate: 'Some data'};
} catch (error) {
  console.error(error);
}
```
:::
