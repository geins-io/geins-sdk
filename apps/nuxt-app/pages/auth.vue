<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { GeinsCore, buildEndpoints } from '@geins/core';
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

let username = ref<string>('');
let password = ref<string>('');
let slug = ref<string>('');

const loginProxyGood = async () => {
  const result = await authClientProxy.login({ username: 'arvidsson@geins.io', password: 'MuDwzsBLq4Tx45X', rememberUser: true });
  console.log('loginProxyGood() result', result);
};

const loginClientGood = async () => {
  const result = await authClientClientSide.login({ username: 'arvidsson@geins.io', password: 'MuDwzsBLq4Tx45X', rememberUser: true });
  console.log('loginClientGood() result', result);
};

const loginProxyBad = async () => {
  const result = await authClientProxy.login({ username: 'arvsidsson@geins.io', password: 'MuDwzsBLq4Tx45X', rememberUser: true });
  console.log('loginProxyBad() result', result);
};

const loginClientBad = async () => {
  const result = await authClientClientSide.login({ username: 'arvsidsson@geins.io', password: 'MuDwzsBLq4Tx45X', rememberUser: true });
  console.log('loginClientBad() result', result);
};

const loginBad = () => {

};

const logout = () => {

}



const dumpCookies = () => {
  const allCookies = geinsCore.cookies.getAllCookies();
  // loop through all cookies
  for (const key in allCookies) {
    items.value.push({ header: key, data: JSON.stringify(allCookies[key], null, 2) });
  }
};

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
              <td><input v-model="password" type="password" /></td>
              <td>
              </td>
            </tr>

            <tr>
              <td></td>
              <td>
                PROXY:
              </td>
              <td>
                <button @click="loginProxyGood">Login Good</button>
                <button @click="loginProxyBad">Login Bad</button>
              </td>
            </tr>
            <tr>
              <td>
              </td>
              <td>
                CLIENT SIDE:
              </td>
              <td>
                <button @click="loginClientGood">Login Good</button>
                <button @click="loginClientBad">Login Bad</button>
              </td>
            </tr>
          </table>
          <div v-for="(item, index) in items" :key="index">
            <p>
              <b>{{ item.header }}</b><br />
              <textarea style="border:0; width:600px;">{{ item.data }}</textarea>
            </p>
          </div>
        </td>
        <td></td>
        <td style="vertical-align: top;">
          <!-- DATA -->
        </td>
      </tr>
    </table>

  </div>
</template>
