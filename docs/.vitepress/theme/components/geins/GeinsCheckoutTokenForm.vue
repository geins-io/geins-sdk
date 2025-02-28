<script setup lang="ts">
import { GeinsCore } from '@geins/core';
import { GeinsOMS } from '@geins/oms';
import type { GenerateCheckoutTokenOptions, CheckoutSettings, GeinsSettings } from '@geins/types';
import { ref, watch, computed, onMounted } from 'vue';
import {
  cartValid,
  getStoredSettings,
  storeSettings,
  GeinsStorageParam,
  type GeinsStorage,
  type GeinsStorageCheckout,
} from '../../utils';
import GeinsFormGroup from './GeinsFormGroup.vue';

const checkoutToken = ref();
const validationError = ref('');
const cartId = ref('');
const checkoutSettings = ref<CheckoutSettings>({
  selectedPaymentMethodId: undefined,
  selectedShippingMethodId: undefined,
  customerType: undefined,
  redirectUrls: {
    success: '',
    cancel: '',
    error: '',
    terms: '',
  },
  branding: {
    title: '',
    avatar: '',
    logo: '',
    styles: {
      fontSize: '',
      radius: '',
      background: '#f7f7f7',
      foreground: '#9c9c9c',
      card: '#ffffff',
      cardForeground: '#131313',
      accent: '#131313',
      accentForeground: '#ffffff',
      border: '#e6e6e6',
      sale: '#b70000',
    },
  },
});
const geinsSettings = ref<GeinsSettings>();

