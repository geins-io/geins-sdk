import type { GeinsAPILocalization } from '@geins/core';
import { BaseService } from './baseService';
import { queries } from './queries';

export class MenuService extends BaseService {
    async atLocation(locationId: string, localization: GeinsAPILocalization) {
        if (!locationId) {
            throw new Error('Location ID is required');
        }
        if (!localization) {
            throw new Error('Localization is required');
        }
        const variables = {
            menuLocationId: locationId,
            channelId: localization.channelId,
            marketId: localization.marketId,
            languageId: localization.languageId
        };
        return this.client.runQuery(queries.menu, variables);
    }
}