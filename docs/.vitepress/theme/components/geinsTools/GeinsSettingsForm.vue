<script setup lang="ts">
import { GeinsCore } from '@geins/core';
import { GeinsSettings } from '@geins/types';
import { ref, onMounted, defineProps } from 'vue';
import { getStoredSettings, storeSettings, type StoredGeinsSettings } from '../../utils';

// add prop to watch
const _props = defineProps<{
  valid?: boolean;
}>();

// GeinsSettings
const validationError = ref<string>('');

// GeinsStoredSettings
const settings = ref<GeinsSettings>({
  apiKey: '',
  accountName: '',
  channel: '',
  tld: '',
  locale: '',
  market: '',
});

const validateSettings = async (settings: GeinsSettings) => {
  if (!settings.apiKey || settings.apiKey === '') {
    validationError.value = 'API Key is required.';
    return false;
  }
  if (!settings.accountName || settings.accountName === '') {
    validationError.value = 'Account Name is required.';
    return false;
  }
  if (!settings.channel || settings.channel === '') {
    validationError.value = 'Channel is required.';
    return false;
  }
  if (!settings.tld || settings.tld === '') {
    validationError.value = 'TLD is required.';
    return false;
  }
  if (!settings.market || settings.market === '') {
    validationError.value = 'Market is required.';
    return false;
  }
  if (!settings.locale || settings.locale === '') {
    validationError.value = 'Locale is required.';
    return false;
  }

  const geinsCore = new GeinsCore(settings);
  let valid = false;
  try {
    const channel = await geinsCore.channel.current();
    if (!channel) {
      throw new Error('Failed to validate settings.');
    }
    validationError.value = '';
    valid = true;
  } catch (error) {
    validationError.value = 'Failed to validate settings.';
    valid = false;
  }

  storeSettings(valid, settings);
  return valid;
};

const handleSubmit = async (event: Event) => {
  event.preventDefault();
  validateSettings(settings.value);
};

onMounted(() => {
  const storedSettings: StoredGeinsSettings | null = getStoredSettings();
  if (storedSettings) {
    settings.value = storedSettings.geinsSettings;
  }
});
</script>

<template>
  <div class="checkout-token-generator">
    <form @submit.prevent="handleSubmit">
      <div class="form-container">
        <div class="form-grid">
          <div class="form-group two-thirds-row-group">
            <label for="apiKey">API Key</label>
            <input
              type="text"
              id="apiKey"
              name="apiKey"
              v-model="settings.apiKey"
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            />
          </div>

          <div class="form-group account-name-group">
            <label for="accountName">Account Name </label>
            <input
              type="text"
              id="accountName"
              name="accountName"
              v-model="settings.accountName"
              placeholder="name"
            />
          </div>

          <div class="form-group one-forth-row-group">
            <label for="channel">Channel ID</label>
            <input type="text" id="channel" name="channel" v-model="settings.channel" placeholder="1" />
          </div>

          <div class="form-group one-forth-row-group">
            <label for="tld">TLD</label>
            <input type="text" id="tld" name="tld" v-model="settings.tld" placeholder="com" />
          </div>

          <div class="form-group one-forth-row-group">
            <label for="market">Market ID</label>
            <input type="text" id="market" name="market" v-model="settings.market" placeholder="1" />
          </div>

          <div class="form-group one-forth-row-group">
            <label for="locale">Locale</label>
            <input type="text" id="locale" name="locale" v-model="settings.locale" placeholder="en-US" />
          </div>
        </div>

        <!-- Validation Error -->
        <div v-if="validationError" class="validation-error">
          {{ validationError }}
        </div>
        <button type="submit">Save Settings</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.validation-error {
  margin: 1rem 0;
  padding: 0.75rem 1rem;
  border-radius: 5px;
  background-color: var(--vp-c-danger-soft);
  color: var(--vp-c-danger-1);
  font-size: 0.9rem;
  border: 1px solid var(--vp-c-danger-2);
}

.checkout-token-generator {
  position: relative;
}

.settings-status {
  position: absolute;
  top: 20px;
  right: 20px;
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
  margin-bottom: 1rem;
}

.section-header h4 {
  color: var(--vp-c-text-1);
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
}

.divider {
  height: 2px;
  background-color: var(--vp-c-divider);
  margin-bottom: 1rem;
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
  gap: 0.2rem;
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
  border-radius: 5px;
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
  border-radius: 5px;
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
  border-radius: 5px;
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
  border-radius: 5px;
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
  border-radius: 5px;
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
  border-radius: 5px;
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
