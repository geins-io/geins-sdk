
import { MANAGEMENT_API_URL } from './endpoints'
import type { GeinsManagementAPICredentials } from './types'
//

export default class GeinsManagementApiClient {
  private baseUrl: string;
  private apiKey: string;
  private authToken: string;

  constructor(credentials: GeinsManagementAPICredentials) {
    this.baseUrl = MANAGEMENT_API_URL;
    this.apiKey = credentials.apiKey;
    this.authToken = this.createAuthToken(credentials);
  }

  createAuthToken(credentials: GeinsManagementAPICredentials) {
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
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-apikey': this.apiKey,
        'Authorization': `Bearer ${this.authToken}`,
      },
      body: JSON.stringify(data),
    };

    const reponse  = await fetch(endpointUrl, options).then((response) => {
      return response.json();
    });
    return reponse;
  }
}


