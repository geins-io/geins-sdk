import { EndpointApiClient } from '../api-client/endpointClient';
import NodeCache from 'node-cache';
const ttlSeconds = 60 * 60 * 24; // 24 hours

// https://merchantapi.geins.io/redirect/urlhistory/`{API-KEY}`?offset=`{DATE_TIME}`
// https://merchantapi.geins.io/redirect/aliashistory/`{API-KEY}`?offset=`{DATE_TIME}`



export class RoutingService {
  //protected client: GeinsManagementApiClient;
  protected endpoints: any;
  private cache: NodeCache;
  private apiKey: string;
  private apiClient: EndpointApiClient;
  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.cache = this.initCache();
    this.apiClient = new EndpointApiClient(apiKey);
  }
  private initCache() {
    return new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false,
    });
  }

  get cacheInstance() {
    return this.cache;
  }

  fillRoutes() {
    // dummy data for loop
    let count = 0;
    // forloop to fill routes 100 times
    for (let i = 0; i < 100000; i++) {
      // get ms from date and randon number
      const ms = new Date().getMilliseconds();
      const random = Math.random();
      const path = `path${ms}${random}`;
      this.saveRouteInCache(`path${count}/${path}`, `route${count}`);
      count++;
    }
  }

  async fillSlugHistory() {
    return this.apiClient.getUrlHistory();
  }

  saveRouteInCache(path: string, route: string) {
    if (!this.cache) {
      throw new Error('Cache not initialized');
    }
    this.cache.set(path, route);
  }

  getRoute(path: string) {
    const cachedData = this.cache.get(path);
    return cachedData;
  }

  getAllRoutes() {
    return this.cache.keys();
  }
}
