<script setup lang="ts">
import { defineEmits, watch, ref } from 'vue';

const props = defineProps<{
  label: string;
  modelValue: string;
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
}>();

const value = ref(props.modelValue);
watch(value, (newValue) => {
  emit('update:modelValue', newValue);
});
watch(
  () => props.modelValue,
  (newValue) => {
    value.value = newValue;
  },
);
const emit = defineEmits(['update:modelValue']);
</script>
<template>
  <div class="input">
    <label :for="id">{{ label }}</label>
    <input :type="type" :id="id" :name="name" v-model="value" :placeholder="placeholder" />
  </div>
</template>
<style scoped>
.input label {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.1rem;
  margin-left: 3px;
  display: block;
  color: var(--vp-c-text-1);
}

.input input {
  width: 100%;
  padding: 0.7rem 1rem;
  font-size: 1rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  border-radius: 6px;
  transition: all 0.2s ease;
}

.input input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 2px var(--vp-c-brand-lighter);
}

.input input::placeholder {
  color: var(--vp-c-text-3);
}
</style>
