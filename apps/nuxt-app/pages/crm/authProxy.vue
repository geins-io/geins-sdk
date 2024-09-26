<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { GeinsCore, AuthClientConnectionModes, logWrite } from '@geins/core';
import { GeinsCRM } from '@geins/crm';
import type {
  GeinsSettings,
  AuthSettings,
  AuthCredentials,
  AuthResponse,
} from '@geins/types';
import CookieDump from '~/components/CookieDump.vue';

const config = useRuntimeConfig();
const geinsSettings = config.public.geins.settings as GeinsSettings;
const authSettings = {
  clientConnectionMode: AuthClientConnectionModes.Proxy,
} as AuthSettings;

// Initialize Geins Core and GeinsCRM
const core = new GeinsCore(geinsSettings);
const geinsCRM = new GeinsCRM(core, authSettings);

// State variables
const username = ref<string>('viola92@gmail.com');
const password = ref<string>('na0o38y987fnbbxm4a7oi');
const rememberUser = ref<boolean>(true);
const errorMessage = ref<string | null>(null);
const user = ref<any>({});
const userLoggedIn = ref<boolean>(false);

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

const checkUserLoggedIn = () => {
  const isLoggedIn = geinsCRM.user.authorized();
  if (isLoggedIn === true) {
    userLoggedIn.value = true;
  } else {
    userLoggedIn.value = false;
  }
};

onMounted(() => {
  checkUserLoggedIn();
  if (userLoggedIn.value) {
    handleUpdate();
  }
});

const handleLogin = async (validCredentials = true) => {
  user.value = null;
  const loginCredentials = validCredentials
    ? credentials.value
    : {
        username: 'error',
        password: 'error',
        rememberUser: true,
      };
  try {
    // Create credentials object
    const credentials: AuthCredentials = {
      username: username.value,
      password: password.value,
    };

    // Use GeinsCRM to authenticate the user
    const response: AuthResponse | undefined =
      await geinsCRM.auth.login(loginCredentials);

    logWrite('Login response', response);

    if (response?.succeeded) {
      user.value = response;
      checkUserLoggedIn();
      // Do something on successful login, e.g., redirect or fetch user profile
    } else {
      errorMessage.value = 'Login failed. Please check your credentials.';
    }
  } catch (error) {
    errorMessage.value = 'An error occurred during login.';
    console.error('Login error:', error);
  }
};

const handleLogout = async () => {
  user.value = null;
  geinsCRM.auth.logout();
  checkUserLoggedIn();
};

const handleUpdate = async () => {
  geinsCRM.auth.getUser().then((response) => {
    user.value = response;
    checkUserLoggedIn();
  });
};

const handleRefresh = async () => {
  geinsCRM.auth.refresh().then((response) => {
    user.value = response;
    checkUserLoggedIn();
  });
};

const handleChangePassword = async () => {
  const newPasswordCredentials = {
    ...credentials.value,
    newPassword: newPassword.value,
  };
  logWrite(`New Password:`, newPassword.value);

  const result = await geinsCRM.auth.changePassword(newPasswordCredentials);
  logWrite(`change password result`, result);
  if (!result) {
    logWrite(`change password failed`, result);
    return;
  }
  password.value = newPassword.value;
};
</script>

<template>
  <div>
    <h2>Nuxt @geins/crm authentication - Proxy Mode</h2>

    <p>
      This page demonstrates how to use the <b>@geins/crm</b> package to
      authenticate a user in with proxy mode.
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
                            <input v-model="rememberUser" type="checkbox" />
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
                <hr />
              </td>
            </tr>
            <tr>
              <td>3. Login</td>
            </tr>
            <tr>
              <td>
                <button
                  :disabled="userLoggedIn === true"
                  @click="handleLogin(true)"
                >
                  Login Good
                </button>
                <button
                  :disabled="userLoggedIn === true"
                  @click="handleLogin(false)"
                >
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
                <button
                  :disabled="userLoggedIn === false"
                  @click="handleUpdate"
                >
                  Get User
                </button>
                <button
                  :disabled="userLoggedIn === false"
                  @click="handleRefresh"
                >
                  Refresh
                </button>
                <button
                  :disabled="userLoggedIn === false"
                  @click="handleChangePassword"
                >
                  Change Password
                </button>
                <button
                  :disabled="userLoggedIn === false"
                  @click="handleLogout"
                >
                  Logout
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <hr />
              </td>
            </tr>
          </table>
          <hr />
          <CookieDump />
        </td>
        <td style="vertical-align: top; padding-left: 50px">
          <div v-if="user" style="width: 500px; overflow-x: scroll">
            <b>Response Object:</b>
            <pre>{{ JSON.stringify(user, null, 2) }}</pre>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>
