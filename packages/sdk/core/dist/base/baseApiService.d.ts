import type { Channel, MarketLanguage } from '@geins/types';
export declare abstract class BaseApiService {
    protected client: any;
    protected channel: Channel;
    protected channelId: string;
    protected defaultMarketLanguage: MarketLanguage | undefined;
    constructor(client: any, channel: Channel, defaultMarketLanguage?: MarketLanguage);
    protected createVariables(vars: any): any;
    protected runQuery(query: any, variables: any): Promise<any>;
    protected runQueryParsed<T>(query: any, variables: any): Promise<T>;
    protected abstract parseResult(result: any): any;
}
