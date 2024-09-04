import { PageVariables, ContentAreaType } from '@geins/core';
import { BaseApiService } from '@geins/core';
import { queries } from '../graphql';
import * as contentParsers from '../util/contentParsers';

export class PageService extends BaseApiService {
  private async generateVars(variables: PageVariables) {
    if (!variables.alias) {
      throw new Error('Alias is required');
    }
    return this.createVariables(variables);
  }

  async get(variables: PageVariables) {
    const vars = await this.generateVars(variables);
    return await this.runQuery(queries.contentArea, vars);
  }

  async getParsed(variables: PageVariables) {
    const vars = await this.generateVars(variables);
    return await this.runQueryParsed(queries.contentArea, vars);
  }

  protected parseResult(result: any): ContentAreaType {
    return contentParsers.parseContentArea(result);
  }
}
