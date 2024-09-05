import { API_ENDPOINT_URL_HISTORY, API_ENDPOINT_SLUG_HISTORY } from '../constants/endpoints';
export class EndpointApiClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getEndpointUrl(endpointUrl: string) {
    this.apiKey = '81966EA4-AB03-44C0-A736-755E68DBC4C1';
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

      const response = await fetch(endpointUrl, options);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching data from ${endpointUrl}:`, error);
      throw error;
    }
  }

  async getUrlHistory(offset?: string) {
    const endpoint = this.getEndpointUrl(API_ENDPOINT_URL_HISTORY) + (offset ? `?offset=${offset}` : '');
    return this.request(endpoint);
  }

  async getSlugHistory(offset?: string) {
    const endpoint = this.getEndpointUrl(API_ENDPOINT_SLUG_HISTORY) + (offset ? `?offset=${offset}` : '');
    return this.request(endpoint);
  }
}
