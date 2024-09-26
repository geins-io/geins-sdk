<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { GeinsCredentials, } from '@geins/types';
import { logWrite, GeinsCore, gql } from '@geins/core';

const config = useRuntimeConfig();
const geinsCredentials = config.public.geins.credentials as GeinsCredentials;
const geinsCore = new GeinsCore(geinsCredentials);

const items = ref<any[]>([]);
const query = async () => {

  /*   const qu: GeinsQueryType = {
      query: gql`
        query test($test: String!) {
          test(test: $test) {
            header
            data
          }
        }
      `,
      variables: {
        test: 'test',
      },
    }; */
  geinsCore.openQueryClient.query('test', { test: 'test' });
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
