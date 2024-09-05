import { EndpointApiClient } from '../api-client';

let instance: RoutingService | null = null;
const oneHourMs = 60 * 60 * 1000; // 1 hour in milliseconds
const KEY_URL_HISTORY = 'urlHistory';
const KEY_LAST_FETCH_TIME = 'urlHistory:lastFetchTime';

export enum RoutingServiceState {
  INIT,
  FETCHING,
  READY,
  ERROR,
}

export interface RoutingRule extends RoutingItem {
  httpStatusCode?: number;
  isCanonical?: boolean;
}

export interface RoutingItem {
  fromUrl: string;
  toUrl: string;
}

export class RoutingService {
  private store: any;
  private apiKey: string;
  private apiClient: EndpointApiClient;
  private state: RoutingServiceState;

  constructor(apiKey: string, store: any) {
    if (!apiKey) {
      this.state = RoutingServiceState.ERROR;
      throw new Error('API key is required');
    }

    if (!store) {
      this.state = RoutingServiceState.ERROR;
      throw new Error('Store is required');
    }

    this.state = RoutingServiceState.INIT;
    this.store = store;
    this.apiKey = apiKey;
    this.apiClient = new EndpointApiClient(apiKey);
    this.state = RoutingServiceState.READY;
  }

  public static getInstance(apiKey: string, store: any) {
    if (!instance) {
      instance = new RoutingService(apiKey, store);
    }
    return instance;
  }

  setKey(key: string, value: string): void {
    this.store.setKey(key, value);
  }

  getKey(key: string): string {
    return this.store.getKey(key);
  }

  async getRoutingRules(): Promise<RoutingRule[]> {
    const keys = await this.store.getKeys();
    const rules: RoutingRule[] = [];
    for (const key of keys) {
      const item = await this.store.getKey(key);
      if (item) {
        rules.push({
          fromUrl: key,
          toUrl: item,
          httpStatusCode: 301,
          isCanonical: false,
        });
      }
    }
    return rules;
  }

  async getAllRoutes() {
    return this.store.getKeys();
  }

  async fillUrlHistory() {
    if (this.state === RoutingServiceState.FETCHING) {
      console.log('Already fetching URL history, skipping...');
      return;
    }
    this.state = RoutingServiceState.FETCHING;

    const cacheKey = KEY_URL_HISTORY;
    const lastFetchTimeKey = KEY_LAST_FETCH_TIME;

    const lastFetchTime = this.getKey(lastFetchTimeKey);
    const now = new Date();

    // Check if less than 1 hour has passed since last fetch
    if (lastFetchTime) {
      const lastFetchDate = new Date(lastFetchTime as string);
      const timeElapsed = now.getTime() - lastFetchDate.getTime();

      if (timeElapsed < oneHourMs) {
        const cachedRoutes = this.getKey(cacheKey);
        if (cachedRoutes) return cachedRoutes;
      }
    }

    // Fetch new data from API
    const history = await this.apiClient.getUrlHistory();
    for (const item of history) {
      if (item.oldUrl && item.newUrl && !item.deleted) {
        this.setKey(item.oldUrl, item.newUrl);
      }
    }

    // Set the new last fetch time in the cache
    this.setKey(lastFetchTimeKey, now.toISOString());
    this.state = RoutingServiceState.READY;
    return this.store.getKeys(); // Return all cached keys
  }

  async getRoute(path: string) {
    console.log('Getting route for path:', path);
    return this.getKey(path);
  }

  async refreshUrlHistoryIfNeeded() {
    const now = new Date();

    const lastFetchTime = this.getKey(KEY_LAST_FETCH_TIME);
    if (lastFetchTime) {
      const lastFetchDate = new Date(lastFetchTime as string);
      const timeElapsed = now.getTime() - lastFetchDate.getTime();

      if (timeElapsed >= oneHourMs) {
        console.log('Fetching new URL history as more than 1 hour has passed');
        await this.fillUrlHistory();
      } else {
        const timeLeft = oneHourMs - timeElapsed;
        console.log('No need to fetch new URL history. Time left:', timeLeft);
      }
    } else {
      // If no last fetch time, initiate a fetch
      await this.fillUrlHistory();
    }
  }

  async getLastFetchTime() {
    return this.getKey(KEY_LAST_FETCH_TIME);
  }

  async fillRoutes() {
    await this.fillUrlHistory();
    return {
      urlHistory: this.store.getKeys(), // Return all cached routes or relevant info
    };
  }
}
