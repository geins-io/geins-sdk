<script setup lang="ts">
const props = defineProps<{}>();
</script>
<template>
  <button type="submit" @click="$emit('submit')">
    <slot />
  </button>
</template>

<style scoped>
button {
  width: 100%;
  padding: 0.7rem;
  font-size: 0.95rem;
  font-weight: 600;

  border: 1px solid var(--vp-button-brand-border);
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  background-color: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  border-color: var(--vp-button-brand-border);
}

button:hover {
  color: var(--vp-button-brand-hover-text);
  background-color: var(--vp-button-brand-hover-bg);
  border-color: var(--vp-button-brand-hover-border);
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 3px var(--vp-c-brand-lighter);
}
</style>
