<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { logWrite, GeinsCore, AuthClientConnectionMode } from '@geins/core';
import type { GeinsCredentials, AuthSettings } from '@geins/types';
import { GeinsCRM } from '@geins/crm';
import CookieDump from '~/components/CookieDump.vue';

const config = useRuntimeConfig();
const geinsCredentials = config.public.geins.credentials as GeinsCredentials;
const authSettings = {
  clientConnectionMode: AuthClientConnectionMode.Direct,
} as AuthSettings;

const geinsCore = new GeinsCore(geinsCredentials);
const geinsCRM = new GeinsCRM(geinsCore, authSettings);
const timeToLoggout = ref<number>(900);
const isLoggedIn = ref<boolean>(false);
const userObject = ref<any>(null);
const authObject = ref<any>(null);

const checkUserLoggedIn = () => {
  const result = geinsCRM.user.isLoggedIn();
  if (result === true) {
    isLoggedIn.value = true;
    return true;
  } else {
    isLoggedIn.value = false;
    return false;
  }
};

const userLoggedIn = computed(() => {
  checkUserLoggedIn();
  return isLoggedIn.value;
});

const setAuthObject = async (response: any) => {
  authObject.value = response;
  response?.tokens?.expiresIn
    ? (timeToLoggout.value = response.tokens.expiresIn)
    : null;
};

const getAuthObject = async () => {
  await geinsCRM.auth.getUser().then((response) => {
    setAuthObject(response);
  });
};

const setUserObject = async () => {
  await geinsCRM.user.get().then((response) => {
    userObject.value = response;
  });
};

onMounted(async () => {
  await setUserObject();
  await getAuthObject();
  setInterval(() => {
    timeToLoggout.value -= 1;
    if (timeToLoggout.value <= 0) {
      geinsCRM.auth.logout();
    }
  }, 1000);
});

/**
 * Fetches and updates the user information.
 */
const getUser = async () => {
  setUserObject();
};

/**
 * Handles token refresh based on the current connection type.
 */
const handleRefresh = async () => {
  geinsCRM.auth.refresh().then((response) => {
    authObject.value = response;
    setAuthObject(response);
  });
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
                <button :disabled="userLoggedIn === false" @click="getUser">
                  Get User
                </button>
                <button :disabled="userLoggedIn === false" @click="handleRefresh">
                  Refresh
                </button>
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
          <div v-if="userLoggedIn">
            <b>Time to logout: {{ timeToLoggout }}</b><br /><br />
          </div>
          <div v-if="authObject" style="width: 500px; overflow-x: scroll">
            <b>Auth Object:</b>
            <pre>{{ JSON.stringify(authObject, null, 2) }}</pre>
          </div>

          <div v-if="userObject" style="width: 500px; overflow-x: scroll">
            <b>User Object:</b>
            <pre>{{ JSON.stringify(userObject, null, 2) }}</pre>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>
