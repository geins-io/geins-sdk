<script setup lang="ts">
import { ref, onMounted, computed, defineProps } from 'vue';
import { getStoredSettings, settingsValid } from '../../utils';

// add prop to watch
const props = defineProps<{
  onlyStatusCircle?: boolean;
  linked?: boolean;
}>();

const settings = ref();

const color = computed(() => {
  return settingsValid.value ? '#74e878' : '#e87474';
});

const size = computed(() => {
  return props.onlyStatusCircle ? '15px' : '10px';
});

const text = computed(() => {
  return settingsValid.value ? 'Geins settings valid' : 'Geins settings inactive';
});

const handleClick = (event: Event) => {
  if (!props.linked) {
    event.preventDefault();
  }
};

onMounted(() => {
  settings.value = getStoredSettings();
});
</script>

<template>
  <a class="link" href="/guide/setting-up-sdk.html" @click="handleClick">
    <div v-if="onlyStatusCircle" class="status-circle" :title="text" />
    <div v-else class="geins-settings">
      <div class="status-circle"></div>
      <span>{{ text }}</span>
    </div>
  </a>
</template>

<style scoped>
.link {
  text-decoration: none;
  &:hover {
    color: var(--vp-c-primary);
  }
}
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
}
.status-circle {
  border-radius: 50%;
  background-color: v-bind('color');
  width: v-bind('size');
  height: v-bind('size');
  box-shadow: 0px 0px 5px 2px v-bind('color');
  animation: glow 0.6s linear infinite alternate;
}

@keyframes glow {
  to {
    box-shadow: 0px 0px 8px 3px v-bind('color');
  }
}
</style>
