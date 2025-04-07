# User Balance

The `User Balance` functionality in the Geins CRM package allows for tracking and managing the user's account balance. The balance reflects the amount of money available for the user to make purchases or receive refunds, and can be adjusted through transactions.

## Key Concepts

- **Available Balance**: The current amount of money available in the user’s account.
- **Balance Adjustments**: Users' balance can be updated through purchases, refunds, or manual adjustments.

## Retrieving User Balance

To retrieve the balance of the logged-in user, you can use the `getBalance` method in the `UserService`.

### Example

```typescript
const balance = await geinsCRM.user.getBalance();
console.log('User Balance:', balance);
```

This method returns the current balance of the user, which you can display or use in application logic.

## Example JSON Structure of User Balance

```json
{
  "currency": "USD",
  "amount": 150.0
}
```

## When to Use

The user balance can be used in applications that manage user funds or store credit, like e-commerce platforms. It’s essential for tracking available funds for user purchases and calculating refunds or adjustments.
