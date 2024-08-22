<script setup lang="ts">
import { ref } from 'vue';
import { GeinsCore, GeinsRouter } from '@geins/core';
const { data } = await useFetch<any>('/api/router');
const runtimeConfig = useRuntimeConfig()
const nuxtApp = useNuxtApp();
const router = new GeinsRouter();


const items = ref<any[]>([]);
const handleClick = () => {
  console.log('nuxtApp', nuxtApp);
};

</script>
<template>
  <div>
    <h2>Nuxt Test</h2>
    <button @click="handleClick">Core</button>
    <button @click="handleClick">CMS</button>
    <button @click="handleClick">CRM</button>
    <button @click="handleClick">Page</button>

  </div>
</template>
