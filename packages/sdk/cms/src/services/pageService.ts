import { ContentAreaVariabels } from '@geins/types';
import { BaseApiService } from '@geins/core';
import { queries } from '../graphql';

export class PageService extends BaseApiService {
  async page(alias: string, variables?: ContentAreaVariabels) {
    if (!alias) {
      throw new Error('Alias is required');
    }

    // set alias to widgetAlias in variables gor usability
    const arg = { ...variables };
    arg.widgetAlias = alias;

    const vars = this.createVariables(arg);

    return await this.runQuery(queries.contentArea, vars);
  }
}
