# TypeScript Usage

The Geins SDK is written in TypeScript and ships type declarations with every package. This guide covers how to use types effectively.

## Importing Types

Types live in `@geins/types` and are re-exported through `@geins/core`:

```typescript
// Both work — use whichever you prefer
import type { GeinsSettings, CartType } from '@geins/types';
import type { GeinsSettings, CartType } from '@geins/core';
```

Use `import type` when you only need the type at compile time. This produces no runtime code and is best practice for type-only imports.

## Package API Types

Each package exports typed interfaces and classes:

### Core

```typescript
import { GeinsCore } from '@geins/core';
import type { GeinsSettings } from '@geins/core';

const settings: GeinsSettings = {
  apiKey: 'your-key',
  accountName: 'your-account',
  channel: 'your-channel',
  tld: 'se',
  locale: 'sv-SE',
  market: 'se',
};

const core = new GeinsCore(settings);
```

### CRM

```typescript
import { GeinsCRM, CrmSession } from '@geins/crm';
import type { AuthSettings, AuthCredentials, AuthResponse } from '@geins/types';

const authSettings: AuthSettings = {
  clientConnectionMode: 'Direct',
};

const crm = new GeinsCRM(core, authSettings);

const credentials: AuthCredentials = {
  username: 'user@example.com',
  password: 'password',
};

const response: AuthResponse | undefined = await crm.auth.login(credentials);
```

### OMS

```typescript
import { GeinsOMS, CartSession } from '@geins/oms';
import type { CartType, OMSSettings } from '@geins/types';

const oms = new GeinsOMS(core, {
  omsSettings: { defaultPaymentId: 1, defaultShippingId: 2 },
});

const cart: CartType = await oms.cart.get('cart-id');
```

### CMS

```typescript
import { GeinsCMS } from '@geins/cms';

const cms = new GeinsCMS(core);
const page = await cms.page.get({ alias: '/my-page' });
```

## Custom GraphQL Queries

When writing custom GraphQL queries, provide a type parameter to get typed results:

```typescript
import { gql } from '@geins/core';

interface ProductResult {
  products: {
    productId: number;
    name: string;
    unitPrice: { sellingPriceIncVat: number };
  }[];
}

const PRODUCTS_QUERY = gql`
  query Products($channelId: String!) {
    products(channelId: $channelId) {
      productId
      name
      unitPrice { sellingPriceIncVat }
    }
  }
`;

const data = await core.graphql.query<ProductResult>({
  query: PRODUCTS_QUERY,
  variables: { channelId: '1|se' },
});

// data.products is typed as the array defined above
```

## Error Type Narrowing

SDK errors form a class hierarchy, so `instanceof` checks narrow the type:

```typescript
import {
  GeinsError,
  GeinsErrorCode,
  AuthError,
  TokenExpiredError,
  CartError,
  TimeoutError,
} from '@geins/core';

try {
  await crm.auth.getUser(refreshToken);
} catch (error) {
  if (error instanceof TokenExpiredError) {
    // TypeScript knows: error.code === GeinsErrorCode.AUTH_TOKEN_EXPIRED
    redirectToLogin();
  } else if (error instanceof AuthError) {
    // TypeScript knows: error.code is an AUTH_* code
    console.error(error.code, error.message);
  } else if (error instanceof TimeoutError) {
    // TypeScript knows: error.timeoutMs and error.requestId exist
    console.warn(`Timeout after ${error.timeoutMs}ms`);
  } else if (error instanceof GeinsError) {
    // Catch-all for any SDK error
    console.error(`[${error.code}]`, error.message);
  }
}
```

## Storage Interface

The SDK defines a `StorageInterface` for pluggable storage backends. Implement it to provide custom persistence:

```typescript
import type { StorageInterface, StorageSetOptions } from '@geins/core';

class MyStorage implements StorageInterface {
  private store = new Map<string, string>();

  get(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  set(key: string, value: string, options?: StorageSetOptions): void {
    this.store.set(key, value);
  }

  remove(key: string): void {
    this.store.delete(key);
  }
}
```

Built-in implementations: `MemoryStorage` (in-memory) and `CookieStorageAdapter` (cookie-backed).

## Event Typing

The `EventService` emits typed events:

```typescript
import type { GeinsEventMessage } from '@geins/types';
import { GeinsEventType } from '@geins/types';

core.events.listen('USER', (event: GeinsEventMessage) => {
  console.log(event.subject, event.payload);
});

core.events.listen('CART', (event: GeinsEventMessage) => {
  console.log('Cart changed:', event.payload);
});
```

## Key Types Reference

| Type | Package | Description |
|------|---------|-------------|
| `GeinsSettings` | `@geins/types` | SDK initialization settings |
| `AuthSettings` | `@geins/types` | Auth configuration (connection mode, proxy URL) |
| `AuthCredentials` | `@geins/types` | Username + password for login |
| `AuthResponse` | `@geins/types` | Login/refresh response with tokens and user |
| `AuthTokens` | `@geins/types` | JWT token + refresh token pair |
| `GeinsUserType` | `@geins/types` | Full user profile |
| `CartType` | `@geins/types` | Full cart with items, totals, shipping |
| `CheckoutType` | `@geins/types` | Checkout state with payment/shipping options |
| `OrderSummaryType` | `@geins/types` | Order confirmation summary |
| `ContentPageType` | `@geins/types` | CMS page with widgets |
| `ContentAreaType` | `@geins/types` | CMS content area with containers |
| `OMSSettings` | `@geins/types` | OMS config (default payment/shipping, URLs) |
| `GeinsErrorCode` | `@geins/core` | Enum of all error codes |
| `StorageInterface` | `@geins/core` | Pluggable storage contract |
| `GraphQLQueryOptions` | `@geins/core` | Options for custom GraphQL queries |
