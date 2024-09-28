<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { GeinsSettings } from '@geins/types';
import { logWrite, RoutingService, RoutingStore } from '@geins/core';
import DataDump from '~/components/DataDump.vue';

const config = useRuntimeConfig();
const geinsSettings = config.public.geins.settings as GeinsSettings;
const apiKey = geinsSettings.apiKey;
const store = new RoutingStore();
const routingService = RoutingService.getInstance(apiKey, store);


const items = ref<any[]>([]);
const url = ref('');

const fillRoutes = async () => {
  const routes = await routingService.fillUrlHistory();
  logWrite('routes', routes);
};

const refreshRoutes = async () => {
  await routingService.refreshUrlHistoryIfNeeded();
};

const get301Pages = async () => {
  logWrite('get301Pages');
  const all = await routingService.getRoutingRules();
  logWrite('all routes count', all.length);
  for (let i = 0; i < (all.length > 100 ? 100 : all.length); i++) {
    const item = all[i];
    if (!item) {
      break;
    }
    const header = item.fromUrl ? item.fromUrl : 'no fromUrl';
    items.value.push({ header: header, data: item });
  }
  logWrite('all routes count', all.length);
};

const get301Length = async () => {
  const all = await routingService.getAllRoutes();
  logWrite('all routes count', all.length);
};

const getLatestRefresh = async () => {
  const lastUrlFetchTime = await routingService.getLastFetchTime();
  logWrite('Last fetch time for URL history:', lastUrlFetchTime);
  const all = await routingService.getAllRoutes();
  logWrite('all routes count', all.length);
};

const getLocalRoutes = async () => {
  const all = await routingService.getAllRoutes();
  logWrite('all routes count', all.length);
};

const testRoute = async () => {
  const route = await routingService.getRoute(url.value);
  logWrite('route', route);
};

const testRouteRedirect = async () => {
  const route = await routingService.getRoute(url.value);
  logWrite('route', route);
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

    <p>This page is used to test the routing service</p>

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
