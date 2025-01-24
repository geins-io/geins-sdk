# @geins/oms

## Introduction

The `@geins/oms` package provides functionalities for managing shopping carts and checkout processes. It includes features such as cart creation, item management, promotion code handling.

## Overview

The `@geins/oms` package allows you to add shopping cart and checkout functionalities to your application. It includes the following features:

- [Cart](./cart)
- [Checkout](./checkout)


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

// add item with id 1234 to cart
await geinsOMS.cart.items.add({ skuId: 1234 });

// get cart items
const cartItems: CartItemType[] = await geinsOMS.cart.items.get();

// output cart items
for (const item of cartItems) {
  console.log(item);
}


```

## Overview

The `@geins/oms` package provides the features to help you manage shopping carts and checkout processes. This packages can be utilized in different contexts such as `clint-side`, `server-side`, or in `hybrid mode`.

### Settings

`GeinsOMS`class takes in a options object that have the omsSettings propery of the type `OMSSettings` that include the properties `context` and `merchantDataTemplate`.

```typescript
type OMSSettings = {
    context: RuntimeContext;
    merchantDataTemplate?: unknown;
};
```
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

Read more about `Cart` [here](./cart.md).


### Checkout

Checkout is a class that provides functionalities to manage the checkout process. It includes features such as order creation, payment handling, and order confirmation.

Read more about `Checkout` [here](./checkout.md).
