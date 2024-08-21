import { BaseService } from '@geins/core';
import { queries } from './queries';

export class BrandService extends BaseService {
    async get(slug: string) {
        if (!slug) {
            throw new Error('Slug is required');
        }
        const variables = {
            slug
        };
        return {};
        //return this.client.runQuery(queries.contentArea, variables);
    }
}
