import GeinsManagementApiClient from './clientManagementApi';
import NodeCache from 'node-cache';
const ttlSeconds = 60 * 60 * 24; // 24 hours

export class GeinsRouter {
    //protected client: GeinsManagementApiClient;
    protected endpoints: any;
    private cache: NodeCache;
    constructor() {
      //  this.client = client;
      this.cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false });
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

    saveRouteInCache(path: string, route: string) {
      if(!this.cache) {
        throw new Error('Cache not initialized');
      }
      this.cache.set(path, route);
    }

    getRoute(path: string) {
      const cachedData = this.cache.get(path);
      return cachedData;
    }
}
