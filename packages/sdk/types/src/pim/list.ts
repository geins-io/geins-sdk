import { ProductFilterModeType } from './filter';

export enum ProductListSortType {
  NONE = 'NONE',
  PRICE = 'PRICE',
  PRICE_DESC = 'PRICE_DESC',
  MOST_SOLD = 'MOST_SOLD',
  VOTES = 'VOTES',
  BRAND = 'BRAND',
  LATEST = 'LATEST',
  RELEVANCE = 'RELEVANCE',
  FACET_ORDER = 'FACET_ORDER',
  ALPHABETICAL = 'ALPHABETICAL',
  ALPHABETICAL_DESC = 'ALPHABETICAL_DESC',
  AVAILABLE_STOCK = 'AVAILABLE_STOCK',
  AVAILABLE_STOCK_DESC = 'AVAILABLE_STOCK_DESC',
  TOTAL_STOCK = 'TOTAL_STOCK',
  TOTAL_STOCK_DESC = 'TOTAL_STOCK_DESC',
}

export type PriceFilterType = {
  lowest: number;
  highest: number;
};

export type ProductListFilterType = {
  searchText: string;
  facets: string[];
  excludeFacets: string[];
  include: string[];
  exclude: string[];
  sort: ProductListSortType;
  price: PriceFilterType;
  filterMode: ProductFilterModeType;
  productIds: number[];
  includeCollapsed: Boolean;
};
