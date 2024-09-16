<script setup lang="ts">
import { useNuxtApp } from '#app';
import { ref, onMounted } from 'vue';
import type { GeinsCredentials, MarketType } from '@geins/types';
import { logWrite, GeinsCore } from '@geins/core';
import { GeinsPIM } from '@geins/pim';
import MarketAndLanguage from '~/components/MarketAndLanguage.vue';
import Input from '~/components/controls/Input.vue';

const { $currentChannel } = useNuxtApp();
const config = useRuntimeConfig();

const geinsCredentials = config.public.geins.credentials as GeinsCredentials;
const geinsCore = new GeinsCore(geinsCredentials);

const items = ref<{ header: string; data: string }[]>([]);

const marketAndLanguage = ref({
  marketId: '',
  languageId: '',
});
const testar = ref('');

const languageId = ref();
const marketId = ref();
const markets = ref<{ name: string; data: any }[]>([]);

const brands = ref<any[]>([]);

const getBrands = async () => {
  logWrite('Get Brands', marketAndLanguage.value);
};

const clear = async () => {
  items.value = [];
};

// computed prop to get market languages
const marketLanguages = computed(() => {
  if (markets.value.length > 0) {
    const market = markets.value.find((x) => x.data.id === marketId.value);
    const result = market?.data?.allowedLanguages;
    logWrite('Market Languages:', result);
    return result || [];
  }
  return [];
});

onMounted(() => {
  /*   // set markets
  let marketsData = $currentChannel.markets;
  const defaultMarket = $currentChannel.defaultMarketId;
  const defaultLanguage = $currentChannel.defaultLanguageId;
  const defaultGroupKey = $currentChannel.markets.find(
    (x) => x.id === defaultMarket,
  )?.groupKey;

  // sort markets by groupKey and default market first and default groupKey first
  marketsData = marketsData.sort((a, b) => {
    if (a.groupKey === defaultGroupKey) return -1;
    if (b.groupKey === defaultGroupKey) return 1;
    if (a.id === defaultMarket) return -1;
    if (b.id === defaultMarket) return 1;
    return a.groupKey.localeCompare(b.groupKey);
  });
  for (let index = 0; index < marketsData.length; index++) {
    const element = marketsData[index];
    markets.value.push({ name: element.alias, data: element });
  }
  marketId.value = defaultMarket; */
});
</script>
<template>
  <div>
    <h2>Nuxt @geins/pim brand</h2>
    <p>This is a brand page for products</p>
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
              <td><b>Options:</b></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td colspan="3">
                <MarketAndLanguage v-model="marketAndLanguage" />
              </td>
            </tr>

            <tr>
              <td colspan="3">
                <hr />
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <button @click="getBrands">Get All Brands</button>
              </td>
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
              <textarea v-model="item.data" style="border: 0; width: 600px; height: 100px"></textarea>
            </p>
          </div>
        </td>
        <td></td>

        <td style="padding-left: 50px; vertical-align: top">
          <div>
            <h3>Brands</h3>

            <table>
              <tr style="font-weight: bold">
                <td>Id:</td>
                <td>Image:</td>
                <td>Name:</td>
              </tr>
            </table>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>
