# Routing

The `RoutingService` class is designed to manage URL redirects and routing rules within your application. It fetches URL history from the Geins API and caches it, allowing your application to handle redirects efficiently and keep routing information up-to-date.

## Purpose

The primary purpose of the `RoutingService` is to provide a centralized way to manage URL changes, especially when pages are moved or URLs are updated. It ensures that users and search engines are redirected to the correct URLs, improving user experience and maintaining SEO rankings.

## Key Features

- Fetches URL history from the Geins API.
- Caches routing data to minimize API calls.
- Handles URL redirects with appropriate HTTP status codes.
- Refreshes routing information periodically.

## Usage

To use the `RoutingService`, you need to initialize it with your API key and a storage mechanism that implements the `IStore` interface. The `RoutingStore` class is provided for in-memory caching, but you can implement your own store if needed.

### Initialization

```typescript
import { RoutingService, RoutingStore } from '@geins/core';

const apiKey = 'your-api-key';
const store = new RoutingStore();

const routingService = RoutingService.getInstance(apiKey, store);
```

## Implementing Middleware in Frameworks

The `RoutingService` can be integrated into middleware functions in various web frameworks to handle redirects seamlessly. Below are examples of how to use it in different frameworks.

### Express.js Middleware Example

```typescript
import express from 'express';
import { RoutingService, RoutingStore } from '@geins/core';

const app = express();
const apiKey = 'your-api-key';
const store = new RoutingStore();
const routingService = RoutingService.getInstance(apiKey, store);

// Middleware to handle redirects
app.use(async (req, res, next) => {
  const newUrl = await routingService.getRoute(req.path);
  if (newUrl) {
    // Redirect with 301 Moved Permanently status
    res.redirect(301, newUrl);
  } else {
    next();
  }
});

// Your other routes and middleware
app.get('/some-route', (req, res) => {
  res.send('This is some route');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

### Next.js Middleware Example

In Next.js, you can create custom middleware to handle redirects using the `RoutingService`.

```typescript
// next.config.js
module.exports = {
  async redirects() {
    // Initialize RoutingService
    const { RoutingService, RoutingStore } = require('@geins/core');
    const apiKey = 'your-api-key';
    const store = new RoutingStore();
    const routingService = RoutingService.getInstance(apiKey, store);

    // Fetch the latest routing rules
    await routingService.fillUrlHistory();
    const routingRules = await routingService.getRoutingRules();

    // Map routing rules to Next.js redirects
    return routingRules.map((rule) => ({
      source: rule.fromUrl,
      destination: rule.toUrl,
      permanent: rule.httpStatusCode === 301,
    }));
  },
};
```

### Nuxt.js Middleware Example

For Nuxt.js applications, you can use middleware to handle redirects before page rendering.

```typescript
// middleware/redirect.js
import { RoutingService, RoutingStore } from '@geins/core';

const apiKey = 'your-api-key';
const store = new RoutingStore();
const routingService = RoutingService.getInstance(apiKey, store);

export default async function ({ route, redirect }) {
  const newUrl = await routingService.getRoute(route.fullPath);
  if (newUrl) {
    return redirect(301, newUrl);
  }
}
```

Then, register the middleware in your Nuxt configuration or use it in specific pages.

## Refreshing Routing Data

The `RoutingService` automatically refreshes the routing data if more than an hour has passed since the last fetch. However, you can manually refresh it if needed.

```typescript
// Manually refresh routing data
await routingService.refreshUrlHistoryIfNeeded();
```

## Example Workflow

Here is a step-by-step guide on how to integrate the `RoutingService` into your application:

1.  Initialize the `RoutingService` with your API key and a storage mechanism.
2.  Fetch and fill the URL history by calling `fillUrlHistory()`.
3.  Implement middleware in your framework that uses `getRoute()` to check for redirects.
4.  If a redirect is found, redirect the user to the new URL with the appropriate HTTP status code.
5.  Optionally, refresh the routing data periodically or based on specific events.

## Custom Store Implementation

If you need a persistent storage mechanism or want to use a different caching strategy, you can implement your own store by adhering to the `IStore` interface.

```typescript
import { IStore } from '@geins/core';

class CustomStore implements IStore {
  async setKey(key: string, value: string): Promise {
    // Implement your storage logic here
  }

  async getKey(key: string): Promise {
    // Implement your retrieval logic here
    return null;
  }

  async getKeys(): Promise {
    // Implement your logic to get all keys
    return [];
  }
}

// Use your custom store with RoutingService
const store = new CustomStore();
const routingService = RoutingService.getInstance(apiKey, store);
```

## Key Interfaces

### RoutingRule

Represents a routing rule with optional HTTP status code and canonical flag.

```typescript
export interface RoutingRule {
  fromUrl: string;
  toUrl: string;
  httpStatusCode?: number;
  isCanonical?: boolean;
}
```

### IStore Interface

The storage mechanism must implement the following interface:

```typescript
export interface IStore {
  setKey(key: string, value: string): Promise;
  getKey(key: string): Promise;
  getKeys(): Promise;
}
```

## Notes

- Ensure that you handle errors appropriately, especially when the API key is invalid or the store encounters issues.
- The provided `RoutingStore` is suitable for applications that do not require persistent storage across restarts.
- Consider implementing caching strategies that suit your application's scaling and performance needs.
