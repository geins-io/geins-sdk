import GeinsMerchantApiClient from './client';
import type { GeinsAPILocalization } from './types';

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
