import {
  API_ENDPOINT_URL_HISTORY,
  API_ENDPOINT_SLUG_HISTORY,
} from '../constants';
export class EndpointApiClient {
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
      console.log('Fetching data from:', endpointUrl);
      const response = await fetch(endpointUrl, options);

      if (!response.ok) {
        throw new Error(
          `Request failed with status ${response.status}: ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching data from ${endpointUrl}:`, error);
      throw error;
    }
  }

  async getUrlHistory(lastFetchTime?: string) {
    const endpoint =
      this.getEndpointUrl(API_ENDPOINT_URL_HISTORY) +
      (lastFetchTime ? `?offset=${lastFetchTime}` : '');
    console.log('endpoint', endpoint);
    return this.request(endpoint);
  }

  async getSlugHistory(lastFetchTime?: string) {
    const endpoint =
      this.getEndpointUrl(API_ENDPOINT_SLUG_HISTORY) +
      (lastFetchTime ? `?offset=${lastFetchTime}` : '');
    return this.request(endpoint);
  }
}
