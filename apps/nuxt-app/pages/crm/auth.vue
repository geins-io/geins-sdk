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
//import { AuthClientDirect, AuthClientProxy } from '../../utils/auth';

enum Connection {
  Proxy = 'Proxy',
  Direct = 'Direct',
  None = 'None',
}

type ConnectionType = Connection.Proxy | Connection.Direct | Connection.None;

const config = useRuntimeConfig();
const items = ref<any[]>([]);
const user = ref<any>({});
const connectionType = ref<ConnectionType>(Connection.None);
const username = ref<string>('arvidsson@geins.io');
const password = ref<string>('8yifjxvujx95ie2vdkml8d');
const rememberUser = ref<boolean>(true);

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

const credentials = computed(() => ({
  username: username.value,
  password: password.value,
  rememberUser: rememberUser.value,
}));

const newPassword = computed(
  () =>
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15),
);

const userLoggedIn = computed(() => {
  return user.value && user.value?.tokens?.expired === false;
});

const authClient = computed(() => {
  if (connectionType.value === Connection.Proxy) {
    return authClientProxy;
  } else {
    return authClientDirect;
  }
});

onMounted(() => {
  updateCookiesDisplay();
});

/**
 * Fetches and updates the user information.
 */
const setConnectionType = async (type: ConnectionType) => {
  if (type === Connection.None) {
    return;
  }
  handleLogout();
  connectionType.value = type;
  updateUser();
};

