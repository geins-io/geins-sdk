<script setup lang="ts">
import { GeinsCore } from '@geins/core';
import { GeinsOMS } from '@geins/oms';
import type {
  GenerateCheckoutTokenOptions,
  CheckoutSettings,
  GeinsSettings,
  GeinsUserType,
  PaymentOptionType,
  ShippingOptionType,
} from '@geins/types';
import { ref, watch, computed, onMounted, nextTick } from 'vue';
import {
  cartValid,
  settingsValid,
  getStoredSettings,
  storeSettings,
  GeinsStorageParam,
  type GeinsStorage,
} from '../../utils';
import GeinsFormGroup from './GeinsFormGroup.vue';
import GeinsFormGrid from './GeinsFormGrid.vue';
import GeinsFormContainer from './GeinsFormContainer.vue';
import GeinsInput from './GeinsInput.vue';
import GeinsButton from './GeinsButton.vue';
import GeinsColorInput from './GeinsColorInput.vue';
import GeinsStatus from './GeinsStatus.vue';

const checkoutToken = ref();
const validationError = ref('');
const cartId = ref('');
const user = ref<GeinsUserType>({
  id: 0,
  email: '',
  address: {
    phone: '',
    mobile: '',
    company: '',
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    zip: '',
    careOf: '',
    city: '',
    state: '',
    country: '',
    entryCode: '',
  },
});

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

const paymentMethodOptions = ref<PaymentOptionType[] | undefined>();
const shippingMethodOptions = ref<ShippingOptionType[] | undefined>();

const checkoutSettings = ref<CheckoutSettings>({
  selectedPaymentMethodId: undefined,
  selectedShippingMethodId: undefined,
  copyCart: true,
  customerType: undefined,
  redirectUrls: {
    success: '',
    cancel: '',
    continue: '',
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
      sale: '#e60000',
      error: '#b00020',
    },
  },
});
const geinsSettings = ref<GeinsSettings>();

const payload = computed<GenerateCheckoutTokenOptions>(() => ({
  cartId: cartId.value,
  geinsSettings: geinsSettings.value,
  user: user.value,
  ...checkoutSettings.value,
}));

watch(cartValid, async (valid) => {
  if (valid) {
    await getCart();
    await getCheckout();
  }
});

watch(settingsValid, async (valid) => {
  if (valid) {
    await initGeins();
  }
});

let geinsCore: GeinsCore | null = null;
let geinsOMS: GeinsOMS | null = null;

const getCart = async () => {
  const storedCart: GeinsStorage | null = getStoredSettings(GeinsStorageParam.Cart);
  if (storedCart?.geinsCart) {
    cartId.value = storedCart.geinsCart.id;
  }
};

