import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
export declare enum FetchPolicy {
    CACHE_FIRST = "cache-first",
    NETWORK_ONLY = "network-only",
    CACHE_ONLY = "cache-only",
    NO_CACHE = "no-cache",
    STANDBY = "standby"
}
export declare class MerchantApiClient {
    private client;
    fetchPolicy: FetchPolicy;
    pollInterval: number;
    constructor(apiUrl: string, apiKey: string);
    createClient(apiUrl: string, apiKey: string): ApolloClient<NormalizedCacheObject>;
    getClient(): ApolloClient<NormalizedCacheObject> | undefined;
    clearCache(): void;
    runQuery(query: any, variables?: any, options?: any): Promise<import("@apollo/client").ApolloQueryResult<any>>;
    runMutation(mutation: any): Promise<import("@apollo/client").FetchResult<any>>;
}
