---
title: Authentication
description: How to work with authentication in the Geins CRM Package
tags:
  - sdk
  - crm
  - authentication
  - login
  - logout
  - user-token
  - refresh-token
  - user-max-age
  - user-type
  - user-username
  - user-password  
  - user-email
  - user-newsletter
  - user-customer-type
  - user-create
  - user-authorized
  - user-refresh
---
  
# Authentication

Once a user is authenticated, the `@geins/crm` package provides a JWT token that attaches to the request headers for API calls. This tokens validation depends on the remeber me option. If the user selects the remember me option, the token will be valid for 30 days. Otherwise, the token will be valid for 1 hour.

### User Login

To log in a user:

```typescript
const credentials = {
  username: 'user@example.com',
  password: 'password123',
  rememberUser: true, // Set to true for extended session
};

const loginResult = await geinsCRM.auth.login(credentials);

if (loginResult?.succeeded) {
  console.log('Login successful');
  // Handle successful login (e.g., redirect to dashboard)
} else {
  console.error('Login failed');
  // Handle login failure
}
```

### User Logout

To log out a user:

```typescript
await geinsCRM.auth.logout();
console.log('User logged out');
```

### Token Refresh

To refresh the authentication token:

```typescript
const refreshResult = await geinsCRM.auth.refresh();

if (refreshResult?.succeeded) {
  console.log('Token refreshed successfully');
} else {
  console.error('Token refresh failed');
  // Handle refresh failure (e.g., redirect to login page)
}
```

### Register New User

To register a new user:

```typescript
const newUserCredentials = {
  username: 'newuser@example.com',
  password: 'password123',
};

const userInfo = {
  newsletter: false,
  customerType: GeinsCustomerType.PersonType,
};

const registerResult = await geinsCRM.user.create(newUserCredentials, userInfo);

if (registerResult?.succeeded) {
  console.log('User registered successfully');
} else {
  console.error('Failed to register user');
}
```

### Check Authorization

To check if the current user is authorized:

```typescript
const isAuthorized = await geinsCRM.auth.authorized();

if (isAuthorized) {
  console.log('User is authorized');
} else {
  console.log('User is not authorized');
}
```

## Refresh token

The GeinsCRM class automatically manages authentication tokens using cookies. After successful login or token refresh, the necessary cookies are set. You don't need to manually handle token storage in most cases.

## User token

The user token is used to authenticate the user and is stored in the user's browser cookies. It is used to authenticate the user when the user is logged in through the and in all calls to the Merchant API.

## Example

Here's an example of error handling in authentication:

```typescript
try {
  const loginResult = await geinsCRM.auth.login(credentials);
  // Handle result
} catch (error) {
  console.error('Authentication error:', error);
  // Handle error (e.g., show error message to user)
}
```

Remember to handle authentication failures gracefully in your application, such as redirecting to a login page or showing appropriate error messages to the user.

## Cookie Overview

The `@geins/crm` package uses cookies to store the JWT token. The package uses the `js-cookie` package to manage cookies. The following cookies are used:
| Name | Value |
|------------|-------------|
| geins-user | username |
| geins-auth | jwt token to use with the merchant api |
| geins-user-type | type of user |
| geins-auth-refresh-token | refresh-token used by auth api |
| geins-user-maxage | max age of cookies |
