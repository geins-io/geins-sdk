# Events

The Geins SDK provides a robust event management system that allows you to handle and respond to various events within your application seamlessly. This system is essential for building responsive and interactive applications, enabling real-time updates and efficient communication between different parts of your app.

This article will guide you through the events module in `GeinsCore`, including how to listen for events, emit events, and manage event messages and types. We'll also provide practical examples, including TypeScript methods, to illustrate how to integrate event handling into your application effectively.

## Usage

The SDK emits events to notify your application of important changes or actions. You can listen for these events and respond accordingly. Events are useful for updating the user experience across browser tabs, integrating third-party services, tracking user actions, and more.

Events serve as a communication bridge within your application, allowing different components to react to specific actions without being tightly coupled.

## Overview

The `GeinsCore` class provides methods to manage events. You can listen for specific events, broadcast events, and access event data.

- **`EventService`**: Manages event listeners and emits events.
- **`GeinsEventMessage`**: Defines the structure of event messages.
- **`GeinsEventType`**: Enumerates the types of events that can be emitted and listened to.

By leveraging the events system, you can create a dynamic and responsive application that reacts to user interactions, data changes, and other significant occurrences.

## Event Message Structure

The `GeinsEventMessage` interface defines the structure of the messages associated with events. It ensures consistency and type safety when handling event data.

```typescript
/**
 * Event message interface
 * @interface
 * @name GeinsEventMessage
 * @property {string} subject - Event subject
 * @property {any} payload - Event payload
 * @property {boolean} [broadcast] - Broadcast event over windows and tabs
 * @example
 * {
 *  subject: 'USER_LOGIN',
 *  payload: {
 *   user: 'luke.skywalker@tatooine.com',
 *  },
 * broadcast: true,
 * }
 */
export interface GeinsEventMessage {
  subject: string;
  payload: any;
  broadcast?: boolean;
}
```

The `subject` provides context about the event, while the `payload` carries the actual data related to the event. The optional `broadcast` property indicates whether the event should be broadcasted across different contexts (e.g., browser tabs).

## Emitting an Event

To emit an event, use the `push` method provided by the `EventService`. This method allows you to send event messages that other parts of your application can listen for and respond to.

```typescript
import { GeinsCore, GeinsEventType } from '@geins/core';
import type { GeinsSettings, GeinsEventMessage } from '@geins/types';

const geinsSettings: GeinsSettings = {
  apiKey: 'your-api-key',
  accountName: 'your-account-name',
  channel: 'your-channel-id',
  tld: 'your-tld',
  locale: 'your-locale',
  market: 'your-market',
};

const geinsCore = new GeinsCore(geinsSettings);

// Emitting a simple toast event
geinsCore.events.push({ subject: 'toast', payload: 'Hello world' });

// Emitting an auth event
geinsCore.events.push({ subject: 'auth', payload: { method: 'login' } });

// Emitting a user login event with a specific event type
const message: GeinsEventMessage = {
  subject: 'user.auth',
  payload: { method: 'login yes' },
};
geinsCore.events.push(message, GeinsEventType.USER_LOGIN);
```

In this example:

- A simple toast event is emitted with a message payload.
- An auth event is emitted with a payload containing the login method.
- A user login event is emitted with a specific event type and a more detailed payload.

## Broadcasts of Events

Events can be broadcasted across different browser contexts (e.g., multiple tabs) using the `BroadcastChannel` API. This ensures that events are propagated throughout the entire application, regardless of the context in which they occur.

When emitting an event with the `broadcast` property set to `true` (or omitted, as it defaults to `true`), the event will be sent to all listeners across different contexts.

```typescript
const eventMessage: GeinsEventMessage = {
  subject: 'user.auth',
  payload: { method: 'login yes' },
  broadcast: true, // This event will be broadcasted
};
geinsCore.events.push(eventMessage, GeinsEventType.USER_LOGIN);
```

In this example, the `USER_LOGIN` event is broadcasted, ensuring that all parts of the application, including other browser tabs, receive and can respond to the event.

## Listening for Events

To respond to events emitted by the SDK, you need to add event listeners. The `EventService` provides methods to add listeners that can handle events when they occur.

### Adding Event Listeners

