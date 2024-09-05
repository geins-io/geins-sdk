import { ContentPageVariables, ContentAreaType } from '@geins/core';
import { BaseApiService } from '@geins/core';
import { queries } from '../graphql';
import * as contentParsers from '../util/contentParsers';

export class ContentPageService extends BaseApiService {
  private async generateVars(variables: ContentPageVariables) {
    if (!variables.alias) {
      throw new Error('Alias is required');
    }
    return this.createVariables(variables);
  }

  async get(variables: ContentPageVariables) {
    const vars = await this.generateVars(variables);
    return await this.runQuery(queries.contentArea, vars);
  }

  async getParsed(variables: ContentPageVariables) {
    const vars = await this.generateVars(variables);
    return await this.runQueryParsed(queries.contentArea, vars);
  }

  protected parseResult(result: any): ContentAreaType {
    return contentParsers.parseContentArea(result);
  }
}
