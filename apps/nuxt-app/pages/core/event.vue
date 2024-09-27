<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { GeinsSettings, GeinsEventMessage } from '@geins/types';
import { logWrite, GeinsCore, GeinsEventType } from '@geins/core';

const config = useRuntimeConfig();
const geinsSettings = config.public.geins.settings as GeinsSettings;
const geinsCore = new GeinsCore(geinsSettings);



const items = ref<any[]>([]);

const eventPushToast = () => {
  geinsCore.events.push({ subject: 'toast', payload: 'Hello world' });
};
const eventPushAuth = () => {
  geinsCore.events.push({ subject: 'auth', payload: { method: 'login' } });
  const message: GeinsEventMessage = {
    subject: 'user.auth',
    payload: { method: 'login yes' },
  };
  geinsCore.events.push(message, GeinsEventType.USER_LOGIN);
};
const eventPushAlert = () => {
  geinsCore.events.push({ subject: 'alert', payload: 'Hello world' });
};

onMounted(() => {
  // custom events
  const myCustomEventHandler = function (data: GeinsEventMessage) {
    items.value.push({ header: data.subject, data: data });
    logWrite(data.subject, data);
    if (data.subject === GeinsEventType.USER_LOGIN) {
      logWrite(data.subject, data);
    }
    if (data.subject === GeinsEventType.USER_LOGOUT) {
      logWrite(data.subject, data);
    }
    if (data.subject === 'alert') {
      logWrite(data.subject, data);
      alert(data.payload);
    }
  };
  geinsCore.events.listnerAdd(myCustomEventHandler);

  // login event
  const myEventHandlerLogin = function (data: GeinsEventMessage) {
    items.value.push({ header: data.subject, data: data });
    logWrite(data.subject, data);
  };
  geinsCore.events.listnerAdd(myEventHandlerLogin, GeinsEventType.USER_LOGIN);
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
        <NuxtLink to="/">GO BACK</NuxtLink>
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
