<script setup lang="ts">
import type { ContentAreaType, GeinsSettings } from '@geins/types';
import { logWrite, GeinsCore, AUTH_COOKIES } from '@geins/core';
import { GeinsCMS } from '@geins/cms';
import { authClaimsTokenSerializeToObject } from '@geins/crm';
const config = useRuntimeConfig();
const geinsSettings = config.public.geins.settings as GeinsSettings;
const geinsCore = new GeinsCore(geinsSettings);
const geinsCMS = new GeinsCMS(geinsCore);
const user = ref<any>();
const items = ref<{ header: string; data: string }[]>([]);
const pageData = ref<ContentAreaType>();
const resetComponentData = () => {
  pageData.value = undefined;
};

const slug = ref('hej');

const getUser = async () => {
  const userAuth = geinsCore.cookies.get(AUTH_COOKIES.USER_AUTH);
  if (userAuth) {
    const userObj = authClaimsTokenSerializeToObject(userAuth);
    user.value = userObj;
  }
};

const getPage = async () => {
  resetComponentData();
  logWrite('getting page with slug:', slug.value);

  const { data } = await useAsyncData('page', () =>
    geinsCMS.page.getRaw({ alias: slug.value }),
  );

  const contentPage = data.value?.data;
  items.value.unshift({
    header: `:: geinsCMS.page.get  :: [${new Date().toISOString()}]`,
    data: JSON.stringify(contentPage),
  });

  geinsCMS.page
    .get({ alias: slug.value })
    .then((result) => {
      return result as ContentAreaType;
    })
    .then((contentArea: ContentAreaType) => {
      logWrite('widgetArea:', contentArea);
      pageData.value = contentArea;
      items.value.unshift({
        header: `:: geinsCMS.page.get :: [${new Date().toISOString()}]`,
        data: JSON.stringify(contentArea),
      });
    });
};

const clear = async () => {
  resetComponentData();
  items.value = [];
};

onMounted(() => {
  getUser();
});
</script>
<template>
  <div>
    <h2>Nuxt @geins/cms content</h2>
    <p>
      This page demonstrates the usage of the GeinsCMS class and the useGeinsCMS
      composition function.
    </p>
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
              <td colspan="3">
                <div v-if="user">
                  <b>User:</b>
                  <pre>{{ user }}</pre>
                </div>
                <div v-else>
                  <b>No user logged in</b>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <hr />
              </td>
            </tr>
            <tr>
              <td>Filters:</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td colspan="3">
                <hr />
              </td>
            </tr>
            <tr>
              <td>Slug:</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td><input v-model="slug" /></td>
              <td><button @click="getPage">Get Page</button></td>
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
              <b>{{ item.header }}</b
              ><br />
              <textarea
                v-model="item.data"
                style="border: 0; width: 600px; height: 300px"
              ></textarea>
            </p>
          </div>
        </td>
        <td></td>
        <td style="vertical-align: top; padding-left: 50px">
          <b>Page SLUG: {{ slug }}</b>
          <CmsContentArea v-if="pageData" :data="pageData" />
        </td>
      </tr>
    </table>
  </div>
</template>
