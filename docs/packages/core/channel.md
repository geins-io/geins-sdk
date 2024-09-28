# Channels

The Geins SDK provides powerful tools for managing channels, allowing you to configure and access different channels within your application. Channels represent different sales channels or storefronts, each potentially with its own settings, products, and configurations.

This article will guide you through the concept of channels in the `GeinsCore` SDK, how to access them, and how to use the `Channel` class independently. We'll also provide code examples to illustrate how to implement channels in your application, reflecting the recent refactoring you've applied.

## Overview

- **Channels**: Represent different sales channels or storefronts in the Geins platform.
- **`GeinsCore`**: The central class of the Geins SDK, used to configure and access various services, including channels.
- **`Channel` Class**: A class that allows you to access channel information independently of `GeinsCore`.
- **Services**: Classes like `ChannelsService` and `ChannelService` that handle API interactions for channels.

By understanding and utilizing channels, you can tailor your application's behavior based on different sales channels, manage configurations, and access specific channel data.

## What are Channels?

In the Geins platform, a **channel** represents a distinct sales avenue or storefront. Each channel can have its own:

- **Settings**: Localization, market, currency, etc.
- **Products**: Specific products available in that channel.
- **Configurations**: Pricing, discounts, and other channel-specific configurations.

Channels enable you to manage multiple storefronts or sales channels within a single application, providing flexibility and scalability.

## Accessing Channels via `GeinsCore`

The `GeinsCore` class provides methods to access channel information. You can retrieve the current channel or fetch all available channels.

### Method Signatures

```typescript
    // Accessing channel methods from GeinsCore
    interface GeinsChannelInterface {
      current: () => Promise<GeinsChannelTypeType | undefined>;
      all: () => Promise<GeinsChannelTypeType[] | undefined>;
    }

    geinsCore.channel.current(): Promise<GeinsChannelTypeType | undefined>;
    geinsCore.channel.all(): Promise<GeinsChannelTypeType[] | undefined>;
```

The methods return a Promise that resolves to the channel data or `undefined` if not available.

### Example: Getting the Current Channel

```typescript
import GeinsCore from '@geins/core';
import type { GeinsSettings } from '@geins/types';

async function getCurrentChannel() {
  const geinsSettings: GeinsSettings = {
    apiKey: 'your-api-key',
    accountName: 'your-account-name',
    channel: 'your-channel-id',
    tld: 'your-tld',
    locale: 'your-locale',
    market: 'your-market',
  };

  const geinsCore = new GeinsCore(geinsSettings);

  try {
    const currentChannel = await geinsCore.channel.current();
    console.log('Current Channel:', currentChannel);
  } catch (error) {
    console.error('Error fetching current channel:', error);
  }
}

getCurrentChannel();
```

In this example:

- We initialize `GeinsCore` with the necessary settings.
- We call `geinsCore.channel.current()` to fetch the current channel.
- We handle the response and possible errors.

### Example: Getting All Channels

```typescript
import GeinsCore from '@geins/core';
import type { GeinsSettings } from '@geins/types';

async function getAllChannels() {
  const geinsSettings: GeinsSettings = {
    apiKey: 'your-api-key',
    accountName: 'your-account-name',
    channel: 'your-channel-id',
    tld: 'your-tld',
    locale: 'your-locale',
    market: 'your-market',
  };

  const geinsCore = new GeinsCore(geinsSettings);

  try {
    const channels = await geinsCore.channel.all();
    console.log('Available Channels:', channels);
  } catch (error) {
    console.error('Error fetching channels:', error);
  }
}

getAllChannels();
```

In this example:

- We call `geinsCore.channel.all()` to fetch all available channels.
- We handle the response and possible errors.

## Using the `Channel` Class Independently

The `Channel` class can be used independently of `GeinsCore`. This allows for more direct control and can be useful in certain scenarios, such as when integrating with frameworks like Nuxt.js.

### Method Signatures

```typescript
// Initializing Channel independently
const channel = Channel.getInstance(geinsSettings);

// Fetching the current channel
const currentChannel = await channel.get();
```

The `get()` method returns a Promise that resolves to the current channel data or `undefined`.

### Example: Initializing and Using `Channel`

Here's how you might use the `Channel` class independently in a Nuxt.js plugin:

```typescript
// plugins/channel.ts
import { defineNuxtPlugin } from '#app';
import type { GeinsSettings } from '@geins/types';
import { Channel } from '@geins/core';

export default defineNuxtPlugin(async (nuxtApp) => {
  // Retrieve GeinsSettings from runtime config
  const geinsSettings = nuxtApp.$config.public.geins.settings as GeinsSettings;

  // Initialize the Channel with settings
  const channel = Channel.getInstance(geinsSettings);

  // Await the channel initialization
  try {
    const currentChannel = await channel.get();

    // Provide currentChannel to the Nuxt context
    nuxtApp.provide('currentChannel', currentChannel);
  } catch (error) {
    console.error('Error initializing currentChannel:', error);
    // Handle initialization error as needed
  }
});
```

In this example:

- We import the `Channel` class from `@geins/core`.
- We retrieve the `GeinsSettings` from the Nuxt.js runtime config.
- We initialize the `Channel` using `Channel.getInstance(geinsSettings)`.
- We fetch the current channel using `channel.get()`.
- We provide the `currentChannel` to the Nuxt.js context for use in the application.

## Channel Classes and Services

Understanding the underlying classes and services can help you customize and extend channel functionality.

### `Channel` Class

The `Channel` class handles fetching and caching the current channel information.

- **Initialization**: Requires `GeinsSettings`, including `apiKey` and `channel`.
- **Methods**:
  - `get()`: Fetches the current channel, using cached data if available, and returns a Promise resolving to `GeinsChannelTypeType | undefined`.
  - `setKey(key, value)`: Stores a key-value pair in the cache.
  - `getKey(key)`: Retrieves a value from the cache by key.

### `ChannelsService` and `ChannelService`

These services handle API interactions related to channels.

- **`ChannelsService`**:
  - Fetches all available channels using the `channels` GraphQL query.
  - Returns a Promise resolving to `GeinsChannelTypeType[] | undefined`.
- **`ChannelService`**:
  - Fetches a specific channel by ID using the `channel` GraphQL query.
  - Returns a Promise resolving to `GeinsChannelTypeType | undefined`.

Both services extend the `BaseApiService`, which provides common API interaction methods.

## Additional Tips

- **Caching**: The `Channel` class caches channel data to improve performance. Cached data is stored for 24 hours by default.
- **Error Handling**: Always include error handling when fetching channel data to manage potential issues like network errors or invalid configurations.
- **Configuration**: Ensure that `GeinsSettings` is correctly configured with all required fields, such as `apiKey`, `accountName`, and `channel`.

## Conclusion

Channels in the Geins SDK provide a flexible way to manage multiple sales channels or storefronts within your application. Whether you use the `Channel` class independently or access channels via `GeinsCore`, you have the tools to fetch and utilize channel data effectively.

By understanding how channels work and how to implement them, you can tailor your application's behavior to different channels, manage configurations, and enhance the user experience.

For more information on channels and other SDK features, refer to the [Geins API Documentation](https://docs.geins.io/).

## Final Notes

- **Use Cases**: Channels are particularly useful for applications that need to support multiple storefronts, markets, or localized experiences.
- **Performance**: Utilizing caching mechanisms provided by the `Channel` class can improve application performance by reducing unnecessary API calls.

Happy coding!

By following this guide, you should now be able to effectively use channels within the `GeinsCore` SDK, whether through `GeinsCore` or by using the `Channel` class independently.
