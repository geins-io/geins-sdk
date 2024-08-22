import { BaseApiService } from '@geins/core';
import { queries } from '../graphql';

export class BrandService extends BaseApiService {
  async get(slug: string) {
    if (!slug) {
      throw new Error('Slug is required');
    }
    const variables = {
      slug,
    };
    return {};
    //return this.client.runQuery(queries.contentArea, variables);
  }
}
