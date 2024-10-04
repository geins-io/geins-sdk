import type { ProductSearchVars } from '@geins/core';
import {
  BaseApiService,
  logWrite,
  ProductFilterModeType,
  ProductListSortType,
} from '@geins/core';
import { parseFilters } from '@geins/pim';
import { queries } from '../graphql';

export class ProductSearchService extends BaseApiService {
  private async generateVars(variables: any) {
    const searchVars = {
      filter: {
        searchText: variables.searchText,
        sort: variables.sort || ProductListSortType.RELEVANCE,
        filterMode: variables.filterMode || ProductFilterModeType.CURRENT,
        facets: variables.facets || [],
      },
      skip: variables.skip || 0,
      take: variables.take || 0,
    };
    return this.createVariables(searchVars);
  }

  async getRaw(variables: ProductSearchVars) {
    if (!variables.searchText) {
      throw new Error('searchText is required');
    }
    const options = {
      query: queries.products,
      variables: await this.generateVars(variables),
    };
    return await this.runQuery(options);
  }

  async get(variables: ProductSearchVars) {
    if (!variables.searchText) {
      throw new Error('searchText is required');
    }
    const options = {
      query: queries.products,
      variables: await this.generateVars(variables),
    };
    throw new Error('Not implemented');
  }

  async getFiltersRaw(variables: ProductSearchVars) {
    if (!variables.searchText) {
      throw new Error('searchText is required');
    }
    const modifiedVars = await this.generateVars({
      ...variables,
      take: 0,
      skip: 0,
    });
    const options = {
      query: queries.filters,
      variables: modifiedVars,
    };
    return await this.runQuery(options);
  }

  async getFilters(variables: ProductSearchVars) {
    const modifiedVars = await this.generateVars({
      ...variables,
      take: 0,
      skip: 0,
    });
    const options = {
      query: queries.filters,
      variables: modifiedVars,
    };
    const { data } = await this.runQuery(options);
    const filters = data?.products?.filters
      ? parseFilters(data.products.filters)
      : [];

    return filters;
  }
}
