<script setup lang="ts">
import type { PropType } from 'vue';
import type { MenuType } from '@geins/core';
import MenuItem from './MenuItem.vue';

// Define props interface
defineProps({
  menu: {
    type: Object as PropType<MenuType>,
    required: true,
  },
});
</script>
<template>
  <div>
    <h4>{{ menu.title || 'No title' }}</h4>
    <div>
      <MenuItem v-for="item in menu.menuItems" :key="item.id" :item="item" />
    </div>
  </div>
</template>
