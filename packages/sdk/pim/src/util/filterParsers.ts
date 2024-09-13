import type { FilterFacetType, FilterFacetValueType } from '@geins/core';
import { logWrite, FilterSystemEntityTypes } from '@geins/core';

export function parseFilters(filters: {
  facets?: FilterFacetType[];
}): FilterFacetType[] {
  if (!filters.facets) {
    return [];
  }

  const parsedFilters = filters.facets
    .map(parseSingleFacet)
    .filter(Boolean) as FilterFacetType[];

  return parsedFilters
    .filter((filter) => filter.filterId !== 'ParameterValue')
    .sort(compareFilters);
}

function parseSingleFacet(facet: FilterFacetType): FilterFacetType | null {
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

function compareFilters(a: FilterFacetType, b: FilterFacetType): number {
  if (a.isSystem === b.isSystem) {
    if (a.group === b.group) {
      return a.label.localeCompare(b.label);
    }
    return a.group.localeCompare(b.group);
  }
  return a.isSystem ? -1 : 1;
}

function parseFacetValues(facetValues: any): FilterFacetValueType[] {
  if (!facetValues) {
    return [];
  }

  return facetValues.map(parseFacetValue).sort(compareFacetValues);
}

function parseFacetValue(facetValue: any): FilterFacetValueType {
  return {
    facetId: facetValue.facetId,
    parentId: facetValue.parentId,
    label: facetValue.label ?? facetValue.type,
    count: facetValue.count || 0,
    order: facetValue.order || 0,
    hidden: facetValue.hidden || false,
  };
}

function compareFacetValues(
  a: FilterFacetValueType,
  b: FilterFacetValueType,
): number {
  const labelA = a.label || '';
  const labelB = b.label || '';

  if (a.order === b.order) {
    return labelA.localeCompare(labelB);
  }
  return (a.order ?? 0) - (b.order ?? 0);
}
