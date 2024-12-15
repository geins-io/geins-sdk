<script setup lang="ts">
import type { PropType } from 'vue';
import type { ContentAreaType } from '@geins/core';
import ContentContainer from './ContentContainer.vue';

// Define props interface
const props = defineProps({
  family: {
    type: String,
    required: false,
    default: 'Frontpage',
  },
  area: {
    type: String,
    required: false,
    default: '',
  },
  data: {
    type: Object as PropType<ContentAreaType>,
    required: true,
  },
});
</script>
<template>
  <div>
    <h4>{{ props.family }} / {{ $props.area }}</h4>
    <div>
      <p>
        <b>meta:</b> {{ JSON.stringify(props.data.meta, null, 2) }}
        <br />
        <b>tags:</b> {{ JSON.stringify(props.data.tags, null, 2) }}
      </p>
      <div style="border: 2px solid gray; padding: 5px">
        <ContentContainer v-for="container in props.data.containers" :key="container.id" :data="container" />
      </div>
    </div>
  </div>
</template>
