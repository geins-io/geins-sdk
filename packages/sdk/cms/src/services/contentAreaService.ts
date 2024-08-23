import { ContentAreaVariabels } from '@geins/types';
import { BaseApiService } from '@geins/core';
import { queries } from '../graphql';

export class ContentAreaService extends BaseApiService {
  async area(
    family: string,
    areaName: string,
    variables?: ContentAreaVariabels,
  ) {
    if (!areaName || !family) {
      throw new Error('areaName and family is required');
    }
    // set areaName and family in variables for usability
    const arg = { ...variables };
    arg.areaName = areaName;
    arg.family = family;

    const vars = this.createVariables(arg);

    return await this.runQuery(queries.contentArea, vars);
  }

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
