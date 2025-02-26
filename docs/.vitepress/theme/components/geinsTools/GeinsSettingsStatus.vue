<script setup lang="ts">
import { ref, onMounted, watch, computed, defineProps } from 'vue';
import { getStoredSettings } from '../../utils';

// add prop to watch
const props = defineProps<{
  count?: number;
  onlyStatusCircle?: boolean;
}>();

// watch props
watch(
  () => props.count,
  (count, prevCount) => {
    checkValidSettings();
  },
);

// GeinsSettings
const settingsValid = ref<boolean>(false);

const checkValidSettings = () => {
  const settings = getStoredSettings();
  if (settings) {
    settingsValid.value = settings.validated;
  } else {
    settingsValid.value = false;
  }
};

// onmount
onMounted(() => {
  checkValidSettings();
});

const color = computed(() => {
  return settingsValid.value ? '#74e878' : '#e87474';
});

const text = computed(() => {
  return settingsValid.value ? 'Geins settings valid' : 'Geins settings inactive';
});
</script>

<template>
  <div v-if="onlyStatusCircle" class="status-circle" :title="text"></div>
  <a v-else class="geins-settings" href="/guide/setting-up-sdk.html" @click="handleClick">
    <div class="status-circle"></div>
    <span>{{ text }}</span>
  </a>
</template>

<style scoped>
.geins-settings {
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 20px;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 12px;
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-primary);
  &:hover {
    color: var(--vp-c-primary);
  }
}
.status-circle {
  border-radius: 50%;
  background-color: v-bind('color');
  width: 10px;
  height: 10px;
  box-shadow: 0px 0px 5px 2px v-bind('color');
  animation: glow 0.6s linear infinite alternate;
}

@keyframes glow {
  to {
    box-shadow: 0px 0px 8px 3px v-bind('color');
  }
}
</style>
