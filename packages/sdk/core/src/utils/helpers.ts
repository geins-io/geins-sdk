import { ENDPOINTS } from '../constants';
import type { Environment } from '@geins/types';

/**
 * Get context of the runtime.
 * @returns If the context is server.
 */

export function isServerContext() {
  return typeof window === 'undefined';
}
/**
 * Builds the endpoints for the Geins API.
 * @param apiKey - The API key.
 * @param accountName - The account name.
 * @param environment - The environment.
 * @returns The endpoints.
 * @example
 * ```ts
 * const apiKey
 * const accountName
 * const environment
 * const endpoints = buildEndpoints(apiKey, accountName, environment);
 * ```
 */
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
