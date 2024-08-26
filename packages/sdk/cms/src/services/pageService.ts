import { ContentAreaVariables, ContentAreaType } from '@geins/core';
import { BaseApiService } from '@geins/core';
import { queries } from '../graphql';
import * as contentParsers from '../util/contentParsers';

export class PageService extends BaseApiService {
  private async aliasVars(alias: string, variables?: ContentAreaVariables) {
    if (!alias) {
      throw new Error('Alias is required');
    }
    const combinedVariables = { ...variables, widgetAlias: alias };
    return this.createVariables(combinedVariables);
  }

  async alias(alias: string, variables?: ContentAreaVariables) {
    const vars = await this.aliasVars(alias, variables);
    return await this.runQuery(queries.contentArea, vars);
  }

  async aliasParsed(alias: string, variables?: ContentAreaVariables) {
    const vars = await this.aliasVars(alias, variables);
    return await this.runQueryParsed(queries.contentArea, vars);
  }

  protected parseResult(result: any): ContentAreaType {
    return contentParsers.parseContentArea(result);
  }
}
