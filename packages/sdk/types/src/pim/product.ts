export type AlternativeUrlType = {
  url: string;
  type: string;
};

export type ProductTextsType = {
  shortDescription?: string;
  longDescription?: string;
  additionalInfo?: string;
};

export type SkuType = {
  skuId: number;
  skuCode: string;
  price: PriceType;
  stock: StockType;
  attributes: AttributeType[];
};

export type BrandType = {
  brandId: number;
  name: string;
  logoUrl?: string;
};

export type CategoryType = {
  categoryId: number;
  parentCategoryId: number;
  order: number;
  alias?: string;
  canonicalUrl: string;
  alternativeCanonicalUrls?: string[];
  alternativeUrls?: AlternativeUrlType[];
  name: string;
  description?: string;
  secondaryDescription?: string;
  isHidden?: boolean;
  googleTaxonomy?: GoogleTaxonomyType;
  primaryImage?: string;
  backgroundImage?: string;
};

export type PriceType = {
  amount: number;
  currency: string;
  formatted: string;
};

export type LowestPriceType = {
  amount: number;
  currency: string;
  formatted: string;
  validFrom: string;
  validTo: string;
};

export type ProductImageType = {
  url: string;
  altText?: string;
  isPrimary: boolean;
};

type ParameterType = {
  parameterId: number;
  parameterGroupId: number;
  type?: string;
  name?: string;
  label?: string;
  description?: string;
  value?: string;
  show: boolean;
  showFilter: boolean;
  identifier?: string;
  facetId?: string;
};

export type ParameterGroupType = {
  groupName: string;
  parameters: ParameterType[];
};

export type VariantDimensionType = {
  dimensionName: string;
  values: string[];
};

export type VariantGroupType = {
  groupId: number;
  groupName: string;
  variants: VariantType[];
};

export type RatingType = {
  averageRating: number;
  reviewCount: number;
};

export type StockType = {
  quantity: number;
  isInStock: boolean;
};

export type MetadataType = {
  key: string;
  value: string;
};

export type VariantType = {
  variantId: number;
  attributes: AttributeType[];
  price: PriceType;
  stock: StockType;
};

export type BreadcrumbType = {
  name: string;
  url: string;
};

export type CampaignRuleType = {
  ruleId: number;
  description: string;
  discountType: DiscountType;
  discountValue: number;
};

export type PriceLogItemType = {
  date: string;
  price: PriceType;
};

enum DiscountType {
  PERCENTAGE,
  FIXED_AMOUNT,
}

export type ProductPackageType = {
  packageId: number;
  dimensions: DimensionsType;
  weight: number;
};

export type DimensionsType = {
  length: number;
  width: number;
  height: number;
};

export type AttributeType = {
  attributeName: string;
  attributeValue: string;
};

export type GoogleTaxonomyType = {
  id: number;
  parentId?: number;
  name: string;
  path: string;
};

export type ProductType = {
  productId: number;
  name?: string;
  alias: string;
  articleNumber?: string;
  categoryId: number;
  canonicalUrl?: string;
  alternativeCanonicalUrls?: string[];
  alternativeUrls?: AlternativeUrlType[];
  firstAvailableOn?: string;
  texts?: ProductTextsType;
  type?: string;
  skus?: SkuType[];
  brand?: BrandType;
  categories?: CategoryType[];
  unitPrice?: PriceType;
  lowestPrice?: LowestPriceType;
  images?: string[];
  productImages?: ProductImageType[];
  parameterGroups?: ParameterGroupType[];
  variantDimensions?: VariantDimensionType[];
  variantGroup?: VariantGroupType;
  rating?: RatingType;
  totalStock?: StockType;
  meta?: MetadataType;
  primaryCategory?: CategoryType;
  currentProductVariant?: VariantType;
  breadcrumbs?: BreadcrumbType[];
  discountCampaigns?: CampaignRuleType[];
  priceLog?: PriceLogItemType[];
  discountType?: DiscountType;
  productPackage?: ProductPackageType;
  dimensions?: DimensionsType;
  weight: number;
  freightClass?: string;
  supplierId: number;
};
