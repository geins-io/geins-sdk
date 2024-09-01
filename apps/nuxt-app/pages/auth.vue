<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { GeinsCore, buildEndpoints } from '@geins/core';
import { AuthClient, ConnectionType } from '../utils/authClient';
import { authClaimsTokenSerializeToObject } from '../utils/helpers';

import type { Channel, MerchantApiCredentials } from '@geins/core';

const runtimeConfig = useRuntimeConfig();
const items = ref<any[]>([]);


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

const geinsCore = new GeinsCore(geinsCredentials, channel, { marketId, languageId });
const authClientProxy = new AuthClient(ConnectionType.Proxy);
const authClientClientSide = new AuthClient(ConnectionType.ClientSide, endpoints.authSign, endpoints.auth);

let username = ref<string>('arvidsson@geins.io');
let password = ref<string>('m7d8xdxi8ohbdzzrw3txvo');
let rememberUser = ref<Boolean>(true);
let connectionType = ref<string>('');
let user = ref<any>({});

const credentials = computed(() => {
  return {
    username: username.value,
    password: password.value,
    rememberUser: rememberUser.value.valueOf(),
  };
});
const newPassword = computed(() => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
});

const userLoggedIn = computed(() => {
  return user.value;
});

onMounted(async () => {
  user.value = await authClientClientSide.getUser();
  dumpCookiesAndUpdateUser();
});

const loginProxyGood = async () => {
  connectionType.value = ConnectionType.Proxy;
  const result = await authClientProxy.login(credentials.value);
  console.log('loginProxyGood() result', result);
  dumpCookiesAndUpdateUser();
};

const loginClientGood = async () => {
  connectionType.value = ConnectionType.ClientSide;
  const result = await authClientClientSide.login(credentials.value);
  console.log('loginClientGood() result', result);
  dumpCookiesAndUpdateUser();
};

const loginProxyBad = async () => {
  connectionType.value = ConnectionType.Proxy;
  const result = await authClientProxy.login({
    username: 'error',
    password: 'error',
    rememberUser: true
  });
  console.log('loginProxyBad() result', result);
  dumpCookiesAndUpdateUser();
};

const loginClientBad = async () => {
  connectionType.value = ConnectionType.ClientSide;
  const result = await authClientClientSide.login({
    username: 'error',
    password: 'error',
    rememberUser: true
  });
  console.log('loginClientBad() result', result);
  dumpCookiesAndUpdateUser();
};

const logoutProxy = async () => {
  connectionType.value = '';
  const result = await authClientProxy.logout();
  console.log('refreshProxy() result', result);
  dumpCookiesAndUpdateUser();
};

const logoutClient = async () => {
  connectionType.value = '';
  const result = await authClientClientSide.logout();
  console.log('refreshProxy() result', result);
  dumpCookiesAndUpdateUser();
};

const refreshProxy = async () => {
  connectionType.value = ConnectionType.Proxy;
  const result = await authClientProxy.refresh();
  console.log('refreshProxy() result', result);
  dumpCookiesAndUpdateUser();
};

const refreshClient = async () => {
  connectionType.value = ConnectionType.ClientSide;
  const result = await authClientClientSide.refresh();
  console.log('refreshProxy() result', result);
  dumpCookiesAndUpdateUser();
};

const registerProxy = async () => {
  connectionType.value = ConnectionType.Proxy;
  const result = await authClientProxy.register();
  console.log('registerProxy() result', result);
  dumpCookiesAndUpdateUser();
};

const registerClient = async () => {
  connectionType.value = ConnectionType.ClientSide;
  const result = await authClientClientSide.register();
  console.log('registerClient() result', result);
  dumpCookiesAndUpdateUser();
};

const getUserProxy = async () => {
  connectionType.value = ConnectionType.Proxy;
  const result = await authClientProxy.getUser();
  console.log('[auth.vue] getUserProxy() result', result);
  dumpCookiesAndUpdateUser(true);
};

const getUserClient = async () => {
  connectionType.value = ConnectionType.ClientSide;
  const result = await authClientClientSide.getUser();
  console.log('[auth.vue] getUserClient() result', result);
  dumpCookiesAndUpdateUser(true);
};

const newPasswordProxy = async () => {
  connectionType.value = ConnectionType.Proxy;
  const newPasswordCredentials = {
    username: username.value,
    password: password.value,
    rememberUser: rememberUser.value.valueOf(),
    newPassword: newPassword.value,
  };
  console.log('newPasswordProxy() newPassword=' + newPassword.value);
  const result = await authClientProxy.changePassword(newPasswordCredentials);
  console.log('newPasswordProxy() result', result);
  dumpCookiesAndUpdateUser();
};

const newPasswordClient = async () => {
  const np = newPassword.value;
  connectionType.value = ConnectionType.ClientSide;
  const newPasswordCredentials = {
    username: username.value,
    password: password.value,
    rememberUser: rememberUser.value.valueOf(),
    newPassword: np,
  };
  const result = await authClientClientSide.changePassword(newPasswordCredentials);
  console.log('newPasswordClient() newPassword=' + np + ' result', result);
  password.value = np;
  dumpCookiesAndUpdateUser();
}

