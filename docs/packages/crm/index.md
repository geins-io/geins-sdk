# @geins/crm Documentation

## Introduction

The `@geins/crm` package provides functionalities for a logged-in user experience. It includes features such as authentication, user registration, forgot password, user profile management, and order status and history.

The package also allows users to get specific content from the `@geins/cms` and get special promotions or pricelists fron the `@geins/pim` package.

## Overview

The `@geins/crm` package allows you to add logged-in user functionalities to your application. It includes the following features:

- [Authentication](./authentication)
- [Registration / Sign Up](./registration)
- [Profile](./user)
- [Balance](./user-balance)
- [Order history](./user-order-history)
- [Password management](./password)
- [JWT token that attaches to the request headers for API calls](./jwt)

## Setting Up @geins/crm

### Prerequisites

- `@geins/core` package linked in the workspace.

### Installation

```bash
yarn add @geins/crm
```

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
  .then(user => console.log('Logged in user:', user))
  .catch(error => console.error('Login failed:', error));
```
