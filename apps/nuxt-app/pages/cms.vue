<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Menu from '@/components/cms/Menu.vue';
import ContentArea from '~/components/cms/ContentArea.vue';
import { GeinsCore } from '@geins/core';
import { GeinsCMS } from '@geins/cms';
import type { Channel, MerchantApiCredentials, ContentAreaVariables, MenuType, ContentAreaType } from '@geins/types';
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

let slug = ref<string>('hej');
let family = ref<string>('Frontpage');
let area = ref<string>('The front page area');
let menuLocation = ref<string>('main-desktop');

const menuData = ref<MenuType>();
const pageData = ref<ContentAreaType>();


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
    items.value.unshift({
      header: `:: geinsCMS.content.area :: ----------------- :: [${new Date().toISOString()}]`,
      data: JSON.stringify(data)
    });
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
    items.value.unshift({
      header: `:: geinsCMS.page.alias :: ----------------- :: [${new Date().toISOString()}]`,
      data: JSON.stringify(data)
    });
  });
  geinsCMS.page.aliasParsed(slug.value).then((result) => {
    return result as ContentAreaType;
  }).then((contentArea) => {
    console.log('widgetArea:', contentArea);
    pageData.value = contentArea;
    items.value.unshift({
      header: `:: geinsCMS.page.aliasParsed :: ----------------- :: [${new Date().toISOString()}]`,
      data: JSON.stringify(contentArea)
    });
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
    items.value.unshift({
      header: `:: geinsCMS.menu.locationParsed :: ----------------- :: [${new Date().toISOString()}]`,
      data: JSON.stringify(data)
    });
  });

  geinsCMS.menu.locationParsed(menuLocation.value).then((result) => {
    return result as MenuType;
  }).then((menu) => {
    menuData.value = menu;
    items.value.unshift({
      header: `:: geinsCMS.menu.locationParsed :: ----------------- :: [${new Date().toISOString()}]`,
      data: JSON.stringify(menu)
    });

  });

};
</script>
<template>
  <div>
    <h2>Nuxt @geins/CMS Test</h2>
    <table>
      <tr>
        <td>
          <table>
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
          <div v-for=" (item, index) in items" :key="index">
            <p>
              <b>{{ item.header }}</b><br />
              <textarea style="border:0; width:900px; height:300px; "> {{ item.data }}</textarea>
            </p>
          </div>
        </td>
        <td></td>
        <td style="vertical-align: top;">
          <Menu v-if="menuData" :menu="menuData" />
          <ContentArea v-if="pageData" :family="family" :area="area" :data="pageData" />
        </td>
      </tr>
    </table>

  </div>
</template>
