<template>
  <div>Nuxt module playground!</div>
  <div>Check the log for some magic</div>
</template>

<script setup>
const { getContentArea } = useGeinsCMS();
const { geinsLog } = useGeinsLog();
const family = ref('Frontpage');
const area = ref('The front page area');

const { data } = await useAsyncData('contentArea', () =>
  getContentArea(family.value, area.value),
);

const contentArea = data.value?.data;

geinsLog('contentArea', contentArea);
</script>
