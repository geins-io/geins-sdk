# Order

The `OrderService` provides method to interact with orders.

## Overview

The `OrderService` provides a straightforward way to interact with orders. It includes the following features:

- **Order Methods**: 
  - **Get Order**: Retrieve order summary information using a public order ID  

## Features

### Get Order

The `get` method retrieves an order summary based on the public order ID. This is useful for looking up order details after an order has been placed.

To get an order summary, use the `get` method:

```typescript
const orderSummary = await geinsOMS.order.get({
  publicOrderId: 'your-public-order-id'
});
```

The returned object will be of type `OrderSummaryType` containing all the order information.

