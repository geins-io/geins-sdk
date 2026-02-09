# @geins/types

Shared TypeScript type definitions for the Geins SDK. Contains all interfaces, enums, and type aliases used across `@geins/core`, `@geins/crm`, `@geins/cms`, and `@geins/oms`.

## Install

This package is re-exported through `@geins/core`, so you typically don't need to install it directly. All types are available from `@geins/core`:

```ts
import type { GeinsSettings, CartType, AuthResponse } from '@geins/core';
```

If you need it standalone:

```bash
npm install @geins/types
```

## What's included

- **Auth types** — `AuthCredentials`, `AuthResponse`, `AuthTokens`, `AuthUser`
- **Cart types** — `CartType`, `CartItemInputType`, `CartGroupInputType`
- **Checkout types** — `CheckoutType`, `CheckoutInputType`
- **Order types** — `OrderType`
- **Channel types** — `GeinsChannelTypeType`, `GeinsChannelInterface`
- **CMS types** — `MenuType`, `ContentPageType`, `ContentAreaType`
- **Settings** — `GeinsSettings`, `GeinsEndpoints`
- **Events** — `GeinsEventType`, `GeinsEventMessage`
- **Generated types** — GraphQL-generated types from the Geins API schema

## License

MIT
