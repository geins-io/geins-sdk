<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { logWrite, GeinsCore, AuthClientConnectionMode } from '@geins/core';
import type { GeinsCredentials, AuthSettings, AuthCredentials, AuthResponse } from '@geins/types';
import { GeinsCRM } from '@geins/crm';
import CookieDump from '~/components/CookieDump.vue';

const config = useRuntimeConfig();
const geinsCredentials = config.public.geins.credentials as GeinsCredentials;
const authSettings = {
  clientConnectionMode: AuthClientConnectionMode.Direct,
} as AuthSettings;

const geinsCore = new GeinsCore(geinsCredentials);
const geinsCRM = new GeinsCRM(geinsCore, authSettings);
const resultObject = ref<any>(null);
const errorMessage = ref<string | null>(null);

const email = ref<string>('arvidsson@geins.io');
const password = ref<string>('na0o38y987fnbbxm4a7oi');
const resetToken = ref<string>('');
const router = useRouter();
const requestReset = async () => {
  const result = await geinsCRM.passwordResetRequest(email.value);
  resultObject.value = result;

};

const commitReset = async () => {
  const result = await geinsCRM.passwordResetCommit(resetToken.value, password.value);
  resultObject.value = result;

  loginUser();

};

const loginUser = async () => {
  try {
    // Create credentials object
    const credentials: AuthCredentials = {
      username: email.value,
      password: password.value,
    };

    // Use GeinsCRM to authenticate the user
    const response: AuthResponse | undefined =
      await geinsCRM.auth.login(credentials);

    logWrite('Login response', response);

    if (response?.succeeded) {
      router.push('/crm/user');
    } else {
      errorMessage.value = 'Login failed. Please check your credentials.';
    }
  } catch (error) {
    errorMessage.value = 'An error occurred during login.';
    console.error('Login error:', error);
  }
};

onMounted(async () => {

});
</script>
<template>
  <div>
    <h2>Nuxt @geins/crm password reset</h2>
    <p>
      This page is used to test the password reset functionality of the @geins/crm package.
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
              <td>1. Request Reset:</td>
            </tr>
            <tr>
              <td>
                email:<br />
                <input v-model="email" />
                <button @click="requestReset">
                  Request Reset
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <hr />
              </td>
            </tr>
            <tr>
              <td>2. Commit Reset:</td>
            </tr>
            <tr>
              <td>
                <table>
                  <tr>
                    <td>
                      reset token:<br />
                      <textarea v-model="resetToken" style="width: 500px;"></textarea>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      new password:<br />
                      <input v-model="password" />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button @click="commitReset">
                        Commit Reset
                      </button>
                      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <hr />
          <div>
            <CookieDump />
          </div>
        </td>
        <td style="vertical-align: top; padding-left: 50px">

          <div style="width: 500px; overflow-x: scroll">
            <b>Result Object:</b>
            <pre>{{ JSON.stringify(resultObject, null, 2) }}</pre>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>
<style scoped>
.error {
  color: red;
}

input {
  width: 200px;
}

textarea {
  height: 100px;
}
</style>
