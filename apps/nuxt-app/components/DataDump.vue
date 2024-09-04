<script setup lang="ts">
import type { PropType } from 'vue';


// Define props interface
const props = defineProps({
  data: {
    type: Object as PropType<object>,
    required: true,
  },
});
</script>
<template>
  <div v-if="props.data" v-for="(item, index) in props.data" :key="index">
    <p>
      <b>{{ item.header }}</b><br />
      <textarea :style="{
        border: 0,
        width: '500px',
        height: item.data.length > 100
          ? Math.min(200, item.data.length * 10) + 'px'
          : '20px',
      }">{{ item.data }}</textarea>
    </p>
  </div>
</template>
