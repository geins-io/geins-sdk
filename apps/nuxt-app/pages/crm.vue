<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
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

const geinsCore = new GeinsCore(geinsCredentials, channel, { marketId, languageId });

</script>
<template>
  <div>
    <h2>Nuxt @geins/CRM Test</h2>
    <table>
      <tr>
        <td style="vertical-align: top;">
          <!--           <table>
            <tr>
              <td>family:</td>
              <td>area:</td>
              <td></td>
            </tr>
            <tr>
              <td><input v-model="family" /></td>
              <td><input v-model="area" /></td>
              <td><button @click="getContentArea">Get Content Area</button></td>
            </tr>
          </table> -->
          <div v-for=" (item, index) in items" :key="index">
            <p>
              <b>{{ item.header }}</b><br />
              <textarea style="border:0; width:600px; height:300px; "> {{ item.data }}</textarea>
            </p>
          </div>
        </td>
        <td></td>
        <td style="vertical-align: top;">
          <!-- DATA -->
        </td>
      </tr>
    </table>

  </div>
</template>
