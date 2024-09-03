<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { GeinsCore } from '@geins/core';
import type { Channel, MerchantApiCredentials } from '@geins/core';

const runtimeConfig = useRuntimeConfig();
const items = ref<any[]>([]);
const channel: Channel = {
  siteId: runtimeConfig.public.channel.siteId,
  siteTopDomain: runtimeConfig.public.channel.siteTopDomain,
};

const geinsCredentials: MerchantApiCredentials = {
  ...runtimeConfig.public.geins,
};

const languageId = runtimeConfig.public.defaultLanguage;
const marketId = runtimeConfig.public.defaultMarket;

const geinsCore = new GeinsCore(geinsCredentials, channel, {
  marketId,
  languageId,
});
// const geinsCRM = new GeinsCRM(geinsCore);

const eventPush = () => {
  geinsCore.events.push({ type: 'toast', payload: 'HELLO' });
};
const eventPush2 = () => {
  geinsCore.events.push({ type: 'auth', payload: { method: 'login' } });
};
const eventPush3 = () => {
  geinsCore.events.push({ type: 'alert', payload: 'HELLO elert' });
};

onMounted(() => {
  var myEventHandler = function (data: any) {
    items.value.push({ header: data.type, data: data });
    if (data.type === 'auth') {
      console.log('USER OK');
    }
    if (data.type === 'toast') {
      console.log('TOAST OK');
    }
    if (data.type === 'alert') {
      alert(data.payload);
    }
  };
  geinsCore.events.listnerAdd(myEventHandler);
});
</script>
<template>
  <div>
    <h2>Nuxt @geins/CRM Test</h2>
    <table>
      <tr>
        <td style="vertical-align: top">
          <table>
            <tr>
              <td>
                <button @click="eventPush">Event push</button>
                <button @click="eventPush2">Event push</button>
                <button @click="eventPush3">Event push -> alert</button>
              </td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </table>
          <div v-for="(item, index) in items" :key="index">
            <p>
              <b>{{ item.header }}</b
              ><br />
              <textarea style="border: 0; width: 600px; height: 100px">{{
                item.data
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
