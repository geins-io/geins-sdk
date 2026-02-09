# @geins/oms

Order Management System package for the Geins SDK. Provides cart operations, checkout flow, order retrieval, and checkout token generation.

## Install

```bash
npm install @geins/oms @geins/core
# or
yarn add @geins/oms @geins/core
```

`@geins/core` is a peer dependency and must be installed alongside this package.

## Quick start

### Stateless (server-side)

```ts
import { GeinsCore } from '@geins/core';
import { GeinsOMS } from '@geins/oms';

const core = new GeinsCore({ apiKey: '...', accountName: '...', channel: '...' });
const oms = new GeinsOMS(core);

// Create a cart and add an item
const cart = await oms.cart.create();
const updated = await oms.cart.addItem(cart.id, { skuId: 123, quantity: 2 });

// Generate a checkout token
const token = await oms.createCheckoutToken({ cartId: cart.id });
```

### Session (browser-side)

```ts
import { CartSession } from '@geins/oms';

const session = new CartSession(oms.cart, 'en-US', {
  storage: customStorageAdapter, // optional, defaults to cookies
  events: core.events,           // optional, enables cart events
});

// Add / remove / update items with auto-quantity logic
await session.items.add({ skuId: 123, quantity: 1 });
await session.items.remove({ skuId: 123 });
await session.items.update({ skuId: 123, quantity: 5 });

// Promotion codes and shipping
await session.promotionCode.apply('SAVE10');
await session.shippingFee.set(49);
```

## API overview

| Export | Description |
|---|---|
| `GeinsOMS` | Stateless OMS entry point — exposes `cart`, `checkout`, and `order` services. |
| `CartSession` | Browser-side cart session with storage persistence and event emission. |

### GeinsOMS services

- **`oms.cart`** — `create()`, `get(id)`, `addItem()`, `updateItem()`, `deleteItem()`, `copy()`, `complete()`
- **`oms.checkout`** — Checkout validation and order creation.
- **`oms.order`** — `get(orderId)` — Retrieve order summaries.
- **`oms.createCheckoutToken(options)`** — Generate tokens for external checkout pages.

### CartSession

- **`session.items`** — `add()`, `remove()`, `update()`, `delete()`, `clear()`, `get()`
- **`session.promotionCode`** — `apply(code)`, `remove()`
- **`session.shippingFee`** — `set(fee)`
- **`session.merchantData`** — `set(data)`, `get()`

## Documentation

See the [full documentation](https://sdk.geins.dev/packages/oms/) for detailed usage.

## License

MIT
