<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { logWrite, GeinsCore, buildEndpoints } from '@geins/core';
import type { GeinsCredentials } from '@geins/core';
import {
  AuthClientDirect,
  AuthClientProxy,
  authClaimsTokenSerialize,
  authClaimsTokenSerializeToObject,
} from '@geins/crm';

enum Connection {
  Proxy = 'Proxy',
  Direct = 'Direct',
  None = 'None',
}

type ConnectionType = Connection.Proxy | Connection.Direct | Connection.None;

const config = useRuntimeConfig();
const items = ref<any[]>([]);
const user = ref<any>({});
const connectionType = ref<ConnectionType>(Connection.Direct);

const geinsCredentials = config.public.geins.credentials as GeinsCredentials;

const endpoints = buildEndpoints(
  geinsCredentials.apiKey,
  geinsCredentials.accountName,
  geinsCredentials.environment,
);

const geinsCore = new GeinsCore(geinsCredentials);
const authClientProxy = new AuthClientProxy('/api/auth');
const authClientDirect = new AuthClientDirect(
  endpoints.authSign,
  endpoints.auth,
);

const userLoggedIn = computed(() => {
  return false;
  //return user.value && user.value?.tokens?.expired === false;
});

const authClient = computed(() => {
  if (connectionType.value === Connection.Proxy) {
    return authClientProxy;
  } else {
    return authClientDirect;
  }
});

onMounted(async () => {
  connectionType.value = Connection.Direct;
  updateCookiesDisplay();
  await getUser();
});
/**
 * Fetches and updates the user information.
 */
const setConnectionType = async (type: ConnectionType) => {
  if (type === Connection.None) {
    return;
  }
  // handleLogout();
  connectionType.value = type;
};

/**
 * Fetches and updates the user information.
 */
const getUser = async () => {
  const result = await authClient.value?.getUser();
  logWrite(`Getting user by: ${connectionType.value}`, result);
  updateCookiesDisplay();
  user.value = result;
};

/**
 * Handles token refresh based on the current connection type.
 */
const handleRefresh = async () => {
  const result = await authClient.value?.refresh();
  logWrite(`handleRefresh() result`, result);
  updateCookiesDisplay();
  user.value = result;
};

/**
 * Updates the displayed cookies.
 */
const updateCookiesDisplay = () => {
  items.value = [];
  const allCookies = geinsCore.cookies.getAll() as any;
  for (const key in allCookies) {
    items.value.push({
      header: key,
      data: JSON.stringify(allCookies[key], null, 2),
    });
  }
};
</script>

<template>
  <div>
    <h2>Nuxt @geins/crm auth</h2>

    <p>
      This page demonstrates the usage of the AuthClientProxy and
      AuthClientDirect classes.
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
              <td>
                1. Connection Type <b>{{ connectionType }}</b>:
              </td>
            </tr>
            <tr>
              <td>
                <button :disabled="userLoggedIn || connectionType === Connection.Direct
                  " @click="setConnectionType(Connection.Direct)">
                  Set to Direct
                </button>
                <button :disabled="userLoggedIn || connectionType === Connection.Proxy
                  " @click="setConnectionType(Connection.Proxy)">
                  Set to Proxy
                </button>
              </td>
            </tr>
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
            Current CRM cookies:
            <div v-for="(item, index) in items" v-if="items.length > 0" :key="index">
              <p>
                <b>{{ item.header }}</b><br />
                <textarea :style="{
                  border: 0,
                  width: '400px',
                  height:
                    item.data.length > 100
                      ? Math.min(200, item.data.length * 10) + 'px'
                      : '20px',
                }">{{ item.data }}</textarea>
              </p>
            </div>
            <i v-else> ... no cookies set </i>
          </div>
        </td>
        <td style="vertical-align: top; padding-left: 50px">
          <div v-if="connectionType">
            <b>Connection Type:</b>
            <pre>{{ connectionType }}</pre>
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
