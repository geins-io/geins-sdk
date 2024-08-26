<script setup lang="ts">
import type { PropType } from 'vue';
import type { ContentType } from '@geins/core';

// Define props interface
const props = defineProps({
  data: {
    type: Object as PropType<ContentType>,
    required: true,
  },
});
</script>
<template>
  <div style="border:2px groove red; margin-bottom: 5px;">
    <div>
      <pre>{{ JSON.stringify(props.data, null, 2) }}</pre>
    </div>
  </div>
</template>