const spoofUser = () => {
  const spoofToken1 =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiQWRtaW5QcmV2aWV3IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiUmVnaXN0ZXJlZCIsIkRyYWZ0SWQiOiIyNCIsIlNwb29mRGF0ZSI6IjIwMjQtMDktMjEgMTI6MDA6MDAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjcxNTVlYjM3LTJkODgtZmEzYi05MGY4LWYyYzdhYjQ1MzM2NyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3NpZCI6IjcxNTVlYjM3LTJkODgtZmEzYi05MGY4LWYyYzdhYjQ1MzM2NyIsIlNwb29mZWRCeSI6ImFydmlkc3NvbkBnZWlucy5pbyIsImV4cCI6MTcyNTg5NjU5MiwiaXNzIjoiQ2FyaXNtYXIgU29mdHdhcmUgQUIifQ.lU-zyRwoWJjE36Vnn7AmK6xO3WHik1p2_4I4RyoOCUg';
  const spoofToken2 =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiQWRtaW5QcmV2aWV3IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiUmVnaXN0ZXJlZCIsIkRyYWZ0SWQiOiIyNCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiNzE1NWViMzctMmQ4OC1mYTNiLTkwZjgtZjJjN2FiNDUzMzY3IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvc2lkIjoiNzE1NWViMzctMmQ4OC1mYTNiLTkwZjgtZjJjN2FiNDUzMzY3IiwiU3Bvb2ZlZEJ5IjoiYXJ2aWRzc29uQGdlaW5zLmlvIiwiZXhwIjoxNzI1ODk2ODgyLCJpc3MiOiJDYXJpc21hciBTb2Z0d2FyZSBBQiJ9.ODGfzT9zljVDvkmY3eAZwBKlMQpb_UWEAYDlvq-e_GY';
  const spoofToken3 =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiQWRtaW5QcmV2aWV3IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiUmVnaXN0ZXJlZCIsIkRyYWZ0SWQiOiIyMSIsIlNwb29mRGF0ZSI6IjIwMjQtMDktMjUgMjI6MDA6MDAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjcxNTVlYjM3LTJkODgtZmEzYi05MGY4LWYyYzdhYjQ1MzM2NyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3NpZCI6IjcxNTVlYjM3LTJkODgtZmEzYi05MGY4LWYyYzdhYjQ1MzM2NyIsIlNwb29mZWRCeSI6ImFydmlkc3NvbkBnZWlucy5pbyIsImV4cCI6MTcyNTg5NzA1OCwiaXNzIjoiQ2FyaXNtYXIgU29mdHdhcmUgQUIifQ.D1gfXMw9vkFj5eQVUdVj-Oww2vd-jvWff7uGNFDb3FQ';
  const spoofToken4 =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiQWRtaW5QcmV2aWV3IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiUmVnaXN0ZXJlZCIsIkRyYWZ0SWQiOiIyNSIsIlNwb29mRGF0ZSI6IjIwMjQtMDktMTcgMjI6MDA6MDAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjcxNTVlYjM3LTJkODgtZmEzYi05MGY4LWYyYzdhYjQ1MzM2NyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3NpZCI6IjcxNTVlYjM3LTJkODgtZmEzYi05MGY4LWYyYzdhYjQ1MzM2NyIsIlNwb29mZWRCeSI6ImFydmlkc3NvbkBnZWlucy5pbyIsImV4cCI6MTcyNTg5NzIxMSwiaXNzIjoiQ2FyaXNtYXIgU29mdHdhcmUgQUIifQ.uqXT-hGy4HLqmE5sKggQPcF8bmgxr62dyQ1lAbEwkDM';

  const spoofToken5 =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiQWRtaW5QcmV2aWV3IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiUmVnaXN0ZXJlZCIsIkRyYWZ0SWQiOiIyNSIsIlNwb29mRGF0ZSI6IjIwMjQtMDktMTggMjI6MDA6MDAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjcxNTVlYjM3LTJkODgtZmEzYi05MGY4LWYyYzdhYjQ1MzM2NyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3NpZCI6IjcxNTVlYjM3LTJkODgtZmEzYi05MGY4LWYyYzdhYjQ1MzM2NyIsIlNwb29mZWRCeSI6ImFydmlkc3NvbkBnZWlucy5pbyIsImV4cCI6MTcyNTg5ODAxNiwiaXNzIjoiQ2FyaXNtYXIgU29mdHdhcmUgQUIifQ.8urktUiZCYpIH8q4YPME-3JC4opOLLoh7P1cmfNXYwA';

  const spoofToken6 =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiQWRtaW5QcmV2aWV3IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiUmVnaXN0ZXJlZCIsIkRyYWZ0SWQiOiIyNSIsIlNwb29mRGF0ZSI6IjIwMjQtMDktMTggMjI6MDA6MDAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjcxNTVlYjM3LTJkODgtZmEzYi05MGY4LWYyYzdhYjQ1MzM2NyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3NpZCI6IjcxNTVlYjM3LTJkODgtZmEzYi05MGY4LWYyYzdhYjQ1MzM2NyIsIlNwb29mZWRCeSI6ImFydmlkc3NvbkBnZWlucy5pbyIsImV4cCI6MTcyNTg5ODAxNiwiaXNzIjoiQ2FyaXNtYXIgU29mdHdhcmUgQUIifQ.8urktUiZCYpIH8q4YPME-3JC4opOLLoh7P1cmfNXYwA0';

  const user1 = authClaimsTokenSerializeToObject(spoofToken1);
  logWrite(`Spoofing user 1`, user1);
  const user2 = authClaimsTokenSerializeToObject(spoofToken2);
  logWrite(`Spoofing user 2`, user2);
  const user3 = authClaimsTokenSerializeToObject(spoofToken3);
  logWrite(`Spoofing user 3`, user3);
  const user4 = authClaimsTokenSerializeToObject(spoofToken4);
  logWrite(`Spoofing user 4`, user4);
  const user5 = authClaimsTokenSerializeToObject(spoofToken5);
  logWrite(`Spoofing user 5`, user5);
  const user6 = authClaimsTokenSerializeToObject(spoofToken6);
  logWrite(`Spoofing user 6`, user6);
};

const clearCookies = () => {
  authClientDirect.clearCookies();
  updateCookiesDisplay();
};

/**
 * Fetches and updates the user information.
 */
