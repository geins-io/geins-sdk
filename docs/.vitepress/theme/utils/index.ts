import { GeinsSettings, GenerateCheckoutTokenOptions } from '@geins/types';

export const enum GeinsStorageParam {
  Settings = 'geins-settings',
  Cart = 'geins-cart',
  CheckoutToken = 'geins-checkout-token',
}

import { ref } from 'vue';
export const settingsValid = ref(false);
export const cartValid = ref(false);
export const checkoutTokenValid = ref(false);

export interface GeinsStorage {
  valid: boolean;
  geinsSettings?: GeinsSettings;
  geinsCart?: GeinsStorageCart;
  geinsCheckout?: GeinsStorageCheckout;
}
export interface GeinsStorageCart {
  id: string;
  skus: number[];
}

export interface GeinsStorageCheckout extends GenerateCheckoutTokenOptions {
  token?: string;
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
    } else if (storageParam === GeinsStorageParam.CheckoutToken) {
      checkoutTokenValid.value = parsed.valid;
    }
    return parsed;
  }
  return null;
};

export const storeSettings = (
  valid: boolean,
  payload: GeinsSettings | GeinsStorageCart | GeinsStorageCheckout,
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
  } else if (storageParam === GeinsStorageParam.CheckoutToken) {
    obj = {
      valid,
      geinsCheckout: payload as GeinsStorageCheckout,
    };
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
