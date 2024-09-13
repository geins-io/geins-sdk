import { logWrite } from '@geins/core';

export enum FilterSystemEntityTypes {
  Brand = 'Brand',
  Category = 'Category',
  Price = 'Price',
  Sku = 'Sku',
  StockStatus = 'StockStatus',
  DiscountCampaign = 'DiscountCampaign',
  DiscountCampaignNumber = 'DiscountCampaignNumber',
  Discount = 'Discount',
  ReducedPrice = 'ReducedPrice',
}

type FilterType = {
  filterId: string;
  label: string;
  group: string;
  type: string;
  isSystem: boolean;
  values: FilterFacetType[];
};

type FilterFacetType = {
  facetId: string;
  parentFacetId: string;
  label: string;
  url?: string;
  order: number;
  count: number;
  hidden: boolean;
};

type Facet = {
  filterId: string;
  label?: string;
  group?: string;
  type: string;
  values: FacetValue[];
};

type FacetValue = {
  facetId: string;
  parentId: string;
  label?: string;
  type: string;
  count?: number;
  order?: number;
  hidden?: boolean;
};

export function parseFilters(filters: { facets?: Facet[] }): FilterType[] {
  if (!filters.facets) {
    return [];
  }

  const parsedFilters = filters.facets
    .map(parseSingleFacet)
    .filter(Boolean) as FilterType[];

  return parsedFilters
    .filter((filter) => filter.filterId !== 'ParameterValue')
    .sort(compareFilters);
}

function parseSingleFacet(facet: Facet): FilterType | null {
  const isSystemEntity = isSystemEntityType(facet.type);

  return {
    filterId: facet.filterId,
    label: facet.label ?? facet.type,
    group: facet.group ?? (isSystemEntity ? 'SystemEntity' : 'Custom'),
    type: facet.type,
    isSystem: isSystemEntity,
    values: parseFacetValues(facet.values),
  };
}

function isSystemEntityType(type: string): boolean {
  return Object.values(FilterSystemEntityTypes).includes(
    type as FilterSystemEntityTypes,
  );
}

function compareFilters(a: FilterType, b: FilterType): number {
  if (a.isSystem === b.isSystem) {
    if (a.group === b.group) {
      return a.label.localeCompare(b.label);
    }
    return a.group.localeCompare(b.group);
  }
  return a.isSystem ? -1 : 1;
}

export function parseFacetValues(facetValues: FacetValue[]): FilterFacetType[] {
  if (!facetValues) {
    return [];
  }

  return facetValues.map(parseSingleFacetValue).sort(compareFacetValues);
}

function parseSingleFacetValue(facetValue: FacetValue): FilterFacetType {
  return {
    facetId: facetValue.facetId,
    parentFacetId: facetValue.parentId,
    label: facetValue.label ?? facetValue.type,
    count: facetValue.count || 0,
    order: facetValue.order || 0,
    hidden: facetValue.hidden || false,
  };
}

function compareFacetValues(a: FilterFacetType, b: FilterFacetType): number {
  const labelA = a.label || '';
  const labelB = b.label || '';

  if (a.order === b.order) {
    return labelA.localeCompare(labelB);
  }
  return a.order - b.order;
}
