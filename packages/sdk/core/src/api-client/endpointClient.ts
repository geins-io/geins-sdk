import { API_ENDPOINT_URL_HISTORY, API_ENDPOINT_SLUG_HISTORY } from '../constants/endpoints';
export class EndpointApiClient {
  private apiKey: string;
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getEndpointUrl(endpointUrl: string) {
    return `${endpointUrl}/${this.apiKey}`;
  }

  private async request(endpointUrl: string) {
    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    };

    const reponse = await fetch(this.getEndpointUrl(endpointUrl), options).then((response) => {
      return response.json();
    });
    return reponse;
  }

  async getUrlHistory(offset?: string) {
    return this.request(`${API_ENDPOINT_URL_HISTORY}`) + (offset ? '?offset=${offset}': '');
  }
}
