import { GeinsAPILocalization, ContentAreaVariabels } from '@geins/types';
import { BaseApiService } from '@geins/core';
import { queries } from '../graphql';

export class MenuService extends BaseApiService {
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
