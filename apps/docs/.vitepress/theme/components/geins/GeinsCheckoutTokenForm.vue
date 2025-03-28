<script setup lang="ts">
import { GeinsCore } from '@geins/core';
import { GeinsOMS } from '@geins/oms';
import type { GenerateCheckoutTokenOptions, CheckoutSettings, GeinsSettings } from '@geins/types';
import { GeinsPaymentType } from '@geins/types';
import { ref, watch, computed, onMounted } from 'vue';
import {
  cartValid,
  getStoredSettings,
  storeSettings,
  GeinsStorageParam,
  type GeinsStorage,
} from '../../utils';
import GeinsFormGroup from './GeinsFormGroup.vue';

const checkoutToken = ref();
const validationError = ref('');
const cartId = ref('');

enum LogoSize {
  xs = '1.5rem',
  sm = '2rem',
  md = '2.5rem',
  lg = '3rem',
}

const logoSizeOptions = [
  { size: LogoSize.xs, label: 'XS (24px height)' },
  { size: LogoSize.sm, label: 'S (32px height)' },
  { size: LogoSize.md, label: 'M (40px height)' },
  { size: LogoSize.lg, label: 'L (48px height)' },
];

const paymentMethodOptions = [
  { id: 18, label: 'Manual Invoice' },
  { id: 23, label: 'Klarna Checkout' },
  { id: 24, label: 'Svea Checkout' },
  { id: 25, label: 'Walley Checkout' },
  { id: 26, label: 'Avarda Checkout' },
  { id: 27, label: 'Geins Pay' },
];

