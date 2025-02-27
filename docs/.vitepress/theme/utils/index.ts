import { GeinsSettings } from '@geins/types';

export const enum GeinsStorageParam {
  Settings = 'geins-settings',
  Cart = 'geins-cart',
}

import { ref } from 'vue';
export const settingsValid = ref(false);
export const cartValid = ref(false);

export interface GeinsStorage {
  valid: boolean;
  geinsSettings?: GeinsSettings;
  geinsCart?: GeinsStorageCart;
}
export interface GeinsStorageCart {
  id: string;
  skus: number[];
}

export const getStoredSettings = (
  storageParam: GeinsStorageParam = GeinsStorageParam.Settings,
): GeinsStorage | null => {
  const stored = localStorage.getItem(storageParam);
  if (stored) {
    const parsed = JSON.parse(stored);
    if (storageParam === GeinsStorageParam.Settings) {
      settingsValid.value = parsed.valid;
    } else if (storageParam === GeinsStorageParam.Cart) {
      cartValid.value = parsed.valid;
    }
    return parsed;
  }
  return null;
};

export const storeSettings = (
  valid: boolean,
  payload: GeinsSettings | GeinsStorageCart,
  storageParam: GeinsStorageParam = GeinsStorageParam.Settings,
) => {
  let obj = {};
  if (storageParam === GeinsStorageParam.Settings) {
    obj = {
      valid,
      geinsSettings: payload as GeinsSettings,
    };
    settingsValid.value = valid;
  } else if (storageParam === GeinsStorageParam.Cart) {
    obj = {
      valid,
      geinsCart: payload as GeinsStorageCart,
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
