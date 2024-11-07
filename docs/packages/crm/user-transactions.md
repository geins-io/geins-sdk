# User Transactions

The `User Transactions` feature in the Geins CRM package is designed to keep track of all user-related transactions, including purchases, refunds, and balance adjustments.

## Key Concepts

- **Transaction Records**: Stores a history of all balance changes and transactions involving the user.
- **Transaction Types**: Includes credits, debits, refunds, and other balance adjustments.

## Retrieving User Transactions

To get the transaction history for the user, use the `getTransactions` method:

### Example

```typescript
const transactions = await geinsCRM.user.getTransactions();
console.log('User Transactions:', transactions);
```

This method returns a list of all transactions related to the user, helping with transparency and accounting.

## Example JSON Structure of User Transactions

```json
[
  {
    "id": "transaction-1",
    "type": "purchase",
    "amount": -50.0,
    "currency": "USD",
    "date": "2023-08-15T14:30:00Z"
  },
  {
    "id": "transaction-2",
    "type": "refund",
    "amount": 20.0,
    "currency": "USD",
    "date": "2023-08-16T10:00:00Z"
  }
]
```

## When to Use

User transaction records are critical for applications with financial components, such as e-commerce platforms, where tracking funds and purchases are essential.

---
