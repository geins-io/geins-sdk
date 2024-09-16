<script setup lang="ts">
import { useNuxtApp } from '#app';
import { ref, onMounted } from 'vue';
import type { GeinsCredentials, ChannelType } from '@geins/types';
import { logWrite, GeinsCore } from '@geins/core';
const { $currentChannel } = useNuxtApp();

const config = useRuntimeConfig();
const geinsCredentials = config.public.geins.credentials as GeinsCredentials;
const geinsCore = new GeinsCore(geinsCredentials);
const channel = ref<any>();
const channels = ref<any>();

const items = ref<{ header: string; data: string }[]>([]);

const getChannels = async () => {
  const result = await geinsCore.channels.get();
  channels.value = result;
  logWrite('Channels', result);
};

const getChannel = async () => {
  const result = await geinsCore.getChannel();
  channel.value = result;
  logWrite('Channel', result);
};

const clear = async () => {
  channel.value = undefined;
  channels.value = undefined;
  items.value = [];
};

onMounted(() => {
  channel.value = $currentChannel;
});
</script>
<template>
  <div>
    <h2>Nuxt @geins/core channels</h2>
    <p>This is a brand page for products</p>
    <p>
      <b>
        <NuxtLink to="/">GO BACK</NuxtLink>
      </b>
    </p>
    <table>
      <tr>
        <td style="vertical-align: top">
          <table>
            <tr>
              <td colspan="3">
                <button @click="getChannels">Get Account Channels</button>
                <button @click="getChannel">Get Application Channel</button>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <hr />
              </td>
            </tr>
            <tr>
              <td colspan="3"><button @click="clear">Clear</button></td>
            </tr>
            <tr>
              <td colspan="3">
                <hr />
              </td>
            </tr>
          </table>

          <div v-for="(item, index) in items" :key="index">
            <p>
              <b>{{ item.header }}</b><br />
              <textarea v-model="item.data" style="border: 0; width: 600px; height: 100px"></textarea>
            </p>
          </div>
        </td>
        <td></td>

        <td style="padding-left: 50px; vertical-align: top">
          <div v-if="channels">
            <h3>All Account Channels</h3>
            <pre>{{ channels }}</pre>
          </div>
          <div v-if="channel">
            <h3>Current Application Channel</h3>
            <pre>{{ channel }}</pre>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>
