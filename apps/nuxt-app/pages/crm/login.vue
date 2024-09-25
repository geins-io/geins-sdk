<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
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
  clientConnectionMode: AuthClientConnectionModes.Direct,
} as AuthSettings;

// State variables
const email = ref<string>('viola92@gmail.com');
const password = ref<string>('na0o38y987fnbbxm4a7oi');
const errorMessage = ref<string | null>(null);

// Initialize Geins Core and GeinsCRM
const router = useRouter();
const route = useRoute();

// Initialize Geins Core and GeinsCRM
const core = new GeinsCore(geinsCredentials);
const geinsCRM = new GeinsCRM(core, authSettings);

const populateFromQuery = () => {
  const queryEmail = route.query.email as string | undefined;
  const queryPassword = route.query.password as string | undefined;

  logWrite('Query email', queryEmail);

  if (queryEmail) {
    email.value = queryEmail;
  }
  if (queryPassword) {
    password.value = queryPassword;
  }
};
onMounted(() => {
  populateFromQuery();
});

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
      router.push('/crm/user');
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
        <label for="email">Email:</label><br />
        <input id="email" v-model="email" type="email" required />
      </div>
      <div>
        <label for="password">Password:</label><br />
        <input id="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
    </form>

    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  </div>
</template>
<style scoped>
input {
  width: 250px;
}

.error {
  color: red;
}
</style>
