import type { Channel } from '@geins/core';

declare module '#app' {
  interface NuxtApp {
    $currentChannel: Channel;
  }
}
