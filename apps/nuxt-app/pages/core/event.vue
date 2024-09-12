<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { GeinsCredentials } from '@geins/types';
import { logWrite, GeinsCore } from '@geins/core';

const config = useRuntimeConfig();
const geinsCredentials = config.public.geins.credentials as GeinsCredentials;
const geinsCore = new GeinsCore(geinsCredentials);

const items = ref<any[]>([]);

const eventPushToast = () => {
  geinsCore.events.push({ type: 'toast', payload: 'Hello world' });
};
const eventPushAuth = () => {
  geinsCore.events.push({ type: 'auth', payload: { method: 'login' } });
};
const eventPushAlert = () => {
  geinsCore.events.push({ type: 'alert', payload: 'Hello world' });
};

onMounted(() => {
  const myEventHandler = function (data: any) {
    items.value.push({ header: data.type, data: data });
    if (data.type === 'auth') {
      logWrite(data.type, data);
    }
    if (data.type === 'toast') {
      logWrite(data.type, data);
    }
    if (data.type === 'alert') {
      logWrite(data.type, data);
      alert(data.payload);
    }
  };
  geinsCore.events.listnerAdd(myEventHandler);
});

const clear = async () => {
  items.value = [];
};
</script>
<template>
  <div>
    <h2>Nuxt @geins/core event</h2>
    <p>This page is for testing the event system</p>
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
              <td>
                <button @click="eventPushToast">Event push</button>
                <button @click="eventPushAuth">Auth Event push</button>
                <button @click="eventPushAlert">Event push to alert</button>
              </td>
              <td></td>
              <td></td>
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
              <textarea style="border: 0; width: 500px; height: 100px">{{
                JSON.stringify(item.data)
              }}</textarea>
            </p>
          </div>
        </td>
        <td></td>
        <td style="vertical-align: top">
          <!-- DATA -->
        </td>
      </tr>
    </table>
  </div>
</template>