const getStoredCheckout = async () => {
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

const parseToken = async () => {
  const settings = await GeinsOMS.parseCheckoutToken(checkoutToken.value);
  cartId.value = settings.cartId;
  checkoutSettings.value = {
    ...checkoutSettings.value,
    ...settings.checkoutSettings,
  };
};

const getCheckout = async () => {
  const checkout = await geinsOMS?.checkout.get({
    cartId: cartId.value,
    checkoutOptions: {
      skipShippingValidation: true,
    },
  });

  if (checkout) {
    paymentMethodOptions.value = checkout.paymentOptions;
    shippingMethodOptions.value = checkout.shippingOptions;
    if (paymentMethodOptions.value && !checkoutSettings.value.selectedPaymentMethodId) {
      checkoutSettings.value.selectedPaymentMethodId = paymentMethodOptions.value[0].id;
    }
    if (shippingMethodOptions.value && !checkoutSettings.value.selectedShippingMethodId) {
      checkoutSettings.value.selectedShippingMethodId = shippingMethodOptions.value[0].id;
    }
  }
};

const initGeins = async () => {
  const storedSettings: GeinsStorage | null = getStoredSettings(GeinsStorageParam.Settings);
  if (storedSettings?.geinsSettings) {
    geinsSettings.value = storedSettings.geinsSettings;
    geinsCore = new GeinsCore(storedSettings.geinsSettings);
    geinsOMS = new GeinsOMS(geinsCore);
  }
};

onMounted(async () => {
  await getStoredCheckout();
  await getCart();
  await initGeins();
  await getCheckout();
});
</script>
<template>
  <form class="token-form" @submit.prevent="generateToken">
    <GeinsFormContainer>
      <GeinsToken v-if="checkoutToken" :checkout-token="checkoutToken" :loading="loading" />
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
          <GeinsStatus class="status-circle" :for="GeinsStorageParam.Cart" :only-status-circle="true" />
        </GeinsFormGroup>
      </GeinsFormGrid>
      <GeinsFormGrid>
        <GeinsFormGroup row-size="full">
          <label for="copy-cart" class="checkbox">
            <input type="checkbox" id="copy-cart" v-model="checkoutSettings.copyCart" />
            <div class="checkbox-label">Clone cart</div>
          </label>
        </GeinsFormGroup>
      </GeinsFormGrid>
      <h3>Checkout Settings</h3>
      <GeinsFormGrid>
        <GeinsFormGroup v-if="paymentMethodOptions && paymentMethodOptions.length" row-size="half">
          <label class="select-label" for="payment-method-id">Payment Method</label>
          <div class="select">
            <select v-model.number="checkoutSettings.selectedPaymentMethodId">
              <option :value="undefined" disabled selected>Select payment method</option>
              <option v-for="option in paymentMethodOptions" :value="option.id" :key="option.id">
                {{ option.displayName }}
              </option>
            </select>
          </div>
        </GeinsFormGroup>
        <GeinsFormGroup v-else row-size="half">
          <GeinsInput
            v-model.number="checkoutSettings.selectedPaymentMethodId"
            id="payment-method-id"
            name="payment-method-id"
            label="Payment Method ID"
          />
        </GeinsFormGroup>
        <GeinsFormGroup v-if="shippingMethodOptions && shippingMethodOptions.length" row-size="half">
          <label class="select-label" for="shipping-method-id">Shipping Method</label>
          <div class="select">
            <select v-model.number="checkoutSettings.selectedShippingMethodId">
              <option :value="undefined" disabled selected>Select shipping method</option>
              <option v-for="option in shippingMethodOptions" :value="option.id" :key="option.id">
                {{ option.displayName }}
              </option>
            </select>
          </div>
        </GeinsFormGroup>
        <GeinsFormGroup v-else row-size="half">
          <GeinsInput
            v-model.number="checkoutSettings.selectedShippingMethodId"
            id="shipping-method-id"
            name="shipping-method-id"
            label="Shipping Method ID"
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="half">
          <label class="select-label" for="customerType">Customer Type</label>
          <div class="select">
            <select id="customerType" v-model="checkoutSettings.customerType">
              <option :value="undefined" disabled selected>Select type</option>
              <option value="PERSON">Person</option>
              <option value="ORGANIZATION">Organization</option>
            </select>
          </div>
        </GeinsFormGroup>
        <GeinsFormGroup v-if="user.address" row-size="half">
          <GeinsInput
            v-model="user.address.zip"
            id="zip-code"
            name="zip-code"
            label="Zip Code"
            placeholder="12345"
            description="The zip code to be used for shipping"
          />
        </GeinsFormGroup>
      </GeinsFormGrid>
      <h3>Urls</h3>
      <GeinsFormGrid v-if="checkoutSettings.redirectUrls">
        <GeinsFormGroup row-size="half">
          <GeinsInput
            v-model="checkoutSettings.redirectUrls.cancel"
            id="cancel-url"
            name="cancel-url"
            label="Cancel Url"
            placeholder="https://example.com/cart"
            description="Url to go to if user cancels/exits the checkout. Will show a small arrow link next to the icon/logo"
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
            description="Will display a Terms & Conditions link on the checkout page."
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="half">
          <GeinsInput
            v-model="checkoutSettings.redirectUrls.privacy"
            id="privacy-url"
            name="privacy-url"
            label="Privacy Policy Url"
            placeholder="https://example.com/privacy"
            description="Will display a Privacy Policy link on the checkout page."
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="half">
          <GeinsInput
            v-model="checkoutSettings.redirectUrls.success"
            id="success-url"
            name="success-url"
            label="Success Url"
            placeholder="https://example.com/thank-you"
            description="Url to redirect to after successful checkout. Leave empty to use the default (recommended)"
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
            description="Title of the checkout page. Will not be shown if you add a logo, but is always used for the meta title."
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="half">
          <GeinsInput
            v-model="checkoutSettings.branding.icon"
            id="icon"
            name="icon"
            label="Icon URL"
            placeholder="https://example.com/icon.png"
            description="Shown to the left of the logo/title if provided. Will be shown in a circle as 48x48px"
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
            <label class="select-label" for="logoSize">Logo Size</label>
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
            placeholder="5px"
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
      <GeinsToken v-if="checkoutToken" :checkout-token="checkoutToken" :loading="loading" />
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

.select-label {
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
  margin-bottom: 0.2rem;
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
.checkbox-label {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
  position: relative;
  cursor: pointer;
}

.checkbox input[type='checkbox'] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkbox-label::before {
  content: '';
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  margin-right: 10px;
  transition: all 0.2s ease;
}

.checkbox input[type='checkbox']:checked + .checkbox-label::before {
  background: #74e878;
  border-color: #74e878;
}

.checkbox-label::after {
  content: '✔';
  position: absolute;
  left: 4px;
  top: 1px;
  font-size: 9px;
  color: #000;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.checkbox input[type='checkbox']:checked + .checkbox-label::after {
  opacity: 1;
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
</style>
