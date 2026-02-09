---
title: Core Package
description: How to work with the Geins Core Package
tags:
  - sdk
  - core
---

# @geins/core

The `@geins/core` package serves as the foundation of the Geins SDK, providing essential functionalities such as event handling, cookie management, and API communication. It is the central piece that all other packages, like `@geins/cms`, depend upon to function correctly.

## Overview

The `GeinsCore` class encapsulates core services that are crucial for building applications with the Geins SDK. By initializing an instance of `GeinsCore`, you gain access to:

- [Channel Information](./channel): Access current and available channels for your application.
- [Event Handling](./events): Manage and respond to events within your application.
- [Cookie Management](./cookies): Simplify cookie operations across client and server environments.
- [Routing](./routing): Manage routing and navigation within your application.
- [GraphQL Client](./graphql-client): Interact with Geins Merchant APIs using a GraphQL client.

All other Geins packages require an instance of `GeinsCore` to function, making it an indispensable part of your application setup.

## Setting Up GeinsCore

To get started, you need to create an instance of `GeinsCore` by providing necessary configuration settings.

### Installation

::: code-group

```sh [npm]
$ npm add -D @geins/core
```

```sh [pnpm]
$ pnpm add -D @geins/core
```

```sh [yarn]
$ yarn add -D @geins/core
```

```sh [bun]
$ bun add -D @geins/core
```
:::


### GeinsSettings Type

The `GeinsSettings` type defines the configuration required to initialize `GeinsCore`:

```typescript
export type GeinsSettings = {
  apiKey: string;
  accountName: string;
  channel: string;
  tld: string;
  locale: string;
  market: string;
  environment?: Environment;
  logLevel?: GeinsLogLevel;
  requestConfig?: GeinsRequestConfig;
};
```

These settings include authentication details, application-specific configurations like channel and locale, and optional request pipeline configuration.

### Initializing GeinsCore

Here's how you can initialize an instance of `GeinsCore`:

```typescript
import { GeinsCore } from '@geins/core';

const geinsSettings = {
  apiKey: 'your-api-key',
  accountName: 'your-account-name',
  channel: 'your-channel-id',
  tld: 'your-tld',
  locale: 'your-locale',
  market: 'your-market',
  environment: 'production', // or 'staging', 'development'
  loglevel: 'info', // or 'debug', 'warn', 'error'
};

const geinsCore = new GeinsCore(geinsSettings);
```

Ensure that all required fields in `GeinsSettings` are provided; otherwise, an error will be thrown during initialization.

## Core Functionalities

Once you have an instance of `GeinsCore`, you can access its core functionalities.

### Event Handling with EventService

The `EventService` allows you to manage custom events within your application. For detailed documentation, refer to the [Events Documentation](/packages/core/events).

```typescript
// Accessing the EventService
const eventService = geinsCore.events;

// Adding an event listener
eventService.listenerAdd(data => {
  console.log('Event received:', data);
});

// Emitting an event
eventService.push({
  subject: 'USER_LOGIN',
  payload: { userId: 'user-123' },
  broadcast: true,
});
```

### Cookie Management with CookieService

The `CookieService` simplifies cookie operations, ensuring consistency across environments. For more information, see the [Cookies Documentation](/packages/core/cookies).

```typescript
// Accessing the CookieService
const cookieService = geinsCore.cookies;

// Setting a cookie
cookieService.set({
  name: 'session_id',
  payload: 'abc123xyz',
  secure: true,
  httpOnly: true,
  maxAge: 86400, // 1 day in seconds
});

// Getting a cookie
const sessionId = cookieService.get('session_id');

// Removing a cookie
cookieService.remove('session_id');
```

### GraphQL Client

For more information, see the [GraphQL Client Documentation](./graphql-client).

```typescript
// Accessing the GraphQL client
const graphQLClient = geinsCore.graphql;

// Making a GraphQL query
const query = `{ user(id: "user-123") { name email } }`;
graphQLClient.query(query).then(response => {
  console.log('GraphQL response:', response);
});
```

### Channel Information

You can access information about the current channel and all available channels. For more details, check the [Channels Documentation](./channel.md).

```typescript
// Getting the current channel
geinsCore.channel.current().then(channel => {
  console.log('Current channel:', channel);
});

// Getting all channels
geinsCore.channel.all().then(channels => {
  console.log('All channels:', channels);
});
```

## Request Configuration

The SDK supports optional request pipeline features for production robustness. These are configured via the `requestConfig` property on `GeinsSettings`.

### Retry with Exponential Backoff

Automatically retry failed requests caused by network errors or server errors (5xx). Client errors (4xx) are not retried except for rate limiting (429).

```typescript
const geinsCore = new GeinsCore({
  // ...required settings
  requestConfig: {
    retry: {
      maxRetries: 3,        // default: 3
      initialDelayMs: 300,  // default: 300
      maxDelayMs: 10000,    // default: 10000
      jitter: true,         // default: true
    },
  },
});
```

