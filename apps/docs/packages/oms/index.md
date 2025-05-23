---
title: OMS Package
description: How to work with the Geins OMS Package
tags:
  - sdk
  - oms
---

# @geins/oms

## Introduction

The `@geins/oms` package provides functionalities for managing shopping carts and checkout processes. It includes features such as cart creation, item management, promotion code handling.

## Overview

The `@geins/oms` package allows you to add shopping cart and checkout functionalities to your application. It includes the following features:

- [Cart](./cart/index.md)

- [Checkout](./checkout/index.md)

- [Order](./order/index.md)

- [Merchant Data](./merchant-data.md)

## Setting Up @geins/oms

### Prerequisites

- `@geins/core` package linked in the workspace.

### Installation

::: code-group

```sh [npm]
$ npm add -D @geins/oms
```

```sh [pnpm]
$ pnpm add -D @geins/oms
```

```sh [yarn]
$ yarn add -D @geins/oms
```

```sh [bun]
$ bun add -D @geins/oms
```

:::

## Quick Start

```ts
import { GeinsCore } from '@geins/core';
import { GeinsOMS } from '@geins/oms';

const geinsCore = new GeinsCore(mySettings);
const geinsOMS = new GeinsOMS(geinsCore);

// Add item with id 1234 to cart
await geinsOMS.cart.items.add({ skuId: 1234 });

// Checkout
const checkout = await geinsOMS.checkout.get();

// Create options for checkout
const checkoutOptions = {
  paymentId: 1,
  email: 'john.doe@example.com',
  billingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    addressLine1: '1312 Chestnut St',
    city: 'San Francisco',
    zip: '94123',
    state: 'CA',
    country: 'US',
  },
};

// Validate checkout
const validationResult = await geinsOMS.checkout.validate({
  checkoutOptions,
});

if (validationResult.isValid) {
  // Create order
  const order = await geinsOMS.checkout.create({
    checkoutOptions,
  });

  console.log('Order created:', order);
} else {
  console.error('Checkout validation failed:', validationResult.message);
}
```

## Overview

The `@geins/oms` package provides the features to help you manage shopping carts and checkout processes. This packages can be utilized in different contexts such as `clint-side`, `server-side`, or in `hybrid mode`.

### Settings

`GeinsOMS` class takes in an options object that has the omsSettings property of the type `OMSSettings` that is used to configure the OMS on how to behave.

```typescript
type OMSSettings = {
  context: RuntimeContext;
  merchantDataTemplate?: unknown;
  defaultPaymentId?: number;
  defaultShippingId?: number;
  checkoutUrls?: CheckoutRedirectsType;
};
```

- `context`: The context in which the OMS is running. It can be `RuntimeContext.CLIENT`, `RuntimeContext.SERVER`, or `RuntimeContext.HYBRID`.
- `merchantDataTemplate`: The template for the merchant data. It is an object that can be used to store additional data for the merchant. The data can be of any type and can be used to store additional information about the merchant.
- `defaultPaymentId`: The default payment method id to be used for the checkout process.
- `defaultShippingId`: The default shipping method id to be used for the checkout process.
- `checkoutUrls`: The URLs to redirect the user to after the checkout process is completed. Read more about how `CheckoutRedirectsType` is used [here](./checkout/get.md#types).

##### context

The context in which the OMS is running. It can be `RuntimeContext.CLIENT`, `RuntimeContext.SERVER`, or `RuntimeContext.HYBRID`.

##### merchantDataTemplate

The template for the merchant data. It is an object that can be used to store additional data for the merchant. The data can be of any type and can be used to store additional information about the merchant.

Read more about `merchantData` [here](./merchant-data.md).

::: tip :bulb: Tip
To get some type safety on the merchant data, you can create your own type and use it to define the `merchantDataTemplate` property.
:::

Example:

```typescript
type MyMerchantDataTemplate = {
  extraData: string;
  extraNumber?: number;
};
const myTemplate: MyMerchantDataTemplate = {
  extraData: '',
  extraNumber: 0,
};

const mySettings: OMSSettings = {
  context: RuntimeContext.HYBRID, // will eg. set cookies if `window` is available
  merchantDataTemplate: myTemplate,
};

const geinsOMS = new GeinsOMS(geinsCore, myOSettings);
```

### Cart

Cart is a class that provides functionalities to manage shopping carts. It includes features such as cart creation, item management, and promotion code handling.

Read more about `Cart` [here](./cart/index.md)

### Checkout

Checkout is a class that provides functionalities to manage the checkout process. It includes features such as order creation, payment handling, and order confirmation.

Read more about `Checkout` [here](./checkout/index.md).
