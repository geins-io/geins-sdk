<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { LogService, GeinsCore, buildEndpoints } from '@geins/core';
import type { GeinsCredentials } from '@geins/core';
import { AuthClientDirect, AuthClientProxy } from '@geins/crm';

enum Connection {
  Proxy = 'Proxy',
  Direct = 'Direct',
  None = 'None',
}

type ConnectionType = Connection.Proxy | Connection.Direct | Connection.None;

const config = useRuntimeConfig();
const items = ref<any[]>([]);
const user = ref<any>({});
const connectionType = ref<ConnectionType>(Connection.Proxy);
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

/**
 * Fetches and updates the user information.
 */
const updateUser = async () => {
  const result = await authClient.value?.getUser();
  LogService.debug(`Getting user by: ${connectionType.value}`, result);
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
  LogService.debug(`Not yet implemented`, credentials.value);
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
                      <input v-model="rememberUser" type="checkbox" />
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
              <td>
                SET CONNECTION TYPE - <b>{{ connectionType }}</b>:
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <button :disabled="connectionType === Connection.Direct" @click="setConnectionType(Connection.Direct)">
                  Set to Direct
                </button>
                <button :disabled="connectionType === Connection.Proxy" @click="setConnectionType(Connection.Proxy)">
                  Set to Proxy
                </button>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <hr />
              </td>
            </tr>
            <tr>
              <td>AuthClient actions</td>
            </tr>
            <tr>
              <td colspan="3">
                <button :disabled="userLoggedIn" @click="handleLogin(true)">
                  Login Good
                </button>
                <button :disabled="userLoggedIn" @click="handleLogin(false)">
                  Login Bad
                </button>
                <button :disabled="!userLoggedIn" @click="handleChangePassword">
                  Change Password
                </button>
                <button :disabled="!userLoggedIn" @click="handleLogout">
                  Logout
                </button>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <button @click="updateUser">Get User</button>
                <button :disabled="!userLoggedIn" @click="handleRefresh">
                  Refresh
                </button>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <button @click="handleRegister">Register</button>
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
