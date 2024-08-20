// src/baseService.ts
import { GeinsMerchantApiClient } from '@geins/core';
import type { GeinsAPILocalization } from '@geins/core';

export abstract class BaseService {
    protected client: GeinsMerchantApiClient;

    constructor(client: GeinsMerchantApiClient) {
        this.client = client;
        
    }
    protected createVariables(vars: any, localization: GeinsAPILocalization) {
        return {
            ...vars,
            channelId: localization.channelId,
            marketId: localization.marketId,
            languageId: localization.languageId
        };
    }
}
