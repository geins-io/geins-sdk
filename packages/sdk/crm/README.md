# @geins/crm

Customer Relationship Management package for the Geins SDK. Provides user authentication (login, refresh, password reset) and profile management.

## Install

```bash
npm install @geins/crm @geins/core
# or
yarn add @geins/crm @geins/core
```

`@geins/core` is a peer dependency and must be installed alongside this package.

## Quick start

### Stateless (server-side)

```ts
import { GeinsCore } from '@geins/core';
import { GeinsCRM } from '@geins/crm';

const core = new GeinsCore({ apiKey: '...', accountName: '...', channel: '...' });
const crm = new GeinsCRM(core);

// Login
const response = await crm.auth.login({ username: 'user@example.com', password: '...' });

// Get user profile (requires a valid user token)
const user = await crm.user.get(userToken);
```

### Session (browser-side)

```ts
import { CrmSession } from '@geins/crm';

const session = new CrmSession(crm, {
  storage: customStorageAdapter, // optional, defaults to cookies
  events: core.events,           // optional, enables cross-tab sync
});

await session.login({ username: 'user@example.com', password: '...' });
const user = await session.getUser(); // auto-refreshes expired tokens
session.logout();
```

## API overview

| Export | Description |
|---|---|
| `GeinsCRM` | Stateless CRM entry point — exposes `auth` and `user` services. |
| `CrmSession` | Browser-side session with token persistence, auto-refresh, and event emission. |

### GeinsCRM services

- **`crm.auth`** — `login()`, `refresh()`, `getUser()`, `authorized()`, `changePassword()`
- **`crm.user`** — `get(token)`, `update(input, token)`, `create(input)`

### CrmSession

- **`session.login(credentials)`** — Login and persist tokens.
- **`session.getUser()`** — Get profile with auto-refresh.
- **`session.authorized()`** — Check session validity.
- **`session.logout()`** — Clear all stored tokens.

## Documentation

See the [full documentation](https://sdk.geins.dev/packages/crm/) for detailed usage.

## License

MIT
