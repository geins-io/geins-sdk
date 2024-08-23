import { ContentAreaVariables } from '@geins/types';
import { BaseApiService } from '@geins/core';
import { queries } from '../graphql';

export class ContentAreaService extends BaseApiService {
  async area(
    family: string,
    areaName: string,
    variables?: ContentAreaVariables,
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

  protected parseResult(result: any): any {
    // Implement the parsing logic specific to PageService
    // Adjust based on expected result structure
    return JSON.parse(result);
  }
}
