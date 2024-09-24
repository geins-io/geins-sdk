export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  Decimal: { input: any; output: any; }
  Guid: { input: any; output: any; }
  Long: { input: any; output: any; }
};

export type AddressInputType = {
  addressLine1?: InputMaybe<Scalars['String']['input']>;
  addressLine2?: InputMaybe<Scalars['String']['input']>;
  addressLine3?: InputMaybe<Scalars['String']['input']>;
  careOf?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  company?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  entryCode?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  mobile?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  zip?: InputMaybe<Scalars['String']['input']>;
};

export type AddressType = {
  __typename?: 'AddressType';
  addressLine1: Scalars['String']['output'];
  addressLine2: Scalars['String']['output'];
  addressLine3: Scalars['String']['output'];
  careOf: Scalars['String']['output'];
  city: Scalars['String']['output'];
  company: Scalars['String']['output'];
  country: Scalars['String']['output'];
  entryCode: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  mobile: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  state: Scalars['String']['output'];
  zip: Scalars['String']['output'];
};

export type AlternativeUrlType = {
  __typename?: 'AlternativeUrlType';
  channelId: Scalars['String']['output'];
  country?: Maybe<Scalars['String']['output']>;
  culture: Scalars['String']['output'];
  language: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type BalanceType = {
  __typename?: 'BalanceType';
  pending: Scalars['Decimal']['output'];
  pendingFormatted?: Maybe<Scalars['String']['output']>;
  remaining: Scalars['Decimal']['output'];
  remainingFormatted?: Maybe<Scalars['String']['output']>;
  totalSellingPriceExBalanceExVat: Scalars['Decimal']['output'];
  totalSellingPriceExBalanceExVatFormatted?: Maybe<Scalars['String']['output']>;
  totalSellingPriceExBalanceIncVat: Scalars['Decimal']['output'];
  totalSellingPriceExBalanceIncVatFormatted?: Maybe<Scalars['String']['output']>;
};

export type BrandListType = {
  __typename?: 'BrandListType';
  alias?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use AlternativeUrls instead. */
  alternativeCanonicalUrls?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  alternativeUrls?: Maybe<Array<Maybe<AlternativeUrlType>>>;
  backgroundImage?: Maybe<Scalars['String']['output']>;
  brandId: Scalars['Int']['output'];
  canonicalUrl?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  logo?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  primaryImage?: Maybe<Scalars['String']['output']>;
  secondaryDescription?: Maybe<Scalars['String']['output']>;
};

export type BrandType = {
  __typename?: 'BrandType';
  alias?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use AlternativeUrls instead. */
  alternativeCanonicalUrls?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  alternativeUrls?: Maybe<Array<Maybe<AlternativeUrlType>>>;
  brandId: Scalars['Int']['output'];
  canonicalUrl?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type BreadcrumbType = {
  __typename?: 'BreadcrumbType';
  categoryId: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  parentCategoryId: Scalars['Int']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type CampaignPriceType = {
  __typename?: 'CampaignPriceType';
  discount: Scalars['Decimal']['output'];
  discountPercentage: Scalars['Decimal']['output'];
  price?: Maybe<PriceType>;
  quantity: Scalars['Int']['output'];
};

export type CampaignRuleType = {
  __typename?: 'CampaignRuleType';
  action?: Maybe<Scalars['String']['output']>;
  actionValue?: Maybe<Scalars['String']['output']>;
  campaignId: Scalars['String']['output'];
  canonicalUrl?: Maybe<Scalars['String']['output']>;
  category?: Maybe<Scalars['String']['output']>;
  hideTitle?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  ruleType?: Maybe<Scalars['String']['output']>;
};

export type CampaignType = {
  __typename?: 'CampaignType';
  appliedCampaigns?: Maybe<Array<Maybe<CampaignRuleType>>>;
  prices?: Maybe<Array<Maybe<CampaignPriceType>>>;
};

export type CartFeesType = {
  __typename?: 'CartFeesType';
  paymentFeeExVat: Scalars['Decimal']['output'];
  paymentFeeIncVat: Scalars['Decimal']['output'];
  shippingFeeExVat: Scalars['Decimal']['output'];
  shippingFeeIncVat: Scalars['Decimal']['output'];
};

export type CartGroupInputType = {
  groupKey?: InputMaybe<Scalars['ID']['input']>;
  quantity: Scalars['Int']['input'];
};

export type CartItemInputType = {
  groupKey?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  quantity: Scalars['Int']['input'];
  skuId?: InputMaybe<Scalars['Int']['input']>;
};

export type CartItemType = {
  __typename?: 'CartItemType';
  campaign?: Maybe<CampaignType>;
  groupKey?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  message?: Maybe<Scalars['String']['output']>;
  product?: Maybe<ProductType>;
  productPackage?: Maybe<ProductPackageCartItemType>;
  quantity: Scalars['Int']['output'];
  skuId: Scalars['Int']['output'];
  totalPrice?: Maybe<PriceType>;
  unitPrice?: Maybe<PriceType>;
};

export type CartSummaryType = {
  __typename?: 'CartSummaryType';
  balance?: Maybe<BalanceType>;
  fees?: Maybe<CartFeesType>;
  fixedAmountDiscountExVat: Scalars['Decimal']['output'];
  fixedAmountDiscountIncVat: Scalars['Decimal']['output'];
  payment?: Maybe<PaymentOptionType>;
  shipping?: Maybe<ShippingOptionType>;
  subTotal?: Maybe<PriceType>;
  total?: Maybe<PriceType>;
  vats?: Maybe<Array<Maybe<VatGroupType>>>;
};

export type CartType = {
  __typename?: 'CartType';
  appliedCampaigns?: Maybe<Array<Maybe<CampaignRuleType>>>;
  fixedDiscount: Scalars['Decimal']['output'];
  freeShipping: Scalars['Boolean']['output'];
  id?: Maybe<Scalars['String']['output']>;
  isCompleted: Scalars['Boolean']['output'];
  items?: Maybe<Array<Maybe<CartItemType>>>;
  promoCode?: Maybe<Scalars['String']['output']>;
  summary?: Maybe<CartSummaryType>;
};

export type CategoryType = {
  __typename?: 'CategoryType';
  alias?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use AlternativeUrls instead. */
  alternativeCanonicalUrls?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  alternativeUrls?: Maybe<Array<Maybe<AlternativeUrlType>>>;
  backgroundImage?: Maybe<Scalars['String']['output']>;
  canonicalUrl: Scalars['String']['output'];
  categoryId: Scalars['Int']['output'];
  description?: Maybe<Scalars['String']['output']>;
  googleTaxonomy?: Maybe<GoogleTaxonomyType>;
  isHidden?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  parentCategoryId: Scalars['Int']['output'];
  primaryImage?: Maybe<Scalars['String']['output']>;
  secondaryDescription?: Maybe<Scalars['String']['output']>;
};

export type ChannelType = {
  __typename?: 'ChannelType';
  defaultLanguageId: Scalars['String']['output'];
  defaultMarketId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  languages?: Maybe<Array<Maybe<LanguageType>>>;
  markets?: Maybe<Array<Maybe<MarketType>>>;
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type CheckoutAndOrderType = {
  __typename?: 'CheckoutAndOrderType';
  htmlSnippet: Scalars['String']['output'];
  order?: Maybe<CheckoutOrderType>;
};

export type CheckoutDataType = {
  __typename?: 'CheckoutDataType';
  cart?: Maybe<CartType>;
  completed?: Maybe<Scalars['Boolean']['output']>;
  htmlSnippet?: Maybe<Scalars['String']['output']>;
  newCheckoutSession: Scalars['Boolean']['output'];
  nthPurchase: Scalars['Int']['output'];
  order?: Maybe<CheckoutOrderType>;
};

export type CheckoutInputType = {
  acceptedConsents?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  billingAddress?: InputMaybe<AddressInputType>;
  customerType?: InputMaybe<CustomerType>;
  desiredDeliveryDate?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  externalShippingFee?: InputMaybe<Scalars['Decimal']['input']>;
  externalShippingId?: InputMaybe<Scalars['String']['input']>;
  identityNumber?: InputMaybe<Scalars['String']['input']>;
  merchantData?: InputMaybe<Scalars['String']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  paymentId?: InputMaybe<Scalars['Int']['input']>;
  pickupPoint?: InputMaybe<Scalars['String']['input']>;
  shippingAddress?: InputMaybe<AddressInputType>;
  shippingId?: InputMaybe<Scalars['Int']['input']>;
};

export type CheckoutOrderRowType = {
  __typename?: 'CheckoutOrderRowType';
  articleNumber?: Maybe<Scalars['String']['output']>;
  brand?: Maybe<Scalars['String']['output']>;
  campaignIds?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  campaignNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  categories?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  discountExVat: Scalars['Decimal']['output'];
  discountIncVat: Scalars['Decimal']['output'];
  discountRate: Scalars['Float']['output'];
  externalId?: Maybe<Scalars['String']['output']>;
  gtin?: Maybe<Scalars['String']['output']>;
  height: Scalars['Int']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  length: Scalars['Int']['output'];
  message?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  priceExVat: Scalars['Decimal']['output'];
  priceIncVat: Scalars['Decimal']['output'];
  productId: Scalars['Int']['output'];
  productPriceCampaignId?: Maybe<Scalars['Int']['output']>;
  productPriceListId?: Maybe<Scalars['Int']['output']>;
  productUrl?: Maybe<Scalars['String']['output']>;
  quantity: Scalars['Int']['output'];
  sku?: Maybe<Scalars['String']['output']>;
  variant?: Maybe<Scalars['String']['output']>;
  weight: Scalars['Int']['output'];
  width: Scalars['Int']['output'];
};

export type CheckoutOrderType = {
  __typename?: 'CheckoutOrderType';
  campaignIds?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  campaignNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  currency?: Maybe<Scalars['String']['output']>;
  discountExVat: Scalars['Decimal']['output'];
  discountIncVat: Scalars['Decimal']['output'];
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  itemValueExVat: Scalars['Decimal']['output'];
  itemValueIncVat: Scalars['Decimal']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  marketId: Scalars['String']['output'];
  message?: Maybe<Scalars['String']['output']>;
  orderId?: Maybe<Scalars['String']['output']>;
  orderValueExVat: Scalars['Decimal']['output'];
  orderValueIncVat: Scalars['Decimal']['output'];
  paymentFeeExVat: Scalars['Decimal']['output'];
  paymentFeeIncVat: Scalars['Decimal']['output'];
  rows?: Maybe<Array<Maybe<CheckoutOrderRowType>>>;
  secondaryTransactionId?: Maybe<Scalars['String']['output']>;
  shippingFeeExVat: Scalars['Decimal']['output'];
  shippingFeeIncVat: Scalars['Decimal']['output'];
  sum: Scalars['Decimal']['output'];
  transactionId?: Maybe<Scalars['String']['output']>;
  zip?: Maybe<Scalars['String']['output']>;
};

export enum CheckoutStatus {
  CustomerBlacklisted = 'CUSTOMER_BLACKLISTED',
  Ok = 'OK'
}

export type CheckoutType = {
  __typename?: 'CheckoutType';
  billingAddress?: Maybe<AddressType>;
  cart?: Maybe<CartType>;
  checkoutStatus?: Maybe<CheckoutStatus>;
  consents?: Maybe<Array<Maybe<ConsentType>>>;
  email?: Maybe<Scalars['String']['output']>;
  identityNumber?: Maybe<Scalars['String']['output']>;
  paymentOptions?: Maybe<Array<Maybe<PaymentOptionType>>>;
  shippingAddress?: Maybe<AddressType>;
  shippingData?: Maybe<Scalars['String']['output']>;
  shippingOptions?: Maybe<Array<Maybe<ShippingOptionType>>>;
};

export type ConsentType = {
  __typename?: 'ConsentType';
  autoAccept: Scalars['Boolean']['output'];
  checked: Scalars['Boolean']['output'];
  description: Scalars['String']['output'];
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type CountryType = {
  __typename?: 'CountryType';
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type CurrencyType = {
  __typename?: 'CurrencyType';
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  rate: Scalars['Decimal']['output'];
  symbol: Scalars['String']['output'];
};

export enum CustomerType {
  Organization = 'ORGANIZATION',
  Person = 'PERSON'
}

export type DimensionsType = {
  __typename?: 'DimensionsType';
  height: Scalars['Int']['output'];
  length: Scalars['Int']['output'];
  width: Scalars['Int']['output'];
};

export enum DiscountType {
  None = 'NONE',
  PriceCampaign = 'PRICE_CAMPAIGN',
  SalePrice = 'SALE_PRICE'
}

export type FilterCollectionType = {
  __typename?: 'FilterCollectionType';
  facets?: Maybe<Array<Maybe<FilterType>>>;
  price?: Maybe<PriceFilterType>;
};

export type FilterInputType = {
  exclude?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  excludeFacets?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  facets?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  filterMode?: InputMaybe<FilterMode>;
  include?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  includeCollapsed?: InputMaybe<Scalars['Boolean']['input']>;
  price?: InputMaybe<PriceFilterInputType>;
  productIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  searchText?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortType>;
};

export enum FilterMode {
  ByGroup = 'BY_GROUP',
  Current = 'CURRENT'
}

export type FilterType = {
  __typename?: 'FilterType';
  filterId: Scalars['String']['output'];
  group?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  values?: Maybe<Array<Maybe<FilterValueType>>>;
};

export type FilterValueType = {
  __typename?: 'FilterValueType';
  _id: Scalars['String']['output'];
  count: Scalars['Long']['output'];
  facetId?: Maybe<Scalars['String']['output']>;
  hidden: Scalars['Boolean']['output'];
  label?: Maybe<Scalars['String']['output']>;
  order: Scalars['Int']['output'];
  parentId?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type GeinsMerchantApiMutation = {
  __typename?: 'GeinsMerchantApiMutation';
  addPackageToCart?: Maybe<CartType>;
  addToCart?: Maybe<CartType>;
  commitReset?: Maybe<Scalars['Boolean']['output']>;
  completeCart?: Maybe<CartType>;
  createOrUpdateCheckout?: Maybe<CheckoutType>;
  deleteUser?: Maybe<Scalars['Boolean']['output']>;
  monitorProductAvailability?: Maybe<Scalars['Boolean']['output']>;
  placeOrder?: Maybe<PlaceOrderResponseType>;
  postProductReview?: Maybe<Scalars['Boolean']['output']>;
  requestPasswordReset?: Maybe<Scalars['Boolean']['output']>;
  setCartPromoCode?: Maybe<CartType>;
  setCartShippingFee?: Maybe<CheckoutType>;
  subscribeToNewsletter?: Maybe<Scalars['Boolean']['output']>;
  updateCartGroup?: Maybe<CartType>;
  updateCartItem?: Maybe<CartType>;
  updateUser?: Maybe<UserType>;
};


export type GeinsMerchantApiMutationAddPackageToCartArgs = {
  allowExternalShippingFee?: InputMaybe<Scalars['Boolean']['input']>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  packageId: Scalars['Int']['input'];
  selections?: InputMaybe<Array<InputMaybe<ProductPackageSelectionType>>>;
};


export type GeinsMerchantApiMutationAddToCartArgs = {
  allowExternalShippingFee?: InputMaybe<Scalars['Boolean']['input']>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  item: CartItemInputType;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
};


export type GeinsMerchantApiMutationCommitResetArgs = {
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  resetKey: Scalars['String']['input'];
};


export type GeinsMerchantApiMutationCompleteCartArgs = {
  channelId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
};


export type GeinsMerchantApiMutationCreateOrUpdateCheckoutArgs = {
  cartId: Scalars['String']['input'];
  channelId?: InputMaybe<Scalars['String']['input']>;
  checkout?: InputMaybe<CheckoutInputType>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
};


export type GeinsMerchantApiMutationDeleteUserArgs = {
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
};


export type GeinsMerchantApiMutationMonitorProductAvailabilityArgs = {
  channelId?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  skuId: Scalars['Int']['input'];
};


export type GeinsMerchantApiMutationPlaceOrderArgs = {
  cartId: Scalars['String']['input'];
  channelId?: InputMaybe<Scalars['String']['input']>;
  checkout: CheckoutInputType;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
};


export type GeinsMerchantApiMutationPostProductReviewArgs = {
  alias: Scalars['String']['input'];
  author: Scalars['String']['input'];
  channelId?: InputMaybe<Scalars['String']['input']>;
  comment?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  rating?: InputMaybe<Scalars['Int']['input']>;
};


export type GeinsMerchantApiMutationRequestPasswordResetArgs = {
  channelId?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
};


export type GeinsMerchantApiMutationSetCartPromoCodeArgs = {
  channelId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  promoCode: Scalars['String']['input'];
};


export type GeinsMerchantApiMutationSetCartShippingFeeArgs = {
  cartId: Scalars['String']['input'];
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  shippingFee: Scalars['Decimal']['input'];
};


export type GeinsMerchantApiMutationSubscribeToNewsletterArgs = {
  channelId?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type GeinsMerchantApiMutationUpdateCartGroupArgs = {
  allowExternalShippingFee?: InputMaybe<Scalars['Boolean']['input']>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  item: CartGroupInputType;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
};


export type GeinsMerchantApiMutationUpdateCartItemArgs = {
  allowExternalShippingFee?: InputMaybe<Scalars['Boolean']['input']>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  item: CartItemInputType;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
};


export type GeinsMerchantApiMutationUpdateUserArgs = {
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  user: UserInputType;
};

export type GeinsMerchantApiQuery = {
  __typename?: 'GeinsMerchantApiQuery';
  brands?: Maybe<Array<Maybe<BrandListType>>>;
  categories?: Maybe<Array<Maybe<CategoryType>>>;
  category?: Maybe<CategoryType>;
  channel?: Maybe<ChannelType>;
  channels?: Maybe<Array<Maybe<ChannelType>>>;
  checkout?: Maybe<CheckoutDataType>;
  cmsPages?: Maybe<Array<Maybe<PageWidgetPageType>>>;
  getCart?: Maybe<CartType>;
  /** @deprecated Use Checkout instead */
  getCheckout?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use Checkout instead */
  getCheckoutAndOrder?: Maybe<CheckoutAndOrderType>;
  getMenuAtLocation?: Maybe<MenuType>;
  getOrder?: Maybe<OrderType>;
  getOrderPublic?: Maybe<OrderType>;
  getOrders?: Maybe<Array<Maybe<OrderType>>>;
  getUser?: Maybe<UserType>;
  listPageInfo?: Maybe<PageInfoType>;
  product?: Maybe<ProductType>;
  products?: Maybe<ProductsResultType>;
  relatedProducts?: Maybe<Array<Maybe<RelatedProductType>>>;
  reviews?: Maybe<ProductReviewResultType>;
  urlHistory?: Maybe<UrlHistoryType>;
  validateOrderCreation?: Maybe<ValidateOrderCreationResponseType>;
  widgetArea?: Maybe<PageWidgetCollectionType>;
};


export type GeinsMerchantApiQueryBrandsArgs = {
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
};


export type GeinsMerchantApiQueryCategoriesArgs = {
  channelId?: InputMaybe<Scalars['String']['input']>;
  includeHidden?: InputMaybe<Scalars['Boolean']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  parentCategoryId?: InputMaybe<Scalars['Int']['input']>;
};


export type GeinsMerchantApiQueryCategoryArgs = {
  alias?: InputMaybe<Scalars['String']['input']>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
};


export type GeinsMerchantApiQueryChannelArgs = {
  channelId?: InputMaybe<Scalars['String']['input']>;
};


export type GeinsMerchantApiQueryCheckoutArgs = {
  cartId?: InputMaybe<Scalars['String']['input']>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  paymentType: PaymentType;
};


export type GeinsMerchantApiQueryCmsPagesArgs = {
  channelId?: InputMaybe<Scalars['String']['input']>;
  excludeTags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  includeTags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
};


export type GeinsMerchantApiQueryGetCartArgs = {
  allowExternalShippingFee?: InputMaybe<Scalars['Boolean']['input']>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  forceRefresh?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  includeCompleted?: InputMaybe<Scalars['Boolean']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
};


export type GeinsMerchantApiQueryGetCheckoutArgs = {
  channelId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  paymentType: PaymentType;
};


export type GeinsMerchantApiQueryGetCheckoutAndOrderArgs = {
  channelId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  paymentType: PaymentType;
};


export type GeinsMerchantApiQueryGetMenuAtLocationArgs = {
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  menuLocationId?: InputMaybe<Scalars['String']['input']>;
};


export type GeinsMerchantApiQueryGetOrderArgs = {
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  orderId: Scalars['Int']['input'];
};


export type GeinsMerchantApiQueryGetOrderPublicArgs = {
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  publicOrderId: Scalars['Guid']['input'];
};


export type GeinsMerchantApiQueryGetOrdersArgs = {
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
};


export type GeinsMerchantApiQueryGetUserArgs = {
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
};


export type GeinsMerchantApiQueryListPageInfoArgs = {
  alias?: InputMaybe<Scalars['String']['input']>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};


export type GeinsMerchantApiQueryProductArgs = {
  alias?: InputMaybe<Scalars['String']['input']>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
};


export type GeinsMerchantApiQueryProductsArgs = {
  brandAlias?: InputMaybe<Scalars['String']['input']>;
  categoryAlias?: InputMaybe<Scalars['String']['input']>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  discountCampaignAlias?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FilterInputType>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};


export type GeinsMerchantApiQueryRelatedProductsArgs = {
  alias: Scalars['String']['input'];
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
};


export type GeinsMerchantApiQueryReviewsArgs = {
  alias?: InputMaybe<Scalars['String']['input']>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type GeinsMerchantApiQueryUrlHistoryArgs = {
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};


export type GeinsMerchantApiQueryValidateOrderCreationArgs = {
  cartId: Scalars['String']['input'];
  channelId?: InputMaybe<Scalars['String']['input']>;
  checkout: CheckoutInputType;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
};


export type GeinsMerchantApiQueryWidgetAreaArgs = {
  alias?: InputMaybe<Scalars['String']['input']>;
  areaName?: InputMaybe<Scalars['String']['input']>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  customerType?: InputMaybe<CustomerType>;
  displaySetting?: InputMaybe<Scalars['String']['input']>;
  family?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<Array<InputMaybe<PageWidgetCollectionFilterInputType>>>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export enum Gender {
  Man = 'MAN',
  Unspecified = 'UNSPECIFIED',
  Woman = 'WOMAN'
}

export type GoogleTaxonomyType = {
  __typename?: 'GoogleTaxonomyType';
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  parentId?: Maybe<Scalars['Int']['output']>;
  path?: Maybe<Scalars['String']['output']>;
};

export type GroupType = {
  __typename?: 'GroupType';
  description?: Maybe<Scalars['String']['output']>;
  groupId: Scalars['Int']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  options?: Maybe<Array<Maybe<OptionType>>>;
  required: Scalars['Boolean']['output'];
  sortOrder: Scalars['Int']['output'];
};

export type LanguageType = {
  __typename?: 'LanguageType';
  code: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type LowestPriceType = {
  __typename?: 'LowestPriceType';
  comparisonPriceExVat: Scalars['Decimal']['output'];
  comparisonPriceExVatFormatted?: Maybe<Scalars['String']['output']>;
  comparisonPriceIncVat: Scalars['Decimal']['output'];
  comparisonPriceIncVatFormatted?: Maybe<Scalars['String']['output']>;
  discountExVat: Scalars['Decimal']['output'];
  discountExVatFormatted?: Maybe<Scalars['String']['output']>;
  discountIncVat: Scalars['Decimal']['output'];
  discountIncVatFormatted?: Maybe<Scalars['String']['output']>;
  discountPercentage: Scalars['Int']['output'];
  isDiscounted: Scalars['Boolean']['output'];
  lowestPriceExVat: Scalars['Decimal']['output'];
  lowestPriceExVatFormatted?: Maybe<Scalars['String']['output']>;
  lowestPriceIncVat: Scalars['Decimal']['output'];
  lowestPriceIncVatFormatted?: Maybe<Scalars['String']['output']>;
  sellingPriceExVat: Scalars['Decimal']['output'];
  sellingPriceExVatFormatted?: Maybe<Scalars['String']['output']>;
  sellingPriceIncVat: Scalars['Decimal']['output'];
  sellingPriceIncVatFormatted?: Maybe<Scalars['String']['output']>;
  vat: Scalars['Decimal']['output'];
  vatFormatted?: Maybe<Scalars['String']['output']>;
};

export type MarketType = {
  __typename?: 'MarketType';
  alias?: Maybe<Scalars['String']['output']>;
  allowedLanguages?: Maybe<Array<Maybe<LanguageType>>>;
  country?: Maybe<CountryType>;
  currency?: Maybe<CurrencyType>;
  defaultLanguageId: Scalars['String']['output'];
  groupKey: Scalars['String']['output'];
  id: Scalars['String']['output'];
  onlyDisplayInCheckout?: Maybe<Scalars['Boolean']['output']>;
  virtual?: Maybe<Scalars['Boolean']['output']>;
};

export type MenuItemType = {
  __typename?: 'MenuItemType';
  canonicalUrl?: Maybe<Scalars['String']['output']>;
  children?: Maybe<Array<Maybe<MenuItemType>>>;
  hidden: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  label?: Maybe<Scalars['String']['output']>;
  open: Scalars['Boolean']['output'];
  order: Scalars['Int']['output'];
  targetBlank: Scalars['Boolean']['output'];
  title?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  value?: Maybe<Scalars['String']['output']>;
};

export type MenuType = {
  __typename?: 'MenuType';
  channels?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  id: Scalars['String']['output'];
  languages?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  locations?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  menuItems?: Maybe<Array<Maybe<MenuItemType>>>;
  name?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type MetadataType = {
  __typename?: 'MetadataType';
  description?: Maybe<Scalars['String']['output']>;
  keywords?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type OptionType = {
  __typename?: 'OptionType';
  isSelected: Scalars['Boolean']['output'];
  optionId: Scalars['Int']['output'];
  product?: Maybe<ProductType>;
  quantity: Scalars['Int']['output'];
  sortOrder: Scalars['Int']['output'];
};

export type OrderType = {
  __typename?: 'OrderType';
  billingAddress?: Maybe<AddressType>;
  cart?: Maybe<CartType>;
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  customerId?: Maybe<Scalars['Int']['output']>;
  desiredDeliveryDate?: Maybe<Scalars['DateTime']['output']>;
  discount?: Maybe<PriceType>;
  fromBalance: Scalars['Decimal']['output'];
  fromBalanceFormatted?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  orderTotal?: Maybe<PriceType>;
  paymentDetails?: Maybe<Array<Maybe<PaymentDetailsType>>>;
  paymentFee?: Maybe<PriceType>;
  publicId: Scalars['ID']['output'];
  refunds?: Maybe<Array<Maybe<RefundType>>>;
  shippingAddress?: Maybe<AddressType>;
  shippingDetails?: Maybe<Array<Maybe<ShippingDetailType>>>;
  shippingFee?: Maybe<PriceType>;
  status: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  vat?: Maybe<PriceType>;
};

export type PageAreaType = {
  __typename?: 'PageAreaType';
  id: Scalars['Int']['output'];
  index: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type PageInfoType = {
  __typename?: 'PageInfoType';
  alias: Scalars['String']['output'];
  /** @deprecated Use AlternativeUrls instead. */
  alternativeCanonicalUrls?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  alternativeUrls?: Maybe<Array<Maybe<AlternativeUrlType>>>;
  backgroundImage?: Maybe<Scalars['String']['output']>;
  canonicalUrl?: Maybe<Scalars['String']['output']>;
  hideDescription: Scalars['Boolean']['output'];
  hideTitle: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  logo?: Maybe<Scalars['String']['output']>;
  meta?: Maybe<MetadataType>;
  name: Scalars['String']['output'];
  primaryDescription?: Maybe<Scalars['String']['output']>;
  primaryImage?: Maybe<Scalars['String']['output']>;
  secondaryDescription?: Maybe<Scalars['String']['output']>;
  subCategories?: Maybe<Array<Maybe<CategoryType>>>;
};

export type PageWidgetCollectionFilterInputType = {
  key?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type PageWidgetCollectionType = {
  __typename?: 'PageWidgetCollectionType';
  containers?: Maybe<Array<Maybe<PageWidgetContainerType>>>;
  familyName?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  meta?: Maybe<MetadataType>;
  name: Scalars['String']['output'];
  pageArea?: Maybe<PageAreaType>;
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  title?: Maybe<Scalars['String']['output']>;
};

export type PageWidgetContainerType = {
  __typename?: 'PageWidgetContainerType';
  classNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  design: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  layout: Scalars['String']['output'];
  name: Scalars['String']['output'];
  responsiveMode: Scalars['String']['output'];
  sortOrder: Scalars['Int']['output'];
  widgets?: Maybe<Array<Maybe<PageWidgetType>>>;
};

export type PageWidgetImageSizeType = {
  __typename?: 'PageWidgetImageSizeType';
  imageHeight: Scalars['Int']['output'];
  imageRatio: Scalars['Float']['output'];
  imageWidth: Scalars['Int']['output'];
};

export type PageWidgetImageType = {
  __typename?: 'PageWidgetImageType';
  fileName: Scalars['String']['output'];
  largestSize?: Maybe<PageWidgetImageSizeType>;
  sizes?: Maybe<Array<Maybe<PageWidgetImageSizeType>>>;
};

export type PageWidgetPageType = {
  __typename?: 'PageWidgetPageType';
  activeFrom?: Maybe<Scalars['DateTime']['output']>;
  activeTo?: Maybe<Scalars['DateTime']['output']>;
  alias?: Maybe<Scalars['String']['output']>;
  canonicalUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  meta?: Maybe<MetadataType>;
  name: Scalars['String']['output'];
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  title?: Maybe<Scalars['String']['output']>;
};

export type PageWidgetType = {
  __typename?: 'PageWidgetType';
  classNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  configuration: Scalars['String']['output'];
  id: Scalars['String']['output'];
  images?: Maybe<Array<Maybe<PageWidgetImageType>>>;
  name: Scalars['String']['output'];
  size: Scalars['String']['output'];
  sortOrder: Scalars['Int']['output'];
  type: Scalars['String']['output'];
};

export type ParameterGroupType = {
  __typename?: 'ParameterGroupType';
  name: Scalars['String']['output'];
  parameterGroupId?: Maybe<Scalars['Int']['output']>;
  parameters?: Maybe<Array<Maybe<ParameterType>>>;
  productId: Scalars['Int']['output'];
};

export type ParameterType = {
  __typename?: 'ParameterType';
  description?: Maybe<Scalars['String']['output']>;
  facetId?: Maybe<Scalars['String']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  parameterGroupId: Scalars['Int']['output'];
  parameterId: Scalars['Int']['output'];
  show: Scalars['Boolean']['output'];
  showFilter: Scalars['Boolean']['output'];
  type?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type PaymentDetailsType = {
  __typename?: 'PaymentDetailsType';
  displayName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isPaid: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  paymentDate?: Maybe<Scalars['DateTime']['output']>;
  paymentFee: Scalars['Float']['output'];
  paymentId: Scalars['Int']['output'];
  paymentOption?: Maybe<Scalars['String']['output']>;
  reservationDate: Scalars['DateTime']['output'];
  reservationNumber?: Maybe<Scalars['String']['output']>;
  shippingFee: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
  transactionId: Scalars['String']['output'];
};

export type PaymentOptionType = {
  __typename?: 'PaymentOptionType';
  displayName?: Maybe<Scalars['String']['output']>;
  feeExVat: Scalars['Decimal']['output'];
  feeExVatFormatted?: Maybe<Scalars['String']['output']>;
  feeIncVat: Scalars['Decimal']['output'];
  feeIncVatFormatted?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  isDefault: Scalars['Boolean']['output'];
  isSelected: Scalars['Boolean']['output'];
  logo?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  newCheckoutSession: Scalars['Boolean']['output'];
  paymentData?: Maybe<Scalars['String']['output']>;
  paymentType?: Maybe<PaymentType>;
};

export enum PaymentType {
  Avarda = 'AVARDA',
  Klarna = 'KLARNA',
  Standard = 'STANDARD',
  Svea = 'SVEA',
  Walley = 'WALLEY'
}

export type PlaceOrderResponseType = {
  __typename?: 'PlaceOrderResponseType';
  orderId?: Maybe<Scalars['String']['output']>;
  redirectUrl?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type PriceFilterInputType = {
  highest?: InputMaybe<Scalars['Float']['input']>;
  lowest?: InputMaybe<Scalars['Float']['input']>;
};

export type PriceFilterType = {
  __typename?: 'PriceFilterType';
  highest: Scalars['Float']['output'];
  lowest: Scalars['Float']['output'];
};

export type PriceLogItemType = {
  __typename?: 'PriceLogItemType';
  date: Scalars['String']['output'];
  discountExVat: Scalars['Decimal']['output'];
  discountExVatFormatted?: Maybe<Scalars['String']['output']>;
  discountIncVat: Scalars['Decimal']['output'];
  discountIncVatFormatted?: Maybe<Scalars['String']['output']>;
  discountPercentage: Scalars['Int']['output'];
  isDiscounted: Scalars['Boolean']['output'];
  isLowest: Scalars['Boolean']['output'];
  regularPriceExVat: Scalars['Decimal']['output'];
  regularPriceExVatFormatted?: Maybe<Scalars['String']['output']>;
  regularPriceIncVat: Scalars['Decimal']['output'];
  regularPriceIncVatFormatted?: Maybe<Scalars['String']['output']>;
  sellingPriceExVat: Scalars['Decimal']['output'];
  sellingPriceExVatFormatted?: Maybe<Scalars['String']['output']>;
  sellingPriceIncVat: Scalars['Decimal']['output'];
  sellingPriceIncVatFormatted?: Maybe<Scalars['String']['output']>;
  vat: Scalars['Decimal']['output'];
  vatFormatted?: Maybe<Scalars['String']['output']>;
};

export type PriceType = {
  __typename?: 'PriceType';
  discountExVat: Scalars['Decimal']['output'];
  discountExVatFormatted?: Maybe<Scalars['String']['output']>;
  discountIncVat: Scalars['Decimal']['output'];
  discountIncVatFormatted?: Maybe<Scalars['String']['output']>;
  discountPercentage: Scalars['Int']['output'];
  isDiscounted: Scalars['Boolean']['output'];
  regularPriceExVat: Scalars['Decimal']['output'];
  regularPriceExVatFormatted?: Maybe<Scalars['String']['output']>;
  regularPriceIncVat: Scalars['Decimal']['output'];
  regularPriceIncVatFormatted?: Maybe<Scalars['String']['output']>;
  sellingPriceExVat: Scalars['Decimal']['output'];
  sellingPriceExVatFormatted?: Maybe<Scalars['String']['output']>;
  sellingPriceIncVat: Scalars['Decimal']['output'];
  sellingPriceIncVatFormatted?: Maybe<Scalars['String']['output']>;
  vat: Scalars['Decimal']['output'];
  vatFormatted?: Maybe<Scalars['String']['output']>;
};

export type ProductImageType = {
  __typename?: 'ProductImageType';
  fileName: Scalars['String']['output'];
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type ProductPackageCartItemType = {
  __typename?: 'ProductPackageCartItemType';
  groupId: Scalars['Int']['output'];
  optionId: Scalars['Int']['output'];
  packageId: Scalars['Int']['output'];
  packageName: Scalars['String']['output'];
};

export type ProductPackageSelectionType = {
  groupId: Scalars['Int']['input'];
  optionId: Scalars['Int']['input'];
  skuId: Scalars['Int']['input'];
};

export type ProductPackageType = {
  __typename?: 'ProductPackageType';
  groups?: Maybe<Array<Maybe<GroupType>>>;
};

export enum ProductRelation {
  Accessories = 'ACCESSORIES',
  Related = 'RELATED',
  Similar = 'SIMILAR'
}

export type ProductReviewResultType = {
  __typename?: 'ProductReviewResultType';
  averageRating: Scalars['Float']['output'];
  count: Scalars['Long']['output'];
  reviews?: Maybe<Array<Maybe<ProductReviewType>>>;
};

export type ProductReviewType = {
  __typename?: 'ProductReviewType';
  author: Scalars['String']['output'];
  comment: Scalars['String']['output'];
  rating: Scalars['Int']['output'];
  reviewDate: Scalars['DateTime']['output'];
};

export type ProductTextsType = {
  __typename?: 'ProductTextsType';
  text1?: Maybe<Scalars['String']['output']>;
  text2?: Maybe<Scalars['String']['output']>;
  text3?: Maybe<Scalars['String']['output']>;
};

export type ProductType = {
  __typename?: 'ProductType';
  alias: Scalars['String']['output'];
  /** @deprecated Use AlternativeUrls instead. */
  alternativeCanonicalUrls?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  alternativeUrls?: Maybe<Array<Maybe<AlternativeUrlType>>>;
  articleNumber?: Maybe<Scalars['String']['output']>;
  brand?: Maybe<BrandType>;
  breadcrumbs?: Maybe<Array<Maybe<BreadcrumbType>>>;
  canonicalUrl?: Maybe<Scalars['String']['output']>;
  categories?: Maybe<Array<Maybe<CategoryType>>>;
  categoryId: Scalars['Int']['output'];
  currentProductVariant?: Maybe<VariantType>;
  dimensions?: Maybe<DimensionsType>;
  discountCampaigns?: Maybe<Array<Maybe<CampaignRuleType>>>;
  discountType?: Maybe<DiscountType>;
  firstAvailableOn?: Maybe<Scalars['String']['output']>;
  freightClass?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use ProductType.ProductImages instead. */
  images?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  lowestPrice?: Maybe<LowestPriceType>;
  meta?: Maybe<MetadataType>;
  name?: Maybe<Scalars['String']['output']>;
  parameterGroups?: Maybe<Array<Maybe<ParameterGroupType>>>;
  priceLog?: Maybe<Array<Maybe<PriceLogItemType>>>;
  primaryCategory?: Maybe<CategoryType>;
  productId: Scalars['Int']['output'];
  productImages?: Maybe<Array<Maybe<ProductImageType>>>;
  productPackage?: Maybe<ProductPackageType>;
  rating?: Maybe<RatingType>;
  skus?: Maybe<Array<Maybe<SkuType>>>;
  supplierId: Scalars['Int']['output'];
  texts?: Maybe<ProductTextsType>;
  totalStock?: Maybe<StockType>;
  type?: Maybe<Scalars['String']['output']>;
  unitPrice?: Maybe<PriceType>;
  variantDimensions?: Maybe<Array<Maybe<VariantDimensionType>>>;
  variantGroup?: Maybe<VariantGroupType>;
  weight: Scalars['Int']['output'];
};

export type ProductsResultType = {
  __typename?: 'ProductsResultType';
  count: Scalars['Long']['output'];
  filters?: Maybe<FilterCollectionType>;
  products?: Maybe<Array<Maybe<ProductType>>>;
};

export type RatingType = {
  __typename?: 'RatingType';
  score: Scalars['Decimal']['output'];
  voteCount: Scalars['Int']['output'];
};

export type RefundType = {
  __typename?: 'RefundType';
  articleNumber?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  itemId: Scalars['Int']['output'];
  reason?: Maybe<Scalars['String']['output']>;
  reasonCode?: Maybe<Scalars['Int']['output']>;
  refundType?: Maybe<Scalars['String']['output']>;
  toBalance: Scalars['Boolean']['output'];
  total: Scalars['Float']['output'];
  vat: Scalars['Float']['output'];
};

export type RelatedProductType = {
  __typename?: 'RelatedProductType';
  alias: Scalars['String']['output'];
  brand?: Maybe<BrandType>;
  canonicalUrl?: Maybe<Scalars['String']['output']>;
  discountCampaigns?: Maybe<Array<Maybe<CampaignRuleType>>>;
  /** @deprecated Use RelatedProductType.ProductImages instead. */
  images?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  name?: Maybe<Scalars['String']['output']>;
  parameterGroups?: Maybe<Array<Maybe<ParameterGroupType>>>;
  primaryCategory?: Maybe<CategoryType>;
  primaryImage?: Maybe<Scalars['String']['output']>;
  productImages?: Maybe<Array<Maybe<ProductImageType>>>;
  /** @deprecated Use RelatedProductType.RelationType instead. */
  relation?: Maybe<ProductRelation>;
  relationType: Scalars['String']['output'];
  secondaryImage?: Maybe<Scalars['String']['output']>;
  skus?: Maybe<Array<Maybe<SkuType>>>;
  unitPrice?: Maybe<PriceType>;
};

export type ShippingDetailType = {
  __typename?: 'ShippingDetailType';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  parcelNumber?: Maybe<Scalars['String']['output']>;
  shippingDate?: Maybe<Scalars['DateTime']['output']>;
  shippingId: Scalars['Int']['output'];
  trackingLink?: Maybe<Scalars['String']['output']>;
};

export type ShippingOptionType = {
  __typename?: 'ShippingOptionType';
  amountLeftToFreeShipping: Scalars['Decimal']['output'];
  amountLeftToFreeShippingFormatted?: Maybe<Scalars['String']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  externalId?: Maybe<Scalars['String']['output']>;
  feeExVat: Scalars['Decimal']['output'];
  feeExVatFormatted?: Maybe<Scalars['String']['output']>;
  feeIncVat: Scalars['Decimal']['output'];
  feeIncVatFormatted?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  isDefault: Scalars['Boolean']['output'];
  isSelected: Scalars['Boolean']['output'];
  logo?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  shippingData?: Maybe<Scalars['String']['output']>;
  subOptions?: Maybe<Array<Maybe<ShippingOptionType>>>;
};

export type SkuType = {
  __typename?: 'SkuType';
  articleNumber: Scalars['String']['output'];
  dimensions?: Maybe<DimensionsType>;
  externalId?: Maybe<Scalars['String']['output']>;
  gtin?: Maybe<Scalars['String']['output']>;
  incoming?: Maybe<Scalars['DateTime']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  productId: Scalars['Int']['output'];
  shelf?: Maybe<Scalars['String']['output']>;
  skuId: Scalars['Int']['output'];
  stock?: Maybe<StockType>;
  weight: Scalars['Int']['output'];
};

export enum SortType {
  Alphabetical = 'ALPHABETICAL',
  AlphabeticalDesc = 'ALPHABETICAL_DESC',
  AvailableStock = 'AVAILABLE_STOCK',
  AvailableStockDesc = 'AVAILABLE_STOCK_DESC',
  Brand = 'BRAND',
  Custom_1 = 'CUSTOM_1',
  Custom_2 = 'CUSTOM_2',
  Custom_3 = 'CUSTOM_3',
  Custom_4 = 'CUSTOM_4',
  Custom_5 = 'CUSTOM_5',
  FacetOrder = 'FACET_ORDER',
  Latest = 'LATEST',
  MostSold = 'MOST_SOLD',
  None = 'NONE',
  Price = 'PRICE',
  PriceDesc = 'PRICE_DESC',
  Relevance = 'RELEVANCE',
  TotalStock = 'TOTAL_STOCK',
  TotalStockDesc = 'TOTAL_STOCK_DESC',
  Votes = 'VOTES'
}

export type StockType = {
  __typename?: 'StockType';
  inStock: Scalars['Int']['output'];
  /** @deprecated Use SkuType.Incoming or VariantType.Incoming instead */
  incoming?: Maybe<Scalars['DateTime']['output']>;
  oversellable: Scalars['Int']['output'];
  /** @deprecated Use SkuType.Shelf or VariantType.Shelf instead */
  shelf?: Maybe<Scalars['String']['output']>;
  static?: Maybe<Scalars['Int']['output']>;
  totalStock: Scalars['Int']['output'];
};

export type UrlHistoryType = {
  __typename?: 'UrlHistoryType';
  newUrl: Scalars['String']['output'];
  oldUrl: Scalars['String']['output'];
};

export type UserBalanceType = {
  __typename?: 'UserBalanceType';
  amount: Scalars['Decimal']['output'];
  amountFormatted?: Maybe<Scalars['String']['output']>;
  currency: Scalars['String']['output'];
};

export type UserInputType = {
  address?: InputMaybe<AddressInputType>;
  customerType?: InputMaybe<CustomerType>;
  gender?: InputMaybe<Gender>;
  metaData?: InputMaybe<Scalars['String']['input']>;
  newsletter?: InputMaybe<Scalars['Boolean']['input']>;
  personalId?: InputMaybe<Scalars['String']['input']>;
};

export type UserType = {
  __typename?: 'UserType';
  address?: Maybe<AddressType>;
  /** @deprecated Use Balances instead */
  balance: Scalars['Decimal']['output'];
  /** @deprecated Use Balances instead */
  balanceFormatted?: Maybe<Scalars['String']['output']>;
  balances?: Maybe<Array<Maybe<UserBalanceType>>>;
  customerType?: Maybe<CustomerType>;
  email: Scalars['String']['output'];
  gender?: Maybe<Gender>;
  id: Scalars['Int']['output'];
  memberId: Scalars['Int']['output'];
  memberType: Scalars['String']['output'];
  metaData?: Maybe<Scalars['String']['output']>;
  newsletter?: Maybe<Scalars['Boolean']['output']>;
  personalId?: Maybe<Scalars['String']['output']>;
};

export type ValidateOrderCreationResponseType = {
  __typename?: 'ValidateOrderCreationResponseType';
  isValid: Scalars['Boolean']['output'];
  memberType?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type VariantAttributeType = {
  __typename?: 'VariantAttributeType';
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type VariantDimensionType = {
  __typename?: 'VariantDimensionType';
  attributes?: Maybe<Array<Maybe<VariantAttributeType>>>;
  dimension: Scalars['String']['output'];
  group?: Maybe<Array<Maybe<VariantValueType>>>;
  label?: Maybe<Scalars['String']['output']>;
  level: Scalars['Int']['output'];
  type: Scalars['String']['output'];
  value?: Maybe<Scalars['String']['output']>;
};

export type VariantGroupType = {
  __typename?: 'VariantGroupType';
  activeProducts: Scalars['Int']['output'];
  collapseInLists: Scalars['Boolean']['output'];
  mainProductId: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  variantGroupId: Scalars['Int']['output'];
  variants?: Maybe<Array<Maybe<VariantType>>>;
};

export type VariantType = {
  __typename?: 'VariantType';
  alias?: Maybe<Scalars['String']['output']>;
  attributes?: Maybe<Array<Maybe<VariantAttributeType>>>;
  canonicalUrl?: Maybe<Scalars['String']['output']>;
  dimension: Scalars['String']['output'];
  incoming?: Maybe<Scalars['DateTime']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  level: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  primaryImage?: Maybe<Scalars['String']['output']>;
  productId: Scalars['Int']['output'];
  shelf?: Maybe<Scalars['String']['output']>;
  skuId?: Maybe<Scalars['Int']['output']>;
  stock?: Maybe<StockType>;
  type: Scalars['String']['output'];
  value?: Maybe<Scalars['String']['output']>;
  variants?: Maybe<Array<Maybe<VariantType>>>;
};

export type VariantValueType = {
  __typename?: 'VariantValueType';
  label: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type VatGroupType = {
  __typename?: 'VatGroupType';
  amount: Scalars['Decimal']['output'];
  rate: Scalars['Int']['output'];
};

export type CommitResetMutationVariables = Exact<{
  resetKey: Scalars['String']['input'];
  password: Scalars['String']['input'];
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CommitResetMutation = { __typename?: 'GeinsMerchantApiMutation', commitReset?: boolean | null };

export type RequestPasswordResetMutationVariables = Exact<{
  email: Scalars['String']['input'];
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}>;


export type RequestPasswordResetMutation = { __typename?: 'GeinsMerchantApiMutation', requestPasswordReset?: boolean | null };

export type AddressFragment = { __typename?: 'AddressType', firstName: string, lastName: string, company: string, mobile: string, phone: string, careOf: string, entryCode: string, addressLine1: string, addressLine2: string, addressLine3: string, zip: string, city: string, state: string, country: string };

export type UserBalanceFragment = { __typename?: 'UserBalanceType', currency: string, amount: any };

export type CampaignFragment = { __typename?: 'CampaignRuleType', name?: string | null, hideTitle?: boolean | null };

export type CartFragment = { __typename?: 'CartType', id?: string | null, promoCode?: string | null, appliedCampaigns?: Array<{ __typename?: 'CampaignRuleType', name?: string | null, hideTitle?: boolean | null } | null> | null, items?: Array<{ __typename?: 'CartItemType', quantity: number, skuId: number, campaign?: { __typename?: 'CampaignType', appliedCampaigns?: Array<{ __typename?: 'CampaignRuleType', name?: string | null, hideTitle?: boolean | null } | null> | null, prices?: Array<{ __typename?: 'CampaignPriceType', quantity: number, price?: { __typename?: 'PriceType', isDiscounted: boolean, sellingPriceIncVat: any, sellingPriceExVat: any, regularPriceIncVat: any, regularPriceExVat: any, vat: any, discountPercentage: number, regularPriceIncVatFormatted?: string | null, sellingPriceIncVatFormatted?: string | null, regularPriceExVatFormatted?: string | null, sellingPriceExVatFormatted?: string | null } | null } | null> | null } | null, unitPrice?: { __typename?: 'PriceType', isDiscounted: boolean, sellingPriceIncVat: any, sellingPriceExVat: any, regularPriceIncVat: any, regularPriceExVat: any, vat: any, discountPercentage: number, regularPriceIncVatFormatted?: string | null, sellingPriceIncVatFormatted?: string | null, regularPriceExVatFormatted?: string | null, sellingPriceExVatFormatted?: string | null } | null, product?: { __typename?: 'ProductType', productId: number, articleNumber?: string | null, name?: string | null, alias: string, canonicalUrl?: string | null, brand?: { __typename?: 'BrandType', name?: string | null } | null, productImages?: Array<{ __typename?: 'ProductImageType', fileName: string } | null> | null, primaryCategory?: { __typename?: 'CategoryType', name: string } | null, skus?: Array<{ __typename?: 'SkuType', skuId: number, name?: string | null, stock?: { __typename?: 'StockType', inStock: number, oversellable: number, totalStock: number, static?: number | null, incoming?: any | null } | null } | null> | null, unitPrice?: { __typename?: 'PriceType', isDiscounted: boolean, sellingPriceIncVat: any, sellingPriceExVat: any, regularPriceIncVat: any, regularPriceExVat: any, vat: any, discountPercentage: number, regularPriceIncVatFormatted?: string | null, sellingPriceIncVatFormatted?: string | null, regularPriceExVatFormatted?: string | null, sellingPriceExVatFormatted?: string | null } | null } | null, totalPrice?: { __typename?: 'PriceType', isDiscounted: boolean, sellingPriceIncVat: any, sellingPriceExVat: any, regularPriceIncVat: any, regularPriceExVat: any, vat: any, discountPercentage: number, regularPriceIncVatFormatted?: string | null, sellingPriceIncVatFormatted?: string | null, regularPriceExVatFormatted?: string | null, sellingPriceExVatFormatted?: string | null } | null } | null> | null, summary?: { __typename?: 'CartSummaryType', fixedAmountDiscountIncVat: any, fixedAmountDiscountExVat: any, balance?: { __typename?: 'BalanceType', pending: any, pendingFormatted?: string | null, totalSellingPriceExBalanceExVat: any, totalSellingPriceExBalanceIncVat: any, totalSellingPriceExBalanceIncVatFormatted?: string | null } | null, subTotal?: { __typename?: 'PriceType', regularPriceIncVatFormatted?: string | null, regularPriceExVatFormatted?: string | null, sellingPriceIncVatFormatted?: string | null, sellingPriceExVatFormatted?: string | null, sellingPriceExVat: any, sellingPriceIncVat: any, vat: any } | null, shipping?: { __typename?: 'ShippingOptionType', amountLeftToFreeShipping: any, amountLeftToFreeShippingFormatted?: string | null, feeExVatFormatted?: string | null, feeIncVatFormatted?: string | null, feeIncVat: any, feeExVat: any, isDefault: boolean } | null, total?: { __typename?: 'PriceType', isDiscounted: boolean, sellingPriceIncVatFormatted?: string | null, sellingPriceExVatFormatted?: string | null, sellingPriceIncVat: any, sellingPriceExVat: any, discountIncVatFormatted?: string | null, discountExVatFormatted?: string | null, discountExVat: any, discountIncVat: any, vatFormatted?: string | null, vat: any } | null } | null };

export type PriceFragment = { __typename?: 'PriceType', isDiscounted: boolean, sellingPriceIncVat: any, sellingPriceExVat: any, regularPriceIncVat: any, regularPriceExVat: any, vat: any, discountPercentage: number, regularPriceIncVatFormatted?: string | null, sellingPriceIncVatFormatted?: string | null, regularPriceExVatFormatted?: string | null, sellingPriceExVatFormatted?: string | null };

export type StockFragment = { __typename?: 'StockType', inStock: number, oversellable: number, totalStock: number, static?: number | null, incoming?: any | null };

export type UserFragment = { __typename?: 'UserType', id: number, email: string, customerType?: CustomerType | null, gender?: Gender | null, metaData?: string | null, entityId?: string | null, address?: { __typename?: 'AddressType', firstName: string, lastName: string, company: string, mobile: string, phone: string, careOf: string, entryCode: string, addressLine1: string, addressLine2: string, addressLine3: string, zip: string, city: string, state: string, country: string } | null, balances?: Array<{ __typename?: 'UserBalanceType', currency: string, amount: any } | null> | null };

export type GetUserOrderQueryVariables = Exact<{
  orderId: Scalars['Int']['input'];
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetUserOrderQuery = { __typename?: 'GeinsMerchantApiQuery', getOrder?: { __typename?: 'OrderType', id?: number | null, publicId: string } | null };

export type GetUserOrdersQueryVariables = Exact<{
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetUserOrdersQuery = { __typename?: 'GeinsMerchantApiQuery', getOrders?: Array<{ __typename?: 'OrderType', id?: number | null, publicId: string, createdAt?: any | null, updatedAt?: any | null, status: string, message?: string | null, billingAddress?: { __typename?: 'AddressType', firstName: string, lastName: string, company: string, mobile: string, phone: string, careOf: string, entryCode: string, addressLine1: string, addressLine2: string, addressLine3: string, zip: string, city: string, state: string, country: string } | null, shippingAddress?: { __typename?: 'AddressType', firstName: string, lastName: string, company: string, mobile: string, phone: string, careOf: string, entryCode: string, addressLine1: string, addressLine2: string, addressLine3: string, zip: string, city: string, state: string, country: string } | null, shippingDetails?: Array<{ __typename?: 'ShippingDetailType', name: string, trackingLink?: string | null } | null> | null, paymentDetails?: Array<{ __typename?: 'PaymentDetailsType', displayName: string } | null> | null, orderTotal?: { __typename?: 'PriceType', isDiscounted: boolean, sellingPriceIncVat: any, sellingPriceExVat: any, regularPriceIncVat: any, regularPriceExVat: any, vat: any, discountPercentage: number, regularPriceIncVatFormatted?: string | null, sellingPriceIncVatFormatted?: string | null, regularPriceExVatFormatted?: string | null, sellingPriceExVatFormatted?: string | null } | null, refunds?: Array<{ __typename?: 'RefundType', id: number, itemId: number, articleNumber?: string | null, createdAt: any, reason?: string | null, total: number, vat: number } | null> | null } | null> | null };

export type GetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQuery = { __typename?: 'GeinsMerchantApiQuery', getUser?: { __typename?: 'UserType', id: number, email: string, customerType?: CustomerType | null, gender?: Gender | null, metaData?: string | null, entityId?: string | null, address?: { __typename?: 'AddressType', firstName: string, lastName: string, company: string, mobile: string, phone: string, careOf: string, entryCode: string, addressLine1: string, addressLine2: string, addressLine3: string, zip: string, city: string, state: string, country: string } | null, balances?: Array<{ __typename?: 'UserBalanceType', currency: string, amount: any } | null> | null } | null };

export type CreateUserMutationVariables = Exact<{
  user: UserInputType;
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateUserMutation = { __typename?: 'GeinsMerchantApiMutation', updateUser?: { __typename?: 'UserType', email: string } | null };

export type UpdateUserMutationVariables = Exact<{
  user: UserInputType;
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateUserMutation = { __typename?: 'GeinsMerchantApiMutation', updateUser?: { __typename?: 'UserType', id: number, email: string, customerType?: CustomerType | null, gender?: Gender | null, metaData?: string | null, entityId?: string | null, address?: { __typename?: 'AddressType', firstName: string, lastName: string, company: string, mobile: string, phone: string, careOf: string, entryCode: string, addressLine1: string, addressLine2: string, addressLine3: string, zip: string, city: string, state: string, country: string } | null, balances?: Array<{ __typename?: 'UserBalanceType', currency: string, amount: any } | null> | null } | null };
