import { API_ENDPOINT_SLUG_HISTORY, API_ENDPOINT_URL_HISTORY } from '../constants';
import { GeinsError, GeinsErrorCode } from '../errors/geinsError';
import { sdkLogger } from '../utils/logger';
/** HTTP client for Geins endpoint discovery APIs (URL/slug history). */
export class EndpointApiClient {
  private static readonly FETCH_TIMEOUT_MS = 10_000;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getEndpointUrl(endpointUrl: string) {
    return `${endpointUrl}/${this.apiKey}`;
  }

  private async request(endpointUrl: string) {
    try {
      const options = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      };
      const response = await fetch(endpointUrl, {
        ...options,
        signal: AbortSignal.timeout(EndpointApiClient.FETCH_TIMEOUT_MS),
      });

      if (!response.ok) {
        throw new GeinsError(`Request failed with status ${response.status}: ${response.statusText}`, GeinsErrorCode.NETWORK_ERROR);
      }

      return await response.json();
    } catch (error) {
      sdkLogger.error(`Error fetching data from ${endpointUrl}`);
      throw error;
    }
  }

  async getUrlHistory(lastFetchTime?: string) {
    const endpoint =
      this.getEndpointUrl(API_ENDPOINT_URL_HISTORY) + (lastFetchTime ? `?offset=${lastFetchTime}` : '');
    return this.request(endpoint);
  }

  async getSlugHistory(lastFetchTime?: string) {
    const endpoint =
      this.getEndpointUrl(API_ENDPOINT_SLUG_HISTORY) + (lastFetchTime ? `?offset=${lastFetchTime}` : '');
    return this.request(endpoint);
  }
}
