import { GeinsCore, MerchantApiClient  } from '@geins/core';
import type { ContentAreaVariabels } from '@geins/types';
import { MenuService, PageService, ContentAreaService } from './services';

class GeinsCMS  {
    private merchantApiClient: MerchantApiClient;
    public menu: MenuService;
    public page: PageService;
    public content: ContentAreaService;

    constructor(core: GeinsCore) {
        if(!core) {
            throw new Error('Core is required');
        }
        if (core.client) {
            this.merchantApiClient = core.client;
        } else {
            throw new Error('Merchant API Client is not set');
        }
        this.menu = new MenuService(this.merchantApiClient);
        this.page = new PageService(this.merchantApiClient);
        this.content = new ContentAreaService(this.merchantApiClient);
    }
    get client(): MerchantApiClient {
        if (!this.merchantApiClient) {
            throw new Error('Merchant API Client is not set');
        }
        return this.merchantApiClient;
    }
}

export { GeinsCMS, ContentAreaVariabels };
