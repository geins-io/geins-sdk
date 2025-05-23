---
title: Cookies
description: How to work with cookies in the Geins Core Package
tags:
  - sdk
  - core
  - cookies
---

# Cookies

The `CookieService`, which offers a unified way to manage cookies within your application via the `GeinsCore` class.

## Overview

Through the `CookieService`, you can:

- Set cookies with custom options.
- Retrieve cookie values by name.
- Remove cookies when needed.
- Access all cookies at once.

## CookieService API via GeinsCore

### Accessing the CookieService

Once you have an instance of `GeinsCore` (refer to the [initialization guide](#initialization)), you can access the `CookieService` through the `cookies` property.

### Methods

#### set()

Sets a cookie with the specified name, value, and options.

```typescript
// Setting a cookie
geinsCore.cookies.set({
  name: 'session_id',
  payload: 'abc123',
  path: '/',
  domain: 'example.com',
  secure: true,
  httpOnly: true,
  maxAge: 86400, // 1 day in seconds
});
```

#### get()

Retrieves the value of a cookie by its name.

```typescript
// Getting a cookie
const sessionId = geinsCore.cookies.get('session_id');
```

#### remove()

Removes a cookie by its name.

```typescript
// Removing a cookie
geinsCore.cookies.remove('session_id');
```

#### getAll()

Retrieves all cookies as an object.

```typescript
// Getting all cookies
const allCookies = geinsCore.cookies.getAll();
```

### Configuration Options

When setting cookies, you can specify the following options:

- `name`: The name of the cookie.
- `payload`: The value to store in the cookie.
- `path`: The URL path for which the cookie is valid (default: `'/'`).
- `domain`: The domain for which the cookie is valid.
- `secure`: If true, the cookie is only sent over HTTPS.
- `httpOnly`: If true, the cookie is inaccessible to client-side scripts.
- `maxAge`: The maximum age of the cookie in seconds.

## Using the CookieService

### Setting a Cookie

```typescript
// Setting a cookie
geinsCore.cookies.set({
  name: 'user_token',
  payload: 'token123',
  secure: true,
  httpOnly: true,
  maxAge: 7200, // 2 hours
});
```

### Getting a Cookie

```typescript
// Getting a cookie
const userToken = geinsCore.cookies.get('user_token');
```

### Removing a Cookie

```typescript
// Removing a cookie
geinsCore.cookies.remove('user_token');
```

### Retrieving All Cookies

```typescript
// Getting all cookies
const cookies = geinsCore.cookies.getAll();
console.log(cookies);
```

## Integration with GeinsCore

The `CookieService` is tightly integrated with the `GeinsCore` class, ensuring that cookie management aligns with your application's overall configuration and state.

### Practical Examples

#### Example: Managing User Preferences

Set a cookie to store the user's theme preference:

```typescript
// Setting a preference cookie
geinsCore.cookies.set({
  name: 'theme',
  payload: 'dark',
  maxAge: 2592000, // 30 days
});
```

Retrieve the theme preference:

```typescript
// Getting the theme preference
const theme = geinsCore.cookies.get('theme');
```

#### Example: Handling Authentication Tokens

Set a secure, HTTP-only cookie for authentication:

```typescript
// Setting an authentication token
geinsCore.cookies.set({
  name: 'auth_token',
  payload: 'securetoken123',
  secure: true,
  httpOnly: true,
  maxAge: 3600, // 1 hour
});
```

Remove the authentication token upon logout:

```typescript
// Removing the authentication token
geinsCore.cookies.remove('auth_token');
```

## Additional Tips

- **Security:** Always use `secure: true` and `httpOnly: true` for cookies that contain sensitive information.
- **Expiration:** Use the `maxAge` option to control how long the cookie remains valid.
- **Consistency:** Access the `CookieService` through `GeinsCore` to maintain consistency with other services.

## Conclusion

The `CookieService` accessed via the `GeinsCore` class simplifies cookie management in your application. It abstracts the complexities of handling cookies in different environments and provides a consistent API for common operations.

## Final Notes

By integrating the `CookieService` through `GeinsCore`, you ensure that your application's cookie management is secure, efficient, and aligned with best practices.
