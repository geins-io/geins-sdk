<script setup>
import { defineProps, defineEmits, watch } from 'vue';

import MarketSelect from './controls/MarketSelect.vue';
import LanguageSelect from './controls/LanguageSelect.vue';

const { $currentChannel } = useNuxtApp();

const emit = defineEmits(['update:modelValue']);
const marketsData = $currentChannel.markets;
const defaultMarket = $currentChannel.defaultMarketId;
const defaultLanguage = $currentChannel.defaultLanguageId;

const marketId = ref('');
const languageId = ref('');
const marketOptions = ref([]);

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ marketId: '', languageId: '' }),
  },
});

// watch marketId
watch(
  () => marketId.value,
  async (newMarketId) => {
    emit('update:modelValue', {
      marketId: newMarketId,
      languageId: languageId.value,
    });
  },
  { immediate: true },
);

// watch languageId
watch(
  () => languageId.value,
  async (newlanguageId) => {
    emit('update:modelValue', {
      marketId: marketId.value,
      languageId: newlanguageId,
    });
  },
  { immediate: true },
);

// computed language options
const languageOptions = ref([]);
watch(
  () => marketId.value,
  async (newMarketId) => {
    if (newMarketId) {
      const market = $currentChannel.markets.find((x) => x.id === newMarketId);
      languageOptions.value =
        market?.allowedLanguages.map((lang) => ({
          value: lang.id,
          text: lang.name,
        })) || [];
      if (languageOptions.value.length > 0) {
        languageId.value = languageOptions.value[0].value;
      }
    }
  },
  { immediate: true },
);

onMounted(async () => {
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
  marketOptions.value = marketsData.map((market) => ({
    value: market.id,
    text: market.alias.toUpperCase() + ' - ' + market.groupKey,
  }));
  marketId.value = defaultMarket;
  // get allowed languages for market
  const market = $currentChannel.markets.find((x) => x.id === defaultMarket);
  languageOptions.value =
    market?.allowedLanguages.map((lang) => ({
      value: lang.id,
      text: lang.name,
    })) || [];
  languageId.value = $currentChannel.defaultLanguageId;
});
</script>

<template>
  <div>
    Market:<br />
    <MarketSelect v-model="marketId" :options="marketOptions" /><br />
    Language:<br />
    <LanguageSelect v-model="languageId" :options="languageOptions" />
  </div>
</template>
