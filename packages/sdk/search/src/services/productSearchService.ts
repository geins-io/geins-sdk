import type { ProductSearchVariables } from '@geins/core';
import { BaseApiService, FilterMode, SortType } from '@geins/core';
import { queries } from '../graphql';
// import * as contentParsers from '../util/contentParsers';
export class ProductSearchService extends BaseApiService {
  private async generateVars(variables: any) {
    const searchVars = {
      filter: {
        searchText: variables.searchText,
        sort: variables.sort || SortType.RELEVANCE,
        filterMode: variables.filterMode || FilterMode.CURRENT,
        facets: variables.facets || [],
      },
      skip: variables.skip || 0,
      take: variables.take || 0,
    };
    return this.createVariables(searchVars);
  }

  async get(variables: ProductSearchVariables) {
    if (!variables.searchText) {
      throw new Error('searchText is required');
    }
    const vars = await this.generateVars(variables);
    return await this.runQuery(queries.products, vars);
  }

  async getParsed(variables: ProductSearchVariables) {
    const vars = await this.generateVars(variables);
    return {};
  }

  async getFilters(variables: ProductSearchVariables) {
    if (!variables.searchText) {
      throw new Error('searchText is required');
    }
    variables.take = 0;
    variables.skip = 0;
    const vars = await this.generateVars(variables);
    return await this.runQuery(queries.filters, vars);
  }

  async getFiltersParsed(variables: ProductSearchVariables) {
    variables.take = 0;
    variables.skip = 0;
    const vars = await this.generateVars(variables);
    return {};
  }
}
