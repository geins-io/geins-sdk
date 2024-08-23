<script setup lang="ts">
import type { PropType } from 'vue';
import type { ContentContainerType } from '@geins/core';
import Content from './Content.vue';


// Define props interface
const props = defineProps({
  data: {
    type: Object as PropType<ContentContainerType>,
    required: true,
  },
});
</script>
<template>
  <div style="border:black solid 2px; margin-bottom: 5px; padding: 5px;">
    {{ props.data.name }}
    <div>
      <Content v-for="content in props.data.content" :key="content.id" :data="content" />
    </div>
  </div>
</template>
