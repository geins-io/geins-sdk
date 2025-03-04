<script setup lang="ts">
import { ref, watch } from 'vue';
import { defineEmits } from 'vue';

const props = defineProps<{
  label: string;
  modelValue: string;
  id: string;
  name: string;
  description?: string;
}>();

const value = ref(props.modelValue);
const emit = defineEmits(['update:modelValue']);

watch(value, (newValue) => {
  emit('update:modelValue', newValue);
});

watch(
  () => props.modelValue,
  (newValue) => {
    value.value = newValue;
  },
);
</script>

<template>
  <div class="color-input">
    <label :for="id">{{ label }}</label>
    <div class="input-group">
      <input type="text" :id="id" :name="name" v-model="value" placeholder="#000000" />
      <input type="color" v-model="value" />
    </div>
    <p v-if="description" class="input-description">{{ description }}</p>
  </div>
</template>

<style scoped>
.color-input label {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.1rem;
  margin-left: 3px;
  display: block;
  color: var(--vp-c-text-1);
}

.input-group {
  display: flex;
  align-items: center;
}

.input-group input[type='text'] {
  width: 100%;
  padding: 0.7rem 1rem;
  font-size: 1rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  border-radius: 6px 0 0 6px;
  transition: all 0.2s ease;
  border-right: none;
  height: 49px;
}

.input-group input[type='color'] {
  width: 49px;
  height: 49px;
  border: none;
  border-radius: 6px;
  padding: 0;
  margin: 0;
  cursor: pointer;
  flex-shrink: 0;
  border-radius: 0 6px 6px 0;
  transition: all 0.2s ease;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  border-left: none;
  padding: 6px;
}

.input-group input[type='text']:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 2px var(--vp-c-brand-lighter);
}

.input-group input[type='text']:focus + input[type='color'] {
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 2px var(--vp-c-brand-lighter);
}

.input-group input[type='text']::placeholder {
  color: var(--vp-c-text-3);
}

.input-description {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  margin-top: 5px;
  margin-left: 5px;
  line-height: 1.2;
}
</style>
