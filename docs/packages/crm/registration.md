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

const registerResult = await geinsCRM.auth.newUser(newUserCredentials, userInfo);

if (registerResult?.succeeded) {
  console.log('User registered successfully');
} else {
  console.error('Failed to register user');
}
```
