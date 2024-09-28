import { EndpointApiClient } from '../api-client';
import { IStore } from '../base';

const ONE_HOUR_MS = 60 * 60 * 1000; // 1 hour in milliseconds
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
  private static instance: RoutingService | null = null;
  private store: IStore;
  private apiKey: string;
  private apiClient: EndpointApiClient;
  private state: RoutingServiceState;

  private constructor(apiKey: string, store: IStore) {
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

  /**
   * Retrieves the singleton instance of the RoutingService.
   * @param apiKey - The API key used for authentication.
   * @param store - The storage interface for caching routes.
   * @returns The singleton instance of RoutingService.
   */
  public static getInstance(apiKey: string, store: IStore): RoutingService {
    if (!RoutingService.instance) {
      RoutingService.instance = new RoutingService(apiKey, store);
    }
    return RoutingService.instance;
  }

  private async setKey(key: string, value: string): Promise<void> {
    await this.store.setKey(key, value);
  }

  private async getKey(key: string): Promise<string | null> {
    return await this.store.getKey(key);
  }

  /**
   * Retrieves all routing rules from the store.
   * @returns A promise that resolves to an array of RoutingRule objects.
   */
  public async getRoutingRules(): Promise<RoutingRule[]> {
    const keys = await this.store.getKeys();
    const rules: RoutingRule[] = [];
    for (const key of keys) {
      if (key === KEY_URL_HISTORY || key === KEY_LAST_FETCH_TIME) {
        continue;
      }
      const toUrl = await this.store.getKey(key);
      if (toUrl) {
        rules.push({
          fromUrl: key,
          toUrl,
          httpStatusCode: 301,
          isCanonical: false,
        });
      }
    }
    return rules;
  }

  /**
   * Retrieves all route keys from the store.
   * @returns A promise that resolves to an array of route keys.
   */
  public async getAllRoutes(): Promise<string[]> {
    return await this.store.getKeys();
  }

  private async shouldFetchNewData(): Promise<boolean> {
    const lastFetchTime = await this.getKey(KEY_LAST_FETCH_TIME);
    if (!lastFetchTime) return true;

    const lastFetchDate = new Date(lastFetchTime);
    const timeElapsed = Date.now() - lastFetchDate.getTime();
    return timeElapsed >= ONE_HOUR_MS;
  }

  private async fetchAndProcessUrlHistory(): Promise<void> {
    const history = await this.apiClient.getUrlHistory();
    for (const item of history) {
      if (item.oldUrl && item.newUrl && !item.deleted) {
        await this.setKey(item.oldUrl, item.newUrl);
      }
    }
    await this.setKey(KEY_LAST_FETCH_TIME, new Date().toISOString());
  }

  /**
   * Fetches the URL history from the API and updates the store.
   * If the history was fetched less than an hour ago, it uses the cached data.
   * @returns A promise that resolves to an array of route keys.
   * @throws An error if the URL history could not be fetched.
   */
  public async fillUrlHistory(): Promise<string[]> {
    if (this.state === RoutingServiceState.FETCHING) {
      return this.store.getKeys();
    }

    this.state = RoutingServiceState.FETCHING;
    try {
      if (await this.shouldFetchNewData()) {
        await this.fetchAndProcessUrlHistory();
      }
      return await this.store.getKeys();
    } catch (error) {
      this.state = RoutingServiceState.ERROR;
      console.error('Error fetching URL history:', error);
      throw error;
    } finally {
      if (this.state !== RoutingServiceState.ERROR) {
        this.state = RoutingServiceState.READY;
      }
    }
  }

  /**
   * Retrieves the route for the given path from the store.
   * @param path - The path for which to get the route.
   * @returns A promise that resolves to the route or null if not found.
   */
  public async getRoute(path: string): Promise<string | null> {
    return await this.getKey(path);
  }

  /**
   * Refreshes the URL history if more than an hour has passed since the last fetch.
   * @returns A promise that resolves to an array of route keys.
   */
  public async refreshUrlHistoryIfNeeded(): Promise<string[]> {
    const now = new Date();

    const lastFetchTime = await this.getKey(KEY_LAST_FETCH_TIME);
    if (lastFetchTime) {
      const lastFetchDate = new Date(lastFetchTime);
      const timeElapsed = now.getTime() - lastFetchDate.getTime();

      if (timeElapsed >= ONE_HOUR_MS) {
        return await this.fillUrlHistory();
      } else {
        return await this.store.getKeys();
      }
    } else {
      return await this.fillUrlHistory();
    }
  }

  /**
   * Retrieves the last time the URL history was fetched.
   * @returns A promise that resolves to the last fetch time as a string or null if not set.
   */
  public async getLastFetchTime(): Promise<string | null> {
    return await this.getKey(KEY_LAST_FETCH_TIME);
  }

  /**
   * Fills the routes by fetching the URL history and returns the updated routes.
   * @returns A promise that resolves to an object containing the urlHistory array.
   */
  public async fillRoutes(): Promise<{ urlHistory: string[] }> {
    const urlHistory = await this.fillUrlHistory();
    return { urlHistory };
  }
}
