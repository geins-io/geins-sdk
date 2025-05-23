---
title: Quickstart
description: How to get started with the Geins SDK
tags:
  - sdk
  - quickstart  
  - installation
---

# Quick start

Jump right in with the following commands:

## Install @geins/core

Run the following command to install the [core](./../packages/core/) package:

::: code-group

```sh [npm]
$ npm i @geins/core --save @geins/types --save-dev
```

```sh [pnpm]
$ pnpm add @geins/core --save-dev:@geins/types
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
  environment: 'prod', // or 'dev', 'qa'
};

const geinsCore = new GeinsCore(geinsSettings);
```

## Try it out

### Example: Fetching a Channel

```typescript
const currentChannel = await geinsCore.channel.current();
if (currentChannel) {
  console.log('Channel Details:', currentChannel);
} else {
  console.error('No channel found.');
}
```


### Example: Fetching a Menu from the CMS Package

The following example demonstrates how to fetch a menu and iterate through its items:

```typescript
const geinsCMS = new GeinsCMS(geinsCore);
const menu = await geinsCMS.menu.getMenu('main-menu');

if (menu) {
  menu.items.forEach(item => {
    console.log(`Menu Item: ${item.name}, Link: ${item.link}`);
    if (item.children && item.children.length > 0) {
      console.log('Sub-items:');
      item.children.forEach(subItem => {
        console.log(`  - ${subItem.name}, Link: ${subItem.link}`);
      });
    }
  });
} else {
  console.error('Menu not found.');
}
```


### Example: Getting a List of Brands with a GraphQL Query

Now that you have an instance of `GeinsCore`, you can access its core functionalities. Let's start getting some data from the API:

```typescript
interface BrandList {
  brands: {
    brandId: number;
    name: string;
  }[];
}

const BRANDS_QUERY = gql`
  query Brands {
    brands {
      brandId
      name
    }
  }
`;

const data = await geinsCore.graphql.query<BrandList>({ query: BRANDS_QUERY });
if (data) {
  data.brands.forEach(brand => {
    console.log(brand);
  });
}
```




And you're all set! You can now start building your application with Geins.

