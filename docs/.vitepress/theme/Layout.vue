<script setup>
import DefaultTheme from 'vitepress/theme'
import TopBanner from './components/TopBanner.vue';

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #layout-top v-if="false">
      <TopBanner />
    </template>
    <template #layout-bottom v-if="false">
      <h1>Bottom</h1>
    </template>
  </Layout>

</template>
