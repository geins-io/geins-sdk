import { BaseService } from '@geins/core';
import { queries } from './queries';

export class PageService extends BaseService {
    async slug(slug: string) {
        if (!slug) {
            throw new Error('Slug is required');
        }
        const variables = {
            slug
        };
        return this.client.runQuery(queries.contentArea, variables);
    }
}