Set `retry: false` to explicitly disable retries.

### Request Timeout

Set a maximum time for requests. If a request exceeds this duration, it fails with a `TimeoutError`.

```typescript
const geinsCore = new GeinsCore({
  // ...required settings
  requestConfig: {
    timeoutMs: 30000, // 30 seconds, 0 to disable
  },
});
```

### Request/Response Interceptors

Hook into the request lifecycle for logging, metrics, or custom header injection.

```typescript
const geinsCore = new GeinsCore({
  // ...required settings
  requestConfig: {
    interceptors: {
      onRequest: (ctx) => {
        // ctx.headers is mutable — add custom headers here
        ctx.headers['x-trace-id'] = myTraceId;
        console.log(`[${ctx.requestId}] ${ctx.operationName}`);
      },
      onResponse: (ctx) => {
        console.log(`[${ctx.requestId}] completed in ${ctx.durationMs}ms`);
      },
      onError: (ctx) => {
        console.error(`[${ctx.requestId}] failed: ${ctx.error.message}`);
      },
    },
  },
});
```

The `onRequest` interceptor supports both synchronous and asynchronous callbacks.

### Telemetry

Built-in request metrics — track request count, success/error rates, latency percentiles, and more. Metrics are collected automatically and flushed on a configurable interval.

```typescript
const geinsCore = new GeinsCore({
  // ...required settings
  requestConfig: {
    telemetry: {
      onMetrics: (snapshot) => {
        console.log(`Requests: ${snapshot.totalRequests}`);
        console.log(`Errors: ${snapshot.errorCount}`);
        console.log(`p95 latency: ${snapshot.p95DurationMs}ms`);
      },
      flushIntervalMs: 60000, // default: 60s
    },
  },
});

// Or pull metrics on demand:
const snapshot = geinsCore.telemetry?.snapshot();
```

Set `telemetry: false` to explicitly disable.

### Request IDs and SDK Version

Every request automatically gets two headers — no configuration needed:
- `x-request-id` — unique UUID for log correlation (also on error objects)
- `x-sdk-version` — the SDK version for server-side debugging

### Idempotency Keys

Every mutation automatically gets an `x-idempotency-key` header with a unique UUID. This prevents duplicate side effects when mutations are retried (e.g., adding the same item to a cart twice during a retry). Queries are not affected. Always enabled, no configuration needed.

### Error Types

The request pipeline introduces specific error classes that extend `GeinsError`:

| Error | When |
|-------|------|
| `TimeoutError` | Request exceeds `timeoutMs` |
| `RateLimitError` | Server returns HTTP 429 |
| `RetryExhaustedError` | All retry attempts failed |
| `NetworkRequestError` | Base class for all network errors |

```typescript
import { TimeoutError, RetryExhaustedError } from '@geins/core';

try {
  await geinsOMS.cart.get(cartId);
} catch (error) {
  if (error instanceof TimeoutError) {
    console.log(`Request ${error.requestId} timed out after ${error.timeoutMs}ms`);
  }
  if (error instanceof RetryExhaustedError) {
    console.log(`Request ${error.requestId} failed after ${error.attempts} attempts`);
  }
}
```

## Pagination

The Geins API uses offset-based pagination (`skip`/`take`/`count`). The SDK provides helpers to iterate through paginated results automatically.

### Async Iterator

Use `paginate()` to iterate page-by-page:

```typescript
import { paginate } from '@geins/core';

const pages = paginate(async (skip, take) => {
  const result = await geinsCore.graphql.query({
    query: productsQuery,
    variables: { skip, take, channelId, languageId, marketId },
  });
  return { items: result.products.products, count: result.products.count };
}, { take: 20 });

for await (const page of pages) {
  console.log(`Got ${page.items.length} of ${page.count} (hasMore: ${page.hasMore})`);
  // process page.items
}
```

### Fetch All

Use `paginateAll()` to fetch every page and return a flat array:

```typescript
import { paginateAll } from '@geins/core';

const allProducts = await paginateAll(async (skip, take) => {
  const result = await geinsCore.graphql.query({
    query: productsQuery,
    variables: { skip, take, channelId, languageId, marketId },
  });
  return { items: result.products.products, count: result.products.count };
}, { take: 50 });
```

## Integration with Other Packages

Packages like `@geins/cms` depend on an instance of `GeinsCore` for core functionalities.

```typescript
import { GeinsCMS } from '@geins/cms';

const geinsCMS = new GeinsCMS(geinsCore);

// Using the CMS package
geinsCMS.getContent('homepage').then(content => {
  console.log('Homepage content:', content);
});
```

By passing the `geinsCore` instance to other packages, you ensure they have access to the necessary services like event handling and API clients.
