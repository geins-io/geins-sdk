<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { logWrite, GeinsCore, AuthClientConnectionModes } from '@geins/core';
import type { GeinsCredentials, AuthSettings } from '@geins/types';
import { GeinsCRM } from '@geins/crm';
import CookieDump from '~/components/CookieDump.vue';

const config = useRuntimeConfig();
const geinsCredentials = config.public.geins.credentials as GeinsCredentials;
const authSettings = {
  clientConnectionMode: AuthClientConnectionModes.Direct,
} as AuthSettings;

const geinsCore = new GeinsCore(geinsCredentials);
const geinsCRM = new GeinsCRM(geinsCore, authSettings);

const items = ref<any[]>([]);
const user = ref<any>({});
const spoofToken = ref<string>('');
const spoofUser = () => {
  const userSerialized = geinsCRM.spoofUser(spoofToken.value);
  logWrite('Spoofed user', userSerialized);
  user.value = userSerialized;
};

const goToCmsArea = () => {
  // open new tab with cms area
  window.open('/cms');
};
const goToCmsPage = () => {
  // open new tab with cms area
  window.open('/cms');
};

onMounted(() => {});
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
                    <td>1. Sppof token from MC</td>
                  </tr>
                  <tr>
                    <td>
                      <label>Set spoof token from merchant center</label><br />
                      <textarea
                        v-model="spoofToken"
                        style="width: 500px; height: 200px"
                      ></textarea>
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

          <CookieDump />
        </td>
        <td style="vertical-align: top; padding-left: 50px">
          <div style="width: 500px; overflow-x: scroll">
            <b>Spoof Object:</b>
            <pre>{{ user }}</pre>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>
