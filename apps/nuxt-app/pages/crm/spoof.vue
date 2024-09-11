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
  authClaimsTokenSerializeToObject,
} from '@geins/crm';
import { on } from 'events';
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
const spoofToken = ref<string>(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiQWRtaW5QcmV2aWV3IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiUmVnaXN0ZXJlZCIsIkRyYWZ0SWQiOiIyNSIsIlNwb29mRGF0ZSI6IjIwMjQtMDktMTggMjI6MDA6MDAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjcxNTVlYjM3LTJkODgtZmEzYi05MGY4LWYyYzdhYjQ1MzM2NyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3NpZCI6IjcxNTVlYjM3LTJkODgtZmEzYi05MGY4LWYyYzdhYjQ1MzM2NyIsIlNwb29mZWRCeSI6ImFydmlkc3NvbkBnZWlucy5pbyIsImV4cCI6MTcyNTg5ODAxNiwiaXNzIjoiQ2FyaXNtYXIgU29mdHdhcmUgQUIifQ.8urktUiZCYpIH8q4YPME-3JC4opOLLoh7P1cmfNXYwA0',
);
const spoofTime = ref<any>();
const username = ref<string>('arvidsson@geins.io');

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
                    <td>1. Set spoofed user</td>
                  </tr>
                  <tr>
                    <td>
                      <textarea v-model="spoofToken" style="width: 500px; height: 200px"></textarea>
                    </td>
                  </tr>
                  <!--   <tr>
                    <td>2. Set spoof crentials:</td>
                  </tr>
                                                   <tr>
                    <td>
                      <table>
                        <tr>
                          <td>
                            username:<br />
                            <input v-model="username" style="width: 250px" />
                          </td>
                          <td>
                            Spoof Time:<br />
                            <input v-model="spoofTime" style="width: 250px" />
                          </td>
                          <td>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr> -->
                </table>
              </td>
            </tr>

            <tr>
              <td>
                <hr />
              </td>
            </tr>
            <tr>
              <td>Actions</td>
            </tr>
            <tr>
              <td>
                <button @click="spoofUser">Spoof User</button>
                <button @click="clearCookies">Clear Cookies</button>
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
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>
