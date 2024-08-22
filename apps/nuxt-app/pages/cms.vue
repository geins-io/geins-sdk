<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { GeinsCore } from '@geins/core';
import { GeinsCMS, type ContentAreaVariabels } from '@geins/cms';
import type { GeinsAPILocalization } from '@geins/types';
const runtimeConfig = useRuntimeConfig();
const items = ref<any[]>([]);

const localization: GeinsAPILocalization = {
  ...runtimeConfig.public.geins.localization,
};

const geinsCore = new GeinsCore({
  apiKey: runtimeConfig.public.geins.apiKey,
  accountName: runtimeConfig.public.geins.accountName,
});
const geinsCMS = new GeinsCMS(geinsCore);

const getContentArea = () => {
  geinsCMS.content
    .area('Frontpage', 'The front page area', {}, localization)
    .then((response) => {
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
  geinsCMS.content.page('om-oss', {}, localization).then((response) => {
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
</script>
<template>
  <div>
    <h2>Nuxt @geins/CMS Test</h2>
    <button @click="getContentArea">Get Content Area</button>
    <button @click="getPage">Get Page</button>
    <br /><br />

    <div v-for="(item, index) in items" :key="index">
      <code>{{ item }}</code>
    </div>
  </div>
</template>
