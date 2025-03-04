<script setup lang="ts">
const props = defineProps<{
  rowSize: string;
}>();

const rowClass = props.rowSize ? `${props.rowSize}-row-group` : 'full-row-group';
</script>
<template>
  <div class="form-group" :class="rowClass">
    <slot />
  </div>
</template>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
.one-forth-row-group {
  grid-column: span 3;
}

.one-third-row-group {
  grid-column: span 4;
}

.half-row-group {
  grid-column: span 6;
}

.full-row-group {
  grid-column: span 12;
}

.two-thirds-row-group {
  grid-column: span 8;
}
@media (max-width: 768px) {
  .form-group {
    grid-column: span 1;
  }
}
</style>
