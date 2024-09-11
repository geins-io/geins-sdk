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
const pageData = ref<ContentAreaType>();

const resetComponentData = () => {
  menuData.value = undefined;
  pageData.value = undefined;
};

const family = ref('Frontpage');
const areaName = ref('The front page area');
const slug = ref('hej');
const menuLocation = ref('main-desktop');

const getUser = async () => {
  const userAuth = geinsCore.cookies.get(AUTH_COOKIES.USER_AUTH);
  logWrite('user token:', userAuth);

  if (userAuth) {
    const userObj = authClaimsTokenSerializeToObject(userAuth);

    logWrite('user obj:', userObj);
    user.value = userObj;
  }
};

const getAreaData = async () => {
  resetComponentData();
  logWrite(
    'getting content area with family:""' +
    family.value +
    '"and area:""' +
    areaName.value +
    '"',
  );

  const { data } = await useAsyncData('contentArea', () =>
    geinsCMS.area.get({ family: family.value, areaName: areaName.value }),
  );
  const contentArea = data.value?.data;

  items.value.unshift({
    header: `:: useGeinsCMS.getContentArea  :: [${new Date().toISOString()}]`,
    data: JSON.stringify(contentArea),
  });

  geinsCMS.area
    .getParsed({ family: family.value, areaName: areaName.value })
    .then((result) => {
      return result as ContentAreaType;
    })
    .then((contentArea: ContentAreaType) => {
      logWrite('widgetArea:', contentArea);
      pageData.value = contentArea;
      items.value.unshift({
        header: `:: geinsCMS.area.getParsed  :: [${new Date().toISOString()}]`,
        data: JSON.stringify(contentArea),
      });
    });
};

const getPage = async () => {
  resetComponentData();
  logWrite('getting page with slug:', slug.value);

  const { data } = await useAsyncData('page', () =>
    geinsCMS.page.get({ alias: slug.value }),
  );

  const contentPage = data.value?.data;

  items.value.unshift({
    header: `:: useGeinsCMS.getContentPage  :: [${new Date().toISOString()}]`,
    data: JSON.stringify(contentPage),
  });
  geinsCMS.page
    .getParsed({ alias: slug.value })
    .then((result) => {
      return result as ContentAreaType;
    })
    .then((contentArea: ContentAreaType) => {
      logWrite('widgetArea:', contentArea);
      pageData.value = contentArea;
      items.value.unshift({
        header: `:: geinsCMS.page.getParsed  :: [${new Date().toISOString()}]`,
        data: JSON.stringify(contentArea),
      });
    });
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
              <td>family:</td>
              <td>area:</td>
              <td></td>
            </tr>
            <tr>
              <td><input v-model="family" /></td>
              <td><input v-model="areaName" /></td>
              <td><button @click="getAreaData">Get Content Area</button></td>
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
              <td>menu location id:</td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td><input v-model="menuLocation" /></td>
              <td><button @click="fetchMenu">Get Menu</button></td>
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
        <td style="vertical-align: top">
          <CmsMenu v-if="menuData" :menu="menuData" />
          <CmsContentArea v-if="pageData" :family="family" :area="areaName" :data="pageData" />
        </td>
      </tr>
    </table>
  </div>
</template>
