<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { GeinsSettings, } from '@geins/types';
import { logWrite, GeinsCore, gql } from '@geins/core';
import type { GeinsBrandListTypeType } from '@geins/types';


const config = useRuntimeConfig();
const geinsSettings = config.public.geins.settings as GeinsSettings;
const geinsCore = new GeinsCore(geinsSettings);


const items = ref<any[]>([]);
const query = async () => {
  const BRANDS_QUERY = gql`
    query Brands {
      brands {
        brandId
        name
        description
        logo
        canonicalUrl
      }
    }
  `;
  try {
    const data = await geinsCore.graphql.runQuery<
      { brands: GeinsBrandListTypeType[] }
    >(BRANDS_QUERY);

    if (data) {
      data.brands.forEach((brand) => {
        items.value.push({
          header: 'Brand',
          data: { description: brand.description }
        });
      });
    } else {
      console.error('No data returned from query.');
    }
  } catch (error) {
    console.error('Error fetching brands:', error);
  }

};


onMounted(() => {

});

const clear = async () => {
  items.value = [];
};
</script>
<template>
  <div>
    <h2>Nuxt @geins/core event</h2>
    <p>This page is for testing the event system</p>
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
              <td>
                <button @click="query">Query</button>
              </td>
              <td></td>
              <td></td>
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
              <textarea style="border: 0; width: 500px; height: 100px">{{
                JSON.stringify(item.data)
              }}</textarea>
            </p>
          </div>
        </td>
        <td></td>
        <td style="vertical-align: top">
          <!-- DATA -->
        </td>
      </tr>
    </table>
  </div>
</template>