```typescript
geinsCore.events.listenerAdd(handler: (data: GeinsEventMessage) => void, eventName?: GeinsEventType | string);
geinsCore.events.listenerOnce(handler: (data: GeinsEventMessage) => void, eventName?: GeinsEventType | string);

```

\- `listenerAdd`: Adds a persistent event listener for the specified event.

\- `listenerOnce`: Adds a one-time event listener that is removed after it is triggered once.

### Removing Event Listeners

```typescript
geinsCore.events.listenerRemove(eventName?: GeinsEventType | string);
geinsCore.events.listenerRemoveAll(eventName?: GeinsEventType | string);

```

\- `listenerRemove`: Removes all listeners for the specified event.

\- `listenerRemoveAll`: Removes all listeners for the specified event.

### Counting and Retrieving Listeners

```typescript
geinsCore.events.listenerCount(eventName?: GeinsEventType | string);
geinsCore.events.listenersGet(eventName?: GeinsEventType | string);

```

\- `listenerCount`: Returns the number of listeners for the specified event.

\- `listenersGet`: Retrieves all listeners for the specified event.

## Managing Event Listeners

Managing event listeners effectively is crucial for ensuring that your application responds appropriately to events without causing memory leaks or unintended behavior. The `EventService` class provides a set of methods to add, remove, count, and retrieve event listeners.

### EventService Class Methods

The `EventService` class includes the following methods to manage event listeners:

#### listenerAdd

Adds a persistent event listener for the specified event. This listener will be invoked every time the event is emitted.

```typescript
listenerAdd(handler: (data: GeinsEventMessage) => void, eventName?: GeinsEventType | string);

```

**Parameters:**

- `handler`: A callback function that handles the event data.
- `eventName` (optional): The name of the event to listen for. If omitted, it defaults to `'geins-event'`.

**Example:**

```typescript
geinsCore.events.listenerAdd((data: GeinsEventMessage) => {
  console.log('Received event:', data.subject, data.payload);
}, GeinsEventType.USER_LOGIN);
```

#### listenerOnce

Adds a one-time event listener for the specified event. This listener will be invoked only the first time the event is emitted and then automatically removed.

```typescript
listenerOnce(handler: (data: GeinsEventMessage) => void, eventName?: GeinsEventType | string);

```

**Parameters:**

- `handler`: A callback function that handles the event data.
- `eventName` (optional): The name of the event to listen for. If omitted, it defaults to `'geins-event'`.

**Example:**

```typescript
geinsCore.events.listenerOnce((data: GeinsEventMessage) => {
  console.log('This will log only once:', data.subject, data.payload);
}, GeinsEventType.USER_LOGOUT);
```

#### listenerRemove

Removes all listeners for the specified event.

```typescript
listenerRemove(eventName?: GeinsEventType | string);

```

**Parameters:**

- `eventName` (optional): The name of the event for which to remove listeners. If omitted, it defaults to `'geins-event'`.

**Example:**

```typescript
geinsCore.events.listenerRemove(GeinsEventType.CART_ADD);
```

#### listenerRemoveAll

Removes all listeners for the specified event. This is functionally identical to `listenerRemove`.

```typescript
listenerRemoveAll(eventName?: GeinsEventType | string);

```

**Parameters:**

- `eventName` (optional): The name of the event for which to remove all listeners. If omitted, it defaults to `'geins-event'`.

**Example:**

```typescript
geinsCore.events.listenerRemoveAll(GeinsEventType.CART_REMOVE);
```

#### listenerCount

Returns the number of listeners currently registered for the specified event.

```typescript
listenerCount(eventName?: GeinsEventType | string): number;

```

**Parameters:**

- `eventName` (optional): The name of the event for which to count listeners. If omitted, it defaults to `'geins-event'`.

**Returns:** `number` – The count of listeners for the specified event.

**Example:**

```typescript
const loginListenerCount = geinsCore.events.listenerCount(
  GeinsEventType.USER_LOGIN,
);
console.log('Number of USER_LOGIN listeners:', loginListenerCount);
```

#### listenersGet

Retrieves all listeners for the specified event.

```typescript
listenersGet(eventName?: GeinsEventType | string): Function[];

```

**Parameters:**

- `eventName` (optional): The name of the event for which to retrieve listeners. If omitted, it defaults to `'geins-event'`.

