# Using the `GraphQLClient` from `GeinsCore`

The `GeinsCore` class is the main entry point of the Geins SDK, providing essential functionalities to interact with the Geins API. One of the powerful features it exposes is the `GraphQLClient`, accessible via the `graphql` property. The `GraphQLClient` allows you to execute custom GraphQL queries and mutations, giving you the flexibility to fetch and manipulate data as needed.

This article will guide you through the process of using the `GraphQLClient` provided by `GeinsCore`, including examples of running queries and mutations. We'll also demonstrate how to use the TypeScript types exported by the `@geins/types` package to ensure type safety in your applications.

## Table of Contents

- [Overview](#overview)
- [Accessing the `GraphQLClient`](#accessing-the-graphqlclient)
- [Using TypeScript Types from `@geins/types`](#using-typescript-types)
- [Running GraphQL Queries](#running-graphql-queries)
  - [Example: Fetching Products](#example-fetching-products)
- [Running GraphQL Mutations](#running-graphql-mutations)
  - [Example: Adding a Product to Cart](#example-adding-a-product-to-cart)
- [Handling Responses and Errors](#handling-responses-and-errors)
- [Setting Fetch Policies](#setting-fetch-policies)
- [Additional Tips](#additional-tips)
- [Conclusion](#conclusion)
- [Complete Example: Fetching Brands](#complete-example-fetching-brands)
- [Final Notes](#final-notes)

## Overview

- **`GeinsCore`**: The central class of the Geins SDK, used to configure and access various services.
- **`GraphQLClient`**: A class exposed through `GeinsCore` that allows you to execute custom GraphQL queries and mutations against the Geins API.
- **`gql`**: A function exposed through `@geins/core` used to parse GraphQL queries and mutations.
- **`@geins/types`**: A package that exports TypeScript types generated from the Geins GraphQL schema, providing type definitions for the API.

By using the `GraphQLClient` and types from `@geins/types`, you can interact with the Geins API in a flexible and type-safe manner, leveraging the power of GraphQL and TypeScript.

## Accessing the `GraphQLClient`

Once you have an instance of `GeinsCore` (refer to the [initialization guide](#)), you can access the `GraphQLClient` through the `graphql` property.

    const graphqlClient = geinsCore.graphql;

The `GraphQLClient` provides two primary methods:

- `runQuery<TData, TVariables>(query, variables?, options?)`
- `runMutation<TData, TVariables>(mutation, variables?, options?)`

## Using TypeScript Types from `@geins/types`

The `@geins/types` package exports TypeScript interfaces and types generated from the Geins GraphQL schema. These types correspond to the data structures returned by the API and can be used to ensure type safety in your application.

### Installation

First, install the `@geins/types` refer to the [installation guide](/types).

### Importing Types

You can import the necessary types directly from `@geins/types`:

```typescript
import {
  GeinsProductTypeType,
  GeinsProductsResultTypeType,
} from '@geins/types';
```

- **`GeinsProductTypeType`**: Represents the product data structure.
- **`GeinsProductsResultTypeType`**: Represents the result type of the products query.

## Running GraphQL Queries

### Method Signature

```typescript

    runQuery<TData, TVariables>(
          query: DocumentNode,
          variables?: TVariables,
          options?: {
            fetchPolicy?: FetchPolicy;
            [key: string]: any;
          }
        ): Promise<TData | null>;
```

- **`TData`**: The expected shape of the response data.
- **`TVariables`**: The shape of the variables object for the query.
- **`query`**: The GraphQL query, written using `gql`.
- **`variables`**: An optional object containing variables for the query.
- **`options`**: Optional settings, such as `fetchPolicy`.

### Example: Fetching Products

Let's fetch a list of products using a GraphQL query and utilize the types from `@geins/types`.

#### Import Necessary Modules

```typescript
import { gql } from '@geins/core';
import {
  GeinsProductTypeType,
  GeinsProductsResultTypeType,
} from '@geins/types';
```

#### Define the GraphQL Query

```typescript
const GET_PRODUCTS = gql`
  query GetProducts($skip: Int, $take: Int) {
    products(skip: $skip, take: $take) {
      count
      products {
        productId
        name
        alias
        unitPrice {
          sellingPriceIncVat
          sellingPriceIncVatFormatted
        }
        productImages {
          fileName
        }
        canonicalUrl
      }
    }
  }
`;
```

#### Execute the Query

```typescript
async function fetchProducts() {
  try {
    const data = await geinsCore.graphql.runQuery<
      { products: GeinsProductsResultTypeType },
      { skip: number; take: number }
    >(GET_PRODUCTS, { skip: 0, take: 10 });

    if (data) {
      console.log('Total Products:', data.products.count);
      data.products.products?.forEach((product: GeinsProductTypeType) => {
        console.log('Product:', product.name);
        console.log('Price:', product.unitPrice?.sellingPriceIncVatFormatted);
      });
    } else {
      console.error('No data returned from query.');
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

fetchProducts();
```

In this example:

- We import types from `@geins/types` to ensure type safety.
- We use `GeinsProductsResultTypeType` for the response data type.
- We specify the variables type inline `{ skip: number; take: number }`.

## Running GraphQL Mutations

### Method Signature

```typescript
    runMutation<TData, TVariables>(
          mutation: DocumentNode,
          variables?: TVariables,
          options?: {
            fetchPolicy?: FetchPolicy;
            [key: string]: any;
          }
        ): Promise<TData | null>;
```

- **`TData`**: The expected shape of the response data.
- **`TVariables`**: The shape of the variables object for the mutation.
- **`mutation`**: The GraphQL mutation, written using `gql`.
- **`variables`**: An optional object containing variables for the mutation.
- **`options`**: Optional settings, such as `fetchPolicy`.

### Example: Adding a Product to Cart

Let's add a product to the cart using a GraphQL mutation and types from `@geins/types`.

#### Import Necessary Modules

```typescript
import { gql } from '@geins/core';
import { GeinsCartTypeType, GeinsCartItemInputTypeType } from '@geins/types';
```

#### Define the GraphQL Mutation

```typescript
const ADD_TO_CART = gql`
  mutation AddToCart($cartId: String!, $item: CartItemInputType!) {
    addToCart(id: $cartId, item: $item) {
      id
      items {
        id
        product {
          productId
          name
        }
        quantity
      }
      summary {
        total {
          sellingPriceIncVatFormatted
        }
      }
    }
  }
`;
```

#### Execute the Mutation

```typescript
async function addToCart() {
  try {
    const cartId = 'your-cart-id';
    const item: GeinsCartItemInputTypeType = {
      skuId: 12345,
      quantity: 1,
    };

    const data = await geinsCore.graphql.runMutation<
      { addToCart: GeinsCartTypeType },
      { cartId: string; item: GeinsCartItemInputTypeType }
    >(ADD_TO_CART, { cartId, item });

    if (data && data.addToCart) {
      console.log('Cart ID:', data.addToCart.id);
      data.addToCart.items?.forEach((cartItem) => {
        console.log('Product:', cartItem.product?.name);
        console.log('Quantity:', cartItem.quantity);
      });
      console.log(
        'Total:',
        data.addToCart.summary?.total?.sellingPriceIncVatFormatted,
      );
    } else {
      console.error('No data returned from mutation.');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
}

addToCart();
```

In this example:

- We use `GeinsCartTypeType` for the response data type.
- We use `GeinsCartItemInputTypeType` from `@geins/types` for the variables type.

## Handling Responses and Errors

- **Successful Response**: The `data` variable contains the result of the query or mutation.
- **No Data**: If no data is returned, the method resolves to `null`. Handle this case in your code.
- **Errors**: Any errors during execution are caught in the `catch` block. Always include error handling to manage exceptions.

```typescript
try {
  // ... runQuery or runMutation
} catch (error) {
  console.error('An error occurred:', error);
}
```

## Setting Fetch Policies

Fetch policies determine how the cache interacts with your GraphQL operations. You can set a global default when initializing `GeinsCore` or override it per request.

### Per Request Fetch Policy

```typescript
const data = await geinsCore.graphql.runQuery<
  { products: GeinsProductsResultTypeType },
  { skip: number; take: number }
>(
  GET_PRODUCTS,
  { skip: 0, take: 10 },
  { fetchPolicy: 'cache-and-network' }, // Overrides the global fetchPolicy
);
```

## Additional Tips

- **Type Safety**: Use the TypeScript interfaces and types exported by `@geins/types` to ensure type safety and leverage IntelliSense in your IDE.
- **GraphQL Variables**: Use variables in your queries and mutations to make them dynamic and reusable.
- **IDE Support**: Install GraphQL plugins for your IDE to get syntax highlighting and validation inside `gql` tagged templates.
  - For VSCode: [GraphQL extension](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql)
- **Importing `gql`**: You can import `gql` directly from `@geins/core`:

      import { gql } from '@geins/core';

## Conclusion

The `GraphQLClient` exposed through `GeinsCore` empowers you to execute custom GraphQL queries and mutations against the Geins API with ease. By leveraging TypeScript and GraphQL, along with the types from `@geins/types`, you can build robust applications with precise control over the data you fetch and manipulate.

Remember to handle possible `null` responses and errors appropriately, and consider setting `fetchPolicy` options based on your caching and data-fetching needs.

For more information on available queries and mutations, refer to the [Geins API Documentation](https://docs.geins.io/).

## Complete Example: Fetching Brands

As an additional example, here's how you can fetch brands using the `GraphQLClient` and types from `@geins/types`.

### Import Necessary Modules

```typescript
import { gql } from '@geins/core';
import { GeinsBrandListTypeType } from '@geins/types';
```

### Define the GraphQL Query

```typescript
const BRANDS_QUERY = gql`
  query Brands {
    brands {
      brandId
      name
      description
      logo
      canonicalUrl
    }
  }
`;
```

### Execute the Query

```typescript
async function fetchBrands() {
  try {
    const data = await geinsCore.graphql.runQuery<{
      brands: GeinsBrandListTypeType[];
    }>(BRANDS_QUERY);

    if (data) {
      data.brands.forEach((brand) => {
        console.log('Brand ID:', brand.brandId);
        console.log('Name:', brand.name);
        console.log('Description:', brand.description);
        console.log('Logo URL:', brand.logo);
        console.log('Canonical URL:', brand.canonicalUrl);
      });
    } else {
      console.error('No data returned from query.');
    }
  } catch (error) {
    console.error('Error fetching brands:', error);
  }
}

fetchBrands();
```

In this example:

- We import `GeinsBrandListTypeType` from `@geins/types`.
- We use the type in the response data to ensure type safety.

## Final Notes

- **Custom Operations**: You can use the `GraphQLClient` to execute any custom GraphQL operation supported by the Geins API.
- **Extensibility**: The flexibility of the `GraphQLClient` allows you to build complex data-fetching logic tailored to your application's needs.
- **TypeScript Types**: Utilize the types exported by `@geins/types` to enhance type safety and reduce boilerplate code.

Happy coding!

By following this guide, you should now be able to effectively use the `GraphQLClient` provided by `GeinsCore` to interact with the Geins API. Remember to import and use the types from `@geins/types` to ensure type safety and improve your development experience.
