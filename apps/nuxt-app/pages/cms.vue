<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { GeinsCore } from '@geins/core';
import { GeinsCMS } from '@geins/cms';
import type { Channel, MerchantApiCredentials, ContentAreaVariables, MenuType } from '@geins/types';
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
const geinsCMS = new GeinsCMS(geinsCore);

let slug = ref<string>('om-oss');
let family = ref<string>('Frontpage');
let area = ref<string>('The front page area');
let menuLocation = ref<string>('main-desktop');

const getContentArea = () => {
  console.log('getting content area with family:""', family.value, '"and area:""', area.value, '"');
  geinsCMS.content.area(family.value, area.value).then((response) => {
    if (response.loading) {
      console.info('loading');
      return;
    }
    if (!response.data) {
      console.info('no data');
      return;
    }
    const data = response.data;
    items.value.unshift(JSON.stringify(data));
    items.value.unshift(`${new Date().toISOString()} :: -----------------`);
  });
};

const getPage = () => {
  console.log('getting page with slug:', slug.value);
  geinsCMS.page.alias(slug.value).then((response) => {
    if (response.loading) {
      console.info('loading');
      return;
    }
    if (!response.data) {
      console.info('no data');
      return;
    }
    const data = response.data;
    items.value.unshift(JSON.stringify(data));
    items.value.unshift(`${new Date().toISOString()} :: -----------------`);
  });
};
const getMenu = () => {
  console.log('getting menu at location slug:', menuLocation.value);
  geinsCMS.menu.location(menuLocation.value).then((response) => {
    if (response.loading) {
      console.info('loading');
      return;
    }
    if (!response.data) {
      console.info('no data');
      return;
    }
    const data = response.data;
    items.value.unshift(JSON.stringify(data));
    items.value.unshift(`:: geinsCMS.menu.location :: ----------------- :: [${new Date().toISOString()}]`);
  });
  geinsCMS.menu.locationParsed(menuLocation.value).then((result) => {
    return result as MenuType;
  }).then((menu) => {
    items.value.unshift(JSON.stringify(menu));
    items.value.unshift(`:: geinsCMS.menu.locationParsed :: ----------------- :: [${new Date().toISOString()}]`);
  });

};
</script>

<template>
  <div>
    <h2>Nuxt @geins/CMS Test</h2>
    <table style="border:0">
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
      <tr>
        <td></td>
        <td>slug:</td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td><input v-model="slug" /></td>
        <td><button @click="getPage">Get Page</button></td>
      </tr>
      <tr>
        <td></td>
        <td>slug:</td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td><input v-model="menuLocation" /></td>
        <td><button @click="getMenu">Get Menu</button></td>
      </tr>
    </table>
    <div v-for="(item, index) in items" :key="index">
      <p>
        <code>{{ item }}</code>
      </p>
    </div>
  </div>
</template>
