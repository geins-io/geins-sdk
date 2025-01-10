
# Cart Items

## Overview

The `Cart` in the `@geins/oms` package allows you to manage items in a shopping cart. This document covers the following topics:

- [Types](#types)
- [Adding item](#adding-items)
- [Adding Bundle and selections](#adding-packages)
- [Updating Items](#updating-items)
- [Removing Items](#removing-items)
- [Getting Items](#getting-items)
- [Clearing all items](#getting-item-details)

## Types

The following types for managing cart items:
```typescript [@geins/types]
type CartItemType = {
    id?: string;
    groupKey?: string;
    type?: ItemType;
    title?: string;
    product?: ProductType;
    skuId?: number;
    quantity: number;
    campaign?: CampaignType;
    productPackage?: ProductPackageCartItemType;
    productPackageCartItems?: CartItemType[];
    message?: string;
    totalPrice?: PriceType;
    unitPrice?: PriceType;
};

declare enum ItemType {
    PRODUCT = "PRODUCT",
    PACKAGE = "PACKAGE"
}

type ProductPackageSelectionType = {
    groupId: number;
    optionId: number;
    skuId: number;
};

type ProductPackageCartItemType = {
    packageId: number;
    packageName: string;
    groupId: number;
    optionId: number;
};
```

## Adding Items

Adding an item to the cart is done using the `add` method. A `Cart` will be created if there isnt one already. In its simplest form, you can add an item by providing the `skuId` of the product you want to add to the cart.

Example:
```typescript
// add item with id 1234 to cart
await geinsOMS.cart.items.add({ skuId: 1234 });
```

See JSdoc for more details on the `add` method.

### Adding a Product 

There is a few features that will help you with some common use cases when adding items to the cart. For example, you can add a product with a specific quantity, or you can add a product with a message.

Example:
```typescript
// add item with id 1234 to cart with quantity 2
await geinsOMS.cart.items.add({ skuId: 1234, quantity: 2 });

// add item with id 1234 to cart with a message
await geinsOMS.cart.items.add({ skuId: 1234, message: "This is a message" });
```

### Adding a Product Package with Selections

Adding a product package to the cart is similar to adding a product. You can add a product package with a specific quantity, or you can add a product package with a message.


## Updating Items


## Removing Items

## Getting Items

## Clearing all items