**Returns:** `Function[]` – An array of listener functions for the specified event.

**Example:**

```typescript
const cartAddListeners = geinsCore.events.listenersGet(GeinsEventType.CART_ADD);
cartAddListeners.forEach((listener, index) => {
  console.log(`Listener ${index + 1}:`, listener);
});
```

#### push

Emits an event with the given message and event name. This method not only triggers the event listeners but also handles broadcasting the event across different contexts if the `broadcast` property is set to `true`.

```typescript
push(eventMessage: GeinsEventMessage, eventName?: GeinsEventType | string);

```

**Parameters:**

- `eventMessage`: An object adhering to the `GeinsEventMessage` interface, containing the event's subject and payload.
- `eventName` (optional): The name of the event to emit. If omitted, it defaults to `'geins-event'`.

**Example:**

```typescript
const eventMessage: GeinsEventMessage = {
  subject: 'user.auth',
  payload: {
    userId: 'user-123',
    timestamp: new Date(),
  },
  broadcast: true, // This event will be broadcasted
};
geinsCore.events.push(eventMessage, GeinsEventType.USER_LOGIN);
```

This will emit the `USER_LOGIN` event with the provided message, and since `broadcast` is set to `true`, the event will be sent to all listeners across different browser contexts.

## Events Always Emitted by the SDK

The SDK emits a set of predefined events that you can listen to for handling user actions and cart operations. These events are categorized under user and cart-related actions.

### `GeinsEventType` Enum

```typescript
// enum over event types to subscribe to
export enum GeinsEventType {
  // User
  USER = 'USER',
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_UPDATE = 'USER_UPDATE',
  USER_DELETE = 'USER_DELETE',

  // Cart
  CART = 'CART',
  CART_ADD = 'CART_ADD',
  CART_REMOVE = 'CART_REMOVE',
  CART_UPDATE = 'CART_UPDATE',
  CART_CLEAR = 'CART_CLEAR',
}
```

These event types can be used to listen for and respond to specific actions within your application.

- **USER_LOGIN**: Triggered when a user logs in.
- **USER_LOGOUT**: Triggered when a user logs out.
- **CART_ADD**: Triggered when an item is added to the cart.
- **CART_REMOVE**: Triggered when an item is removed from the cart.

## Example: Sending Data to a Third-Party Service on User Login

Let's create an example where we send user login data to a third-party analytics service whenever a user logs in. We'll listen for the `USER_LOGIN` event and trigger an API call to the analytics service.

```typescript
import { GeinsCore, GeinsEventType } from '@geins/core';
import type { GeinsSettings, GeinsEventMessage } from '@geins/types';
import axios from 'axios';

const geinsSettings: GeinsSettings = {
  apiKey: 'your-api-key',
  accountName: 'your-account-name',
  channel: 'your-channel-id',
  tld: 'your-tld',
  locale: 'your-locale',
  market: 'your-market',
};

const geinsCore = new GeinsCore(geinsSettings);

// Define an event handler for USER_LOGIN
const handleUserLogin = async (eventMessage: GeinsEventMessage) => {
  const userData = eventMessage.payload;

  try {
    await axios.post('https://third-party-analytics.com/login', {
      userId: userData.userId,
      timestamp: userData.timestamp,
    });
    console.log('User login data sent to analytics service.');
  } catch (error) {
    console.error('Failed to send user login data:', error);
  }
};

// Add the event listener
geinsCore.events.listenerAdd(handleUserLogin, GeinsEventType.USER_LOGIN);

// Emit a USER_LOGIN event (this would typically be triggered elsewhere in your application)
const loginEventMessage: GeinsEventMessage = {
  subject: 'user.auth',
  payload: {
    userId: 'user-123',
    timestamp: new Date(),
  },
  broadcast: true,
};
geinsCore.events.push(loginEventMessage, GeinsEventType.USER_LOGIN);
```

In this example:

- We initialize `GeinsCore` with the necessary settings.
- We define an event handler `handleUserLogin` that sends user login data to a third-party analytics service using `axios`.
- We add the event listener for the `USER_LOGIN` event.
- We emit a `USER_LOGIN` event with relevant user data.

