# @geins/crm Documentation

## Introduction

The `@geins/crm` package provides functionalities related to the Customer Relationship Management (CRM) system. This package allows developers to authenticate users, manage user profiles, handle password resets, and perform other customer-related operations. It is designed to work seamlessly with the `@geins/core` package to interact with the Geins API.

## Overview

The `@geins/crm` package includes the following primary features:

- [Authentication](./authentication)
- User Registration
- Forgot Password
- User Profile Management
- Order History

## Setting Up @geins/crm

### Prerequisites

- `@geins/core` package linked in the workspace.
- Other dependencies installed as listed in the `package.json`.

### Installation

```bash
yarn add @geins/crm
```

### Basic Usage

```ts
import { GeinsCore } from '@geins/core';
import { GeinsCRM } from '@geins/crm';

const core = new GeinsCore({ apiKey: 'YOUR_API_KEY', accountName: 'YOUR_ACCOUNT_NAME' });
const crm = new GeinsCRM(core);

// Example: Authenticating a user
crm.auth
  .login('user@example.com', 'userpassword')
  .then(user => console.log('Logged in user:', user))
  .catch(error => console.error('Login failed:', error));
```

## Authentication

### Overview

The Authentication feature of `@geins/crm` allows you to log in users, handle logout, and manage sessions. It provides helper methods to integrate with the Geins API seamlessly.

### Usage

For more detailed usage and examples, please refer to the [Authentication Feature](./authentication.md).
