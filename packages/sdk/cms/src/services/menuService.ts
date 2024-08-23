import { ContentAreaVariabels } from '@geins/types';
import { BaseApiService } from '@geins/core';
import { queries } from '../graphql';

export class MenuService extends BaseApiService {
  async location(locationId: string) {
    if (!locationId) {
      throw new Error('Location ID is required');
    }

    const variables = {
      menuLocationId: locationId,
    };
    // set alias to widgetAlias in variables gor usability
    const arg = { ...variables };
    arg.menuLocationId = locationId;

    const vars = this.createVariables(arg);

    return await this.runQuery(queries.contentArea, vars);
  }
}
