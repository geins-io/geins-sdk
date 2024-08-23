import { ContentAreaVariables } from '@geins/types';
import { BaseApiService } from '@geins/core';
import { queries } from '../graphql';

export class PageService extends BaseApiService {
  async alias(alias: string, variables?: ContentAreaVariables) {
    if (!alias) {
      throw new Error('Alias is required');
    }

    const vars = this.createVariables({ ...variables, widgetAlias: alias });

    return await this.runQuery(queries.contentArea, vars);

    //return await this.runQueryTyped<T>(queries.contentArea, vars);

    //  return (await this.runQuery(queries.contentArea, vars)) as any;
  }

  protected parseResult(result: any): any {
    // Implement the parsing logic specific to PageService
    // Adjust based on expected result structure
    return JSON.parse(result);
  }
}
