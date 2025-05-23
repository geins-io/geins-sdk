---
title: JWT Token
description: How to work with the JWT Token in the Geins CRM Package
tags:
  - sdk
  - crm
  - jwt-token
  - user-token
  - refresh-token
  - user-max-age
  - user-type
  - user-username
  - user-password
  - user-email
---

# User Token

## Usage

When a user is logged in, the user token is used to authenticate the user. The token is used to make requests to the Merchant API. Token is automaticly sent in header if it is present. This allows the merchant API to give back responses that are specific to the user.

### Responses that are specific to the user

- User specific promotions
- User specific pricelists
- User specific content

## Get Token

To retrieve the current user token:

```typescript
const tokenResult = await geinsCRM.auth.token();
```

## Refresh Token

To refresh the current user token:

```typescript
const tokenResult = await geinsCRM.auth.refreshToken();
```
