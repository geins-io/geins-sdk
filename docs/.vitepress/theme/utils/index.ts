import { GeinsSettings } from '@geins/types';
const STORAGE_PARAMS = {
  geinsSettings: 'geins-settings',
};

import { ref } from 'vue';
export const settingsValid = ref(false);

export interface StoredGeinsSettings {
  valid: boolean;
  geinsSettings: GeinsSettings;
}

export const getStoredSettings = (): StoredGeinsSettings | null => {
  const geinsSettings = localStorage.getItem(STORAGE_PARAMS.geinsSettings);
  if (geinsSettings) {
    const parsed = JSON.parse(geinsSettings);
    settingsValid.value = parsed.valid;
    return parsed;
  }
  return null;
};

export const storeSettings = (valid: boolean, settings: GeinsSettings) => {
  const obj = {
    valid,
    geinsSettings: settings,
  };
  settingsValid.value = valid;
  localStorage.setItem(STORAGE_PARAMS.geinsSettings, JSON.stringify(obj));
};

export const cleanObjectForToken = (obj: any): any => {
  for (const key in obj) {
    if (obj[key] === '') {
      delete obj[key];
    }
  }
  return obj;
};
