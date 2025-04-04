<script setup lang="ts">
import { ref, toRef } from 'vue';
import GeinsLoading from './GeinsLoading.vue';
const props = defineProps<{
  checkoutToken: string;
  loading: boolean;
}>();

const successText = ref('');
const loading = toRef(props, 'loading');

const copyToken = () => {
  navigator.clipboard.writeText(props.checkoutToken);
  successText.value = 'Token copied to clipboard!';
  setTimeout(() => {
    successText.value = '';
  }, 3000);
};
</script>
<template>
  <div class="token">
    <p class="token-title">Your Checkout Token</p>
    <div class="token-box">
      <pre id="checkout-token">{{ checkoutToken }}</pre>
      <div class="links">
        <button type="button" class="link" @click="copyToken">Copy</button>
        <a :href="`https://checkout.geins.services/${checkoutToken}`" target="_blank" class="link">
          Visit Checkout
        </a>
      </div>
      <p v-if="successText" class="success">{{ successText }}</p>
      <GeinsLoading v-if="loading" />
    </div>
  </div>
</template>

<style scoped>
.token {
  border-radius: 6px;
  text-align: center;
  margin-bottom: 20px;
}

.token-box {
  border: 1px solid var(--vp-c-success-1);
  border-radius: 6px;
  background: var(--vp-c-bg);
  padding: 1rem;
  position: relative;
  overflow: hidden;
}

.token-title {
  font-size: 1rem;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
}

.token .success {
  font-size: 0.7rem;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg);
  margin: 0;
  z-index: 10;
}

.token pre {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--vp-c-success-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 60px);
  margin: 0;
}

.links {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  position: absolute;
  padding: 0 20px;
  background: var(--vp-c-bg);
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
}

.link {
  text-decoration: underline;
  text-underline-offset: 3px;
  padding: 0;
  font-size: 13px;
  font-weight: 400;
  color: var(--vp-c-text-1);
}
.link:hover {
  color: var(--vp-c-brand);
}
</style>
