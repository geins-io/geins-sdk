<script setup lang="ts">
import { GeinsCore, CustomerType } from '@geins/core';
import { GeinsOMS } from '@geins/oms';
import { GeinsSettings, GenerateCheckoutTokenOptions, CheckoutRedirectsType } from '@geins/types';
import { ref, onMounted } from 'vue';

// GeinsSettings
const validationError = ref<string>('');
const apiKey = ref<string>('');
const accountName = ref<string>('');
const channel = ref<string>('');
const tld = ref<string>('');
const locale = ref<string>('');
const market = ref<string>('');

// branding
const branding = ref({
  title: '',
  logoUrl: '',
  body: {
    backgroundColor: '',
    textColor: '',
    fontSize: '',
  },
  topbar: {
    visible: true,
    backgroundColor: '',
    textColor: '',
  },
  cards: {
    backgroundColor: '',
    textColor: '',
    fontSize: '',
    borderRadius: '',
  },
  text: {
    backgroundColor: '',
    textColor: '',
    fontSize: '',
  },
  buttons: {
    backgroundColor: '',
    textColor: '',
    fontSize: '',
  },
  validation: {
    backgroundColor: '',
    textColor: '',
    fontSize: '',
  },
});
// urls
const redirectUrls = ref<CheckoutRedirectsType>({
  terms: '',
  success: '',
  change: '',
  cancel: '',
  error: '',
});

// GenerateCheckoutTokenOptions
const cartId = ref<string>('');
const customerType = ref<string>('');
const selectedPaymentMethodId = ref<number>();
const selectedShippingMethodId = ref<number>();

// Generate Cart
const skuIds = ref<string>('');

// GeneratedToken
let token = ref<string>('');

// on mount
onMounted(() => {
  const geinsSettings = localStorage.getItem('geinsSettings');
  if (geinsSettings) {
    const settings = JSON.parse(geinsSettings) as GeinsSettings;
    apiKey.value = settings.apiKey;
    accountName.value = settings.accountName;
    channel.value = settings.channel;
    tld.value = settings.tld;
    locale.value = settings.locale;
    market.value = settings.market;
  }
  const geinsCart = localStorage.getItem('geinsCart');
  if (geinsCart) {
    const cart = JSON.parse(geinsCart);
    cartId.value = cart.id;
  }
  const geinsCheckoutToken = localStorage.getItem('geinsCheckoutToken');
  if (geinsCheckoutToken) {
    const tokenOptions = JSON.parse(geinsCheckoutToken);
    customerType.value = tokenOptions.customerType;
    selectedPaymentMethodId.value = tokenOptions.selectedPaymentMethodId;
    selectedShippingMethodId.value = tokenOptions.selectedShippingMethodId;
    redirectUrls.value = tokenOptions.redirectUrls;
    branding.value = tokenOptions.branding;
  }
});

const createSettingsJson = (): GeinsSettings => {
  return {
    apiKey: apiKey.value,
    accountName: accountName.value,
    channel: channel.value,
    tld: tld.value,
    locale: locale.value,
    market: market.value,
  };
};

const cleanObjectForToken = (obj: any): any => {
  for (const key in obj) {
    if (obj[key] === '') {
      delete obj[key];
    }
  }
  return obj;
};

const createCheckoutTokenOptions = (): GenerateCheckoutTokenOptions => {
  const style = cleanObjectForToken(branding.value);
  const urls = cleanObjectForToken(redirectUrls.value);
  const cartIdValue = cartId.value || '';

  const customerTypeValue =
    customerType.value === 'ORGANIZATION' ? CustomerType.ORGANIZATION : CustomerType.PERSON;
  return {
    cartId: cartIdValue,
    customerType: customerTypeValue,
    selectedPaymentMethodId: selectedPaymentMethodId.value,
    selectedShippingMethodId: selectedShippingMethodId.value,
    redirectUrls: urls,
    branding: style,
  };
};

const generateCart = async () => {
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
};

const validateSettings = async (settings: GeinsSettings) => {
  if (!settings.apiKey || settings.apiKey === '') {
    return false;
  }
  if (!settings.accountName || settings.accountName === '') {
    return false;
  }
  if (!settings.channel || settings.channel === '') {
    return false;
  }
  if (!settings.tld || settings.tld === '') {
    return false;
  }
  if (!settings.locale || settings.locale === '') {
    return false;
  }
  if (!settings.market || settings.market === '') {
    return false;
  }

  const geinsCore = new GeinsCore(settings);
  try {
    await geinsCore.channel.current();
  } catch (error) {
    validationError.value = 'Failed to validate settings.';
    return false;
  }

  localStorage.setItem('geinsSettings', JSON.stringify(settings));
  return true;
};

const validateTokenOptions = (options: GenerateCheckoutTokenOptions) => {
  if (!options.cartId || options.cartId === '') {
    validationError.value = 'Invalid token options. No Cart.';
    return false;
  }
  if (!options.selectedPaymentMethodId || options.selectedPaymentMethodId === 0) {
    validationError.value = 'Invalid token options. No Payment Method.';
    return false;
  }
  return true;
};

