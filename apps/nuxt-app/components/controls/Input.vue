<script setup>
import { defineEmits, defineProps } from 'vue';
const { $currentChannel } = useNuxtApp();
const options = ref([]);
// Props
const props = defineProps({
  modelValue: String,
});

// Emits
const emit = defineEmits(['update:modelValue']);

// Event handler for input
const onInput = (event) => {
  emit('update:modelValue', event.target.value);
};

onMounted(async () => {
  const marketsData = $currentChannel.markets;

  const defaultMarket = $currentChannel.defaultMarketId;
  const defaultGroupKey = $currentChannel.markets.find(
    (x) => x.id === defaultMarket,
  )?.groupKey;

  marketsData.sort((a, b) => {
    if (a.groupKey === defaultGroupKey) return -1;
    if (b.groupKey === defaultGroupKey) return 1;
    if (a.id === defaultMarket) return -1;
    if (b.id === defaultMarket) return 1;
    return a.groupKey.localeCompare(b.groupKey);
  });

  options.value = marketsData.map((market) => ({
    value: market.id,
    text: market.alias.toUpperCase() + ' - ' + market.groupKey,
  }));
});
</script>
<template>
  <select :value="modelValue" style="250px" @change="onInput">
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.text }}
    </option>
  </select>
</template>
