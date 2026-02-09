---
title: CRM Package
description: How to work with the Geins CRM Package
tags:
  - sdk
  - crm
---

# @geins/crm

## Introduction

The `@geins/crm` package provides functionalities for a logged-in user experience. It includes features such as authentication, user registration, forgot password, user profile management, and order status and history.

## Overview

The `@geins/crm` package allows you to add logged-in user functionalities to your application. It includes the following features:

- [Authentication](./authentication)
- [Registration / Sign Up](./registration)
- [Password management](./password)
- [User management](./user/index.md)
  - [Profile](./user/profile.md)
  - [Balance](./user/balance.md)
  - [Order history](./user/transactions.md)

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

## Quick Start

### Server-Side (Stateless)

The core `GeinsCRM` is fully stateless — no stored tokens, no cookies. All auth and user state flows through method parameters.

```ts
import { GeinsCore } from '@geins/core';
import { GeinsCRM } from '@geins/crm';

const geinsCore = new GeinsCore({
  apiKey: 'your-api-key',
  accountName: 'your-account-name',
  environment: 'production',
});

const authSettings = {
  clientConnectionMode: 'Direct',
};

const geinsCRM = new GeinsCRM(geinsCore, authSettings);

// Login — returns tokens, no side effects
const loginResult = await geinsCRM.auth.login({
  username: 'user@example.com',
  password: 'userpassword',
});

if (loginResult?.succeeded) {
  const userToken = loginResult.tokens!.token!;
  const refreshToken = loginResult.tokens!.refreshToken!;

  // All user operations require explicit token
  const user = await geinsCRM.user.get(userToken);
  console.log('User:', user?.email);

  // Refresh requires explicit refreshToken
  const refreshResult = await geinsCRM.auth.refresh(refreshToken);
}
```

### Client-Side (Session Layer)

For browser apps, the `CrmSession` wrapper manages tokens in cookies:

```ts
import { GeinsCore } from '@geins/core';
import { GeinsCRM, CrmSession } from '@geins/crm';

const geinsCore = new GeinsCore(mySettings);
const geinsCRM = new GeinsCRM(geinsCore, authSettings);

const session = new CrmSession(geinsCRM);

// Login — stores tokens in cookies automatically
await session.login({ username: 'user@example.com', password: 'pass' });

// Uses stored token — no explicit token needed
const user = await session.getUser();

// Refresh — uses stored refreshToken
await session.refresh();

// Logout — clears all cookies and tokens
session.logout();
```

## Architecture

```
Stateless Core (server-safe)
├── GeinsCRM.auth  — login, logout, refresh(token), getUser(token), authorized(token)
└── GeinsCRM.user  — get(token), update(user, token), create(creds), remove(token)

Session Layer (browser convenience)
└── CrmSession     — cookie persistence, token management
```

The stateless core holds **no per-request state** — it's safe to share as a singleton across concurrent requests. Tokens (userToken, refreshToken) must be passed explicitly to every method. The session layer is intended for browser-side use only.
