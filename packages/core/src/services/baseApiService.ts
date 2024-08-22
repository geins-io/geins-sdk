import { MerchantApiClient } from '../api-client/merchantApiClient';
import type { GeinsAPILocalization } from '@geins/types';

export abstract class BaseApiService {
    protected client: MerchantApiClient;

    constructor(client: MerchantApiClient) {
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
