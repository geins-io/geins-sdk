import { EndpointApiClient } from '../api-client/endpointClient';
import NodeCache from 'node-cache';
const ttlSeconds = 60 * 60 * 24; // 24 hours

export class RoutingService {
  //protected client: GeinsManagementApiClient;
  protected endpoints: any;
  private cache: NodeCache;
  private lastFetchTimes: NodeCache;
  private apiKey: string;
  private apiClient: EndpointApiClient;
  private lastFetchTime: Date | null = null;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.apiClient = new EndpointApiClient(apiKey);
    this.cache = this.initCache();
    this.lastFetchTimes = this.initCache();
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

  async fillRoutes() {
   const urlHistory = await this.fillUrlhistory();
   //const slugHistory = await this.fillSlugHistory();
   // console.log(urlHistory, slugHistory);
   return { urlHistory };

  }
  async fillUrlhistory() {
    const history =  await this.apiClient.getUrlHistory();
    for (const item of history) {
      if(item.oldUrl && item.newUrl && item.deleted === false) {
        this.saveRouteInCache(item.oldUrl, item.newUrl);
      }
    }
    return history;
  }

  async fillSlugHistory() {
   return await this.apiClient.getSlugHistory();
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
