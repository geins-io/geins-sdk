import { EndpointApiClient } from '@geins/core';
import NodeCache from 'node-cache';

let instance: RoutingService | null = null;

const ttlSeconds = 60 * 60 * 24; // 24 hours
const oneHourMs = 60 * 60 * 1000; // 1 hour in milliseconds

export class RoutingService {
  private cache: NodeCache;
  private apiKey: string;
  private apiClient: EndpointApiClient;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.apiClient = new EndpointApiClient(apiKey);
    this.cache = new NodeCache({ stdTTL: ttlSeconds }); // Initialize NodeCache with TTL
  }

  public static getInstance(apiKey: string) {
    if (!instance) {
      instance = new RoutingService(apiKey);
    }
    return instance;
  }

  // Fetch URL history from the cache if available, otherwise fetch from API
  async fillUrlHistory() {
    const cacheKey = 'urlHistory';
    const lastFetchTimeKey = 'urlHistory:lastFetchTime';

    const lastFetchTime = this.cache.get(lastFetchTimeKey);
    const now = new Date();

    // Check if less than 1 hour has passed since last fetch
    if (lastFetchTime) {
      const lastFetchDate = new Date(lastFetchTime as string);
      const timeElapsed = now.getTime() - lastFetchDate.getTime();

      if (timeElapsed < oneHourMs) {
        // Less than 1 hour passed, return cached data
        console.log('Returning cached URL history from NodeCache');
        const cachedRoutes = this.cache.get(cacheKey);
        if (cachedRoutes) return cachedRoutes;
      }
    }

    // Fetch new data from API
    console.log('Fetching new URL history from API...');
    const history = await this.apiClient.getUrlHistory();
    for (const item of history) {
      if (item.oldUrl && item.newUrl && !item.deleted) {
        this.cache.set(item.oldUrl, item.newUrl);
      }
    }

    // Set the new last fetch time in the cache
    this.cache.set(lastFetchTimeKey, now.toISOString());

    return this.cache.keys(); // Return all cached keys
  }

  // Get a specific route from the cache
  async getRoute(path: string) {
    console.log('Getting route for path:', path);
    return this.cache.get(path);
  }

  // Get all routes from the cache
  async getAllRoutes() {
    return this.cache.keys();
  }

  // Refresh URL history if needed (if more than 1 hour has passed)
  async refreshUrlHistoryIfNeeded() {
    const lastFetchTimeKey = 'urlHistory:lastFetchTime';
    const now = new Date();

    const lastFetchTime = this.cache.get(lastFetchTimeKey);
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

  // get last fetch time
  async getLastFetchTime() {
    return this.cache.get('urlHistory:lastFetchTime');
  }

  async fillRoutes() {
    await this.fillUrlHistory();
    return {
      urlHistory: this.cache.keys(), // Return all cached routes or relevant info
    };
  }
}
