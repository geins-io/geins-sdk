<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import {
  logWrite,
  GeinsCore,
  buildEndpoints,
  CookieService,
  AuthClientConnectionMode,
} from '@geins/core';
import type { AuthSettings, GeinsCredentials } from '@geins/core';
import { GeinsCRM } from '@geins/crm';

//import { AuthClientDirect, AuthClientProxy } from '../../utils/auth';
const cookieService = new CookieService();

const config = useRuntimeConfig();
const geinsCredentials = config.public.geins.credentials as GeinsCredentials;
const authSettings = {
  clientConnectionMode: AuthClientConnectionMode.Direct,
} as AuthSettings;
const geinsCore = new GeinsCore(geinsCredentials);
const geinsCRM = new GeinsCRM(geinsCore, authSettings);

function generateRandomEmail(domain: string = 'example.com'): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const randomString = (length: number) => {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const username = randomString(10); // You can adjust the length of the email username
  return `${username}@${domain}`;
}

const items = ref<any[]>([]);
const user = ref<any>({});

const username = ref<string>('');
const password = ref<string>('dZgFCZi66mnPr9D');

const register = async () => {
  const result = await geinsCRM.Auth.newUser({
    username: username.value,
    password: password.value,
  });
  user.value = result;
  items.value.push({
    header: username.value,
    data: JSON.stringify(
      { username: username.value, password: password.value },
      null,
      2,
    ),
  });
  items.value.push({
    header: username.value + ':: ' + password.value,
    data: JSON.stringify(result, null, 2),
  });

  /*  geinsCRM.auth.register({
    email: username.value,
    password: password.value,
  }); */
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
  updateCookiesDisplay();
};

onMounted(() => {
  username.value = generateRandomEmail();
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
                    <td>1. Information</td>
                  </tr>
                  <tr>
                    <td>
                      <label>Email:</label><br /><input v-model="username" style="width: 250px" /><br />
                      <label>Password:</label><br /><input v-model="password" style="width: 250px" />
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
              <td>2. Singup</td>
            </tr>
            <tr>
              <td>
                <button @click="register">Register</button>
              </td>
            </tr>
            <tr>
              <td>
                <hr />
              </td>
            </tr>
          </table>
          <hr />
          <div>
            Added Users:
            <div v-for="(item, index) in items" v-if="items.length > 0" :key="index">
              <p>
                <b>{{ item.header }}</b><br />
                <textarea :style="{
                  border: 0,
                  width: '400px',
                  height:
                    item.data.length > 100
                      ? Math.min(500, item.data.length * 10) + 'px'
                      : '70px',
                }">{{ item.data }}</textarea>
              </p>
            </div>
            <i v-else> ... no users added </i>
          </div>
        </td>
        <td style="vertical-align: top; padding-left: 50px">
          <div v-if="user" style="width: 500px; overflow-x: scroll">
            <b>User Object:</b>
            <pre>{{ JSON.stringify(user, null, 2) }}</pre>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>
