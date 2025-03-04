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
const options = {
  query: MY_PLP_QUERY,
  variables: { skip: 0, take: 10 },
};
const myProductList = await graphqlClient.Query<MyProductListType>(options);
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

- `query<T>(options)`
- `mutation<T>(options)`

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

### `GraphQLQueryOptions`

- **`query`**: The GraphQL query document node.
- **`queryAsString`**: The GraphQL query as a string.
- **`variables`**: An object containing variables for the query or mutation.
- **`requestOptions`**: Additional settings for the request.

Use `query` or `queryAsString` to specify the GraphQL query. You can pass variables as an object to the `variables` property. Variables set in `GeinsSettings` will be automatically added to the query (see below). Additional settings can be passed in the `requestOptions` object.

All exposed through `@geins/core`.

## Benefits of Using the `GraphQLClient`

### Automatic Adding of Headers

The `GraphQLClient` automatically adds the necessary headers for user authentication and spoofing, simplifying the process of interacting with the Geins API.

### Automatic Adding variables to the query

The `GraphQLClient` automatically adds the variables that are set in GeinsSettings to the query.

```typescript
const geinsSettings: GeinsSettings = {
  apiKey: process.env.GEINS_API_KEY || '',
  accountName: process.env.GEINS_ACCOUNT_NAME || '',
  channel: process.env.GEINS_CHANNEL || '',
  tld: process.env.GEINS_TLD || '',
  locale: process.env.GEINS_LOCALE || '',
  market: process.env.GEINS_MARKET || '',
  environment: 'qa',
};
const geinsCore = new GeinsCore(geinsSettings);
```

Ofcourse you can override these variables by setting them in the options object like so:

```typescript
const options = {
  query: MY_QUERY,
  variables: { market: 'us', locale: 'en-US' },
};
```

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
    const itemToAdd: GeinsCartItemInputTypeType = {
      skuId: 12345,
      quantity: 1,
    };
    const options: GraphQLQueryOptions = {
      mutation: ADD_TO_CART_MUTATION,
      variables: { cartId, item: itemToAdd },
    };

    const data = await geinsCore.graphql.mutation<GeinsCartTypeType>(options);
    if (data && data.addToCart) {
      console.log('Cart Id:', data.addToCart.id);
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
  // ... Query or Mutation
} catch (error) {
  console.error('An error occurred:', error);
}
```

### Debugging Requests

If the enviroment **is not** set to production (`prod`) you can set the property `log_to_console` to `true` to log the full options object to the console. This can be done globally on the `GeinsCore` object or per request.

```typescript
// setting globally
const geinsCore = new GeinsCore(geinsSettings);
geinsCore.graphql.log_to_console = true;

// setting for one request
const options: GraphQLQueryOptions = {
  query: MY_QUERY,
  variables: { skip: 0, take: 10 },
  requestOptions: {
    log_to_console: true,
  },
};
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
const options: GraphQLQueryOptions = {
  query: MY_QUERY,
  variables: { skip: 0, take: 10 },
  requestOptions: {
    fetchPolicy: FetchPolicyOptions.NETWORK_ONLY,
  },
};
const data = await geinsCore.graphql.query<MyType>(options);
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

For more information on available queries and mutations, refer to the [Geins API Documentation](https://docs.geins.io/).
