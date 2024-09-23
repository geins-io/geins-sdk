<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { logWrite, GeinsCore, AuthClientConnectionMode } from '@geins/core';
import type { GeinsCredentials, AuthSettings } from '@geins/types';
import { GeinsCRM } from '@geins/crm';
const config = useRuntimeConfig();
const geinsCredentials = config.public.geins.credentials as GeinsCredentials;
const authSettings = {
  clientConnectionMode: AuthClientConnectionMode.Direct,
} as AuthSettings;
const geinsCore = new GeinsCore(geinsCredentials);
const geinsCRM = new GeinsCRM(geinsCore, authSettings);

const user = ref<any>(null);
const userLoggedIn = computed(() => {
  return geinsCRM.user.isLoggedIn();
});
const userLoggedInObject = computed(async () => {
  const user = await geinsCRM.user.get();
  //const orders = await geinsCRM.user.orders();
  logWrite(`userLoggedInObject`, user);
  return user;
});

onMounted(async () => {
  //updateCookiesDisplay();
  // await getUser();
});

/**
 * Fetches and updates the user information.
 */
const getUser = async () => {
  /*   const result = await authClient.value?.getUser();
  logWrite(`Getting user by: ${connectionType.value}`, result);
  updateCookiesDisplay();
  user.value = result; */
};

/**
 * Handles token refresh based on the current connection type.
 */
const handleRefresh = async () => {
  /*   const result = await authClient.value?.refresh();
  logWrite(`handleRefresh() result`, result);
  updateCookiesDisplay();
  user.value = result; */
};

/**
 * Updates the displayed cookies.
 */
const updateCookiesDisplay = () => {
  /*   items.value = [];
  const allCookies = geinsCore.cookies.getAll() as any;
  for (const key in allCookies) {
    items.value.push({
      header: key,
      data: JSON.stringify(allCookies[key], null, 2),
    });
  } */
};
</script>

<template>
  <div>
    <h2>Nuxt @geins/crm current user</h2>

    <p>
      This page demonstrates how to use the <b>@geins/crm</b> package to get the
      current user.
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
              <td>2. Actions:</td>
            </tr>
            <tr>
              <td>
                <button @click="getUser">Get User</button>
                <button @click="handleRefresh">Refresh</button>
              </td>
            </tr>
          </table>
          <hr />
          <div>
            <CookieDump />
          </div>
        </td>
        <td style="vertical-align: top; padding-left: 50px">
          <b>User is logged in: {{ userLoggedIn }}</b><br /><br />
          <div>
            <b>User Object:</b>
            <pre>{{ JSON.stringify(userLoggedInObject, null, 2) }}</pre>
          </div>

          <div v-if="user" style="width: 500px; overflow-x: scroll">
            <b>Response Object:</b>
            <pre>{{ JSON.stringify(user, null, 2) }}</pre>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>
