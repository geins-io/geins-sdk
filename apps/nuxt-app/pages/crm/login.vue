<script setup lang="ts">
import { ref } from 'vue';
import { GeinsCore, AuthClientConnectionMode, logWrite } from '@geins/core';
import { GeinsCRM } from '@geins/crm';
import type {
  GeinsCredentials,
  AuthSettings,
  AuthCredentials,
  AuthResponse,
} from '@geins/types';

const config = useRuntimeConfig();
const geinsCredentials = config.public.geins.credentials as GeinsCredentials;
const authSettings = {
  clientConnectionMode: AuthClientConnectionMode.Direct,
} as AuthSettings;

// State variables
const email = ref<string>('viola92@gmail.com');
const password = ref<string>('dZgFCZi66mnPr9D');
const errorMessage = ref<string | null>(null);

// Initialize Geins Core and GeinsCRM
const core = new GeinsCore(geinsCredentials);

const geinsCRM = new GeinsCRM(core, authSettings);

// Define login method
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
      // Do something on successful login, e.g., redirect or fetch user profile
    } else {
      errorMessage.value = 'Login failed. Please check your credentials.';
    }
  } catch (error) {
    errorMessage.value = 'An error occurred during login.';
    console.error('Login error:', error);
  }
};
</script>
<template>
  <div>
    <h2>Nuxt @geins/crm register user</h2>

    <p>
      This page sets a spoofed user in the browser cookies. The user can then be
      used to get preview cms data.
    </p>
    <p>
      <b>
        <NuxtLink to="/">GO BACK</NuxtLink>
      </b>
    </p>
    <h3>Login</h3>
    <form @submit.prevent="loginUser">
      <div>
        <label for="email">Email:</label>
        <input id="email" v-model="email" type="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input id="password" v-model="password" type="password" required />
      </div>
      <button type="submit">Login</button>
    </form>

    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  </div>
</template>
<style scoped>
.error {
  color: red;
}
</style>