const generateToken = async (settingsJson) => {
  const tokenOptions = createCheckoutTokenOptions();
  if (!validateTokenOptions(tokenOptions)) {
    return;
  }

  localStorage.setItem('geinsCheckoutToken', JSON.stringify(tokenOptions));

  try {
    const geinsCore = new GeinsCore(settingsJson);
    const geinsOMS = new GeinsOMS(geinsCore);
    const tokenValue = await geinsOMS.createCheckoutToken(tokenOptions);

    return tokenValue;
  } catch (error) {
    validationError.value = 'Token generation failed.';
    return;
  }
};

const handleSubmit = async (event: Event) => {
  event.preventDefault();
  const settingsJson = createSettingsJson();
  if (!validateSettings(settingsJson)) return;
  const t = await generateToken(settingsJson);
  if (t) {
    token.value = t;
    validationError.value = '';
  } else {
    validationError.value = 'Token generation failed.';
  }
};
</script>

<template>
  <div class="checkout-token-generator">
    <form @submit.prevent="handleSubmit">
      <div class="form-container">
        <!-- GenerateCheckoutTokenOptions -->
        <div class="section-header">
          <h4>Checkout Token Options</h4>
          <div class="divider"></div>
        </div>
        <div v-if="!cartId" class="form-grid">
          <div class="form-group two-thirds-row-group">
            <label for="">Sku Ids</label>
            <input type="text" id="skuIds" placeholder="SkuIds" v-model="skuIds" />
          </div>
          <div class="form-group account-name-group">
            <a @click="generateCart()">Generate Cart</a>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group two-thirds-row-group">
            <label for="cartId">Cart ID</label>
            <input type="text" id="cartId" v-model="cartId" placeholder="Enter cart ID" />
          </div>

          <div class="form-group account-name-group">
            <label for="customerType">Customer Type</label>
            <select id="customerType" v-model="customerType">
              <option value="">Select type</option>
              <option value="PERSON">D2C</option>
              <option value="COMPANY">B2B</option>
            </select>
          </div>

          <div class="form-group half-row-group">
            <label for="selectedPaymentMethodId">Payment ID</label>
            <input
              type="number"
              id="selectedPaymentMethodId"
              v-model="selectedPaymentMethodId"
              placeholder="Enter payment method ID"
            />
          </div>

          <div class="form-group half-row-group">
            <label for="selectedShippingMethodId">Shipping ID</label>
            <input
              type="number"
              id="selectedShippingMethodId"
              v-model="selectedShippingMethodId"
              placeholder="Enter shipping method ID"
            />
          </div>

          <!-- URLs -->
          <div class="form-group full-row-group">
            <h5>Checkout URLs</h5>
            <div class="url-inputs">
              <input type="url" v-model="redirectUrls.success" placeholder="Redirect if success URL" />
              <input type="url" v-model="redirectUrls.change" placeholder="Change order page URL" />
              <input type="url" v-model="redirectUrls.cancel" placeholder="Cancel page URL" />
              <input type="url" v-model="redirectUrls.terms" placeholder="Terms page URL" />
              <input type="url" v-model="redirectUrls.error" placeholder="Error page URL" />
            </div>
          </div>
        </div>

        <!-- Checkout Style -->
        <div class="section-header">
          <h4>Checkout Style</h4>
          <div class="divider"></div>
        </div>

        <div class="form-grid">
          <!-- General -->
          <div class="form-group full-row-group">
            <label for="title">Title</label>
            <input type="text" id="title" v-model="branding.title" placeholder="Checkout title" />
          </div>

          <div class="form-group full-row-group">
            <label for="logoUrl">Logo URL</label>
            <input type="url" id="logoUrl" v-model="branding.logoUrl" placeholder="https://..." />
          </div>

          <!-- Topbar Section -->
          <div class="style-section">
            <h5>Topbar Style</h5>
            <div class="style-grid">
              <div class="form-group">
                <label for="topbarBg">Background</label>
                <input type="color" id="topbarBg" v-model="branding.topbar.backgroundColor" />
              </div>
              <div class="form-group">
                <label for="topbarColor">Text Color</label>
                <input type="color" id="topbarColor" v-model="branding.topbar.textColor" />
              </div>
            </div>
            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="branding.topbar.visible" />
                Visible
              </label>
            </div>
          </div>

          <!-- Body Section -->
          <div class="style-section">
            <h5>Body Style</h5>
            <div class="style-grid">
              <div class="form-group">
                <label for="bodyBg">Background</label>
                <input type="color" id="bodyBg" v-model="branding.body.backgroundColor" />
              </div>
              <div class="form-group">
                <label for="bodyColor">Text Color</label>
                <input type="color" id="bodyColor" v-model="branding.body.textColor" />
              </div>
              <div class="form-group">
                <label for="bodySize">Font Size</label>
                <input type="text" id="bodySize" v-model="branding.body.fontSize" placeholder="16px" />
              </div>
            </div>
          </div>

          <!-- Cards Section -->
          <div class="style-section">
            <h5>Cards Style</h5>
            <div class="style-grid">
              <div class="form-group">
                <label for="cardsBg">Background</label>
                <input type="color" id="cardsBg" v-model="branding.cards.backgroundColor" />
              </div>
              <div class="form-group">
                <label for="cardsColor">Text Color</label>
                <input type="color" id="cardsColor" v-model="branding.cards.textColor" />
              </div>
              <div class="form-group">
                <label for="cardsSize">Font Size</label>
                <input type="text" id="cardsSize" v-model="branding.cards.fontSize" placeholder="14px" />
              </div>
              <div class="form-group">
                <label for="cardsRadius">Border Radius</label>
                <input type="text" id="cardsRadius" v-model="branding.cards.borderRadius" placeholder="8px" />
              </div>
            </div>
          </div>
        </div>

        <!-- Validation Error -->
        <div v-if="validationError" class="validation-error">
          {{ validationError }}
        </div>
        <button type="submit">Generate Token</button>
      </div>
    </form>

    <div v-if="token" class="token-display">
      <h4>Generated Token</h4>
      <div class="token-value">
        <a target="_blank" :href="`https://checkout-qa.geins.services/${token}`"
          >{{ token?.substring(0, 50) }}...</a
        >
      </div>
    </div>
    <div v-if="!token" class="no-token-display">
      <p>No token generated yet. Please fill out the form and generate a token.</p>
    </div>
  </div>
