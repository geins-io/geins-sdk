<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { logWrite, GeinsCore, buildEndpoints } from '@geins/core';
import type { GeinsCredentials } from '@geins/core';
import {
  AuthClientDirect,
  AuthClientProxy,
  authClaimsTokenSerialize,
  authClaimsTokenSerializeToObject,
} from '../../utils/auth';
import { AuthService } from '@geins/crm';

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
const username = ref<string>('arvidsson@geins.io');

// 6wv26rgt0cv44bxxvf8i82
const password = ref<string>('6wv26rgt0cv44bxxvf8i82');
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
  // handleLogout();
  connectionType.value = type;
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
  updateCookiesDisplay();
  if (!result) {
    handleLogout();
  }
  user.value = result;
};
const updateUser2 = async () => {
  const result = await authClientDirect.getUser2();
  logWrite(`Getting user by: ${connectionType.value}`, result);
  updateCookiesDisplay();
  if (!result) {
    handleLogout();
  }
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
const handleLogin2 = async (validCredentials = true) => {
  const loginCredentials = validCredentials
    ? credentials.value
    : {
      username: 'error',
      password: 'error',
      rememberUser: true,
    };
  const result = await authClientDirect.login2(loginCredentials);
  user.value = result;
  // updateUser();
};

/**
 * Handles logout based on the current connection type.
 */
const handleLogout = async () => {
  const result = await authClient.value?.logout();
  logWrite(`result`, result);
  user.value = undefined;
  updateCookiesDisplay();
};
const handleLogout2 = async () => {
  const result = await authClientDirect.logout2();
  logWrite(`result`, result);
  user.value = undefined;
  updateCookiesDisplay();
};

/**
 * Handles token refresh based on the current connection type.
 */
const handleRefresh = async () => {
  const result = await authClient.value?.refresh();
  logWrite(`handleRefresh() result`, result);
  updateCookiesDisplay();
  if (!result) {
    handleLogout();
  }
  user.value = result;
};

const handleRefresh2 = async () => {
  const result = await authClientDirect.refresh2();
  logWrite(`handleRefresh() result`, result);
  updateCookiesDisplay();
  if (!result) {
    handleLogout();
  }
  user.value = result;
};

/**
 * Handles user registration based on the current connection type.
 */
const handleRegister = async () => {
  logWrite(`Not yet implemented`, credentials.value);
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

const handleChangePassword2 = async () => {
  // xypkcj435ofh5h66lbwhc
  const np = newPassword.value;
  logWrite(`NEW PASSWORD`, np);

  const newPasswordCredentials = {
    ...credentials.value,
    newPassword: np,
  };
  const result = await authClientDirect.newPassword(newPasswordCredentials);
  logWrite(`[auth.vue] - handleChangePassword()2 result`, result);
  console.log('newPasswordCredentials', np);
  password.value = np;
  updateUser();
};
</script>

<template>
  <div>
    <h2>Nuxt @geins/crm auth dev dev</h2>

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
                <button :disabled="userLoggedIn || connectionType === Connection.None" @click="handleLogin2(true)">
                  Login Good 2
                </button>
                <button :disabled="userLoggedIn || connectionType === Connection.None" @click="handleLogin2(false)">
                  Login Bad 2
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
                <button :disabled="connectionType === Connection.None" @click="updateUser">
                  Get User
                </button>
                <button @click="updateUser2">Get User 2</button>
                <button :disabled="!userLoggedIn || connectionType === Connection.None
                  " @click="handleRefresh">
                  Refresh
                </button>
                <button :disabled="!userLoggedIn || connectionType === Connection.None
                  " @click="handleRefresh2">
                  Refresh 2
                </button>
                <button :disabled="!userLoggedIn || connectionType === Connection.None
                  " @click="handleChangePassword">
                  Change Password
                </button>
                <button :disabled="!userLoggedIn || connectionType === Connection.None
                  " @click="handleChangePassword2">
                  Change Password 2
                </button>
                <button :disabled="!userLoggedIn || connectionType === Connection.None
                  " @click="handleLogout">
                  Logout
                </button>
                <button @click="handleLogout2">Logout 2</button>
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
            <b>Response Object:</b>
            <pre>{{ JSON.stringify(user, null, 2) }}</pre>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>
