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

const getConfiguration = computed(() => {
  const { id, name, sortOrder, layout, responsiveMode, design } = props.data;
  return { id, name, sortOrder, layout, responsiveMode, design };
});
</script>
<template>
  <div style="border: black solid 2px; margin-bottom: 5px; padding: 5px">
    <pre>{{ getConfiguration }}</pre>

    <div>
      <pre>content:[</pre>
      <Content
        v-for="content in props.data.content"
        :key="content.id"
        :data="content"
      />
      <pre>]</pre>
    </div>
  </div>
</template>
