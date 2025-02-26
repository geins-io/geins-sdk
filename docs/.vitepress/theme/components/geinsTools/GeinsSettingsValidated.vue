<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { getStoredSettings } from '../../utils';

// add prop to watch
const props = defineProps<{
  count: number;
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

const handleClick = async (event: Event) => {};
</script>

<template>
  <span @click="handleClick">
    <span v-if="settingsValid">🟢</span>
    <span v-else>🔴</span>
  </span>
</template>

<style scoped></style>
