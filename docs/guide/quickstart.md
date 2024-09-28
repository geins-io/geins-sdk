# Quick start

Jump right in with the following commands:

## Install @geins/core

Run the following command to install the [core](./../packages/core/) package:

::: code-group

```sh [npm]
$ npm i @geins/core --save @geins/types --save-dev
```

```sh [pnpm]
$ $ pnpm add @geins/core --save-dev:@geins/types
```

```sh [yarn]
$ yarn add @geins/core --dev @geins/types
```

```sh [bun]
$ bun add @geins/core @geins/types --dev
```

:::

## Setting up

```typescript
import { GeinsCore, gql } from '@geins/core';
import type { GeinsBrandListTypeType } from '@geins/types';

const geinsSettings = {
  apiKey: 'your-api-key',
  accountName: 'your-account-name',
  channel: 'your-channel-id',
  tld: 'your-tld',
  locale: 'your-locale',
  market: 'your-market',
  environment: 'production', // or 'staging', 'development'
};

const geinsCore = new GeinsCore(geinsSettings);
```

## Try it out

Now that you have an instance of `GeinsCore`, you can access its core functionalities. Let's start getting some data from the API:

```typescript
const BRANDS_QUERY = gql`
  query Brands {
    brands {
      brandId
      name
      description
    }
  }
`;

const data = await geinsCore.graphql.runQuery<{
  brands: GeinsBrandListTypeType[];
}>(BRANDS_QUERY);

if (data) {
  data.brands.forEach((brand) => {
    console.log('Brand ID:', brand.brandId);
    console.log('Name:', brand.name);
    console.log('Description:', brand.description);
  });
}
```

And you're all set! You can now start building your application with Geins.
