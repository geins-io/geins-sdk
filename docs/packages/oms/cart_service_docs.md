# CartService Documentation

The `CartService` in the Geins SDK Order Management System (OMS) package provides developers with tools to manage shopping carts efficiently. It allows for adding, updating, and removing items, setting promotional codes, and managing other cart-related data.

## Overview

The `CartService` handles the following functionalities:

- **Cart Creation**: Initialize a new shopping cart.
- **Item Management**: Add, update, or remove items from the cart.
- **Promotion Codes**: Apply and manage promotion codes.
- **Shipping Fees**: Configure shipping-related details.
- **Merchant Data**: Add custom merchant-specific data.

This service integrates seamlessly with other OMS modules, providing a robust solution for managing customer carts in e-commerce applications.

## Features

### Key Features

- **Dynamic Cart Management**: Allows the addition and removal of items dynamically.
- **Multi-Channel Support**: Works across multiple channels with localized configurations.
- **Promotion Handling**: Supports applying and removing promotional codes.
- **Custom Extensions**: Flexible options for merchant-specific data and shipping adjustments.

## Usage

### Initialization

Before using `CartService`, ensure that the `GeinsCore` instance is correctly configured:

```typescript
import { GeinsCore, GeinsOMS } from '@geins/core';

const geinsCore = new GeinsCore({
  apiKey: 'your-api-key',
  accountName: 'your-account-name',
  channel: 'your-channel-id',
  locale: 'your-locale',
  market: 'your-market',
});

const geinsOMS = new GeinsOMS(geinsCore);
const cartService = geinsOMS.cart;
```

### Adding an Item to the Cart

Use the `addItem` method to add an item to a cart:

```typescript
const cartId = 'existing-cart-id';
const cartItem = {
  skuId: 'sku-id',
  quantity: 2,
};

await cartService.addItem(cartId, cartItem);
```

### Updating an Item

To update the quantity of an existing item:

```typescript
const updatedItem = {
  skuId: 'sku-id',
  quantity: 5,
};

await cartService.updateItem(cartId, updatedItem);
```

### Removing an Item

To remove an item from the cart:

```typescript
await cartService.removeItem(cartId, 'sku-id');
```

### Applying a Promotion Code

To apply a promotion code:

```typescript
await cartService.setPromotionCode(cartId, 'PROMO2025');
```

### Setting Merchant Data

Custom data can be added to the cart for merchant-specific requirements:

```typescript
const merchantData = {
  key: 'example-key',
  value: 'example-value',
};

await cartService.setMerchantData(cartId, merchantData);
```

### Fetching Cart Details

Retrieve the current state of a cart:

```typescript
const cart = await cartService.get(cartId);
console.log(cart);
```

### Completing a Cart

Mark the cart as completed to proceed with order processing:

```typescript
await cartService.complete(cartId);
```

## Error Handling

The `CartService` methods throw errors when invalid inputs are provided or when API calls fail. Use `try-catch` blocks to handle these errors:

```typescript
try {
  await cartService.addItem(cartId, cartItem);
} catch (error) {
  console.error('Failed to add item:', error);
}
```

## GraphQL Integration

`CartService` uses GraphQL queries and mutations for backend communication. Some notable queries/mutations include:

- **Query: `getCart`**
- **Mutation: `addToCart`**
- **Mutation: `updateCartItem`**
- **Mutation: `setPromotionCode`**
- **Mutation: `completeCart`**

Refer to the [Geins GraphQL Playground](https://merchantapi.geins.io/ui/playground) for more details.

## Conclusion

The `CartService` in the Geins OMS package offers a comprehensive API for managing shopping carts. Its modular design and GraphQL-based architecture ensure flexibility and scalability for modern e-commerce applications.
