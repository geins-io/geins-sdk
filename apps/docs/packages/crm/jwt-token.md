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
