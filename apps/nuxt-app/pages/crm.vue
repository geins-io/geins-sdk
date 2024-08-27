<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { GeinsCore } from '@geins/core';
//import { GeinsCRM } from '@geins/crm';
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

const languageId = runtimeConfig.public.defaultLanguage;
const marketId = runtimeConfig.public.defaultMarket;

const geinsCore = new GeinsCore(geinsCredentials, channel, { marketId, languageId });
// const geinsCRM = new GeinsCRM(geinsCore);


let username = ref<string>('');
let password = ref<string>('');
let slug = ref<string>('');

const resetCompnentData = () => {

};

const dumpCookies = () => {
  const allCookies = geinsCore.cookies.getAllCookies();
  // loop through all cookies
  for (const key in allCookies) {
    items.value.push({ header: key, data: JSON.stringify(allCookies[key], null, 2) });
  }
};

const eventTest = () => {

  var myEventHandler = function (message: any) {
    console.log('I hear a scream! --- ' + message);
    items.value.push({ header: 'I hear a scream!', data: message });
  };
  geinsCore.events.listnerAdd('scream', myEventHandler('HELLO'));

  /* var authHandler = function () {
    console.log('USER OK');
    items.value.push({ header: 'USER LOGGED IN', data: 'USER LOGED IN --- ' });
  }; */

  // geinsCore.events.listnerAdd('auth', authHandler);

  /*   geinsCore.events.listnerOnce('click', myEventHandler2); */

  /*   const logger = (data: any) => {
      console.log('logger', data);
    };

    geinsCore.events.listnerAdd('auth', logger('USER IS LOGGED IN'));

   */
};

const eventTest2 = () => {
  geinsCore.events.push('scream', { test: 'test', test2: 'test2', olle: { pelle: 'pellee' } });
};

const loginServer = () => {
  const response = fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: '', password: '' }),
  });
  console.log(response);
  dumpCookies();
};

const loginGood = () => {
  //geinsCRM.auth.login({ username: 'arvidsson@geins.io', password: 'MuDwzsBLq4Tx45X', rememberUser: true });
  dumpCookies();
};

const loginBad = () => {
  //geinsCRM.auth.login({ username: 'arvidsson@geins.io', password: 'password', rememberUser: true });
  dumpCookies();
};

const logout = () => {
  //geinsCRM.auth.logout();
  dumpCookies();
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
                <button @click="loginGood">Login Good</button>
                <button @click="loginBad">Login Bad</button>
                <button @click="loginServer">Login Server</button>
                <button @click="logout">Logout</button>
                <button @click="eventTest">Event listen</button>
                <button @click="eventTest2">Event emitt</button>
              </td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
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
