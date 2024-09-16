import type { ChannelType } from '@geins/core';

declare module '#app' {
  interface NuxtApp {
    $currentChannel: ChannelType;
  }
}
