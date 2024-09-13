export enum ProductFilterModeType {
  BY_GROUP = 'BY_GROUP',
  CURRENT = 'CURRENT',
}

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

export type FilterFacetType = {
  filterId: string;
  label: string;
  group: string;
  type: string;
  isSystem: boolean;
  values: FilterFacetValueType[];
};

export type FilterFacetValueType = {
  facetId: string;
  parentId: string;
  label?: string;
  count?: number;
  order?: number;
  hidden?: boolean;
};
