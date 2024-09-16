<script setup lang="ts">
import type { GeinsCredentials } from '@geins/types';
import {
  logWrite,
  GeinsCore,
  ProductListSortType,
  ProductFilterModeType,
} from '@geins/core';
import { GeinsPIM } from '@geins/pim';

const config = useRuntimeConfig();

const geinsCredentials = config.public.geins.credentials as GeinsCredentials;
const geinsCore = new GeinsCore(geinsCredentials);
const languageId = ref('en');
const marketId = ref('en');

const items = ref<{ header: string; data: string }[]>([]);
const brands = ref<any[]>([]);

const getBrands = async () => { };

const clear = async () => {
  items.value = [];
};

onMounted(() => { });
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
              <td>LanguageId:</td>
              <td><input v-model="languageId" style="width: 100px" /></td>
              <td></td>
            </tr>
            <tr>
              <td>MarketId:</td>
              <td><input v-model="marketId" style="width: 100px" /></td>
              <td></td>
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