This setup ensures that every time a user logs in, their login information is sent to the analytics service, allowing you to track user activities effectively.

## Example: TypeScript Methods

Below are examples of how to use the `EventService` methods within your TypeScript code.

### Adding a Persistent Event Listener

```typescript
geinsCore.events.listenerAdd((data: GeinsEventMessage) => {
  console.log('Received event:', data.subject, data.payload);
}, GeinsEventType.USER_LOGIN);
```

This listener will log the event data every time a `USER_LOGIN` event is emitted.

### Adding a One-Time Event Listener

```typescript
geinsCore.events.listenerOnce((data: GeinsEventMessage) => {
  console.log('This will log only once:', data.subject, data.payload);
}, GeinsEventType.USER_LOGOUT);
```

This listener will log the event data only the first time a `USER_LOGOUT` event is emitted and then remove itself.

### Removing Event Listeners

```typescript
geinsCore.events.listenerRemove(GeinsEventType.CART_ADD);
```

Removes all listeners associated with the `CART_ADD` event.

### Removing All Event Listeners

```typescript
geinsCore.events.listenerRemoveAll(GeinsEventType.CART_REMOVE);
```

Removes all listeners associated with the `CART_REMOVE` event.

### Counting Event Listeners

```typescript
const loginListenerCount = geinsCore.events.listenerCount(
  GeinsEventType.USER_LOGIN,
);
console.log('Number of USER_LOGIN listeners:', loginListenerCount);
```

Logs the number of listeners currently registered for the `USER_LOGIN` event.

### Retrieving Event Listeners

```typescript
const cartAddListeners = geinsCore.events.listenersGet(GeinsEventType.CART_ADD);
cartAddListeners.forEach((listener, index) => {
  console.log(`Listener ${index + 1}:`, listener);
});
```

Retrieves and logs all listeners registered for the `CART_ADD` event.

### Emitting an Event

```typescript
const eventMessage: GeinsEventMessage = {
  subject: 'user.auth',
  payload: {
    userId: 'user-123',
    timestamp: new Date(),
  },
  broadcast: true, // This event will be broadcasted
};
geinsCore.events.push(eventMessage, GeinsEventType.USER_LOGIN);
```

Emits a `USER_LOGIN` event with the specified message, broadcasting it across all contexts.

## Example: TypeScript Methods

Below are examples of how to use the `EventService` methods within your TypeScript code.

### Adding a Persistent Event Listener

```typescript
geinsCore.events.listenerAdd((data: GeinsEventMessage) => {
  console.log('Received event:', data.subject, data.payload);
}, GeinsEventType.USER_LOGIN);
```

This listener will log the event data every time a `USER_LOGIN` event is emitted.

### Adding a One-Time Event Listener

```typescript
geinsCore.events.listenerOnce((data: GeinsEventMessage) => {
  console.log('This will log only once:', data.subject, data.payload);
}, GeinsEventType.USER_LOGOUT);
```

This listener will log the event data only the first time a `USER_LOGOUT` event is emitted and then remove itself.

### Removing Event Listeners

```typescript
geinsCore.events.listenerRemove(GeinsEventType.CART_ADD);
```

Removes all listeners associated with the `CART_ADD` event.

### Counting Event Listeners

```typescript
const loginListenerCount = geinsCore.events.listenerCount(
  GeinsEventType.USER_LOGIN,
);
console.log('Number of USER_LOGIN listeners:', loginListenerCount);
```

Logs the number of listeners currently registered for the `USER_LOGIN` event.

### Retrieving Event Listeners

```typescript
const cartAddListeners = geinsCore.events.listenersGet(GeinsEventType.CART_ADD);
cartAddListeners.forEach((listener, index) => {
  console.log(`Listener ${index + 1}:`, listener);
});
```

Retrieves and logs all listeners registered for the `CART_ADD` event.

### Emitting an Event

```typescript
const eventMessage: GeinsEventMessage = {
  subject: 'user.auth',
  payload: {
    userId: 'user-123',
    timestamp: new Date(),
  },
  broadcast: true, // This event will be broadcasted
};
geinsCore.events.push(eventMessage, GeinsEventType.USER_LOGIN);
```

Emits a `USER_LOGIN` event with the specified message, broadcasting it across all contexts.
