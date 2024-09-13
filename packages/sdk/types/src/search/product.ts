import type { GeinsBaseApiVars } from '../api-client';
import type { ProductListSortType } from '../pim/list';
import type { ProductFilterModeType } from '../pim/filter';

export interface ProductSearchVars extends GeinsBaseApiVars {
  searchText: string;
  sort?: ProductListSortType;
  filterMode?: ProductFilterModeType;
  facets?: string[];
  skip?: number;
  take?: number;
}
