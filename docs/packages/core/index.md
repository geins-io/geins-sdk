# @geins/core

The `@geins/core` package serves as the foundation of the Geins SDK, providing essential functionalities such as event handling, cookie management, and API communication. It is the central piece that all other packages, like `@geins/cms`, depend upon to function correctly.

## Overview

The `GeinsCore` class encapsulates core services that are crucial for building applications with the Geins SDK. By initializing an instance of `GeinsCore`, you gain access to:

- **Event Handling:** Manage and respond to events within your application.
- **Cookie Management:** Simplify cookie operations across client and server environments.
- **API Clients:** Interact with Geins APIs using provided clients for REST and GraphQL.
- **Channel Information:** Access current and available channels for your application.

All other Geins packages require an instance of `GeinsCore` to function, making it an indispensable part of your application setup.

## Setting Up GeinsCore

To get started, you need to create an instance of `GeinsCore` by providing necessary configuration settings.

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
};
```

These settings include authentication details and application-specific configurations like channel and locale.

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
eventService.listnerAdd(data => {
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
