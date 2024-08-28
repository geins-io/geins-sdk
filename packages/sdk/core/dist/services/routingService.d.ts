import NodeCache from 'node-cache';
export declare class GeinsRouter {
    protected endpoints: any;
    private cache;
    constructor();
    get cacheInstance(): NodeCache;
    fillRoutes(): void;
    saveRouteInCache(path: string, route: string): void;
    getRoute(path: string): unknown;
}