const dumpCookiesAndUpdateUser = async (noUser?: boolean) => {
  console.log('dumpCookiesAndUpdateUser()');
  items.value = [];
  const allCookies = geinsCore.cookies.getAll() as any;
  // console.log('dumpCookiesAndUpdateUser() allCookies', allCookies);
  for (const key in allCookies) {
    items.value.push({ header: key, data: JSON.stringify(allCookies[key], null, 2) });
  }
  if (noUser === false || noUser === undefined) {
    console.log('dumpCookiesAndUpdateUser() running getUser()');
    getUser();
  }

};

const getUser = async () => {
  user.value = { l: 'loading...' };
  if (connectionType.value === ConnectionType.Proxy) {
    const result = await authClientProxy.getUser();
    console.log('getUser() from [' + connectionType.value + '] result', result);
    user.value = result;

  } else {
    const result = await authClientClientSide.getUser();
    console.log('getUser() from [' + connectionType.value + '] result', result);
    user.value = result;
  }



}

const getToken = async () => {

  const result = connectionType.value === ConnectionType.Proxy ?
    await authClientProxy.token() :
    await authClientClientSide.token();
  console.log('getToken() from [' + connectionType.value + '] result', result);
};

const doNothing = async () => {
  const result = connectionType.value === ConnectionType.Proxy ?
    await authClientProxy.nothing() :
    await authClientClientSide.nothing();
  console.log('doNothing() from [' + connectionType.value + '] result', result);
};

const previewCookieToken = async () => {
  items.value = [];
  const allCookies = geinsCore.cookies.getAll() as any;
  console.log('previewCookieToken() allCookies', allCookies);
  for (const key in allCookies) {
    items.value.push({ header: key, data: JSON.stringify(allCookies[key], null, 2) });
    if (key === 'geins-auth') {
      const t1 = allCookies[key];
      console.log('previewToken()', authClaimsTokenSerializeToObject(t1));
    }
  }
}
</script>

<template>
  <div>
    <h2>Nuxt @geins/crm AUTH Test</h2>
    <table>
      <tr>
        <td style="vertical-align: top;">
          <table>
            <tr>
              <td>CREDENTIALS:</td>
              <td></td>
              <td></td>
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
                      <input v-model="password" style="width:250px" />
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
                <hr>
              </td>
            </tr>
            <tr>
              <td>AuthClient use - <b>ConnectionType.Proxy</b>:</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td colspan="3">
                <button :disabled="connectionType === ConnectionType.ClientSide || userLoggedIn"
                  @click="loginProxyGood">Login
                  Good</button>
                <button :disabled="connectionType === ConnectionType.ClientSide || userLoggedIn"
                  @click="loginProxyBad">Login
                  Bad</button>
                <button :disabled="connectionType === ConnectionType.ClientSide || !userLoggedIn"
                  @click="logoutProxy">Logout</button>
                <button :disabled="connectionType === ConnectionType.ClientSide || !userLoggedIn"
                  @click="refreshProxy">Refresh</button>
                <button :disabled="connectionType === ConnectionType.ClientSide" @click="registerProxy">User
                  Register</button>
                <button :disabled="connectionType === ConnectionType.ClientSide || !userLoggedIn"
                  @click="newPasswordProxy">Change
                  Password</button>
                <button :disabled="connectionType === ConnectionType.ClientSide" @click="getUserProxy">Get User</button>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <hr>
              </td>
            </tr>
            <tr>
              <td>AuthClient use - <b>ConnectionType.ClientSide</b>:</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td colspan="3">
                <button :disabled="connectionType === ConnectionType.Proxy || userLoggedIn"
                  @click="loginClientGood">Login Good</button>
                <button :disabled="connectionType === ConnectionType.Proxy || userLoggedIn"
                  @click="loginClientBad">Login Bad</button>
                <button :disabled="connectionType === ConnectionType.Proxy || !userLoggedIn"
                  @click="logoutClient">Logout</button>
                <button :disabled="connectionType === ConnectionType.Proxy || !userLoggedIn"
                  @click="refreshClient">Refresh</button>
                <button :disabled="connectionType === ConnectionType.Proxy" @click="registerClient">User
                  Register</button>
                <button :disabled="connectionType === ConnectionType.Proxy || !userLoggedIn"
                  @click="newPasswordClient">Change
                  Password</button>
                <button :disabled="connectionType === ConnectionType.Proxy" @click="getUserClient">Get User</button>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <hr>
              </td>
            </tr>
            <tr>
              <td>MISC:</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td colspan="3">
                <button @click="previewCookieToken">View Set Cookies</button>
                <button @click="getToken">Get Token from AuthClient</button>
                <button @click="doNothing">Do Nothing / Pass Time</button>
              </td>
            </tr>
          </table>
          <hr />
          <div>

          </div>
          Current CRM cookies:
          <div v-if="items.length > 0" v-for="(item, index) in items" :key="index">
            <p>
              <b>{{ item.header }}</b>
              <br />
              <textarea
                :style="{ border: 0, width: 500 + 'px', height: (item.data.length > 100 ? Math.min(200, item.data.length * 10) + 'px' : 20 + 'px') }">{{ item.data }}</textarea>
            </p>
          </div>
          <i v-else>
            ... no cookies set
          </i>
        </td>
        <td></td>
        <td style="vertical-align: top;padding-left:50px">
          <div v-if="connectionType">
            <b>Connection Type:</b>
            <pre>{{ connectionType }}</pre>
          </div>
          <div v-if="user" style="width: 500px; overflow-x: scroll;">
            <b>User Object:</b>
            <pre>{{ JSON.stringify(user, null, 2) }}</pre>
          </div>
        </td>
      </tr>
    </table>

  </div>
</template>
