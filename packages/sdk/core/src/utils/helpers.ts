import { ENDPOINTS } from '../constants';
export function isServerContext() {
  return typeof window === 'undefined';
}

export function buildEndpoints(
  accountName: string,
  apiKey: string,
  environment: string = 'prod',
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
