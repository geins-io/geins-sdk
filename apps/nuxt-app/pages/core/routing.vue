<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RoutingService, RoutingStoreNodeCache } from '@geins/core';
import DataDump from '~/components/DataDump.vue';

const runtimeConfig = useRuntimeConfig();
const items = ref<any[]>([]);
const url = ref('');

const apiKey = runtimeConfig.public.geins.apiKey;
const store = new RoutingStoreNodeCache();
const routingService = new RoutingService(apiKey, store);

const fillRoutes = async () => {
  const routes = await routingService.fillUrlHistory();
  if (routes.length > 0) {
    console.log('routes filled', routes.length);
    url.value = routes[0];
  }

  console.log('routes filled', routes.length);
};

const refreshRoutes = async () => {
  await routingService.refreshUrlHistoryIfNeeded();
};

const get301Pages = async () => {
  const all = await routingService.getRoutingRules();
  for (let i = 0; i < 100; i++) {
    const item = all[i];
    items.value.push({ header: item.fromUrl, data: item });
  }
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
};

const testRouteRedirect = async () => {
  const route = await routingService.getRoute(url.value);
  console.log('route', route);
  if (route) {
    // redirect to new tab
    window.open(route, '_blank');
  }
};

onMounted(async () => { });
</script>
<template>
  <div>
    <h2>Nuxt @geins/core routing</h2>
    <table>
      <tr>
        <td style="vertical-align: top">
          <table>
            <tr>
              <td>Fill / Refresh</td>
            </tr>
            <tr>
              <td>
                <button @click="fillRoutes">Fill Routes</button>
                <button @click="refreshRoutes">Refresh Routes</button>
                <button @click="getLatestRefresh">Get Latest Refresh</button>
              </td>
            </tr>
            <tr>
              <td>Routing for 301</td>
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
                <button @click="getLocalRoutes">
                  Get Local Canonicals Routes
                </button>
              </td>
            </tr>
            <tr>
              <td>Test Route</td>
            </tr>
            <tr>
              <td>
                <input v-model="url" style="width: 300px" type="text" />
                <button @click="testRoute">Test Route</button>
                <button @click="testRouteRedirect">
                  Test Route Redirect New Tab
                </button>
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
