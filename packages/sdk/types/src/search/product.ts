import type { GeinsBaseApiVars } from '../api-client';
import type { SortType, FilterMode } from '../pim';

export interface ProductSearchVariables extends GeinsBaseApiVars {
  searchText: string;
  sort?: SortType;
  filterMode?: FilterMode;
  facets?: string[];
  skip?: number;
  take?: number;
}
