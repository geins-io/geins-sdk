<script setup lang="ts">
import { GeinsCore } from '@geins/core';
import { GeinsOMS } from '@geins/oms';
import { ref, onMounted } from 'vue';
import {
  getStoredSettings,
  storeSettings,
  settingsValid,
  GeinsStorageParam,
  type GeinsStorageCart,
  type GeinsStorage,
} from '../../utils';

const cart = ref<GeinsStorageCart>({
  id: '',
  skus: [],
});

const loading = ref(false);

let geinsCore: GeinsCore | null = null;
let geinsOMS: GeinsOMS | null = null;

const addItemsToCart = async () => {
  try {
    await geinsOMS?.cart.items.clear();
    for (const sku of cart.value.skus) {
      const skuId = Number(sku);
      await geinsOMS?.cart.items.add({ skuId, quantity: 1 });
    }
  } catch (error) {
    console.error('Failed to add items to cart.', error);
    // validationError.value = 'Failed to add items to cart.';
  }
};

const generateCart = async () => {
  if (!settingsValid.value) {
    return;
  }
  try {
    loading.value = true;
    await addItemsToCart();
    const createdCart = await geinsOMS?.cart.get();
    cart.value.id = createdCart?.id || '';
    cart.value.skus = createdCart?.items?.map((item) => Number(item.skuId)) || [];

    const valid = cart.value.id !== '';
    storeSettings(valid, cart.value, GeinsStorageParam.Cart);
  } catch (error) {
    console.error('Failed to generate cart.', error);
    // validationError.value = 'Failed to generate cart.';
  } finally {
    loading.value = false;
  }
};

const removeCart = async () => {
  loading.value = true;
  await geinsOMS?.cart.remove();
  cart.value = { id: '', skus: [] };
  storeSettings(false, cart.value, GeinsStorageParam.Cart);
  loading.value = false;
};

onMounted(() => {
  const stored: GeinsStorage | null = getStoredSettings(GeinsStorageParam.Cart);
  if (stored?.geinsCart) {
    cart.value = stored.geinsCart;
  }
  const settings = getStoredSettings(GeinsStorageParam.Settings);
  if (settings?.geinsSettings) {
    geinsCore = new GeinsCore(settings.geinsSettings);
    geinsOMS = new GeinsOMS(geinsCore);
  }
});
</script>
<template>
  <form @submit.prevent="generateCart">
    <GeinsFormContainer>
      <div v-if="cart.id || loading" class="label">Cart ID</div>
      <div v-if="cart.id || loading" class="cart-id">
        {{ cart.id }}
        <GeinsLoading v-if="loading" />
      </div>
      <GeinsFormGrid>
        <GeinsFormGroup row-size="full">
          <TagsInput
            label="Sku IDs"
            :tags="cart.skus"
            placeholder="Enter a sku ID and press enter"
            @on-tags-changed="cart.skus = $event"
          />
        </GeinsFormGroup>
      </GeinsFormGrid>
      <GeinsButton type="submit">Generate Cart</GeinsButton>
      <button v-if="cart.id" class="link" type="button" @click="removeCart">Clear cart</button>
    </GeinsFormContainer>
  </form>
</template>

<style scoped>
.label {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.2rem;
  margin-left: 3px;
  display: block;
  color: var(--vp-c-text-1);
}
.cart-id {
  position: relative;
  font-size: 1.2rem;
  text-align: center;
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  padding: 10px;
  border-radius: 5px;
  background: var(--vp-c-bg);
  margin-bottom: 20px;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.link {
  text-decoration: underline;
  text-underline-offset: 3px;
  text-align: center;
  width: 100%;
  margin-top: 10px;
}
</style>
