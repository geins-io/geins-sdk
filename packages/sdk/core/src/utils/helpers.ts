import { ENDPOINTS } from '../constants';
import type { Environment } from '@geins/types';
export function isServerContext() {
  return typeof window === 'undefined';
}

export function buildEndpoints(
  apiKey: string,
  accountName: string,
  environment: Environment = 'prod',
) {
  return {
    main: ENDPOINTS.main,
    auth: ENDPOINTS.auth
      .replace('{ACCOUNT}', accountName)
      .replace('{ENV}', environment),
    authSign: ENDPOINTS.auth_sign.replace('{API-KEY}', apiKey),
    image: ENDPOINTS.image.replace('{ACCOUNT}', accountName),
  };
}
