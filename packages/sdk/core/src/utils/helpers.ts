import type { Environment, GeinsEndpoints } from '@geins/types';
import { ENDPOINTS } from '../constants';

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
): GeinsEndpoints {
  return {
    main: ENDPOINTS.main,
    auth: ENDPOINTS.auth.replace('{ACCOUNT}', accountName).replace('{ENV}', environment),
    authSign: ENDPOINTS.auth_sign.replace('{API-KEY}', apiKey),
    image: ENDPOINTS.image.replace('{ACCOUNT}', accountName),
  };
}
/**
 * Finds an object with a property in a nested object.
 * @param obj - The object to search.
 * @param propertyName - The property name to search for.
 * @param propertyValue - The property value to search for.
 * @returns The object with the property or undefined.
 */
export function findObjectWithProperty(obj: any, propertyName: string, propertyValue?: any): any | undefined {
  if (!obj || typeof obj !== 'object') {
    return undefined;
  }

  if (propertyName in obj) {
    if (propertyValue === undefined) {
      return obj;
    }
    if (obj[propertyName] === propertyValue) {
      return obj;
    }
  }

  for (const key of Object.keys(obj)) {
    const result = findObjectWithProperty(obj[key], propertyName, propertyValue);
    if (result) {
      return result;
    }
  }

  return undefined;
}

/**
 * Extracts parameters from a URL and returns the base URL and its parameters.
 * @param url The URL to extract parameters from.
 * @returns An object containing the base URL and a Map of parameter key-value pairs.
 */
export function extractParametersFromUrl(url: string): { url: string; params: Map<string, string> } {
  if (!url) {
    return { url, params: new Map() };
  }
  if (!url.includes('?')) {
    return { url, params: new Map() };
  }
  const [baseUrl, queryString] = url.split('?');
  const params = new Map(
    queryString ? queryString.split('&').map((param) => param.split('=') as [string, string]) : [],
  );
  return { url: baseUrl, params };
}

export function parseErrorMessage(data: Error): string {
  if (!data || !data.message) {
    return '';
  }
  return data.message;
}
