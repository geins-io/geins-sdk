<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { GeinsCore } from '@geins/core';
import { RoutingService, type Channel, type MerchantApiCredentials } from '@geins/core';
import DataDump from '~/components/DataDump.vue';
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

const routingService = new RoutingService(runtimeConfig.public.geins.apiKey);

const getPages = async () => {
  const all = routingService.getAllRoutes();
  // loop all routes
  const pages = await Promise.all(
    all.map(async (route) => {
      console.log(route);
      return {
        header: route.path,
        // get page data
        data: route,
      };
    })
  );

  items.value = pages;

};


onMounted(() => {
  routingService.fillRoutes();
});
</script>
<template>
  <div>
    <h2>Nuxt @geins/core routing</h2>
    <table>
      <tr>
        <td style="vertical-align: top">
          <table>
            <tr>
              <td>
                <button @click="getPages">Get Pages</button>
                <button @click="getPages">Get Products</button>
                <button @click="getPages">Get 301 map</button>
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
          <DataDump :data="items" />
        </td>
        <td></td>
        <td style="vertical-align: top">
          <!-- DATA -->
        </td>
      </tr>
    </table>
  </div>
</template>
