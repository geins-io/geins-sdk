<script setup lang="ts">
import { cookies } from '~/utils/cookies';

const items = ref<CookieArrayItem[]>([]);

cookies.getAllCookies().forEach((cookie) => {
  if (!cookie) return;
  if (!cookie.name) return;
  if (!cookie.name.startsWith('geins')) return;
  items.value.push({
    name: cookie.name,
    data: cookie.data,
  });
});

onMounted(() => { });
</script>
<template>
  <div>
    Current Cookies:
    <div v-for="(item, index) in items" v-if="items" :key="index">
      <p>
        <b>{{ item.name }}</b><br />
        <textarea :style="{
          border: 0,
          width: '500px',
          height:
            item.data.length > 100
              ? Math.min(300, item.data.length * 10) + 'px'
              : '30px',
        }">{{ item.data }}</textarea>
      </p>
    </div>
  </div>
</template>
