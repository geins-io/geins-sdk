/* import { GeinsCore } from '@geins/core' */
import { defineNuxtPlugin } from '#app';
// import { useRuntimeConfig } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  // const { geins: config } = useRuntimeConfig().public

  // function that will be called when the plugin is used
  nuxtApp.provide('hello', (name) => `Hello ${name}!`);
});
