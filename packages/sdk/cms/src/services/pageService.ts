import { ContentAreaVariabels } from '@geins/types';
import { BaseApiService } from '@geins/core';
import { queries } from '../graphql';

export class PageService extends BaseApiService {
  async slug(slug: string) {
    if (!slug) {
      throw new Error('Slug is required');
    }
    const variables = {
      slug,
    };
    if (!this.client) {
      throw new Error('Merchant API Client is not set');
    }
    return this.client.runQuery(queries.contentArea, variables);
  }
}
