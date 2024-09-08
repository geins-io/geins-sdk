import { CookieService } from '../services/cookieService';
import { AUTH_COOKIES } from '../constants';
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCache,
  NormalizedCacheObject,
  gql,
} from '@apollo/client';

export enum FetchPolicy {
  CACHE_FIRST = 'cache-first',
  NETWORK_ONLY = 'network-only',
  CACHE_ONLY = 'cache-only',
  NO_CACHE = 'no-cache',
  STANDBY = 'standby',
}

export class MerchantApiClient {
  private cookieService: CookieService | undefined;
  private client: ApolloClient<NormalizedCacheObject>;
  fetchPolicy: FetchPolicy = FetchPolicy.NETWORK_ONLY;
  pollInterval: number = 0;
  constructor(apiUrl: string, apiKey: string) {
    this.client = this.createClient(apiUrl, apiKey);
    this.cookieService = new CookieService();
  }

  createClient(apiUrl: string, apiKey: string) {
    // get cookie from browser
    let auth = this.cookieService?.get(AUTH_COOKIES.USER_AUTH);
    console.log('Creating client with user', auth);
    const user = this.cookieService?.get('user');

    if (this.cookieService && this.cookieService.get(AUTH_COOKIES.USER_AUTH)) {
      auth = this.cookieService.get(AUTH_COOKIES.USER_AUTH);
    }

    return new ApolloClient({
      uri: apiUrl,
      cache: new InMemoryCache(),
      headers: {
        Accept: 'application/json',
        'x-apikey': apiKey,
        // ...(apiKey ? { Authorization: apiKey } : {}),
      },
    });
  }

  getClient(): ApolloClient<NormalizedCacheObject> | undefined {
    return this.client;
  }

  clearCache() {
    this.client.clearStore();
  }

  async runQuery(query: any, variables: any = {}, options: any = {}) {
    const q = {
      query,
      variables,
      options: {
        fetchPolicy: options.fetchPolicy || this.fetchPolicy,
        pollInterval: options.pollInterval || this.pollInterval,
      },
    };

    // add authorization to header to client
    // this.client

    return this.client.query(q);
  }

  async runMutation(mutation: any) {
    return this.client.mutate(mutation);
  }
}
