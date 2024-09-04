import { MANAGEMENT_API_URL } from '../constants/endpoints';
import type { ManagementApiCredentials } from '@geins/types';

export class ManagementApiClient {
  private baseUrl: string;
  private apiKey: string;
  private authToken: string;

  constructor(credentials: ManagementApiCredentials) {
    this.baseUrl = MANAGEMENT_API_URL;
    this.apiKey = credentials.apiKey;
    this.authToken = this.createAuthToken(credentials);
  }

  createAuthToken(credentials: ManagementApiCredentials) {
    return btoa(`${credentials.username}:${credentials.password}`);
  }

  getEndpointUrl(path: string) {
    return `${this.baseUrl}/${path}`;
  }

  async request(method: string, path: string, data: any = {}) {
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

    const reponse = await fetch(endpointUrl, options).then((response) => {
      return response.json();
    });
    return reponse;
  }
}
