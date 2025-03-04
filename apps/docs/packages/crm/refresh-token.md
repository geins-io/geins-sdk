## Refresh Token

The refresh token is a critical component of the authentication flow in the Geins SDK. It allows users to maintain their authenticated state without needing to repeatedly log in. Here's a detailed explanation of its role and how to handle it:


### What is a Refresh Token?

A refresh token is a secure token issued during authentication. Unlike access tokens, which are short-lived, refresh tokens are used to obtain new access tokens when the original token expires. This approach ensures continuous access without repeatedly exposing sensitive user credentials.


### When is it Used?

- **Token Expiry**: When the access token expires, the refresh token can be used to request a new access token.
- **User Actions**: Actions requiring extended sessions, like updating user profiles or accessing secure features, often depend on refreshed tokens.
- **Session Management**: Maintaining long-lived sessions securely without requiring frequent logins.

### How to Refresh a Token

To refresh a token, you can use the `renewRefreshToken` method provided in the Geins CRM package. Below is an example:

```typescript
const refreshToken = 'user-refresh-token';

try {
  const refreshedTokenData = await geinsCRM.auth.renewRefreshtoken(refreshToken);

  if (refreshedTokenData) {
    console.log('New Access Token:', refreshedTokenData.token);
    console.log('New Refresh Token:', refreshedTokenData.refreshToken);
  } else {
    console.error('Failed to refresh token');
  }
} catch (error) {
  console.error('Error while refreshing token:', error);
}
```



### Key Methods in the SDK

#### `fetchRefreshToken`
This private method fetches a new token pair (access token and refresh token) using the provided refresh token.

```typescript
private async fetchRefreshToken(refreshToken: string): Promise<AuthUserToken> {
  const url = this.getAuthEndpointUrl('login');
  const requestOptions: RequestInit = {
    method: 'GET',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      [`${AUTH_HEADERS.REFRESH_TOKEN}`]: refreshToken,
    },
  };
  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    throw new Error(`Failed to renew refresh token: ${response.statusText}`);
  }

  const newRefreshToken = this.extractRefreshTokenFromResponse(response);

  const userToken = await response.text();
  if (!userToken) {
    throw new Error('Failed to fetch user token: Empty response');
  }

  const retval = JSON.parse(userToken);
  return {
    maxAge: retval.maxAge,
    token: retval.token,
    refreshToken: newRefreshToken,
  };
}
```

#### `renewRefreshToken`
Publicly exposed method to simplify refreshing tokens. It internally calls `fetchRefreshToken`.

```typescript
public async renewRefreshtoken(refreshToken: string): Promise<AuthUserToken> {
  return this.fetchRefreshToken(refreshToken);
}
```

### Error Handling

When refreshing tokens, it’s essential to handle errors gracefully, such as invalid or expired refresh tokens. Here's an example:

```typescript
try {
  const refreshedToken = await geinsCRM.auth.renewRefreshtoken('invalid-refresh-token');
  if (!refreshedToken) {
    throw new Error('Refresh token is invalid or expired');
  }
} catch (error) {
  console.error('Failed to refresh token:', error.message);
  // Handle logout or token re-authentication
}
```


### Best Practices

1. **Secure Storage**: Always store refresh tokens securely using HTTP-only cookies or secure local storage.
2. **Token Rotation**: Use the new refresh token issued during renewal to minimize security risks.
3. **Graceful Logout**: Clear stored tokens upon logout or invalidation to prevent unauthorized access.

By adhering to these practices, you can ensure a seamless and secure user experience.
