import { GeinsCore, GeinsMerchantApiClient  } from '@geins/core';
import type { ContentAreaVariabels } from './types';
import { MenuService } from './menuService';
import { PageService } from './pageService';
import { ContentAreaService } from './contentAreaService';

class GeinsCMS  {
    private merchantApiClient: GeinsMerchantApiClient;
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
    get client(): GeinsMerchantApiClient {
        if (!this.merchantApiClient) {
            throw new Error('Merchant API Client is not set');
        }
        return this.merchantApiClient;
    }      
}

export { GeinsCMS, ContentAreaVariabels };