<script setup>
import DefaultTheme from 'vitepress/theme'
import TopBanner from './components/TopBanner.vue';

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #layout-top>
      <TopBanner v-if="false" />
    </template>
  </Layout>
</template>
