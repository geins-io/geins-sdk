import { ApolloClient, InMemoryCache, gql} from '@apollo/client';


export enum FetchPolicy {
  CACHE_FIRST = 'cache-first',
  NETWORK_ONLY = 'network-only',
  CACHE_ONLY = 'cache-only',
  NO_CACHE = 'no-cache',
  STANDBY = 'standby',
}

export default class GeinsMerchantApiClient {
  private client: any;
  fetchPolicy: FetchPolicy = FetchPolicy.NETWORK_ONLY;
  pollInterval: number = 0;
  constructor(apiUrl:string, apiKey: string) {
    this.client = this.createClient(apiUrl, apiKey);
  }

  createClient(apiUrl: string, apiKey: string) {
    return new ApolloClient({
      uri: apiUrl,
      cache: new InMemoryCache(),
      headers: {
        'Accept': 'application/json',
        'x-apikey': apiKey,
      }
    });
  }
  getClient(): GeinsMerchantApiClient | undefined {    
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
      }       
    }    
    return this.client.query(q);
  }

  async runMutation(mutation: any) {
    return this.client.mutate(mutation);
  }  
}


 