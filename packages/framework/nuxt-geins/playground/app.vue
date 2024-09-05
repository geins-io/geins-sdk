<template>
  <div>Nuxt module playground!</div>
  <div>Check the log for some magic</div>
</template>

<script setup>
const { getContentArea } = useGeinsCMS();
const { geinsLog } = useGeinsLog();
const family = ref('Frontpage');
const areaName = ref('The front page area');

const { data } = await useAsyncData('contentArea', () =>
  getContentArea({ family: family.value, areaName: areaName.value }),
);

const contentArea = data.value?.data;

geinsLog('contentArea', contentArea);
</script>
