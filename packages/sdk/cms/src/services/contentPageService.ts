import { ContentPageVariables, ContentPageType } from '@geins/core';
import { BaseApiService } from '@geins/core';
import { queries } from '../graphql';
import * as contentParsers from '../parsers/contentParsers';

export class ContentPageService extends BaseApiService {
  private async generateVars(variables: ContentPageVariables) {
    if (!variables.alias) {
      throw new Error('Alias is required');
    }
    return this.createVariables(variables);
  }

  async getRaw(variables: ContentPageVariables) {
    const options = {
      query: queries.page,
      variables: await this.generateVars(variables),
    };
    return await this.runQuery(options);
  }

  async get(variables: ContentPageVariables) {
    const options = {
      query: queries.page,
      variables: await this.generateVars(variables),
    };
    return await this.runQueryParsed(options);
  }

  protected parseResult(result: any): ContentPageType {
    return contentParsers.parseContentPage(result);
  }
}
