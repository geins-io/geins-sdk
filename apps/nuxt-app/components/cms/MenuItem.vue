<script setup lang="ts">
import type { PropType } from 'vue';
import type { MenuItemType } from '@geins/core';

// Define props interface
const props = defineProps({
  item: {
    type: Object as PropType<MenuItemType>,
    required: true,
  },
});
</script>

<style scoped>
.menu-item {
  margin-left: 20px;
}

.children {
  margin-left: 20px;
}
</style>
<template>
  <div class="menu-item">
    <a
      :href="item.canonicalUrl"
      :target="item.targetBlank ? '_blank' : '_self'"
    >
      {{ item.title }}
    </a>
    <div v-if="item.children.length > 0" class="children">
      <MenuItem v-for="child in item.children" :key="child.id" :item="child" />
    </div>
  </div>
</template>
