import { GeinsSettings } from '@geins/types';
const STROAGE_PARAMS = {
  geinsSettings: 'geins-settings',
};

export const getStoredSettings = () => {
  const geinsSettings = localStorage.getItem(STROAGE_PARAMS.geinsSettings);
  if (geinsSettings) {
    return JSON.parse(geinsSettings);
  }
  return null;
};

export const storeSettings = (validated: boolean, settings: GeinsSettings) => {
  const obj = {
    validated,
    geinsSettings: settings,
  };
  localStorage.setItem(STROAGE_PARAMS.geinsSettings, JSON.stringify(obj));
};

export const cleanObjectForToken = (obj: any): any => {
  for (const key in obj) {
    if (obj[key] === '') {
      delete obj[key];
    }
  }
  return obj;
};
