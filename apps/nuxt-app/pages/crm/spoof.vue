<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import {
  logWrite,
  GeinsCore,
  buildEndpoints,
  CookieService,
} from '@geins/core';
import type { GeinsCredentials } from '@geins/core';
import {
  AuthClient,
  AuthClientDirect,
  AuthClientProxy,
  authClaimsTokenSerialize,
} from '@geins/crm';
import { authClaimsTokenSerializeToObject } from '../../utils/authHelpers';

//import { AuthClientDirect, AuthClientProxy } from '../../utils/auth';
const config = useRuntimeConfig();

const geinsCredentials = config.public.geins.credentials as GeinsCredentials;

const endpoints = buildEndpoints(
  geinsCredentials.apiKey,
  geinsCredentials.accountName,
  geinsCredentials.environment,
);
const cookieService = new CookieService();
const authClientDirect = new AuthClientDirect(
  endpoints.authSign,
  endpoints.auth,
);

const items = ref<any[]>([]);
const user = ref<any>({});
const spoofToken = ref<string>('');
const spoofUser = () => {
  const userSerialized = authClaimsTokenSerializeToObject(spoofToken.value);
  user.value = userSerialized;
  logWrite(`userSerialized`, userSerialized);
  authClientDirect.spoofPreviewUser(spoofToken.value);
  updateCookiesDisplay();
};

const updateCookiesDisplay = () => {
  items.value = [];
  const allCookies = cookieService.getAll() as any;
  for (const key in allCookies) {
    items.value.push({
      header: key,
      data: JSON.stringify(allCookies[key], null, 2),
    });
  }
};

const goToCmsArea = () => {
  // open new tab with cms area
  window.open('/cms');
};
const goToCmsPage = () => {
  // open new tab with cms area
  window.open('/cms');
};
const clearCookies = () => {
  authClientDirect.clearCookies();
  updateCookiesDisplay();
};

onMounted(() => {
  updateCookiesDisplay();
});
</script>

<template>
  <div>
    <h2>Nuxt @geins/crm spoof user</h2>

    <p>
      This page sets a spoofed user in the browser cookies. The user can then be
      used to get preview cms data.
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
                    <td>1. Sppof token from MC</td>
                  </tr>
                  <tr>
                    <td>
                      <textarea v-model="spoofToken" style="width: 500px; height: 200px"></textarea>
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
              <td>2. Set Spoof cookie</td>
            </tr>
            <tr>
              <td>
                <button @click="spoofUser">Set spoof cookie</button>
                <button @click="clearCookies">Clear Cookies</button>
              </td>
            </tr>
            <tr>
              <td>
                <hr />
              </td>
            </tr>
            <tr>
              <td>3. Try spoof</td>
            </tr>
            <tr>
              <td>
                <button @click="goToCmsArea">Try CMS AREA</button>
              </td>
            </tr>
          </table>
          <hr />
          <div>
            Current cookies:
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
          <div v-if="user" style="width: 500px; overflow-x: scroll">
            <b>Spoof Object:</b>
            <pre>{{ JSON.stringify(user, null, 2) }}</pre>
            <b>Spoof Object changed:</b>
            <pre>{{ JSON.stringify(user2, null, 2) }}</pre>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>
