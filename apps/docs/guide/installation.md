---
title: Installation
description: How to install the Geins SDK
tags:
  - sdk
  - installation  
  - quickstart
---

# Installation

The Geins SDK is modular, allowing you to install only the packages you need. Each package in the SDK serves a specific purpose, such as managing customers, products, or content.

## Prerequisites

- **Node.js**: Ensure you have Node.js version 20 or higher.
- **Package Manager**: Use either `npm`, `yarn`, `pnpm`, or `bun` to install the SDK packages.

## Installing Core and Types

The `@geins/core` package is the foundational module of the SDK. All other packages depend on it, so it should be installed first.

::: code-group

```sh [npm]
$ npm install @geins/core @geins/types --save
```

```sh [pnpm]
$ pnpm add @geins/core @geins/types
```

```sh [yarn]
$ yarn add @geins/core @geins/types
```

```sh [bun]
$ bun add @geins/core @geins/types
```

:::

## Installing Additional Packages

Depending on your application’s needs, you can add the following packages:

- `@geins/cms`: For content management (pages, menus, and widgets).
- `@geins/crm`: For customer relationship management (user profiles, authentication, and transactions).

To install additional packages:

::: code-group

```sh [npm]
$ npm install @geins/cms @geins/crm
```

```sh [pnpm]
$ pnpm add @geins/cms @geins/crm
```

```sh [yarn]
$ yarn add @geins/cms @geins/crm
```

```sh [bun]
$ bun add @geins/cms @geins/crm
```

:::

## Setting Up Your Project

Once the required packages are installed, configure the `GeinsCore` instance with your settings:

```typescript
import { GeinsCore } from '@geins/core';

const geinsSettings = {
  apiKey: 'your-api-key',
  accountName: 'your-account-name',
  channel: 'your-channel-id',
  tld: 'your-top-level-domain',
  locale: 'your-locale',
  market: 'your-market',
};

const geinsCore = new GeinsCore(geinsSettings);
```

This instance is the entry point for other Geins SDK modules, enabling seamless communication.

## Verifying Your Setup

After setting up `GeinsCore`, verify the installation by making a test API call:

```typescript
geinsCore.channel
  .current()
  .then((channel) => {
    console.log('Current channel:', channel);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
```

This example retrieves the current channel settings and logs them, confirming that the core instance and API settings are correct.

---

You’re now ready to build with the Geins SDK! For further details, refer to the module-specific guides.
