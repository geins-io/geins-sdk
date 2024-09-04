<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { GeinsCore, buildEndpoints } from '@geins/core';
import type { Channel, MerchantApiCredentials } from '@geins/core';
import { AuthClientDirect, AuthClientProxy } from '@geins/crm';
/* import { AuthClientDirect } from '../utils/authClientDirect';
import { AuthClientProxy } from '../utils/authClientProxy'; */


enum ConnectionType {
  Proxy = 'Proxy',
  Direct = 'Direct',
}

const runtimeConfig = useRuntimeConfig();
const items = ref<any[]>([]);
const user = ref<any>({});
const connectionType = ref<ConnectionType | ''>('');
const username = ref<string>('arvidsson@geins.io');
const password = ref<string>('8yifjxvujx95ie2vdkml8d');
const rememberUser = ref<boolean>(true);

const channel: Channel = {
  siteId: runtimeConfig.public.channel.siteId,
  siteTopDomain: runtimeConfig.public.channel.siteTopDomain,
};

const geinsCredentials: MerchantApiCredentials = {
  ...runtimeConfig.public.geins,
};

const endpoints = buildEndpoints(
  geinsCredentials.accountName,
  geinsCredentials.apiKey,
  'prod',
);

const languageId = runtimeConfig.public.defaultLanguage;
const marketId = runtimeConfig.public.defaultMarket;

const geinsCore = new GeinsCore(geinsCredentials, channel, {
  marketId,
  languageId,
});

const authClientProxy = new AuthClientProxy('api/auth');
const authClientDirect = new AuthClientDirect(
  endpoints.authSign,
  endpoints.auth,
);

const credentials = computed(() => ({
  username: username.value,
  password: password.value,
  rememberUser: rememberUser.value,
}));

const newPassword = computed(() =>
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15),
);

const userLoggedIn = computed(() => !!user.value);

onMounted(() => {
  updateUser();
});

/**
 * Helper function to handle user login using Proxy or Direct connection.
 * @param {ConnectionType} type - The connection type.
 * @param {boolean} validCredentials - Whether to use valid or invalid credentials.
 */
const handleLogin = async (type: ConnectionType, validCredentials = true) => {
  connectionType.value = type;
  const client = type === ConnectionType.Proxy ? authClientProxy : authClientDirect;
  const loginCredentials = validCredentials ? credentials.value : {
    username: 'error',
    password: 'error',
    rememberUser: true,
  };
  const result = await client.login(loginCredentials);
  console.log(`[auth.vue] - handleLogin(${type}) result`, result);
  updateUser();
};

/**
 * Handles logout based on the current connection type.
 */
const handleLogout = async () => {
  const client = connectionType.value === ConnectionType.Proxy ? authClientProxy : authClientDirect;
  const result = await client.logout();
  console.log(`[auth.vue] - handleLogout() result`, result);
  connectionType.value = '';
  updateUser();
};

/**
 * Handles token refresh based on the current connection type.
 */
const handleRefresh = async () => {
  const client = connectionType.value === ConnectionType.Proxy ? authClientProxy : authClientDirect;
  const result = await client.refresh();
  console.log(`[auth.vue] - handleRefresh() result`, result);
  updateUser();
};

/**
 * Handles user registration based on the current connection type.
 */
const handleRegister = async () => {
  const client = connectionType.value === ConnectionType.Proxy ? authClientProxy : authClientDirect;
  const result = await client.register(credentials.value);
  console.log(`[auth.vue] - handleRegister() result`, result);
  updateUser();
};

/**
 * Handles password change based on the current connection type.
 */
const handleChangePassword = async () => {
  const client = connectionType.value === ConnectionType.Proxy ? authClientProxy : authClientDirect;
  const newPasswordCredentials = {
    ...credentials.value,
    newPassword: newPassword.value,
  };
  const result = await client.changePassword(newPasswordCredentials);
  console.log(`[auth.vue] - handleChangePassword() result`, result);
  password.value = newPassword.value;
  updateUser();
};

/**
 * Fetches and updates the user information.
 */
const updateUser = async () => {
  const client = connectionType.value === ConnectionType.Proxy ? authClientProxy : authClientDirect;
  const result = await client.getUser();
  console.log(`[auth.vue] - updateUser() result`, result);
  user.value = result;
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

</script>

<template>
  <div>
    <h2>Nuxt @geins/crm auth</h2>
    <table>
      <tr>
        <td style="vertical-align: top">
          <table>
            <tr>
              <td>CREDENTIALS:</td>
            </tr>
            <tr>
              <td colspan="3">
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
                      remember user: <br />
                      <input type="checkbox" v-model="rememberUser" />
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <hr />
              </td>
            </tr>
            <tr>
              <td>AuthClient - <b>Proxy</b>:</td>
            </tr>
            <tr>
              <td colspan="3">
                <button :disabled="connectionType === ConnectionType.Direct || userLoggedIn"
                  @click="handleLogin(ConnectionType.Proxy, true)">
                  Login Good
                </button>
                <button :disabled="connectionType === ConnectionType.Direct || userLoggedIn"
                  @click="handleLogin(ConnectionType.Proxy, false)">
                  Login Bad
                </button>
                <button :disabled="connectionType === ConnectionType.Direct || !userLoggedIn" @click="handleLogout">
                  Logout
                </button>
                <button :disabled="connectionType === ConnectionType.Direct || !userLoggedIn" @click="handleRefresh">
                  Refresh
                </button>
                <button :disabled="connectionType === ConnectionType.Direct" @click="handleRegister">
                  Register
                </button>
                <button :disabled="connectionType === ConnectionType.Direct || !userLoggedIn"
                  @click="handleChangePassword">
                  Change Password
                </button>
                <button :disabled="connectionType === ConnectionType.Direct" @click="updateUser">
                  Get User
                </button>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <hr />
              </td>
            </tr>
            <tr>
              <td>AuthClient - <b>Direct</b>:</td>
            </tr>
            <tr>
              <td colspan="3">
                <button :disabled="connectionType === ConnectionType.Proxy || userLoggedIn"
                  @click="handleLogin(ConnectionType.Direct, true)">
                  Login Good
                </button>
                <button :disabled="connectionType === ConnectionType.Proxy || userLoggedIn"
                  @click="handleLogin(ConnectionType.Direct, false)">
                  Login Bad
                </button>
                <button :disabled="connectionType === ConnectionType.Proxy || !userLoggedIn" @click="handleLogout">
                  Logout
                </button>
                <button :disabled="connectionType === ConnectionType.Proxy || !userLoggedIn" @click="handleRefresh">
                  Refresh
                </button>
                <button :disabled="connectionType === ConnectionType.Proxy" @click="handleRegister">
                  Register
                </button>
                <button :disabled="connectionType === ConnectionType.Proxy || !userLoggedIn"
                  @click="handleChangePassword">
                  Change Password
                </button>
                <button :disabled="connectionType === ConnectionType.Proxy" @click="updateUser">
                  Get User
                </button>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <hr />
              </td>
            </tr>
          </table>
          <hr />
          <div>
            Current CRM cookies:
            <div v-if="items.length > 0" v-for="(item, index) in items" :key="index">
              <p>
                <b>{{ item.header }}</b><br />
                <textarea :style="{
                  border: 0,
                  width: '500px',
                  height: item.data.length > 100
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
