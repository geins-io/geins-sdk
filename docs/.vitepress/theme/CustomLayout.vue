<script setup>
import DefaultTheme from 'vitepress/theme';
const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #sidebar-nav-after>
      <GeinsStatus href="/guide/setting-up-sdk.html" />
    </template>
  </Layout>
</template>