const updateUser = async () => {
  const result = await authClient.value?.getUser();
  logWrite(`Getting user by: ${connectionType.value}`, result);
  if (result) {
    user.value = result;
  }
  updateCookiesDisplay();
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

/**
 * Helper function to handle user login using Proxy or Direct connection.
 * @param {ConnectionType} type - The connection type.
 * @param {boolean} validCredentials - Whether to use valid or invalid credentials.
 */
const handleLogin = async (validCredentials = true) => {
  const loginCredentials = validCredentials
    ? credentials.value
    : {
      username: 'error',
      password: 'error',
      rememberUser: true,
    };
  const result = await authClient.value?.login(loginCredentials);
  user.value = result;
  updateUser();
};

/**
 * Handles logout based on the current connection type.
 */
const handleLogout = async () => {
  const result = await authClient.value?.logout();
  user.value = undefined;
  updateUser();
};

/**
 * Handles token refresh based on the current connection type.
 */
const handleRefresh = async () => {
  const result = await authClient.value?.refresh();

  updateUser();
};

/**
 * Handles user registration based on the current connection type.
 */
const handleRegister = async () => {
  logWrite(`Not yet implemented`, credentials.value);
  //const result = await authClient.value?.register(credentials.value);
  //updateUser();
};

/**
 * Handles password change based on the current connection type.
 */
const handleChangePassword = async () => {
  const newPasswordCredentials = {
    ...credentials.value,
    newPassword: newPassword.value,
  };
  const result = await authClient.value?.changePassword(newPasswordCredentials);
  console.log(`[auth.vue] - handleChangePassword() result`, result);
  password.value = newPassword.value;
  updateUser();
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
      <b><a href="/"> GO BACK </a></b>
    </p>

    <table>
      <tr>
        <td style="vertical-align: top">
          <table>
            <tr>
              <td>
                <table>
                  <tr>
                    <td>1. Crentials:</td>
                  </tr>
                  <tr>
                    <td>
                      <table>
                        <tr>
                          <td>
                            username:<br />
                            <input v-model="username" />
                          </td>
                          <td>
                            password:<br />
                            <input v-model="password" style="width: 250px" />
                          </td>
                          <td>
                            remember: <br />
                            <input v-model="rememberUser" type="checkbox" title="uawe" />
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <hr />
              </td>
            </tr>
            <tr>
              <td>
                2. Connection Type <b>{{ connectionType }}</b>:
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
              <td>
                <hr />
              </td>
            </tr>
            <tr>
              <td>3. Login</td>
            </tr>
            <tr>
              <td>
                <button :disabled="userLoggedIn || connectionType === Connection.None" @click="handleLogin(true)">
                  Login Good
                </button>
                <button :disabled="userLoggedIn || connectionType === Connection.None" @click="handleLogin(false)">
                  Login Bad
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <hr />
              </td>
            </tr>
            <tr>
              <td>4. Logedin Actions</td>
            </tr>
            <tr>
              <td>
                <button :disabled="!userLoggedIn || connectionType === Connection.None
                  " @click="updateUser">
                  Get User
                </button>
                <button :disabled="!userLoggedIn || connectionType === Connection.None
                  " @click="handleRefresh">
                  Refresh
                </button>
                <button :disabled="!userLoggedIn || connectionType === Connection.None
                  " @click="handleChangePassword">
                  Change Password
                </button>
                <button :disabled="!userLoggedIn || connectionType === Connection.None
                  " @click="handleLogout">
                  Logout
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <hr />
              </td>
            </tr>
            <tr>
              <td>Other Actions</td>
            </tr>
            <tr>
              <td>
                <button :disabled="userLoggedIn || connectionType === Connection.None" @click="handleRegister">
                  Register new User
                </button>

                <button @click="spoofUser">Spoof User</button>
                <button @click="clearCookies">Clear Cookies</button>
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
            <b>User Object:</b>
            <pre>{{ JSON.stringify(user, null, 2) }}</pre>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>
