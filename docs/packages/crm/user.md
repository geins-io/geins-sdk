# User

## Types of Users

## Information of Users

## Change information of Users

## User Balance

## User Transactions

## User Orders

### Get Current User

To retrieve the current user's information:

```typescript
const userResult = await geinsCRM.auth.getUser();

if (userResult?.succeeded) {
  console.log('User:', userResult.user);
} else {
  console.error('Failed to retrieve user');
}
```

### Update User Profile

### User Orders
