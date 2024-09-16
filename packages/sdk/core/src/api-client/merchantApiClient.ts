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
  fetchPolicy: FetchPolicy = FetchPolicy.CACHE_FIRST;
  pollInterval: number = 0;
  constructor(apiUrl: string, apiKey: string, fetchPolicy?: FetchPolicy) {
    this.client = this.createClient(apiUrl, apiKey);
    this.cookieService = new CookieService();
    if (fetchPolicy) {
      this.fetchPolicy = fetchPolicy;
    }
  }

  createClient(apiUrl: string, apiKey: string) {
    return new ApolloClient({
      uri: apiUrl,
      cache: new InMemoryCache(),
      headers: {
        Accept: 'application/json',
        'x-apikey': apiKey,
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
    const loggedInUser = this.cookieService?.get(AUTH_COOKIES.USER_AUTH);
    const q = {
      query,
      variables,
      options: {
        fetchPolicy: options.fetchPolicy || this.fetchPolicy,
        pollInterval: options.pollInterval || this.pollInterval,
      },
      ...(loggedInUser && {
        context: {
          headers: {
            Authorization: `Bearer ${loggedInUser}`,
          },
        },
      }),
    };
    return this.client.query(q);
  }

  async runMutation(mutation: any) {
    return this.client.mutate(mutation);
  }
}
