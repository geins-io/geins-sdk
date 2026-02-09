# @geins/core

Foundation package for the Geins SDK. Provides the API client, channel management, event bus, storage abstractions, and error types that all domain packages build on.

## Install

```bash
npm install @geins/core
# or
yarn add @geins/core
```

## Quick start

```ts
import { GeinsCore } from '@geins/core';

const core = new GeinsCore({
  apiKey: 'your-api-key',
  accountName: 'your-account',
  channel: 'your-channel-id',
  environment: 'prod',
});

// Channel info
const channel = await core.channel.current();

// Event bus
core.events.listenerAdd((msg) => console.log(msg), 'USER');
```

## API overview

| Export | Description |
|---|---|
| `GeinsCore` | Root entry point — holds the API client, channel, events, and settings. |
| `EventService` | In-process event bus with cross-tab BroadcastChannel support. |
| `StorageInterface` | Pluggable storage abstraction (cookie, memory, or custom). |
| `CookieStorageAdapter` | Default `StorageInterface` backed by browser cookies. |
| `MemoryStorage` | In-memory `StorageInterface` for tests and server-side usage. |
| `GeinsError` | Base error class with typed `GeinsErrorCode`. |
| `AuthError`, `CartError`, `CheckoutError` | Domain-specific error subclasses. |
| `NetworkRequestError`, `TimeoutError`, `RateLimitError` | Network-layer errors. |
| `BasePackage` | Abstract base class for domain packages (CRM, CMS, OMS). |
| `BaseApiService` | Abstract base class for GraphQL-backed services. |

## Documentation

See the [full documentation](https://sdk.geins.dev/packages/core/) for detailed usage.

## License

MIT
