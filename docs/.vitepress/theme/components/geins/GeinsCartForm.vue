<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getStoredSettings, settingsValid, cartValid, GeinsStorageParam } from '../../utils';
/* const generateCart = async () => {
  const settingsJson = createSettingsJson();
  if (!(await validateSettings(settingsJson))) return;

  const skuIdsArray = skuIds.value
    .split(',')
    .filter((id) => id !== '')
    .map((id) => parseInt(id.trim()));

  if (skuIdsArray.length === 0) {
    return;
  }

  try {
    const geinsCore = new GeinsCore(settingsJson);
    const geinsOMS = new GeinsOMS(geinsCore);

    for (const skuId of skuIdsArray) {
      await geinsOMS.cart.items.add({ skuId, quantity: 1 });
    }
    const cart = await geinsOMS.cart.get();
    cartId.value = cart?.id || '';
    // save cart to local storage
    localStorage.setItem('geinsCart', JSON.stringify(cart));
  } catch (error) {
    validationError.value = 'Failed to generate cart.';
  }
}; */
const tags = ref([]);
</script>
<template>
  <form @submit.prevent="submitForm">
    <GeinsFormContainer>
      <GeinsFormGrid>
        <GeinsFromGroup>
          <TagsInput
            label="SKU IDs"
            :tags="tags"
            placeholder="Enter SKU IDs separated by commas"
            name="skuIds"
            id="skuIds"
            @on-tags-changed="tags = $event"
          />
        </GeinsFromGroup>
      </GeinsFormGrid>
    </GeinsFormContainer>
    <button type="submit">Generate Cart</button>
  </form>
</template>
