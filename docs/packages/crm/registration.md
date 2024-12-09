# Register New User

## Overview

The Geins CRM package provides functionality for user registration, including secure authentication and token management. This guide will walk you through the steps to register a new user using the Geins SDK.

## Registering a User

To register a new user, the `register` method is used. This method requires the user's credentials and additional information like customer type or subscription preferences.

### Example: Register a User

```typescript
import { GeinsCustomerType } from '@geins/types';

const newUserCredentials = {
  username: 'newuser@example.com',
  password: 'password123',
};

const userInfo = {
  newsletter: true,
  customerType: GeinsCustomerType.PersonType,
};

const registerResult = await geinsCRM.auth.newUser(newUserCredentials, userInfo);

if (registerResult?.succeeded) {
  console.log('User registered successfully');
  console.log('Token:', registerResult.tokens.token);
} else {
  console.error('Failed to register user:', registerResult?.error);
}
```

### Parameters

- **username**: The email address of the new user.
- **password**: A secure password for the user.
- **newsletter**: Boolean indicating if the user has subscribed to the newsletter.
- **customerType**: Indicates the type of user. Common values include:
  - `PersonType` for individual customers.
  - `CompanyType` for business accounts.

### Response

On successful registration, the method returns an object containing:
- **tokens**: Authentication and refresh tokens.
- **user**: Information about the registered user.

```typescript
{
  succeeded: true,
  tokens: {
    token: 'jwt-token',
    refreshToken: 'refresh-token',
  },
  user: {
    username: 'newuser@example.com',
    customerType: 'PersonType',
    memberId: '12345',
  },
}
```

### Error Handling

If the registration fails, an error object is returned. Ensure to handle it gracefully:

```typescript
try {
  const result = await geinsCRM.auth.newUser(newUserCredentials, userInfo);
  if (!result?.succeeded) {
    throw new Error('Registration failed');
  }
  console.log('Registration successful:', result.user);
} catch (error) {
  console.error('Error during registration:', error.message);
}
```

## Key Features

- **Secure Authentication**: Credentials are hashed and securely transmitted.
- **Token Management**: Automatically provides tokens for user sessions.
- **Customer Type Flexibility**: Support for multiple customer types (e.g., individuals, companies).
- **Newsletter Subscription**: Easily subscribe users to marketing updates.

## Conclusion

The Geins CRM package simplifies user registration with robust authentication and extensibility for custom user attributes. Refer to the [Geins API documentation](https://docs.geins.io) for more details on advanced use cases.

