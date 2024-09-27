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
