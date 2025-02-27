import { GeinsSettings } from '@geins/types';

export const enum GeinsStorageParam {
  settings = 'geins-settings',
  cart = 'geins-cart',
}

import { ref } from 'vue';
export const settingsValid = ref(false);
export const cartValid = ref(false);

export interface GeinsSettingsStorage {
  valid: boolean;
  geinsSettings?: GeinsSettings;
}
export interface GeinsCartStorage {
  valid: boolean;
  geinsCart?: GeinsCart;
}

export const getStoredSettings = (
  storageParam: GeinsStorageParam = GeinsStorageParam.settings,
): GeinsSettingsStorage | GeinsCartStorage | null => {
  console.log('🚀 ~ storageParam:', storageParam);
  const stored = localStorage.getItem(storageParam);
  console.log('🚀 ~ stored:', stored);
  if (stored) {
    const parsed = JSON.parse(stored);
    if (storageParam === GeinsStorageParam.settings) {
      settingsValid.value = parsed.valid;
    } else if (storageParam === GeinsStorageParam.cart) {
      cartValid.value = parsed.valid;
    }
    return parsed;
  }
  return null;
};

export const storeSettings = (
  valid: boolean,
  payload: GeinsSettings | GeinsCart,
  storageParam: GeinsStorageParam = GeinsStorageParam.settings,
) => {
  let obj = {};
  if (storageParam === GeinsStorageParam.settings) {
    obj = {
      valid,
      geinsSettings: payload as GeinsSettings,
    };
    settingsValid.value = valid;
  } else if (storageParam === GeinsStorageParam.cart) {
    obj = {
      valid,
      geinsCart: payload as GeinsCart,
    };
    cartValid.value = valid;
  }
  localStorage.setItem(storageParam, JSON.stringify(obj));
};

export const cleanObjectForToken = (obj: any): any => {
  for (const key in obj) {
    if (obj[key] === '') {
      delete obj[key];
    }
  }
  return obj;
};
