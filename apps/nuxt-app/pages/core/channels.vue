<script setup lang="ts">
import type { GeinsCredentials } from '@geins/types';
import { logWrite, GeinsCore } from '@geins/core';

const config = useRuntimeConfig();

const geinsCredentials = config.public.geins.credentials as GeinsCredentials;
const geinsCore = new GeinsCore(geinsCredentials);

const items = ref<{ header: string; data: string }[]>([]);

const getChannels = async () => {
  logWrite('Channels', 'Getting channels');
  const result = await geinsCore.channels.getRaw();
  logWrite('Channels', result);
};

const getChannel = async () => {
  logWrite('geinsCore.channel', 'Getting channel');
  const result = await geinsCore.getChannel('1|se');
  logWrite('geinsCore.channel ', result);
};

const clear = async () => {
  items.value = [];
};

onMounted(() => { });
</script>
<template>
  <div>
    <h2>Nuxt @geins/core channels</h2>
    <p>This is a brand page for products</p>
    <p>
      <b>
        <a href="/"> GO BACK </a>
      </b>
    </p>
    <table>
      <tr>
        <td style="vertical-align: top">
          <table>
            <tr>
              <td colspan="3">
                <button @click="getChannels">Get Channels</button>
                <button @click="getChannel">Get Channel</button>
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
          <div>
            <h3>Channels</h3>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>
