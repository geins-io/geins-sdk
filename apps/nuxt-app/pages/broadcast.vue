<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { GeinsCore } from '@geins/core';
import type { MerchantApiCredentials} from '@geins/types';

const messages = ref<string[]>([]);
let geinsCore: GeinsCore | null = null;
// Initialize GeinsCore with credentials
const credentials: MerchantApiCredentials = {
  apiKey: 'CF2FF80B-6F85-4CD9-ACE5-F41962891E07',
  accountName: 'demogeins',
};
geinsCore = new GeinsCore(credentials);


// Broadcast a message
const broadcast = () => {
  const channel = geinsCore?.broadcastChannel;
  if (channel) {
    const message = { type: 'message', payload: 'hello from nuxt-app' };
    channel.postMessage(message);
    messages.value.push(`Message sent: ${message.type} - ${message.payload}`);

  } else {
    console.log('BroadcastChannel not initialized');
  }
};

// Check the status of the BroadcastChannel
const status = () => {
  const channel = geinsCore?.broadcastChannel;
  messages.value.push(`Channel status: ${channel ? 'open' : 'closed'}`);
};

</script>

<template>
  <div>
    <h2>Nuxt Broadcast Test</h2>
    <button @click="broadcast">Send Message</button>
    <button @click="status">Check Status</button>
    <br />
    <p v-for="(message, index) in messages" :key="index">{{ message }}</p>
  </div>
</template>
