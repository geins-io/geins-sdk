<script setup lang="ts">
import { GeinsCore } from '@geins/core';
import { GeinsSettings } from '@geins/types';
import { ref, onMounted } from 'vue';
import { getStoredSettings, storeSettings, type GeinsStorage, GeinsStorageParam } from '../../utils';
import GeinsInput from './GeinsInput.vue';

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

  storeSettings(valid, settings, GeinsStorageParam.Settings);
  return valid;
};

const handleSubmit = async (event: Event) => {
  event.preventDefault();
  validateSettings(settings.value);
};

onMounted(() => {
  const storedSettings: GeinsStorage | null = getStoredSettings();
  if (storedSettings?.geinsSettings) {
    settings.value = storedSettings.geinsSettings;
  }
});
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <GeinsFormContainer>
      <GeinsFormGrid>
        <GeinsFormGroup row-size="two-thirds">
          <GeinsInput
            label="API Key"
            id="apiKey"
            name="apiKey"
            v-model="settings.apiKey"
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          />
        </GeinsFormGroup>
        <GeinsFormGroup row-size="one-third">
          <GeinsInput
            label="Account Name"
            id="accountName"
            name="accountName"
            v-model="settings.accountName"
            placeholder="name"
          />
        </GeinsFormGroup>

        <GeinsFormGroup row-size="one-forth">
          <GeinsInput
            label="Channel ID"
            id="channel"
            name="channel"
            v-model="settings.channel"
            placeholder="1"
          />
        </GeinsFormGroup>

        <GeinsFormGroup row-size="one-forth">
          <GeinsInput label="TLD" id="tld" name="tld" v-model="settings.tld" placeholder="com" />
        </GeinsFormGroup>

        <GeinsFormGroup row-size="one-forth">
          <GeinsInput label="Market ID" id="market" name="market" v-model="settings.market" placeholder="1" />
        </GeinsFormGroup>

        <GeinsFormGroup row-size="one-forth">
          <GeinsInput
            label="Locale"
            id="locale"
            name="locale"
            v-model="settings.locale"
            placeholder="en-US"
          />
        </GeinsFormGroup>
      </GeinsFormGrid>

      <!-- Validation Error -->
      <div v-if="validationError" class="validation-error">
        {{ validationError }}
      </div>

      <GeinsButton>Save Settings</GeinsButton>
    </GeinsFormContainer>
  </form>
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
