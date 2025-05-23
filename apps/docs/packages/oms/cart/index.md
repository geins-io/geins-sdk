---
title: Cart
description: How to work with the cart in the Geins OMS Package
tags:
  - sdk
  - oms
  - cart
---

# Cart

The `CartService` in the Geins SDK Order Management System (OMS) package provides developers with tools to manage shopping carts efficiently. It supports adding, updating, and removing items, managing promotional codes, and configuring shipping details.

The `Cart` is a singleton object created during the initialization of the `@geins/oms` package. It represents a collection of user-selected items, along with metadata like applied campaigns, promotion codes, and shipping details.

## Overview

The `CartService` is a comprehensive utility within the Geins SDK OMS package for managing shopping carts. Its key responsibilities include:

- **Cart Lifecycle Management**: 
  - **Creation**: Create a new cart when required.
  - **Fetching**: Retrieve an existing cart using its unique `cartId`.
  - **Refreshing**: Update the cart with the latest data from the backend.
  - **Removal**: Clear the cart and remove its `cartId` from storage.

- **Item Management**:
  - Add, update, remove, or delete items from the cart.
  - Group and manage item packages within the cart.
  - Support for adjusting item quantities.

- **Promotion Codes**:
  - Apply promotional codes to the cart.
  - Remove existing promotional codes.
  - Handle recalculations for discounts.

- **Campaign Management**:
  - Integrate eligible and activated campaigns for the cart.
  - Display applied campaigns and related metadata.

- **Shipping Fees**:
  - Configure and manage shipping-related charges.
  - Validate and recalculate cart totals based on shipping fees.

- **Merchant Data**:
  - Add and modify custom merchant-specific data stored within the cart.
  - Provide flexibility for client-specific requirements.

- **Context Awareness**:
  - Operate seamlessly in both server and client environments.
  - Automatically handle `cartId` storage via cookies (on the client).

- **Cart Copying**:
  - Create a new cart based on an existing one.
  - Optionally reset promotions or load the copied cart.

- **Cart Completion**:
  - Mark a cart as completed to make it read-only, ensuring immutability post-checkout.

This holistic approach makes the `CartService` a powerful tool for managing carts across various e-commerce scenarios.


```typescript
const geinsOMS = new GeinsOMS(geinsCore);
const cart = geinsOMS.cart;
```


## Features

The `Cart` is alive in 30 days from the last touchpoint. The touchpoint is any operation on the cart like adding, updating, or removing items.

### Context awareness

The `CartService` is aware of the context in which it is being used. It can be used in the following contexts:

- **Server** Handles server-side operations for the cart, ensuring security and efficiency during interactions with the backend.
- **Client** Manages client-side aspects of the cart, such as caching and local updates before syncing with the server.

For eg: if you are using the `CartService` in a server environment. You need to use get the cart with your stored `cart id`. If you are using the `CartService` in a client environment `cartId` will be saved in a cookie.



### Cart Management

#### Id
The `cartId` is a unique identifier for the cart. It is used to identify the cart when performing operations like adding, updating, or removing items. This identifier is generated when the cart is created and is stored in a cookie _(if context is client)_. Otherwise, you need to store the `cartId` in your application.

```typescript
const cart = geinsOMS.cart;
const cartId = cart.id;
```


#### Create
A cart will be created when the user adds the first item to the cart. The cart will be stored in the backend and the `cartId` will be saved in a cookie. If a cart already exists in the backend a new cart will be created and the `cartId` will be saved in a cookie _(if context is client)_.

To create a cart manually, you can use the `create` method:

```typescript
const cart = geinsOMS.cart;
const createdCart = await cart.create();
if (createdCart) {     
  console.log(`Cart created successfully with id: ${createdCart.id}`);
}
```

This method returns the created cart object with the `CartType`:
```typescript
  type CartType = {
    id: string;
    items: CartItemType[];
    freeShipping: boolean;
    readonly merchantData?: any;
    readonly promoCode?: string;
    readonly fixedDiscount: number;
    readonly appliedCampaigns: any[];
    readonly summary: any;
  }
```

This is the structure of the `Cart` object. And not the same as the `CartService`. The `CartService` is a service that provides methods to interact with the cart.



#### Get

The `CartService` provides a method to get the cart. This method fetches the cart data from the backend and updates the cart object.

```typescript
const cart = geinsOMS.cart;
const fetchedCart = await cart.get(cartId);
if (fetchedCart) {     
  console.log(`Cart fetched successfully with id: ${fetchedCart.id}`);
}
```

This needs to be perfomed before any operation on the cart like adding, updating, or removing items other wise you will get a new cart or in some operations you will get an error.

::: info :nerd_face: Take note
This:
```typescript
const cart = geinsOMS.cart;
```
is not the same as:
```typescript
const cart = geinsOMS.cart.get(cartId);
```
:::


#### Refresh

The `CartService` provides a method to refresh the cart. This method fetches the latest cart data from the backend and updates the cart object.

```typescript
const cart = geinsOMS.cart;

// load the cart
await cart.get(cartId);  

const refreshedCart = await cart.refresh();
if (refreshedCart) {     
  console.log(`Cart refreshed successfully with id: ${refreshedCart.id}`);
}
```

After refreshing the cart it will live for another 30 days. This is useful when you want to keep the cart alive for a longer period of time.


#### Remove

Use the remove method to remove the cart from your application. This method will however not remove the `cart` from Geins.

```typescript
await geinsOMS.cart.remove();   
```

This method will remove the cart and the `cartId` will be removed from the cookie _(if context is client)_. This is to be used when you need a completely new cart. If you want to remove all items from the cart you can use the `clear` method on `items` instead.


#### Complete

This method is used to complete the cart, a completed cart is read only and can not be modified.

```typescript
await geinsOMS.cart.complete();  
```

::: warning :warning: Warning
Make sure not to set cart as complete before the user has finished the checkout process. A cart marked as complete can not be modified.
:::


#### Copy

This method is used to copy the cart. This is useful when you want to create a new cart with the same items as the current cart. 


```typescript
const myCartId = 'xxxx-xxx-xxx-xxx-xxx-xx';
const newCartId = await geinsOMS.cart.copy({id: myCartId, resetPromotions: true});
```

Read JSdoc for more information on the `copy` method.

::: tip :bulb: Tip
Use this method in combination with `merchant data` to add features like `share cart as wishlist` to your application.
:::
