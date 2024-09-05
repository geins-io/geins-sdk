<script setup>
import { useRoute } from 'nuxt/app';

const route = useRoute();
const routePath = route.fullPath;
</script>
<template>
  <div>
    <h1>Catch All Route</h1>
    <h2>You are visiting: {{ routePath }}</h2>
  </div>
</template>
