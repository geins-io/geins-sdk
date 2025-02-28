<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getStoredSettings, settingsValid, cartValid, GeinsStorageParam } from '../../utils';

const props = withDefaults(
  defineProps<{
    for?: GeinsStorageParam;
    href?: string;
    onlyStatusCircle?: boolean;
    name?: string;
    fontSize?: string;
  }>(),
  {
    for: GeinsStorageParam.Settings,
    href: '',
    onlyStatusCircle: false,
    name: 'Geins settings',
    fontSize: '14px',
  },
);

const settings = ref();
const valid = computed(() => {
  switch (props.for) {
    case GeinsStorageParam.Settings:
      return settingsValid.value;
    case GeinsStorageParam.Cart:
      return cartValid.value;
    default:
      return false;
  }
});

const color = computed(() => {
  return valid.value ? '#74e878' : '#e87474';
});

const size = computed(() => {
  return props.onlyStatusCircle ? '15px' : '10px';
});

const text = computed(() => {
  return valid.value ? `${props.name} valid` : `${props.name} inactive`;
});

const fontSize = computed(() => {
  return props.fontSize;
});

const handleClick = (event: Event) => {
  if (!props.href) {
    event.preventDefault();
  }
};

onMounted(() => {
  settings.value = getStoredSettings(props.for);
});
</script>

<template>
  <a class="status-link" :href="href" @click="handleClick">
    <div v-if="onlyStatusCircle" class="status-circle" :title="text" />
    <div v-else class="status-box">
      <div class="status-circle"></div>
      <span>{{ text }}</span>
    </div>
  </a>
</template>

<style scoped>
.status-link {
  text-decoration: none;
  &:hover {
    color: var(--vp-c-primary);
  }
}
.status-box {
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 20px;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: v-bind('fontSize');
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
