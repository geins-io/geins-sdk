import { defineNuxtPlugin } from '#app';
import type { GeinsCredentials } from '@geins/types';
import { Channel } from '@geins/core';

export default defineNuxtPlugin(async (nuxtApp) => {
  // Retrieve GeinsCredentials from runtime config
  const geinsCredentials = nuxtApp.$config.public.geins
    .credentials as GeinsCredentials;

  // Initialize the Channel with credentials
  const channel = new Channel(geinsCredentials);

  // Await the channel initialization
  try {
    const currentChannel = await channel.getChannel();

    // Provide currentChannel to the Nuxt context
    nuxtApp.provide('currentChannel', currentChannel);
  } catch (error) {
    console.error('Error initializing currentChannel:', error);
    // Handle initialization error as needed
  }
});
