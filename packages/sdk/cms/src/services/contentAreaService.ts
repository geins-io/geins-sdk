import { ContentAreaVariables, ContentAreaType } from '@geins/core';
import { BaseApiService } from '@geins/core';
import { queries } from '../graphql';
import * as contentParsers from '../util/contentParsers';
export class ContentAreaService extends BaseApiService {
  private async areaVars(
    family: string,
    areaName: string,
    variables?: ContentAreaVariables,
  ) {
    if (!areaName || !family) {
      throw new Error('areaName and family is required');
    }

    const combinedVariables = { ...variables, areaName, family };
    return this.createVariables(combinedVariables);
  }
  async area(
    family: string,
    areaName: string,
    variables?: ContentAreaVariables,
  ) {
    const vars = await this.areaVars(family, areaName, variables);
    return await this.runQuery(queries.contentArea, vars);
  }

  async areaParsed(
    family: string,
    areaName: string,
    variables?: ContentAreaVariables,
  ) {
    const vars = await this.areaVars(family, areaName, variables);
    return await this.runQueryParsed(queries.contentArea, vars);
  }

  protected parseResult(result: any): ContentAreaType {
    return contentParsers.parseContentArea(result);
  }
}
