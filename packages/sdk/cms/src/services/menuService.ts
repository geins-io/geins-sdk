import { ContentAreaVariabels } from '@geins/types';
import { BaseApiService } from '@geins/core';
import { queries } from '../graphql';

export class MenuService extends BaseApiService {
  async atLocation(locationId: string) {
    if (!locationId) {
      throw new Error('Location ID is required');
    }

    const variables = {
      menuLocationId: locationId,
    };
    if (!this.client) {
      throw new Error('Merchant API Client is not set');
    }
    return this.client.runQuery(queries.menu, variables);
  }
}
