<script setup lang="ts">
import { GeinsCore } from '@geins/core';
import { GeinsOMS } from '@geins/oms';
import type { CheckoutTokenPayload, CheckoutSettings, GeinsSettings } from '@geins/types';
import { ref, watch, computed, onMounted, watchEffect } from 'vue';
import { cartValid, getStoredSettings, GeinsStorageParam, type GeinsStorage } from '../../utils';
import { get } from 'http';
import GeinsFormGroup from './GeinsFormGroup.vue';

const cartId = ref('');
const customerType = ref('');
const checkoutSettings = ref({
  selectedPaymentMethodId: '',
  selectedShippingMethodId: '',
  redirectUrls: {
    success: '',
    cancel: '',
    error: '',
    terms: '',
  },
});
const geinsSettings = ref({} as GeinsSettings);

const payload = computed(() => ({
  cartId: cartId.value,
  customerType: customerType.value,
  checkoutSettings: checkoutSettings.value,
  geinsSettings: geinsSettings.value,
}));

watch(cartValid, (valid) => {
  getCart();
});

let geinsCore: GeinsCore | null = null;
let geinsOMS: GeinsOMS | null = null;

const getCart = () => {
  const storedCart: GeinsStorage | null = getStoredSettings(GeinsStorageParam.Cart);
  if (storedCart?.geinsCart) {
    cartId.value = storedCart.geinsCart.id;
  }
};

onMounted(() => {
  getCart();
  const storedSettings: GeinsStorage | null = getStoredSettings(GeinsStorageParam.Settings);
  if (storedSettings?.geinsSettings) {
    geinsSettings.value = storedSettings.geinsSettings;
    geinsCore = new GeinsCore(storedSettings.geinsSettings);
    geinsOMS = new GeinsOMS(geinsCore);
  }
});
</script>
<template>
  <form class="token-form" @submit.prevent="generateToken">
    <GeinsFormContainer>
      <GeinsFormGrid>
        <GeinsFormGroup row-size="full" class="cart-id-group">
          <GeinsInput
            v-model="cartId"
            id="cart-id"
            name="cart-id"
            label="Cart ID"
            placeholder="Generate Cart ID above"
          />
          <GeinsStatus class="status-circle" for="geins-cart" :only-status-circle="true" />
        </GeinsFormGroup>
      </GeinsFormGrid>
      <h3>Checkout Settings</h3>
      <GeinsFormGrid>
        <GeinsFormGroup row-size="half">
          <GeinsInput
            v-model="checkoutSettings.selectedPaymentMethodId"
            id="payment-method-id"
            name="payment-method-id"
            label="Payment Method ID"
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="half">
          <GeinsInput
            v-model="checkoutSettings.selectedShippingMethodId"
            id="shipping-method-id"
            name="shipping-method-id"
            label="Shipping Method ID"
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="full">
          <label for="customerType">Customer Type</label>
          <select id="customerType" v-model="customerType">
            <option value="" selected>Select type</option>
            <option value="PERSON">D2C</option>
            <option value="COMPANY">B2B</option>
          </select>
        </GeinsFormGroup>
      </GeinsFormGrid>
      <h3>Checkout Urls</h3>
      <GeinsFormGrid>
        <GeinsFormGroup row-size="half">
          <GeinsInput
            v-model="checkoutSettings.redirectUrls.success"
            id="success-url"
            name="success-url"
            label="Success Url"
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="half">
          <GeinsInput
            v-model="checkoutSettings.redirectUrls.cancel"
            id="cancel-url"
            name="cancel-url"
            label="Cancel Url"
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="half">
          <GeinsInput
            v-model="checkoutSettings.redirectUrls.error"
            id="error-url"
            name="error-url"
            label="Error Url"
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="half">
          <GeinsInput
            v-model="checkoutSettings.redirectUrls.terms"
            id="terms-url"
            name="terms-url"
            label="Terms Url"
          />
        </GeinsFormGroup>
      </GeinsFormGrid>
      <GeinsButton type="submit">Generate Checkout Token</GeinsButton>
    </GeinsFormContainer>
  </form>
</template>
<style scoped>
.token-form {
  margin-top: 20px;
}
.cart-id-group {
  position: relative;
}

.status-circle {
  position: absolute;
  bottom: 23%;
  right: 20px;
}

h3 {
  margin-bottom: 20px;
  font-size: 1.2rem;
  font-weight: 600;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

select {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  border-radius: 6px;
  transition: all 0.2s ease;
}

select:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 2px var(--vp-c-brand-lighter);
}
</style>
