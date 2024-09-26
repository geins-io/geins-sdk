<script setup lang="ts">
import { useNuxtApp } from '#app';
import { ref, onMounted } from 'vue';
import type {
  GeinsSettings,
  BrandsQueryVariables,
  GeinsBrandListTypeType,
} from '@geins/types';
import { logWrite, GeinsCore } from '@geins/core';
import { GeinsPIM } from '@geins/pim';
import MarketAndLanguage from '~/components/MarketAndLanguage.vue';

const { $currentChannel } = useNuxtApp();
const config = useRuntimeConfig();
const items = ref<{ header: string; data: string }[]>([]);
const marketAndLanguage = ref({
  marketId: $currentChannel.defaultMarketId,
  languageId: $currentChannel.defaultLanguageId,
});

const geinsSettings = config.public.geins.settings as GeinsSettings;
const geinsCore = new GeinsCore(geinsSettings);
const geinsPIM = new GeinsPIM(geinsCore);

const brands = ref<GeinsBrandListTypeType[]>([]);

const getBrands = async () => {
  const brandsVars: BrandsQueryVariables = {
    marketId: marketAndLanguage.value.marketId,
    languageId: marketAndLanguage.value.languageId,
  };
  brands.value = await geinsPIM.brands.get(brandsVars);
  logWrite('brands', brands.value);
};

const clear = async () => {
  brands.value = [];
  items.value = [];
  logWrite('clear');
};

onMounted(async () => {});
</script>
<template>
  <div>
    <h2>Nuxt @geins/pim brand</h2>
    <p>This is a page to test brands from @geins/pim</p>
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
                <button @click="getBrands">Get Brands</button>
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
              <b>{{ item.header }}</b
              ><br />
              <textarea
                v-model="item.data"
                style="border: 0; width: 600px; height: 100px"
              ></textarea>
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
                <td>Logo:</td>
                <td>Name:</td>
                <td>Alias/Slug:</td>
                <td>Canonical url</td>
              </tr>
              <tr v-for="(brand, index) in brands" :key="index">
                <td>{{ brand.brandId }}</td>
                <td>
                  <img
                    v-if="brand.logo"
                    :src="`${geinsCore.endpoints.image}/product/40x40/${brand.logo}`"
                  />
                  <i v-else>x</i>
                </td>

                <td>{{ brand.name }}</td>
                <td>
                  <a :href="`/brand/${brand.alias}`">
                    {{ brand.alias }}
                  </a>
                </td>
                <td>
                  <a :href="`${brand.canonicalUrl}`">
                    {{ brand.canonicalUrl }}
                  </a>
                </td>
              </tr>
            </table>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>
