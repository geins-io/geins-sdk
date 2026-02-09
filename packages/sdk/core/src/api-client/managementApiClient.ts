import type { ManagementApiCredentials } from '@geins/types';
import { MANAGEMENT_API_URL } from '../constants/endpoints';

/**
 * HTTP client for the Geins Management (admin) API.
 * Authenticates with Basic Auth derived from username/password credentials.
 */
export class ManagementApiClient {
  private static readonly FETCH_TIMEOUT_MS = 10_000;
  private baseUrl: string;
  private apiKey: string;
  private authToken: string;

  constructor(credentials: ManagementApiCredentials) {
    this.baseUrl = MANAGEMENT_API_URL;
    this.apiKey = credentials.apiKey;
    this.authToken = this.createAuthToken(credentials);
  }

  /** Build a Base64 Basic-Auth token from credentials. */
  createAuthToken(credentials: ManagementApiCredentials) {
    return btoa(`${credentials.username}:${credentials.password}`);
  }

  getEndpointUrl(path: string) {
    return `${this.baseUrl}/${path}`;
  }

  /** Send an authenticated request to the Management API and return the parsed JSON response. */
  async request(method: string, path: string, data: Record<string, unknown> = {}) {
    const endpointUrl = this.getEndpointUrl(path);
    const options = {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-apikey': this.apiKey,
        Authorization: `Bearer ${this.authToken}`,
      },
      body: JSON.stringify(data),
    };

    const reponse = await fetch(endpointUrl, {
      ...options,
      signal: AbortSignal.timeout(ManagementApiClient.FETCH_TIMEOUT_MS),
    }).then((response) => {
      return response.json();
    });
    return reponse;
  }
}
