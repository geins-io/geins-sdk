<script setup lang="ts">
import type { MenuType, ContentAreaType, GeinsCredentials } from '@geins/types';
import { logWrite, GeinsCore, AUTH_COOKIES } from '@geins/core';
import { GeinsCMS } from '@geins/cms';
import { authClaimsTokenSerializeToObject } from '@geins/crm';
const config = useRuntimeConfig();
const geinsCredentials = config.public.geins.credentials as GeinsCredentials;
const geinsCore = new GeinsCore(geinsCredentials);
const geinsCMS = new GeinsCMS(geinsCore);

const user = ref<any>();
const items = ref<{ header: string; data: string }[]>([]);
const menuData = ref<MenuType>();

const resetComponentData = () => {
  menuData.value = undefined;
};

const menuLocation = ref('main-desktop');

const getUser = async () => {
  const userAuth = geinsCore.cookies.get(AUTH_COOKIES.USER_AUTH);
  if (userAuth) {
    const userObj = authClaimsTokenSerializeToObject(userAuth);
    user.value = userObj;
  }
};

const fetchMenu = async () => {
  resetComponentData();
  logWrite('getting menu at location slug:', menuLocation.value);

  const { data } = await useAsyncData('menu', () =>
    geinsCMS.menu.get({ menuLocationId: menuLocation.value }),
  );

  const menu = data.value?.data;

  items.value.unshift({
    header: `:: useGeinsCMS.getMenu  :: [${new Date().toISOString()}]`,
    data: JSON.stringify(menu),
  });

  geinsCMS.menu
    .getParsed({ menuLocationId: menuLocation.value })
    .then((result) => {
      return result as MenuType;
    })
    .then((menu: MenuType) => {
      menuData.value = menu;
      items.value.unshift({
        header: `:: geinsCMS.menu.getParsed  :: [${new Date().toISOString()}]`,
        data: JSON.stringify(menu),
      });
    });
};

const clear = async () => {
  resetComponentData();
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
      <b><a href="/"> GO BACK </a></b>
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
              <td>menu location id:</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td><input v-model="menuLocation" /></td>
              <td><button @click="fetchMenu">Get Menu</button></td>
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
              <textarea v-model="item.data" style="border: 0; width: 600px; height: 300px"></textarea>
            </p>
          </div>
        </td>
        <td></td>
        <td style="padding-left: 50px; vertical-align: top">
          <CmsMenu v-if="menuData" :menu="menuData" />
        </td>
      </tr>
    </table>
  </div>
</template>
