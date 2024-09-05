<script setup lang="ts">
import { ref, onMounted } from 'vue';

import { RoutingService } from '../../utils/routingService'
import DataDump from '~/components/DataDump.vue';

const runtimeConfig = useRuntimeConfig();
const items = ref<any[]>([]);
const url = ref('/sv/skor/kvinna/skor-164/');


const routingService = new RoutingService(runtimeConfig.public.geins.apiKey);

const fillRoutes = async () => {
  const routes = await routingService.fillUrlHistory();
  console.log('routes', routes);
};

const refreshRoutes = async () => {
  await routingService.refreshUrlHistoryIfNeeded();
};

const get301Pages = async () => {
  const all = await routingService.getAllRoutes();
  console.log('all routes', all);
};
const get301Length = async () => {
  const all = await routingService.getAllRoutes();
  console.log('all routes count', all.length);
};
const getLatestRefresh = async () => {
  const lastUrlFetchTime = await routingService.getLastFetchTime();
  console.log('Last fetch time for URL history:', lastUrlFetchTime);
  const all = await routingService.getAllRoutes();
  console.log('all routes count', all.length);

};
const getLocalRoutes = async () => {
  const all = await routingService.getAllRoutes();
  console.log('all routes count', all.length);

};

const testRoute = async () => {
  const route = await routingService.getRoute(url.value);
  console.log('route', route);
  const all = await routingService.getAllRoutes();
  console.log('all routes count', all);
  //items.value = [{ header: 'from: ' + url.value, data: route }];
};



onMounted(async () => {
  const routes = await routingService.fillUrlHistory();
  console.log('routes', routes);
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
                Fill / Refresh
              </td>
            </tr>
            <tr>
              <td>
                <button @click="fillRoutes">Fill Routes</button>
                <button @click="refreshRoutes">Refresh Routes</button>
                <button @click="getLatestRefresh">Get Latest Refresh</button>
              </td>
            </tr>
            <tr>
              <td>
                Routing for 301
              </td>
            </tr>
            <tr>
              <td>
                <button @click="get301Length">Get 301 length</button>
                <button @click="get301Pages">Get 301 map</button>
              </td>
            </tr>
            <tr>
              <td>Canonicals</td>
            </tr>
            <tr>
              <td>
                <button @click="getLocalRoutes">Get Local Canonicals Routes</button>
              </td>
            </tr>
            <tr>
              <td>Test Route</td>
            </tr>
            <tr>
              <td>
                <input style="width:450px" type="text" v-model="url" />
                <button @click="testRoute">Test Route</button>
              </td>
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
