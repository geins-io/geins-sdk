<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { GeinsCore, buildEndpoints, authClaimsTokenSerializeToObject } from '@geins/core';
import { AuthClient, ConnectionType } from '../utils/authClient';

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
let password = ref<string>('MuDwzsBLq4Tx45X');
let remeberUser = ref<Boolean>(true);
let slug = ref<string>('');

const getCredentials = () => {
  return {
    username: username.value,
    password: password.value,
    remeberUser: remeberUser.value,
  };
};
const credentials = ref(getCredentials());

onMounted(() => {
  dumpCookies();
});

const loginProxyGood = async () => {

  const result = await authClientProxy.login(credentials.value);
  console.log('loginProxyGood() result', result);
  dumpCookies();
};

const loginClientGood = async () => {
  const result = await authClientClientSide.login(credentials.value);
  console.log('loginClientGood() result', result);
  dumpCookies();
};

const loginProxyBad = async () => {
  const result = await authClientProxy.login({ username: 'error', password: 'error', rememberUser: true });
  console.log('loginProxyBad() result', result);
  dumpCookies();
};

const loginClientBad = async () => {

  const result = await authClientClientSide.login({ username: 'error', password: 'error', rememberUser: true });
  console.log('loginClientBad() result', result);
  dumpCookies();
};

const logoutProxy = async () => {
  const result = await authClientProxy.logout();
  console.log('refreshProxy() result', result);
  dumpCookies();
};

const logoutClient = async () => {
  const result = await authClientClientSide.logout();
  console.log('refreshProxy() result', result);
  dumpCookies();
};

const refreshProxy = async () => {
  const result = await authClientProxy.refresh();
  console.log('refreshProxy() result', result);
  dumpCookies();
};

const refreshClient = async () => {
  const result = await authClientClientSide.refresh();
  console.log('refreshProxy() result', result);
  dumpCookies();
};

const registerProxy = async () => {
  const result = await authClientProxy.register();
  console.log('registerProxy() result', result);
  dumpCookies();
};

const registerClient = async () => {
  const result = await authClientClientSide.register();
  console.log('registerClient() result', result);
  dumpCookies();
};

const passwordProxy = async () => {
  const result = await authClientProxy.passwordReset();
  console.log('passwordProxy() result', result);
  dumpCookies();
};

const passwordClient = async () => {
  const result = await authClientClientSide.passwordReset();
  console.log('passwordClient() result', result);
  dumpCookies();
}

const dumpCookies = () => {
  items.value = [];
  const allCookies = geinsCore.cookies.getAll();
  for (const key in allCookies) {
    items.value.push({ header: key, data: JSON.stringify(allCookies[key], null, 2) });
  }
};

const tokenProxy = async () => {
  const result = await authClientProxy.token();
  console.log('token() result', result);
};

const nothingProxy = async () => {
  const result = await authClientProxy.nothing();
  console.log('token() result', result);
};

const previewToken = async () => {
  // console.log('previewToken() helperkvp BR new', authClaimsTokenSerializeToObject(t1));
}


</script>
<template>
  <div>
    <h2>Nuxt @geins/CRM Test</h2>
    <table>
      <tr>
        <td style="vertical-align: top;">
          <table>
            <tr>
              <td>username:</td>
              <td>password:</td>
              <td></td>
            </tr>
            <tr>
              <td><input v-model="username" /></td>
              <td>
                <input v-model="password" type="password" />
              </td>
              <td> <input type="checkbox" v-model="remeberUser" /> Remember me </td>
            </tr>
            <tr>
              <td colspan="3"></td>
            </tr>
            <tr>
              <td> PROXY:</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td colspan="3">
                <button @click="loginProxyGood">Login Good</button>
                <button @click="loginProxyBad">Login Bad</button>
                <button @click="logoutProxy">Logout</button>
                <button @click="refreshProxy">Refresh</button>
                <button @click="registerProxy">User Register</button>
                <button @click="passwordProxy">Password Refresh</button>
              </td>
            </tr>
            <tr>
              <td colspan="3"></td>
            </tr>
            <tr>
              <td> CLIENT SIDE:</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td colspan="3">
                <button @click="loginClientGood">Login Good</button>
                <button @click="loginClientBad">Login Bad</button>
                <button @click="logoutClient">Logout</button>
                <button @click="refreshClient">Refresh</button>
                <button @click="registerClient">User Register</button>
                <button @click="passwordClient">Password Refresh</button>
              </td>
            </tr>
            <tr>
              <td colspan="3"></td>
            </tr>
            <tr>
              <td>MISC:</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td colspan="3">
                <button @click="previewToken">Preview Token Claims</button>
                <button @click="tokenProxy">Token Proxy</button>
                <button @click="nothingProxy">Nothing Proxy</button>
              </td>
            </tr>
          </table>
          <hr />
          Current CRM cookies:
          <div v-if="items.length > 0" v-for="(item, index) in items" :key="index">
            <p>
              <b>{{ item.header }}</b><br />
              <textarea :style="{border:0, width:500+'px', height: (item.data.length > 100 ? Math.min(200, item.data.length * 10) + 'px': 20+'px' )}">{{ item.data }}</textarea>
            </p>
          </div>
          <p v-else>
            No cookies set
          </p>
        </td>
        <td></td>
        <td style="vertical-align: top;padding-left:50px">
          <!--DATA -->
          <!--  User loged in: {{ authClientProxy.isLoggedIn }}<br /> -->
          <!--  User name: {{ authClientProxy.username }}<br /> -->

        </td>
      </tr>
    </table>

  </div>
</template>
