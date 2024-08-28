import type { MerchantApiCredentials, Channel, MarketLanguage } from '@geins/types';
import { CookieService, EventService } from './services/';
export declare class GeinsCore {
    private endpointsUrls;
    private apiClient;
    private apiKey;
    private accountName;
    private environment;
    private useChannel;
    private useDefaultMarketLanguage;
    private cookieService;
    private eventService;
    constructor(credentials: MerchantApiCredentials, channel: Channel, defualtMarketLanguage?: MarketLanguage);
    private initApiClient;
    get client(): any;
    get endpoints(): any;
    get channel(): Channel;
    get events(): EventService;
    get defaultMarketLanguage(): MarketLanguage | undefined;
    get cookies(): CookieService;
}