const checkoutSettings = ref<CheckoutSettings>({
  selectedPaymentMethodId: undefined,
  selectedShippingMethodId: undefined,
  customerType: undefined,
  redirectUrls: {
    success: '',
    cancel: '',
    error: '',
    terms: '',
    privacy: '',
  },
  branding: {
    title: '',
    icon: '',
    logo: '',
    styles: {
      logoSize: LogoSize.sm,
      radius: '',
      background: '#f7f7f7',
      foreground: '#131313',
      card: '#ffffff',
      cardForeground: '#131313',
      accent: '#131313',
      accentForeground: '#ffffff',
      border: '#ebebeb',
      sale: '#11890c',
      error: '#b80000',
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

const loading = ref(false);
const generateToken = async () => {
  if (!geinsCore || !geinsOMS || !geinsSettings.value) {
    validationError.value = 'Geins settings are missing.';
    return;
  }
  try {
    loading.value = true;
    console.log('🚀 ~ generateToken ~ payload.value:', payload.value);

    checkoutToken.value = await geinsOMS.createCheckoutToken(payload.value);
    const obj = {
      token: checkoutToken.value,
      ...checkoutSettings.value,
    };
    storeSettings(!!checkoutToken.value, obj, GeinsStorageParam.CheckoutToken);
  } catch (error) {
    validationError.value = 'Token generation failed.';
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 400);
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

const parseToken = async () => {
  const settings = await GeinsOMS.parseCheckoutToken(checkoutToken.value);
  cartId.value = settings.cartId;
  checkoutSettings.value = {
    ...checkoutSettings.value,
    ...settings.checkoutSettings,
  };
  console.log('🚀 ~ parseToken ~ checkoutSettings.value:', checkoutSettings.value);
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
        <p class="token-title">Your Checkout Token</p>
        <div class="token-box">
          <pre id="checkout-token">{{ checkoutToken }}</pre>
          <button type="button" class="link" @click="copyToken">Copy</button>
          <p v-if="successText" class="success">{{ successText }}</p>
          <div class="spinner" v-if="loading">
            <div class="spinner-circle"></div>
          </div>
        </div>
      </div>
      <p class="token-text">Already have a token and want to edit it? Paste it below:</p>
      <GeinsInput
        v-model="checkoutToken"
        id="checkout-token"
        name="checkout-token"
        label=""
        placeholder="Paste token here"
        class="token-input"
        @input="parseToken"
      />
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
          <label for="payment-method-id">Payment Method</label>
          <div class="select">
            <select v-model.number="checkoutSettings.selectedPaymentMethodId">
              <option value="" selected>Select payment method</option>
              <option v-for="option in paymentMethodOptions" :value="option.id" :key="option.id">
                {{ option.label }}
              </option>
            </select>
          </div>
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
          <label for="customerType">Customer Type</label>
          <div class="select">
            <select id="customerType" v-model="checkoutSettings.customerType">
              <option value="" selected>Select type</option>
              <option value="PERSON">Individual</option>
              <option value="ORGANIZATION">Business</option>
            </select>
          </div>
        </GeinsFormGroup>
      </GeinsFormGrid>
      <h3>Urls</h3>
      <GeinsFormGrid v-if="checkoutSettings.redirectUrls">
        <GeinsFormGroup row-size="half">
          <GeinsInput
            v-model="checkoutSettings.redirectUrls.success"
            id="success-url"
            name="success-url"
            label="Success Url"
            placeholder="https://example.com/thank-you"
            description="Url to redirect to after successful checkout, if you don't want to use the default one."
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="half">
          <GeinsInput
            v-model="checkoutSettings.redirectUrls.cancel"
            id="cancel-url"
            name="cancel-url"
            label="Cancel Url"
            placeholder="https://example.com/cart"
            description="Url to redirect to if user cancels the checkout."
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="half">
          <GeinsInput
            v-model="checkoutSettings.redirectUrls.error"
            id="error-url"
            name="error-url"
            label="Error Url"
            placeholder="https://example.com/error"
            description="Url to redirect to if an error occurs during the checkout, if you want to use a custom one."
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="half">
          <GeinsInput
            v-model="checkoutSettings.redirectUrls.continue"
            id="continue-url"
            name="continue-url"
            label="Continue Url"
            placeholder="https://example.com/continue"
            description="If supplied, will show a button to continue shopping on confirmation page."
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="half">
          <GeinsInput
            v-model="checkoutSettings.redirectUrls.terms"
            id="terms-url"
            name="terms-url"
            label="Terms Url"
            placeholder="https://example.com/terms"
            description="Will display a Terms link on the checkout page."
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="half">
          <GeinsInput
            v-model="checkoutSettings.redirectUrls.privacy"
            id="privacy-url"
            name="privacy-url"
            label="Privacy Url"
            placeholder="https://example.com/privacy"
            description="Will display a Privacy link on the checkout page."
          />
        </GeinsFormGroup>
      </GeinsFormGrid>
      <h3>Checkout Branding</h3>
      <GeinsFormGrid v-if="checkoutSettings.branding">
        <GeinsFormGroup row-size="full">
          <GeinsInput
            v-model="checkoutSettings.branding.title"
            id="title"
            name="title"
            label="Title"
            placeholder="Checkout"
            description="Optional title for the checkout page. A tip is to add your brand name here if you don't wanna use a logo."
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="half">
          <GeinsInput
            v-model="checkoutSettings.branding.icon"
            id="icon"
            name="icon"
            label="Icon URL"
            placeholder="https://example.com/icon.png"
            description="Used next to the logo or title. Will be shown in a circle as 48x48px"
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="half">
          <GeinsInput
            v-model="checkoutSettings.branding.logo"
            id="logo"
            name="logo"
            label="Logo URL"
            placeholder="https://example.com/logo.svg"
            description="Url for your logo. Choose size for your logo below."
          />
        </GeinsFormGroup>
        <GeinsFormGroup v-if="checkoutSettings.branding.styles" row-size="half">
          <GeinsFormGroup row-size="full">
            <label for="logoSize">Logo Size</label>
            <div class="select">
              <select id="logoSize" v-model="checkoutSettings.branding.styles.logoSize">
                <option v-for="option in logoSizeOptions" :value="option.size" :key="option.size">
                  {{ option.label }}
                </option>
              </select>
            </div>
          </GeinsFormGroup>
        </GeinsFormGroup>
        <GeinsFormGroup v-if="checkoutSettings.branding.styles" row-size="half">
          <GeinsInput
            v-model="checkoutSettings.branding.styles.radius"
            id="border-radius"
            name="border-radius"
            label="Border Radius"
            placeholder="5px / 0.5rem"
            description="Radius of UI elements"
          />
        </GeinsFormGroup>
      </GeinsFormGrid>
      <h4>Branding Colors</h4>
      <p class="desc">The colors below are set to the default values.</p>
      <GeinsFormGrid v-if="checkoutSettings.branding?.styles">
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
        <GeinsFormGroup row-size="half">
          <GeinsColorInput
            v-model="checkoutSettings.branding.styles.error"
            id="brand-error"
            name="brand-error"
            label="Error Color"
            description="Color used for error messages"
          />
        </GeinsFormGroup>
      </GeinsFormGrid>
      <div v-if="checkoutToken" class="token">
        <p class="token-title">Your Checkout Token</p>
        <div class="token-box">
          <pre id="checkout-token">{{ checkoutToken }}</pre>
          <button type="button" class="link" @click="copyToken">Copy</button>
          <p v-if="successText" class="success">{{ successText }}</p>
          <GeinsLoading v-if="loading" />
        </div>
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

.select {
  position: relative;
}

.select::after {
  content: '▼';
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  pointer-events: none;
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

.token-text {
  font-size: 0.9rem;
  margin-bottom: 0px;
  text-align: center;
}

.token-input {
  margin-bottom: 20px;
}

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
  color: var(--vp-c-white);
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

.link {
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  text-decoration: underline;
  text-underline-offset: 3px;
  padding-left: 20px;
  padding-right: 10px;
  background: var(--vp-c-bg);
}
</style>