</template>

<style scoped>
.validation-error {
  margin: 1rem 0;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  background-color: var(--vp-c-danger-soft);
  color: var(--vp-c-danger-1);
  font-size: 0.9rem;
  border: 1px solid var(--vp-c-danger-2);
}

.checkout-token-generator {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.description {
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
}

.form-container {
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--vp-c-divider);
}

.section-header {
  margin-bottom: 2rem;
}

.section-header h4 {
  color: var(--vp-c-text-1);
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
}

.divider {
  height: 2px;
  background: linear-gradient(to right, var(--vp-c-brand), transparent);
  margin-bottom: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.one-forth-row-group {
  grid-column: span 3; /* Updated to span 3 instead of 6 */
}

.half-row-group {
  grid-column: span 6;
}

.full-row-group {
  grid-column: span 12;
}

.two-thirds-row-group {
  grid-column: span 8;
}

.account-name-group {
  grid-column: span 4;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  border-radius: 4px;
  transition: all 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 2px var(--vp-c-brand-lighter);
}

.form-group input::placeholder {
  color: var(--vp-c-text-3);
}

button {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;

  border: 1px solid var(--vp-button-brand-border);
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  background-color: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  border-color: var(--vp-button-brand-border);
}

button:hover {
  color: var(--vp-button-brand-hover-text);
  background-color: var(--vp-button-brand-hover-bg);
  border-color: var(--vp-button-brand-hover-border);
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 3px var(--vp-c-brand-lighter);
}

.token-display {
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.token-display h4 {
  margin: 0 0 1rem 0;
  color: var(--vp-c-text-1);
  font-size: 1.1rem;
}

.token-value {
  background: var(--vp-c-bg);
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
}

.token-value code {
  color: var(--vp-c-brand);
  font-size: 1.1rem;
  font-family: var(--vp-font-family-mono);
}

@media (max-width: 768px) {
  .form-container {
    padding: 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .api-key-group,
  .account-name-group,
  .form-group:nth-child(n + 3) {
    grid-column: 1;
  }

  .section-header {
    margin-bottom: 1.5rem;
  }
}

.checkbox-group {
  display: flex;
  align-items: flex-begin;
  gap: 0.3rem;
  grid-column: span 12;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input[type='checkbox'] {
  width: auto;
  margin: 0;
}

select {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  border-radius: 4px;
  transition: all 0.2s ease;
}

select:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 2px var(--vp-c-brand-lighter);
}
textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  border-radius: 4px;
  transition: all 0.2s ease;
  resize: vertical;
}

textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 2px var(--vp-c-brand-lighter);
}

.span-full {
  grid-column: 1 / -1;
}

.url-inputs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

h5 {
  color: var(--vp-c-text-1);
  font-size: 1rem;
  margin: 0 0 1rem 0;
}

/* Update media queries */
@media (max-width: 768px) {
  .url-inputs {
    gap: 0.75rem;
  }
}

.style-section {
  grid-column: span 12;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.style-section h5 {
  color: var(--vp-c-text-1);
  font-size: 1rem;
  margin: 0 0 1rem 0;
}

.style-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.form-group input[type='color'] {
  padding: 0;
  width: 100%;
  height: 40px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .style-section {
    grid-column: 1;
  }

  .style-grid {
    grid-template-columns: 1fr;
  }
}
</style>
