# @geins/crm

## Introduction

The `@geins/crm` package provides functionalities for a logged-in user experience. It includes features such as authentication, user registration, forgot password, user profile management, and order status and history.

The package also allows users to get specific content from the `@geins/cms` and get special promotions or pricelists fron the `@geins/pim` package.

## Overview

The `@geins/crm` package allows you to add logged-in user functionalities to your application. It includes the following features:

- [Authentication](./authentication)
- [Registration / Sign Up](./registration)
- [Password management](./password)
- [User management](./user/index.md)
  - [Profile](./user/profile.md)
  - [Balance](./user/balance.md)
  - [Order history](./user/transactions.md)
- [JWT token that attaches to the request headers for API calls](./jwt-token)

## Setting Up @geins/crm

### Prerequisites

- `@geins/core` package linked in the workspace.

### Installation

::: code-group

```sh [npm]
$ npm add -D @geins/crm
```

```sh [pnpm]
$ pnpm add -D @geins/crm
```

```sh [yarn]
$ yarn add -D @geins/crm
```

```sh [bun]
$ bun add -D @geins/crm
```

:::

### Quick Start

```ts
import { GeinsCore } from '@geins/core';
import { GeinsCRM } from '@geins/crm';
import { AuthSettings, AuthClientConnectionModes } from '@geins/types';

const geinsCore = new GeinsCore({
  apiKey: 'your-api-key',
  accountName: 'your-account-name',
  environment: 'production', // or 'QA'
});

const authSettings: AuthSettings = {
  clientConnectionMode: AuthClientConnectionModes.Direct, // or AuthClientConnectionModes.Proxy
};

const geinsCRM = new GeinsCRM(geinsCore, authSettings);

// Example: Authenticating a user
crm.auth
  .login('user@example.com', 'userpassword')
  .then((user) => console.log('Logged in user:', user))
  .catch((error) => console.error('Login failed:', error));
```
