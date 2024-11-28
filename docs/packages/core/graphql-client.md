# GraphQLClient

The `GraphQLClient` allows you to execute custom GraphQL queries and mutations, giving you the flexibility to fetch and manipulate data as needed.

## Quick Start

```typescript
import { GeinsCore, gql } from '@geins/core';

const geinsCore = new GeinsCore(geinsSettings);
const graphqlClient = geinsCore.graphql;

const MY_PLP_QUERY = gql`
  query MyProductList($skip: Int, $take: Int) {
    products(skip: $skip, take: $take) {
      count
      products {
        productId
        name
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

const myProductList = await graphqlClient.runQuery<
  { products: GeinsProductsResultTypeType },
  { skip: number; take: number }
>(MY_PLP_QUERY, { skip: 0, take: 80 });
```

## Overview

- **`GeinsCore`**: The central class of the Geins SDK, used to configure and access various services.
- **`GraphQLClient`**: A class exposed through `GeinsCore` that allows you to execute custom GraphQL queries and mutations against the Geins API.
- **`gql`**: A function exposed through `@geins/core` used to parse GraphQL queries and mutations.
- **`@geins/types`**: A package that exports TypeScript types generated from the Geins GraphQL schema, providing type definitions for the API.

By using the `GraphQLClient` and types from `@geins/types`, you can interact with the Geins API in a flexible and type-safe manner, leveraging the power of GraphQL and TypeScript. Using the `GraphQLClient` will automatically handle authentication and spoofing for you.

## Accessing the `GraphQLClient`

Once you have an instance of `GeinsCore` (refer to the [initialization guide](#)), you can access the `GraphQLClient` through the `graphql` property.

    const graphqlClient = geinsCore.graphql;

The `GraphQLClient` provides two primary methods:

- `runQuery<TData, TVariables>(query, variables?, options?)`
- `runMutation<TData, TVariables>(mutation, variables?, options?)`

## Using TypeScript Types from `@geins/types`

The `@geins/types` package exports TypeScript interfaces and types generated from the Geins GraphQL schema. These types correspond to the data structures returned by the API and can be used to ensure type safety in your application.

### Installation

First, install the `@geins/types` package. Refer to the [installation guide](../types/) for detailed instructions.

### Importing Types

You can import the pre defined types and enums directly from `@geins/types`:

```typescript
import {
  GeinsProductTypeType,
  GeinsProductsResultTypeType,
  ProductListFilterType,
  ProductListSortType,
} from '@geins/types';
```

- **`GeinsProductTypeType`**: Represents the product data structure.
- **`GeinsProductsResultTypeType`**: Represents the result type of the products query.

> **Note**: The `TypeType` suffix is abit of a misnomer, but it's used to avoid naming conflicts with existing types.

## Options for `query` and `mutation` Methods

The option interfaces and types for the `query` and `mutation` methods is as follows:

```typescript
interface GraphQLQueryOptions {
  query?: DocumentNode | undefined;
  queryAsString?: string | undefined;
  variables?: any;
  requestOptions?: RequestOptions;
}

interface RequestOptions {
  fetchPolicy?: FetchPolicyOptions;
  pollInterval?: number;
  context?: any;
  [key: string]: any;
}

enum FetchPolicyOptions {
  CACHE_FIRST = 'cache-first',
  NETWORK_ONLY = 'network-only',
  CACHE_ONLY = 'cache-only',
  NO_CACHE = 'no-cache',
  STANDBY = 'standby',
}
```

All exposed through `@geins/core`.

## Running GraphQL Queries

### Method Signature

```typescript
  async query<T = any>(options: GraphQLQueryOptions): Promise<T | null>
```

- **`T`**: The expected shape of the response data.
- **`options`**: options for the query, including the query itself, variables, and additional settings.

### Example: Fetching Products

Let's fetch a list of products using a GraphQL query and utilize the types from `@geins/types`.

#### Import Necessary Modules

```typescript
import { gql } from '@geins/core';
import { GeinsProductTypeType, GeinsProductsResultTypeType } from '@geins/types';
```

#### Define the GraphQL Query

```typescript
const GET_PRODUCTS_QUERY = gql`
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
    const options = {
      query: GET_PRODUCTS_QUERY,
      variables: { skip: 0, take: 10 },
    };
    const data = await geinsCore.graphql.query<GeinsProductsResultTypeType>(options);
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
- We specify the variables type inline `{ skip: number; take: number }` if we want we can define it as a type.

## Running GraphQL Mutations

Running mutations is similar to running queries but involves modifying data in Geins.

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
const ADD_TO_CART_MUTATION = gql`
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
    >(ADD_TO_CART_MUTATION, { cartId, item });

    if (data && data.addToCart) {
      console.log('Cart ID:', data.addToCart.id);
      data.addToCart.items?.forEach(cartItem => {
        console.log('Product:', cartItem.product?.name);
        console.log('Quantity:', cartItem.quantity);
      });
      console.log('Total:', data.addToCart.summary?.total?.sellingPriceIncVatFormatted);
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

> **Note**: The `TypeType` suffix is abit of a misnomer, but it's used to avoid naming conflicts with existing types.

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

You can get the available fetch policies by importing the enum `FetchPolicyOptions` from `@geins/core`.

```typescript
export enum FetchPolicyOptions {
  CACHE_FIRST = 'cache-first',
  NETWORK_ONLY = 'network-only',
  CACHE_ONLY = 'cache-only',
  NO_CACHE = 'no-cache',
  STANDBY = 'standby',
}
```

FetchPolicyOptions are:

- **`cache-first`**: Fetch from the cache first, then the network if the cache is empty.
- **`network-only`**: Fetch from the network only.
- **`cache-only`**: Fetch from the cache only.
- **`no-cache`**: Bypass the cache and fetch from the network.
- **`standby`**: Do not fetch from the cache or network.

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
      data.brands.forEach(brand => {
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