const payload = computed<GenerateCheckoutTokenOptions>(() => ({
  cartId: cartId.value,
  geinsSettings: geinsSettings.value,
  ...checkoutSettings.value,
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

const getStoredCheckout = () => {
  const stored: GeinsStorage | null = getStoredSettings(GeinsStorageParam.CheckoutToken);
  if (stored?.geinsCheckout) {
    checkoutToken.value = stored.geinsCheckout.token;
    checkoutSettings.value = {
      ...stored.geinsCheckout,
    };
  }
};

const generateToken = async () => {
  if (!geinsCore || !geinsOMS || !geinsSettings.value) {
    validationError.value = 'Geins settings are missing.';
    return;
  }
  try {
    checkoutToken.value = await geinsOMS.createCheckoutToken(payload.value);
    const obj = {
      token: checkoutToken.value,
      ...checkoutSettings.value,
    };
    console.log('🚀 ~ generateToken ~ obj:', obj);
    storeSettings(!!checkoutToken.value, obj, GeinsStorageParam.CheckoutToken);
  } catch (error) {
    validationError.value = 'Token generation failed.';
  }
};
const successText = ref();
const copyToken = () => {
  navigator.clipboard.writeText(checkoutToken.value);
  successText.value = 'Token copied to clipboard!';
  setTimeout(() => {
    successText.value = '';
  }, 3000);
};

onMounted(() => {
  getCart();
  getStoredCheckout();
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
      <div v-if="checkoutToken" class="token">
        <p>Your Checkout Token</p>
        <pre id="checkout-token">{{ checkoutToken }}</pre>
        <button type="button" class="link" @click="copyToken">Copy</button>
        <p v-if="successText" class="success">{{ successText }}</p>
      </div>
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
            v-model.number="checkoutSettings.selectedPaymentMethodId"
            id="payment-method-id"
            name="payment-method-id"
            label="Payment Method ID"
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="half">
          <GeinsInput
            v-model.number="checkoutSettings.selectedShippingMethodId"
            id="shipping-method-id"
            name="shipping-method-id"
            label="Shipping Method ID"
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="full">
          <div class="select">
            <label for="customerType">Customer Type</label>
            <select id="customerType" v-model="checkoutSettings.customerType">
              <option value="" selected>Select type</option>
              <option value="PERSON">D2C</option>
              <option value="COMPANY">B2B</option>
            </select>
          </div>
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
            placeholder="https://example.com/thank-you"
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="half">
          <GeinsInput
            v-model="checkoutSettings.redirectUrls.cancel"
            id="cancel-url"
            name="cancel-url"
            label="Cancel Url"
            placeholder="https://example.com/cart"
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="half">
          <GeinsInput
            v-model="checkoutSettings.redirectUrls.error"
            id="error-url"
            name="error-url"
            label="Error Url"
            placeholder="https://example.com/error"
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="half">
          <GeinsInput
            v-model="checkoutSettings.redirectUrls.terms"
            id="terms-url"
            name="terms-url"
            label="Terms Url"
            placeholder="https://example.com/terms"
          />
        </GeinsFormGroup>
      </GeinsFormGrid>
      <h3>Checkout Branding</h3>
      <GeinsFormGrid>
        <GeinsFormGroup row-size="full">
          <GeinsInput
            v-model="checkoutSettings.branding.title"
            id="title"
            name="title"
            label="Title"
            placeholder="Checkout"
            description="Title for the checkout page. Add your brand name here if you don't wanna use a logo."
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="half">
          <GeinsInput
            v-model="checkoutSettings.branding.avatar"
            id="avatar"
            name="avatar"
            label="Avatar Image URL"
            placeholder="https://example.com/avatar.png"
            description="Used next to the title if no logo is provided. Will be shown as 48x48px"
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="half">
          <GeinsInput
            v-model="checkoutSettings.branding.logo"
            id="logo"
            name="logo"
            label="Logo URL"
            placeholder="https://example.com/logo.svg"
            description="Url for your logo. Will be shown 48px high with auto width."
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="half">
          <GeinsInput
            v-model="checkoutSettings.branding.styles.fontSize"
            id="brand-font-size"
            name="brand-font-size"
            label="Font Size"
            placeholder="16px"
            description="Font size of the body text"
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="half">
          <GeinsInput
            v-model="checkoutSettings.branding.styles.radius"
            id="border-radius"
            name="border-radius"
            label="Border Radius"
            placeholder="5px"
            description="Radius of UI elements in pixels"
          />
        </GeinsFormGroup>
      </GeinsFormGrid>
      <h4>Branding Colors</h4>
      <p class="desc">The colors below are set to the default values.</p>
      <GeinsFormGrid>
        <GeinsFormGroup row-size="half">
          <GeinsColorInput
            v-model="checkoutSettings.branding.styles.background"
            id="brand-background"
            name="brand-background"
            label="Background Color"
            description="The first background color"
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="half">
          <GeinsColorInput
            v-model="checkoutSettings.branding.styles.foreground"
            id="brand-foreground"
            name="brand-foreground"
            label="Foreground Color"
            description="Color for text and icons used on the first background color"
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="half">
          <GeinsColorInput
            v-model="checkoutSettings.branding.styles.card"
            id="brand-card"
            name="brand-card"
            label="Secondary Background Color"
            description="Used as a secondary background color"
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="half">
          <GeinsColorInput
            v-model="checkoutSettings.branding.styles.cardForeground"
            id="brand-card-foreground"
            name="brand-card-foreground"
            label="Secondary Foreground Color"
            description="Color for text and icons used on the secondary background color"
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="half">
          <GeinsColorInput
            v-model="checkoutSettings.branding.styles.accent"
            id="brand-accent"
            name="brand-accent"
            label="Accent Color"
            description="Color used on buttons and other accent elements"
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="half">
          <GeinsColorInput
            v-model="checkoutSettings.branding.styles.accentForeground"
            id="brand-accent-foreground"
            name="brand-accent-foreground"
            label="Accent Foreground Color"
            description="Color for text and icons used on accent elements"
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="half">
          <GeinsColorInput
            v-model="checkoutSettings.branding.styles.border"
            id="brand-border"
            name="brand-border"
            label="Border Color"
            description="Color for borders"
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="half">
          <GeinsColorInput
            v-model="checkoutSettings.branding.styles.sale"
            id="brand-sale"
            name="brand-sale"
            label="Sale Color"
            description="Color used for sale prices in the cart"
          />
        </GeinsFormGroup>
      </GeinsFormGrid>
      <div v-if="checkoutToken" class="token">
        <p>Your Checkout Token</p>
        <pre id="checkout-token">{{ checkoutToken }}</pre>
        <button type="button" class="link" @click="copyToken">Copy</button>
        <p v-if="successText" class="success">{{ successText }}</p>
      </div>
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

h3,
h4 {
  margin-bottom: 20px;
  font-size: 1.2rem;
  font-weight: 600;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

h4 {
  font-size: 1rem;
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

.desc {
  font-size: 0.9rem;
  color: var(--vp-c-text-3);
  margin-bottom: 20px;
}

.token {
  padding: 0 1rem;
  border: var(--vp-c-success-1) 1px solid;
  border-radius: 6px;
  text-align: center;
  margin-bottom: 20px;
}

.token p {
  font-size: 1rem;
  color: var(--vp-c-white);
  margin-bottom: 0.5rem;
}

.token .success {
  font-size: 0.6rem;
  margin-top: -10px;
  margin-bottom: 20px;
}

.token pre {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--vp-c-success-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.link {
  text-decoration: underline;
  text-underline-offset: 3px;
  text-align: center;
  width: 100%;
  margin-bottom: 20px;
}
</style>
