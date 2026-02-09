export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string | number; output: string | number; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /**
   * The `DateTime` scalar type represents a date and time. `DateTime` expects
   * timestamps to be formatted in accordance with the
   * [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard.
   */
  DateTime: { input: string; output: string; }
  Decimal: { input: number; output: number; }
  Guid: { input: string; output: string; }
  Long: { input: number; output: number; }
}

export interface GeinsAddressInputTypeType {
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
}

export interface GeinsAddressTypeType {
  /** The first line of the address. */
  addressLine1: Scalars['String']['output'];
  /** The second line of the address. */
  addressLine2: Scalars['String']['output'];
  /** The third line of the address. */
  addressLine3: Scalars['String']['output'];
  /** The care of (c/o) name for the address. */
  careOf: Scalars['String']['output'];
  /** The city of the address. */
  city: Scalars['String']['output'];
  /** The company name associated with the address. */
  company: Scalars['String']['output'];
  /** The country of the address. Can be either a valid english country name or ISO code */
  country: Scalars['String']['output'];
  /** The entry code for the address. */
  entryCode: Scalars['String']['output'];
  /** The first name of the address holder. */
  firstName: Scalars['String']['output'];
  /** The last name of the address holder. */
  lastName: Scalars['String']['output'];
  /** The mobile phone number associated with the address. */
  mobile: Scalars['String']['output'];
  /** The phone number associated with the address. */
  phone: Scalars['String']['output'];
  /** The state of the address. */
  state: Scalars['String']['output'];
  /** The zip code of the address. */
  zip: Scalars['String']['output'];
}

/** Type containing information about alternative urls to an entity */
export interface GeinsAlternativeUrlTypeType {
  /** The id of the channel that the alternative url exists on */
  channelId: Scalars['String']['output'];
  /** The country code of the alternative url */
  country?: Maybe<Scalars['String']['output']>;
  /** The culture of the alternative url */
  culture: Scalars['String']['output'];
  /** The language code of the alternative url */
  language: Scalars['String']['output'];
  /** Alternative url */
  url: Scalars['String']['output'];
}

/** Type containing account balance information */
export interface GeinsBalanceTypeType {
  /** The amount that will be used for this order */
  pending: Scalars['Decimal']['output'];
  /** Pending balance, formatted as a currency string */
  pendingFormatted?: Maybe<Scalars['String']['output']>;
  /** The remaining account balance */
  remaining: Scalars['Decimal']['output'];
  /** Remaining account balance, formatted as a currency string */
  remainingFormatted?: Maybe<Scalars['String']['output']>;
  /** The cart total selling price excl. VAT if balance hadn't been withdrawn. */
  totalSellingPriceExBalanceExVat: Scalars['Decimal']['output'];
  /** Cart total excl. VAT, excl. balance, formatted as a currency string */
  totalSellingPriceExBalanceExVatFormatted?: Maybe<Scalars['String']['output']>;
  /** The cart total selling price incl. VAT if balance hadn't been withdrawn . */
  totalSellingPriceExBalanceIncVat: Scalars['Decimal']['output'];
  /** Cart total incl. VAT, excl. balance, formatted as a currency string */
  totalSellingPriceExBalanceIncVatFormatted?: Maybe<Scalars['String']['output']>;
}

/** Type containing brand listing information */
export interface GeinsBrandListTypeType {
  /** Brand alias */
  alias?: Maybe<Scalars['String']['output']>;
  /**
   * Alternative full paths to the brand
   * @deprecated Use AlternativeUrls instead.
   */
  alternativeCanonicalUrls?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Alternative urls to the brand */
  alternativeUrls?: Maybe<Array<Maybe<GeinsAlternativeUrlTypeType>>>;
  /** Background image */
  backgroundImage?: Maybe<Scalars['String']['output']>;
  /** Brand ID */
  brandId: Scalars['Int']['output'];
  /** The full path for this brand. e.g. '/l/brand-1' */
  canonicalUrl?: Maybe<Scalars['String']['output']>;
  /** Brand description */
  description?: Maybe<Scalars['String']['output']>;
  /** Brand logo */
  logo?: Maybe<Scalars['String']['output']>;
  /** Brand name */
  name?: Maybe<Scalars['String']['output']>;
  /** Primary image */
  primaryImage?: Maybe<Scalars['String']['output']>;
  /** Secondary description */
  secondaryDescription?: Maybe<Scalars['String']['output']>;
}

/** Type containing brand information */
export interface GeinsBrandTypeType {
  /** Brand alias */
  alias?: Maybe<Scalars['String']['output']>;
  /**
   * Alternative full paths to the brand
   * @deprecated Use AlternativeUrls instead.
   */
  alternativeCanonicalUrls?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Alternative urls to the brand */
  alternativeUrls?: Maybe<Array<Maybe<GeinsAlternativeUrlTypeType>>>;
  /** Brand ID */
  brandId: Scalars['Int']['output'];
  /** The full path for this brand. e.g. '/l/brand-1' */
  canonicalUrl?: Maybe<Scalars['String']['output']>;
  /** Brand description */
  description?: Maybe<Scalars['String']['output']>;
  /** Brand name */
  name?: Maybe<Scalars['String']['output']>;
}

/** Type containing breadcrumb information */
export interface GeinsBreadcrumbTypeType {
  /** Category ID */
  categoryId: Scalars['Int']['output'];
  /** Breadcrumb display name */
  name: Scalars['String']['output'];
  /** Parent category ID */
  parentCategoryId: Scalars['Int']['output'];
  /** Breadcrumb path */
  url?: Maybe<Scalars['String']['output']>;
}

/** Type containing campaign price information */
export interface GeinsCampaignPriceTypeType {
  /** Campaign price discount */
  discount: Scalars['Decimal']['output'];
  /** Campaign price discount percentage */
  discountPercentage: Scalars['Decimal']['output'];
  /** Campaign price */
  price?: Maybe<GeinsPriceTypeType>;
  /** Campaign price quantity */
  quantity: Scalars['Int']['output'];
}

/** Type containing campaign rule information */
export interface GeinsCampaignRuleTypeType {
  /** Campaign action */
  action?: Maybe<Scalars['String']['output']>;
  /** Campaign action value */
  actionValue?: Maybe<Scalars['String']['output']>;
  /** Campaign ID */
  campaignId: Scalars['String']['output'];
  /** The url to this campaign, if any */
  canonicalUrl?: Maybe<Scalars['String']['output']>;
  /** Campaign category */
  category?: Maybe<Scalars['String']['output']>;
  /** Whether to hide the campaign title */
  hideTitle?: Maybe<Scalars['Boolean']['output']>;
  /** Campaign name */
  name?: Maybe<Scalars['String']['output']>;
  /** Campaign rule type */
  ruleType?: Maybe<Scalars['String']['output']>;
}

/** Type containing campaign information */
export interface GeinsCampaignTypeType {
  /** Applied campaigns */
  appliedCampaigns?: Maybe<Array<Maybe<GeinsCampaignRuleTypeType>>>;
  /** Campaign prices */
  prices?: Maybe<Array<Maybe<GeinsCampaignPriceTypeType>>>;
}

/** Type containing information about cart fees */
export interface GeinsCartFeesTypeType {
  /** Payment fee excl. VAT */
  paymentFeeExVat: Scalars['Decimal']['output'];
  /** Payment fee incl. VAT */
  paymentFeeIncVat: Scalars['Decimal']['output'];
  /** Shipping fee excl. VAT */
  shippingFeeExVat: Scalars['Decimal']['output'];
  /** Shipping fee incl. VAT */
  shippingFeeIncVat: Scalars['Decimal']['output'];
}

export interface GeinsCartGroupInputTypeType {
  groupKey?: InputMaybe<Scalars['ID']['input']>;
  quantity: Scalars['Int']['input'];
}

export interface GeinsCartItemInputTypeType {
  groupKey?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  quantity: Scalars['Int']['input'];
  skuId?: InputMaybe<Scalars['Int']['input']>;
}

/** Type containing cart item information */
export interface GeinsCartItemTypeType {
  /** Campaign */
  campaign?: Maybe<GeinsCampaignTypeType>;
  /** The key of the group that this cart item belong to */
  groupKey?: Maybe<Scalars['ID']['output']>;
  /** Cart item Id */
  id: Scalars['ID']['output'];
  /** Indicates if the cart item is a free gift from a campaign */
  isCampaignFreeGift: Scalars['Boolean']['output'];
  /** Custom message */
  message?: Maybe<Scalars['String']['output']>;
  /** Product */
  product?: Maybe<GeinsProductTypeType>;
  /** Contains package meta data if the cart item was part of package */
  productPackage?: Maybe<GeinsProductPackageCartItemTypeType>;
  /** Quantity */
  quantity: Scalars['Int']['output'];
  /** SKU Id */
  skuId: Scalars['Int']['output'];
  /** Total price */
  totalPrice?: Maybe<GeinsPriceTypeType>;
  /** Price per unit */
  unitPrice?: Maybe<GeinsPriceTypeType>;
}

/** Type containing cart summary information */
export interface GeinsCartSummaryTypeType {
  /** Account balance information */
  balance?: Maybe<GeinsBalanceTypeType>;
  /** Cart fee information */
  fees?: Maybe<GeinsCartFeesTypeType>;
  /** Cart fixed discount amount excl. VAT */
  fixedAmountDiscountExVat: Scalars['Decimal']['output'];
  /** Cart fixed discount amount incl. VAT */
  fixedAmountDiscountIncVat: Scalars['Decimal']['output'];
  /** Cart payment option information */
  payment?: Maybe<GeinsPaymentOptionTypeType>;
  /** Cart shipping option information */
  shipping?: Maybe<GeinsShippingOptionTypeType>;
  /** Cart sub-total */
  subTotal?: Maybe<GeinsPriceTypeType>;
  /** Cart total */
  total?: Maybe<GeinsPriceTypeType>;
  /** Cart VAT information */
  vats?: Maybe<Array<Maybe<GeinsVatGroupTypeType>>>;
}

/** Type containing cart information */
export interface GeinsCartTypeType {
  /** Campaigns applied to this cart */
  appliedCampaigns?: Maybe<Array<Maybe<GeinsCampaignRuleTypeType>>>;
  /** Cart fixed discount */
  fixedDiscount: Scalars['Decimal']['output'];
  /** Whether the cart has free shipping */
  freeShipping: Scalars['Boolean']['output'];
  /** The cart ID */
  id?: Maybe<Scalars['String']['output']>;
  /** If true, the cart can not be modified further */
  isCompleted: Scalars['Boolean']['output'];
  /** The cart items */
  items?: Maybe<Array<Maybe<GeinsCartItemTypeType>>>;
  /** Cart merchant data */
  merchantData?: Maybe<Scalars['String']['output']>;
  /** Cart promo code */
  promoCode?: Maybe<Scalars['String']['output']>;
  /** The cart summary */
  summary?: Maybe<GeinsCartSummaryTypeType>;
}

/** Type containing category information */
export interface GeinsCategoryTypeType {
  /** Category alias */
  alias?: Maybe<Scalars['String']['output']>;
  /**
   * Alternative full paths to the category
   * @deprecated Use AlternativeUrls instead.
   */
  alternativeCanonicalUrls?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Alternative urls to the category */
  alternativeUrls?: Maybe<Array<Maybe<GeinsAlternativeUrlTypeType>>>;
  /** Background image */
  backgroundImage?: Maybe<Scalars['String']['output']>;
  /** The full path to the category. e.g. '/l/category-1' */
  canonicalUrl: Scalars['String']['output'];
  /** Category ID */
  categoryId: Scalars['Int']['output'];
  /** Category description */
  description?: Maybe<Scalars['String']['output']>;
  /** Google taxonomy data for this category */
  googleTaxonomy?: Maybe<GeinsGoogleTaxonomyTypeType>;
  /** Category is hidden */
  isHidden?: Maybe<Scalars['Boolean']['output']>;
  /** Category name */
  name: Scalars['String']['output'];
  /** Category display order */
  order: Scalars['Int']['output'];
  /** Parent category ID */
  parentCategoryId: Scalars['Int']['output'];
  /** Primary image */
  primaryImage?: Maybe<Scalars['String']['output']>;
  /** Category secondary description */
  secondaryDescription?: Maybe<Scalars['String']['output']>;
}

/** Type containing all information about the channel-type */
export interface GeinsChannelTypeType {
  /** Default language ID used if no other is specified, or an invalid is supplied. */
  defaultLanguageId: Scalars['String']['output'];
  /** Default market ID used if no other is specified, or an invalid is supplied. */
  defaultMarketId: Scalars['String']['output'];
  /** ID */
  id: Scalars['String']['output'];
  languages?: Maybe<Array<Maybe<GeinsLanguageTypeType>>>;
  markets?: Maybe<Array<Maybe<GeinsMarketTypeType>>>;
  /** Name */
  name: Scalars['String']['output'];
  /** Type */
  type: Scalars['String']['output'];
  /** Base URL */
  url: Scalars['String']['output'];
}

export interface GeinsCheckoutAndOrderTypeType {
  /** HTML-snippet */
  htmlSnippet: Scalars['String']['output'];
  /** Order details */
  order?: Maybe<GeinsCheckoutOrderTypeType>;
}

export interface GeinsCheckoutDataTypeType {
  /** The order details represented as a cart object. */
  cart?: Maybe<GeinsCartTypeType>;
  /** Indicates if the purchase has been completed. This may not be available for all payment types */
  completed?: Maybe<Scalars['Boolean']['output']>;
  /** HTML-snippet */
  htmlSnippet?: Maybe<Scalars['String']['output']>;
  /** True if this is a new checkout session */
  newCheckoutSession: Scalars['Boolean']['output'];
  /** The total number of purchases that the customer has done including this one */
  nthPurchase: Scalars['Int']['output'];
  /** Order details */
  order?: Maybe<GeinsCheckoutOrderTypeType>;
}

export interface GeinsCheckoutInputTypeType {
  /** The consents accepted by the customer. */
  acceptedConsents?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** The billing address for the order. */
  billingAddress?: InputMaybe<GeinsAddressInputTypeType>;
  /**
   * The URLs for the checkout process. These are optional and if not supplied,
   * default values configured in the respective integration to the payment
   * provider will be used. Placeholders that can be used in the URLs:
   * {geins.cartid} - the cart id, {payment.uid} - the unique payment identifier
   * (external order id). Note that some payment providers do not support this and
   * others only accept https.
   */
  checkoutUrls?: InputMaybe<GeinsCheckoutUrlsInputTypeType>;
  /** The type of customer. */
  customerType?: InputMaybe<GeinsCustomerType>;
  /** The desired delivery date for the order. */
  desiredDeliveryDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The email address of the customer. */
  email?: InputMaybe<Scalars['String']['input']>;
  /** The external shipping fee for the order. */
  externalShippingFee?: InputMaybe<Scalars['Decimal']['input']>;
  /** The external ID of the shipping method. */
  externalShippingId?: InputMaybe<Scalars['String']['input']>;
  /** The identity number of the customer. */
  identityNumber?: InputMaybe<Scalars['String']['input']>;
  /** Additional data from the merchant. */
  merchantData?: InputMaybe<Scalars['String']['input']>;
  /** A message from the customer. */
  message?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the payment method. */
  paymentId?: InputMaybe<Scalars['Int']['input']>;
  /** The pickup point for the order. */
  pickupPoint?: InputMaybe<Scalars['String']['input']>;
  /** The shipping address for the order. */
  shippingAddress?: InputMaybe<GeinsAddressInputTypeType>;
  /** The ID of the shipping method. */
  shippingId?: InputMaybe<Scalars['Int']['input']>;
  /**
   * When set to true, the submitted ShippingId will be set on the order regardless
   * of it being available in the list of shipping options.
   */
  skipShippingValidation?: InputMaybe<Scalars['Boolean']['input']>;
}

export interface GeinsCheckoutOrderRowTypeType {
  /** Article number */
  articleNumber?: Maybe<Scalars['String']['output']>;
  /** Brand name */
  brand?: Maybe<Scalars['String']['output']>;
  /** Campaign IDs */
  campaignIds?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Campaign names */
  campaignNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Categories */
  categories?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Currency ISO code */
  currency?: Maybe<Scalars['String']['output']>;
  /** Discount excl. VAT */
  discountExVat: Scalars['Decimal']['output'];
  /** Discount incl. VAT */
  discountIncVat: Scalars['Decimal']['output'];
  /** Discount rate */
  discountRate: Scalars['Float']['output'];
  /** ExternalId */
  externalId?: Maybe<Scalars['String']['output']>;
  /** GTIN */
  gtin?: Maybe<Scalars['String']['output']>;
  /** Height */
  height: Scalars['Int']['output'];
  /** Product image URL */
  imageUrl?: Maybe<Scalars['String']['output']>;
  /** Length */
  length: Scalars['Int']['output'];
  /** Message */
  message?: Maybe<Scalars['String']['output']>;
  /** Name */
  name?: Maybe<Scalars['String']['output']>;
  /** Price excl. VAT */
  priceExVat: Scalars['Decimal']['output'];
  /** Price incl. VAT */
  priceIncVat: Scalars['Decimal']['output'];
  /** ProductId */
  productId: Scalars['Int']['output'];
  /** ProductPriceCampaignId */
  productPriceCampaignId?: Maybe<Scalars['Int']['output']>;
  /** Product price list ID */
  productPriceListId?: Maybe<Scalars['Int']['output']>;
  /** ProductUrl */
  productUrl?: Maybe<Scalars['String']['output']>;
  /** Quantity */
  quantity: Scalars['Int']['output'];
  /** SKU */
  sku?: Maybe<Scalars['String']['output']>;
  /** Variant */
  variant?: Maybe<Scalars['String']['output']>;
  /** Weight */
  weight: Scalars['Int']['output'];
  /** Width */
  width: Scalars['Int']['output'];
}

export interface GeinsCheckoutOrderTypeType {
  /**
   * Address Line 1
   * @deprecated Use Billing Address instead
   */
  address1?: Maybe<Scalars['String']['output']>;
  /**
   * Address Line 2
   * @deprecated Use Billing Address instead
   */
  address2?: Maybe<Scalars['String']['output']>;
  /** Amount used from Balance */
  balance: Scalars['Decimal']['output'];
  /** Billing address */
  billingAddress?: Maybe<GeinsAddressTypeType>;
  /** Campaign IDs */
  campaignIds?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Campaign names */
  campaignNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /**
   * City
   * @deprecated Use Billing Address instead
   */
  city?: Maybe<Scalars['String']['output']>;
  /**
   * Company
   * @deprecated Use Billing Address instead
   */
  company?: Maybe<Scalars['String']['output']>;
  /**
   * Country
   * @deprecated Use Billing Address instead
   */
  country?: Maybe<Scalars['String']['output']>;
  /** Currency */
  currency?: Maybe<Scalars['String']['output']>;
  /** CustomerGroup ID */
  customerGroupId: Scalars['Int']['output'];
  /** Customer ID */
  customerId: Scalars['Int']['output'];
  /** Customer Type ID */
  customerTypeId: Scalars['Int']['output'];
  /** Desired Delivery Date */
  desiredDeliveryDate?: Maybe<Scalars['DateTime']['output']>;
  /** Discount excl. VAT */
  discountExVat: Scalars['Decimal']['output'];
  /** Discount incl. VAT */
  discountIncVat: Scalars['Decimal']['output'];
  /**
   * E-mail
   * @deprecated Use Billing Address instead
   */
  email?: Maybe<Scalars['String']['output']>;
  /** External Order ID */
  externalOrderId?: Maybe<Scalars['String']['output']>;
  /**
   * First name
   * @deprecated Use Billing Address instead
   */
  firstName?: Maybe<Scalars['String']['output']>;
  /** Gender */
  gender: GeinsGenderType;
  /** IP Address */
  ipAddress?: Maybe<Scalars['String']['output']>;
  /** Represents the total sum of the prices for all order rows, excluding VAT */
  itemValueExVat: Scalars['Decimal']['output'];
  /** Represents the total sum of the prices for all order rows */
  itemValueIncVat: Scalars['Decimal']['output'];
  /** Locale */
  languageId?: Maybe<Scalars['String']['output']>;
  /**
   * Last name
   * @deprecated Use Billing Address instead
   */
  lastName?: Maybe<Scalars['String']['output']>;
  /** Market ID. */
  marketId: Scalars['String']['output'];
  /** Order message */
  message?: Maybe<Scalars['String']['output']>;
  /** Meta Data */
  metaData?: Maybe<Scalars['String']['output']>;
  /** Order ID */
  orderId?: Maybe<Scalars['String']['output']>;
  /** Order value excluding VAT (item value + fees - balance) */
  orderValueExVat: Scalars['Decimal']['output'];
  /** Order value including VAT (item value + fees - balance) */
  orderValueIncVat: Scalars['Decimal']['output'];
  /** Organization Number */
  organizationNumber?: Maybe<Scalars['String']['output']>;
  /** Payment fee excl. VAT */
  paymentFeeExVat: Scalars['Decimal']['output'];
  /** Payment fee incl. VAT */
  paymentFeeIncVat: Scalars['Decimal']['output'];
  /** Payment ID */
  paymentId: Scalars['Int']['output'];
  /** Personal ID */
  personalId?: Maybe<Scalars['String']['output']>;
  /**
   * Phone number
   * @deprecated Use Billing Address instead
   */
  phone?: Maybe<Scalars['String']['output']>;
  /** Pickup Point */
  pickupPoint?: Maybe<Scalars['String']['output']>;
  /** Promo Code */
  promoCode?: Maybe<Scalars['String']['output']>;
  /** Order rows */
  rows?: Maybe<Array<Maybe<GeinsCheckoutOrderRowTypeType>>>;
  /**
   * Secondary transaction ID
   * @deprecated Not used any more
   */
  secondaryTransactionId?: Maybe<Scalars['String']['output']>;
  /** Shipping address */
  shippingAddress?: Maybe<GeinsAddressTypeType>;
  /** Shipping fee excl. VAT */
  shippingFeeExVat: Scalars['Decimal']['output'];
  /** Shipping fee incl. VAT */
  shippingFeeIncVat: Scalars['Decimal']['output'];
  /** Shipping ID */
  shippingId: Scalars['Int']['output'];
  /** Order Status */
  status?: Maybe<Scalars['String']['output']>;
  /** Order sum. Amount to pay. */
  sum: Scalars['Decimal']['output'];
  /** Payment Provider Transaction ID */
  transactionId?: Maybe<Scalars['String']['output']>;
  /** User Agent */
  userAgent?: Maybe<Scalars['String']['output']>;
  /**
   * Zip code
   * @deprecated Use Billing Address instead
   */
  zip?: Maybe<Scalars['String']['output']>;
}

export enum GeinsCheckoutStatus {
  CustomerBlacklistedType = 'CUSTOMER_BLACKLISTED',
  OkType = 'OK'
}

export interface GeinsCheckoutTypeType {
  billingAddress?: Maybe<GeinsAddressTypeType>;
  cart?: Maybe<GeinsCartTypeType>;
  checkoutStatus?: Maybe<GeinsCheckoutStatus>;
  /** @deprecated The consent module is not supported any more. */
  consents?: Maybe<Array<Maybe<GeinsConsentTypeType>>>;
  email?: Maybe<Scalars['String']['output']>;
  identityNumber?: Maybe<Scalars['String']['output']>;
  paymentOptions?: Maybe<Array<Maybe<GeinsPaymentOptionTypeType>>>;
  shippingAddress?: Maybe<GeinsAddressTypeType>;
  shippingData?: Maybe<Scalars['String']['output']>;
  shippingOptions?: Maybe<Array<Maybe<GeinsShippingOptionTypeType>>>;
}

export interface GeinsCheckoutUrlsInputTypeType {
  /** The absolute URL to the Checkout page. */
  checkoutPageUrl?: InputMaybe<Scalars['String']['input']>;
  /** The absolute redirect URL. This is usually the URL to which the payment provider redirects after a successful payment. */
  redirectUrl?: InputMaybe<Scalars['String']['input']>;
  /** The absolute URL to the Terms page. */
  termsPageUrl?: InputMaybe<Scalars['String']['input']>;
}

export interface GeinsConsentTypeType {
  autoAccept: Scalars['Boolean']['output'];
  checked: Scalars['Boolean']['output'];
  description: Scalars['String']['output'];
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
}

/** Type containing all information about the country-type */
export interface GeinsCountryTypeType {
  /** Two-letter ISO code */
  code: Scalars['String']['output'];
  /** Name */
  name: Scalars['String']['output'];
}

/** Type containing all information about the currency-type */
export interface GeinsCurrencyTypeType {
  /** Currency code */
  code: Scalars['String']['output'];
  /** Name */
  name: Scalars['String']['output'];
  /** Currency rate used to convert from this currency to default currency */
  rate: Scalars['Decimal']['output'];
  /** Currency symbol */
  symbol: Scalars['String']['output'];
}

/** Customer type */
export enum GeinsCustomerType {
  /** Organization */
  OrganizationType = 'ORGANIZATION',
  /** Private person */
  PersonType = 'PERSON'
}

/** SKU dimensions */
export interface GeinsDimensionsTypeType {
  /** Height */
  height: Scalars['Int']['output'];
  /** Length */
  length: Scalars['Int']['output'];
  /** Width */
  width: Scalars['Int']['output'];
}

export enum GeinsDiscountType {
  ExternalType = 'EXTERNAL',
  NoneType = 'NONE',
  PriceCampaignType = 'PRICE_CAMPAIGN',
  SalePriceType = 'SALE_PRICE'
}

/** Type containing collection of filters */
export interface GeinsFilterCollectionTypeType {
  /** The collection of facet values returned from the query */
  facets?: Maybe<Array<Maybe<GeinsFilterTypeType>>>;
  /** The lowest / highest price found in the results */
  price?: Maybe<GeinsPriceFilterTypeType>;
}

/** Filter options */
export interface GeinsFilterInputTypeType {
  /**
   * A list of article numbers to filter on. The maximum number of values is 600.
   * If Product IDs filter is present, it takes priority and the article number
   * filter will not be applied. When the article number filter is set, no other
   * filters will be applied. The result is sorted in the exact same way as the
   * input list regardless of what sort method has been set.
   */
  articleNumbers?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** A list of brand IDs to filter on. When set, all matching brands will be added to the include filter. */
  brandIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** A list of category IDs to filter on. When set, all matching categories will be added to the include filter. */
  categoryIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** A list of discount campaign IDs to filter on. When set, all matching campaigns will be added to the include filter. */
  discountCampaignIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** A list of string values, that when specified will exclude products that are associated with one of those values */
  exclude?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** A list of brand IDs to filter on. When set, all matching brands will be added to the exclude filter. */
  excludeBrandIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** A list of category IDs to filter on. When set, all matching categories will be added to the exclude filter. */
  excludeCategoryIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** A list of discount campaign IDs to filter on. When set, all matching campaigns will be added to the exclude filter. */
  excludeDiscountCampaignIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** A list of string values, that when specified will exclude products that are associated with one of the facets */
  excludeFacets?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** A list of string values, that when specified will only include products associated with those values */
  facets?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Filter mode */
  filterMode?: InputMaybe<GeinsFilterMode>;
  /** A list of string values, that when specified will only include products associated with those values */
  include?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Include collapsed products */
  includeCollapsed?: InputMaybe<Scalars['Boolean']['input']>;
  /** A value to control how values in the Include-field are combined logically. */
  includeMode?: InputMaybe<GeinsIncludeMode>;
  /** Price filter */
  price?: InputMaybe<GeinsPriceFilterInputTypeType>;
  /** Limits products to only those found in the price list with the specified identifier. */
  priceListIdentifier?: InputMaybe<Scalars['String']['input']>;
  /**
   * A list of product IDs to filter on. The maximum number of values is 600. When
   * the product IDs filter is set, no other filters will be applied. The result is
   * sorted in the exact same way as the input list regardless of what sort method has been set.
   */
  productIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** Search text to filter by */
  searchText?: InputMaybe<Scalars['String']['input']>;
  /** Use this to sort the results in a particular way */
  sort?: InputMaybe<GeinsSortType>;
}

/** Filter mode */
export enum GeinsFilterMode {
  /** Get the counts for the results, including the ones excluded by the groups */
  ByGroupType = 'BY_GROUP',
  /** Get the counts for the current filter results */
  CurrentType = 'CURRENT'
}

/** Filter group */
export interface GeinsFilterTypeType {
  /** ID for this filter type */
  filterId: Scalars['String']['output'];
  /** Parameter group name */
  group?: Maybe<Scalars['String']['output']>;
  /** Parameter group display name */
  label?: Maybe<Scalars['String']['output']>;
  /** The display order of this filter group. Only supported for type Parameter */
  order: Scalars['Int']['output'];
  /** Filter type. e.g. 'Parameter', 'Category', 'Sku' */
  type?: Maybe<Scalars['String']['output']>;
  /** Collection of facet values in this group */
  values?: Maybe<Array<Maybe<GeinsFilterValueTypeType>>>;
}

/** Filter value */
export interface GeinsFilterValueTypeType {
  /** FacetId_Count */
  _id: Scalars['String']['output'];
  /** The amount of products in the results associated with this facet */
  count: Scalars['Long']['output'];
  /** Facet ID. Use this in the Facets-list in the products-query to retrieve products associated with it */
  facetId?: Maybe<Scalars['String']['output']>;
  /** If the filter for this facet is hidden */
  hidden: Scalars['Boolean']['output'];
  /** Facet display name */
  label?: Maybe<Scalars['String']['output']>;
  /** The display order of this facet */
  order: Scalars['Int']['output'];
  /** Parent ID. Only available for category-facets.0 */
  parentId?: Maybe<Scalars['String']['output']>;
  /** The path associated with this facet. e.g. '/c/category-1' */
  url?: Maybe<Scalars['String']['output']>;
}

export interface GeinsGeinsMerchantApiMutationType {
  addPackageToCart?: Maybe<GeinsCartTypeType>;
  addToCart?: Maybe<GeinsCartTypeType>;
  /** Clears all items in the cart */
  clearCart?: Maybe<GeinsCartTypeType>;
  /** Clones the cart */
  cloneCart?: Maybe<GeinsCartTypeType>;
  commitReset?: Maybe<Scalars['Boolean']['output']>;
  /** Marks the cart as completed, and makes it read-only */
  completeCart?: Maybe<GeinsCartTypeType>;
  createOrUpdateCheckout?: Maybe<GeinsCheckoutTypeType>;
  deleteUser?: Maybe<Scalars['Boolean']['output']>;
  monitorProductAvailability?: Maybe<Scalars['Boolean']['output']>;
  placeOrder?: Maybe<GeinsPlaceOrderResponseTypeType>;
  postProductReview?: Maybe<Scalars['Boolean']['output']>;
  requestPasswordReset?: Maybe<Scalars['Boolean']['output']>;
  /** Set custom merchant data on the cart */
  setCartMerchantData?: Maybe<GeinsCartTypeType>;
  /** Set a promo code on the cart */
  setCartPromoCode?: Maybe<GeinsCartTypeType>;
  setCartShippingFee?: Maybe<GeinsCheckoutTypeType>;
  subscribeToNewsletter?: Maybe<Scalars['Boolean']['output']>;
  /** Update the quantity of an entire cart group */
  updateCartGroup?: Maybe<GeinsCartTypeType>;
  /** Update the cart item */
  updateCartItem?: Maybe<GeinsCartTypeType>;
  updateUser?: Maybe<GeinsUserTypeType>;
}


export interface GeinsGeinsMerchantApiMutationAddPackageToCartArgsType {
  allowExternalShippingFee?: InputMaybe<Scalars['Boolean']['input']>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  packageId: Scalars['Int']['input'];
  selections?: InputMaybe<Array<InputMaybe<GeinsProductPackageSelectionTypeType>>>;
}


export interface GeinsGeinsMerchantApiMutationAddToCartArgsType {
  allowExternalShippingFee?: InputMaybe<Scalars['Boolean']['input']>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  item: GeinsCartItemInputTypeType;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}


export interface GeinsGeinsMerchantApiMutationClearCartArgsType {
  channelId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}


export interface GeinsGeinsMerchantApiMutationCloneCartArgsType {
  channelId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  resetPromotions?: InputMaybe<Scalars['Boolean']['input']>;
}


export interface GeinsGeinsMerchantApiMutationCommitResetArgsType {
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  resetKey: Scalars['String']['input'];
}


export interface GeinsGeinsMerchantApiMutationCompleteCartArgsType {
  channelId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}


export interface GeinsGeinsMerchantApiMutationCreateOrUpdateCheckoutArgsType {
  cartId: Scalars['String']['input'];
  channelId?: InputMaybe<Scalars['String']['input']>;
  checkout?: InputMaybe<GeinsCheckoutInputTypeType>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}


export interface GeinsGeinsMerchantApiMutationDeleteUserArgsType {
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}


export interface GeinsGeinsMerchantApiMutationMonitorProductAvailabilityArgsType {
  channelId?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  skuId: Scalars['Int']['input'];
}


export interface GeinsGeinsMerchantApiMutationPlaceOrderArgsType {
  cartId: Scalars['String']['input'];
  channelId?: InputMaybe<Scalars['String']['input']>;
  checkout: GeinsCheckoutInputTypeType;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}


export interface GeinsGeinsMerchantApiMutationPostProductReviewArgsType {
  alias: Scalars['String']['input'];
  author: Scalars['String']['input'];
  channelId?: InputMaybe<Scalars['String']['input']>;
  comment?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  rating?: InputMaybe<Scalars['Int']['input']>;
}


export interface GeinsGeinsMerchantApiMutationRequestPasswordResetArgsType {
  channelId?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}


export interface GeinsGeinsMerchantApiMutationSetCartMerchantDataArgsType {
  channelId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  merchantData: Scalars['String']['input'];
}


export interface GeinsGeinsMerchantApiMutationSetCartPromoCodeArgsType {
  channelId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  promoCode: Scalars['String']['input'];
}


export interface GeinsGeinsMerchantApiMutationSetCartShippingFeeArgsType {
  cartId: Scalars['String']['input'];
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  shippingFee: Scalars['Decimal']['input'];
}


export interface GeinsGeinsMerchantApiMutationSubscribeToNewsletterArgsType {
  channelId?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
}


export interface GeinsGeinsMerchantApiMutationUpdateCartGroupArgsType {
  allowExternalShippingFee?: InputMaybe<Scalars['Boolean']['input']>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  item: GeinsCartGroupInputTypeType;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}


export interface GeinsGeinsMerchantApiMutationUpdateCartItemArgsType {
  allowExternalShippingFee?: InputMaybe<Scalars['Boolean']['input']>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  item: GeinsCartItemInputTypeType;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}


export interface GeinsGeinsMerchantApiMutationUpdateUserArgsType {
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  user: GeinsUserInputTypeType;
}

export interface GeinsGeinsMerchantApiQueryType {
  /** Get all brands. */
  brands?: Maybe<Array<Maybe<GeinsBrandListTypeType>>>;
  /** Get all categories. */
  categories?: Maybe<Array<Maybe<GeinsCategoryTypeType>>>;
  /** Gets a category with the specified ID. Use either alias or categoryId. If both are provided, categoryId will be used. */
  category?: Maybe<GeinsCategoryTypeType>;
  /** Gets a channel with the specified ID. */
  channel?: Maybe<GeinsChannelTypeType>;
  /** Gets all available channels. */
  channels?: Maybe<Array<Maybe<GeinsChannelTypeType>>>;
  /**
   * Gets checkout data with a html snippet, checkout order data for the specified
   * order and the User. If the order was recently completed, the html snippet will
   * contain the "Thank you"-content.
   */
  checkout?: Maybe<GeinsCheckoutDataTypeType>;
  /** Gets all CMS pages. */
  cmsPages?: Maybe<Array<Maybe<GeinsPageWidgetPageTypeType>>>;
  /** Get the cart */
  getCart?: Maybe<GeinsCartTypeType>;
  /**
   * Gets html snippet for the specified external order. If the order was recently
   * completed, the html snippet will contain the "Thank you"-content.
   * @deprecated Use Checkout instead
   */
  getCheckout?: Maybe<Scalars['String']['output']>;
  /**
   * Gets html snippet and checkout order data for the specified external order. If
   * the order was recently completed, the html snippet will contain the "Thank you"-content.
   * @deprecated Use Checkout instead
   */
  getCheckoutAndOrder?: Maybe<GeinsCheckoutAndOrderTypeType>;
  /** Get a menu */
  getMenuAtLocation?: Maybe<GeinsMenuTypeType>;
  /** Get a specific order with details */
  getOrder?: Maybe<GeinsOrderTypeType>;
  /** Get a specific order with details via public id */
  getOrderPublic?: Maybe<GeinsOrderTypeType>;
  /** Get orders for the current user */
  getOrders?: Maybe<Array<Maybe<GeinsOrderTypeType>>>;
  /** Get the current user */
  getUser?: Maybe<GeinsUserTypeType>;
  /** Gets information about the specified list page. */
  listPageInfo?: Maybe<GeinsPageInfoTypeType>;
  /** Gets a product with the specified ID. Use either alias or productId. If both are provided, productId will be used. */
  product?: Maybe<GeinsProductTypeType>;
  /** Gets all products according to the values provided. */
  products?: Maybe<GeinsProductsResultTypeType>;
  /** Gets related products for the specified alias. */
  relatedProducts?: Maybe<Array<Maybe<GeinsRelatedProductTypeType>>>;
  /** Gets all products reviews to the values provided. */
  reviews?: Maybe<GeinsProductReviewResultTypeType>;
  /** Gets an alternate url for a given url. */
  urlHistory?: Maybe<GeinsUrlHistoryTypeType>;
  /**
   * Validates the conditions required for placing an order, including product
   * stock availability, customer balance, payment method selection, shipping
   * method selection, and customer eligibility to complete the purchase.
   */
  validateOrderConditions?: Maybe<GeinsValidateOrderConditionsResponseTypeType>;
  /** @deprecated Use ValidateOrderConditions instead */
  validateOrderCreation?: Maybe<GeinsValidateOrderCreationResponseTypeType>;
  /** Gets the page area and widgets from the specifed family. */
  widgetArea?: Maybe<GeinsPageWidgetCollectionTypeType>;
}


export interface GeinsGeinsMerchantApiQueryBrandsArgsType {
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}


export interface GeinsGeinsMerchantApiQueryCategoriesArgsType {
  channelId?: InputMaybe<Scalars['String']['input']>;
  includeHidden?: InputMaybe<Scalars['Boolean']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  parentCategoryId?: InputMaybe<Scalars['Int']['input']>;
}


export interface GeinsGeinsMerchantApiQueryCategoryArgsType {
  alias?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}


export interface GeinsGeinsMerchantApiQueryChannelArgsType {
  channelId?: InputMaybe<Scalars['String']['input']>;
}


export interface GeinsGeinsMerchantApiQueryCheckoutArgsType {
  cartId?: InputMaybe<Scalars['String']['input']>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  paymentType: GeinsPaymentType;
}


export interface GeinsGeinsMerchantApiQueryCmsPagesArgsType {
  channelId?: InputMaybe<Scalars['String']['input']>;
  excludeTags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  includeTags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}


export interface GeinsGeinsMerchantApiQueryGetCartArgsType {
  allowExternalShippingFee?: InputMaybe<Scalars['Boolean']['input']>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  forceRefresh?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  includeCompleted?: InputMaybe<Scalars['Boolean']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}


export interface GeinsGeinsMerchantApiQueryGetCheckoutArgsType {
  channelId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  paymentType: GeinsPaymentType;
}


export interface GeinsGeinsMerchantApiQueryGetCheckoutAndOrderArgsType {
  channelId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  paymentType: GeinsPaymentType;
}


export interface GeinsGeinsMerchantApiQueryGetMenuAtLocationArgsType {
  channelId?: InputMaybe<Scalars['String']['input']>;
  customerGroupId?: InputMaybe<Scalars['Int']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  menuLocationId?: InputMaybe<Scalars['String']['input']>;
}


export interface GeinsGeinsMerchantApiQueryGetOrderArgsType {
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  orderId: Scalars['Int']['input'];
}


export interface GeinsGeinsMerchantApiQueryGetOrderPublicArgsType {
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  publicOrderId: Scalars['Guid']['input'];
}


export interface GeinsGeinsMerchantApiQueryGetOrdersArgsType {
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}


export interface GeinsGeinsMerchantApiQueryGetUserArgsType {
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}


export interface GeinsGeinsMerchantApiQueryListPageInfoArgsType {
  alias?: InputMaybe<Scalars['String']['input']>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
}


export interface GeinsGeinsMerchantApiQueryProductArgsType {
  alias?: InputMaybe<Scalars['String']['input']>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  productId?: InputMaybe<Scalars['Int']['input']>;
}


export interface GeinsGeinsMerchantApiQueryProductsArgsType {
  brandAlias?: InputMaybe<Scalars['String']['input']>;
  categoryAlias?: InputMaybe<Scalars['String']['input']>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  discountCampaignAlias?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<GeinsFilterInputTypeType>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
}


export interface GeinsGeinsMerchantApiQueryRelatedProductsArgsType {
  alias: Scalars['String']['input'];
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}


export interface GeinsGeinsMerchantApiQueryReviewsArgsType {
  alias?: InputMaybe<Scalars['String']['input']>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
}


export interface GeinsGeinsMerchantApiQueryUrlHistoryArgsType {
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
}


export interface GeinsGeinsMerchantApiQueryValidateOrderConditionsArgsType {
  cartId: Scalars['String']['input'];
  channelId?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}


export interface GeinsGeinsMerchantApiQueryValidateOrderCreationArgsType {
  cartId: Scalars['String']['input'];
  channelId?: InputMaybe<Scalars['String']['input']>;
  checkout: GeinsCheckoutInputTypeType;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}


export interface GeinsGeinsMerchantApiQueryWidgetAreaArgsType {
  alias?: InputMaybe<Scalars['String']['input']>;
  areaName?: InputMaybe<Scalars['String']['input']>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  customerType?: InputMaybe<GeinsCustomerType>;
  displaySetting?: InputMaybe<Scalars['String']['input']>;
  family?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<Array<InputMaybe<GeinsPageWidgetCollectionFilterInputTypeType>>>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
}

export enum GeinsGender {
  ManType = 'MAN',
  UnsetType = 'UNSET',
  UnspecifiedType = 'UNSPECIFIED',
  WomanType = 'WOMAN'
}

export enum GeinsGenderType {
  FemaleType = 'FEMALE',
  MaleType = 'MALE',
  UnknownType = 'UNKNOWN'
}

/** Type containing Google taxonomy data */
export interface GeinsGoogleTaxonomyTypeType {
  /** Google taxonomy ID */
  id?: Maybe<Scalars['Int']['output']>;
  /** Google taxonomy name */
  name?: Maybe<Scalars['String']['output']>;
  /** Parent Google taxonomy ID */
  parentId?: Maybe<Scalars['Int']['output']>;
  /** Google taxonomy path */
  path?: Maybe<Scalars['String']['output']>;
}

/** Type containing information for a group in a product package */
export interface GeinsGroupTypeType {
  /** The package group description */
  description?: Maybe<Scalars['String']['output']>;
  /** The package group id */
  groupId: Scalars['Int']['output'];
  /** The package group image */
  image?: Maybe<Scalars['String']['output']>;
  /** The package group name */
  name?: Maybe<Scalars['String']['output']>;
  /** Options in this package group */
  options?: Maybe<Array<Maybe<GeinsOptionTypeType>>>;
  /** 'true' if this package group is required in order to place the package in cart */
  required: Scalars['Boolean']['output'];
  /** The sort order of this package group relative to other groups */
  sortOrder: Scalars['Int']['output'];
}

export enum GeinsIncludeMode {
  /** Products must have a value from *all* groups provided in the Include field. This is the default mode. */
  IntersectType = 'INTERSECT',
  /** Products must have a value from *at least one* of the groups provided in the Include field. */
  UnionType = 'UNION'
}

/** Type containing all information about the language-type */
export interface GeinsLanguageTypeType {
  /** Two-letter ISO code */
  code: Scalars['String']['output'];
  /** Language ID */
  id: Scalars['String']['output'];
  /** Language name */
  name: Scalars['String']['output'];
}

/**
 * Type containing information about the lowest price during last 30 days and the
 * legal comparison price (EU). Observe that discount is calculated against
 * comparison price and not the regular price.
 */
export interface GeinsLowestPriceTypeType {
  /** The comparison price excluding VAT */
  comparisonPriceExVat: Scalars['Decimal']['output'];
  /** Comparison price (excl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34' */
  comparisonPriceExVatFormatted?: Maybe<Scalars['String']['output']>;
  /** The comparison price including VAT */
  comparisonPriceIncVat: Scalars['Decimal']['output'];
  /** Comparison price (incl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34' */
  comparisonPriceIncVatFormatted?: Maybe<Scalars['String']['output']>;
  /** Discount amount excluding VAT. */
  discountExVat: Scalars['Decimal']['output'];
  /** Discount (excl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34' */
  discountExVatFormatted?: Maybe<Scalars['String']['output']>;
  /** Discount amount including VAT. */
  discountIncVat: Scalars['Decimal']['output'];
  /** Discount (incl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34' */
  discountIncVatFormatted?: Maybe<Scalars['String']['output']>;
  /** Discount percentage. */
  discountPercentage: Scalars['Int']['output'];
  /** Whether the price is discounted or not */
  isDiscounted: Scalars['Boolean']['output'];
  /** The lowest price excluding VAT */
  lowestPriceExVat: Scalars['Decimal']['output'];
  /** Lowest price (excl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34' */
  lowestPriceExVatFormatted?: Maybe<Scalars['String']['output']>;
  /** The lowest price including VAT */
  lowestPriceIncVat: Scalars['Decimal']['output'];
  /** Lowest price (incl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34' */
  lowestPriceIncVatFormatted?: Maybe<Scalars['String']['output']>;
  /** The selling price excluding VAT */
  sellingPriceExVat: Scalars['Decimal']['output'];
  /** Selling price (excl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34' */
  sellingPriceExVatFormatted?: Maybe<Scalars['String']['output']>;
  /** The selling price including VAT */
  sellingPriceIncVat: Scalars['Decimal']['output'];
  /** Selling price (incl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34' */
  sellingPriceIncVatFormatted?: Maybe<Scalars['String']['output']>;
  /** VAT amount */
  vat: Scalars['Decimal']['output'];
  /** VAT amount, formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34' */
  vatFormatted?: Maybe<Scalars['String']['output']>;
}

/** Type containing all information about the market-type */
export interface GeinsMarketTypeType {
  /** The part of the market id that is used in the url. */
  alias?: Maybe<Scalars['String']['output']>;
  allowedLanguages?: Maybe<Array<Maybe<GeinsLanguageTypeType>>>;
  /** Country */
  country?: Maybe<GeinsCountryTypeType>;
  /** Currency */
  currency?: Maybe<GeinsCurrencyTypeType>;
  /** Default language ID used if no other is specified, or an invalid is supplied. */
  defaultLanguageId: Scalars['String']['output'];
  /** Group key used to group related markets together, i.e. if they belong to the same region or continent. */
  groupKey: Scalars['String']['output'];
  /** ID */
  id: Scalars['String']['output'];
  /** Indicates if the market should only be displayed in the checkout process. */
  onlyDisplayInCheckout?: Maybe<Scalars['Boolean']['output']>;
  /** If true, indicates that the market is virtual. Virtual markets cannot be used in the checkout process */
  virtual?: Maybe<Scalars['Boolean']['output']>;
}

export interface GeinsMenuItemTypeType {
  canonicalUrl?: Maybe<Scalars['String']['output']>;
  children?: Maybe<Array<Maybe<GeinsMenuItemTypeType>>>;
  hidden: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  label?: Maybe<Scalars['String']['output']>;
  open: Scalars['Boolean']['output'];
  order: Scalars['Int']['output'];
  targetBlank: Scalars['Boolean']['output'];
  title?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  value?: Maybe<Scalars['String']['output']>;
}

export interface GeinsMenuTypeType {
  channels?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  id: Scalars['String']['output'];
  languages?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  locations?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  menuItems?: Maybe<Array<Maybe<GeinsMenuItemTypeType>>>;
  name?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
}

/** Type containing metadata */
export interface GeinsMetadataTypeType {
  /** Description */
  description?: Maybe<Scalars['String']['output']>;
  /** Keywords */
  keywords?: Maybe<Scalars['String']['output']>;
  /** Title */
  title?: Maybe<Scalars['String']['output']>;
}

/** Type containing information for an option in a product package group */
export interface GeinsOptionTypeType {
  /** 'true' if this option should be selected by default */
  isSelected: Scalars['Boolean']['output'];
  /** The name of the option */
  name?: Maybe<Scalars['String']['output']>;
  /** The option id */
  optionId: Scalars['Int']['output'];
  /** The product that this options refers to */
  product?: Maybe<GeinsProductTypeType>;
  /** The quantity of items that is chosen if this option is selected */
  quantity: Scalars['Int']['output'];
  /** The sort order of this option relative to other options */
  sortOrder: Scalars['Int']['output'];
}

export interface GeinsOrderTypeType {
  billingAddress?: Maybe<GeinsAddressTypeType>;
  cart?: Maybe<GeinsCartTypeType>;
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  customerId?: Maybe<Scalars['Int']['output']>;
  desiredDeliveryDate?: Maybe<Scalars['DateTime']['output']>;
  discount?: Maybe<GeinsPriceTypeType>;
  /** The amount taken from account balance */
  fromBalance: Scalars['Decimal']['output'];
  /** The amount taken from account balance. Formatted as a currency string. */
  fromBalanceFormatted?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  orderTotal?: Maybe<GeinsPriceTypeType>;
  paymentDetails?: Maybe<Array<Maybe<GeinsPaymentDetailsTypeType>>>;
  paymentFee?: Maybe<GeinsPriceTypeType>;
  publicId: Scalars['ID']['output'];
  refunds?: Maybe<Array<Maybe<GeinsRefundTypeType>>>;
  shippingAddress?: Maybe<GeinsAddressTypeType>;
  shippingDetails?: Maybe<Array<Maybe<GeinsShippingDetailTypeType>>>;
  shippingFee?: Maybe<GeinsPriceTypeType>;
  status: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  vat?: Maybe<GeinsPriceTypeType>;
}

/** Type containing widget page area information */
export interface GeinsPageAreaTypeType {
  /** ID */
  id: Scalars['Int']['output'];
  /** Index */
  index: Scalars['Int']['output'];
  /** Name */
  name?: Maybe<Scalars['String']['output']>;
}

/** Type containing page information */
export interface GeinsPageInfoTypeType {
  /** Alias */
  alias: Scalars['String']['output'];
  /**
   * Alternative full paths to the page
   * @deprecated Use AlternativeUrls instead.
   */
  alternativeCanonicalUrls?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Alternative urls to the page */
  alternativeUrls?: Maybe<Array<Maybe<GeinsAlternativeUrlTypeType>>>;
  /** Background image */
  backgroundImage?: Maybe<Scalars['String']['output']>;
  /** Full path to the page */
  canonicalUrl?: Maybe<Scalars['String']['output']>;
  /** Whether the descriptions should be hidden */
  hideDescription: Scalars['Boolean']['output'];
  /** Whether the Name-field should be hidden */
  hideTitle: Scalars['Boolean']['output'];
  /** Page ID */
  id: Scalars['Int']['output'];
  /** Logo */
  logo?: Maybe<Scalars['String']['output']>;
  /** Page metadata */
  meta?: Maybe<GeinsMetadataTypeType>;
  /** Name */
  name: Scalars['String']['output'];
  /** Primary description */
  primaryDescription?: Maybe<Scalars['String']['output']>;
  /** Primary image */
  primaryImage?: Maybe<Scalars['String']['output']>;
  /** Secondary description */
  secondaryDescription?: Maybe<Scalars['String']['output']>;
  /** Page sub-categories */
  subCategories?: Maybe<Array<Maybe<GeinsCategoryTypeType>>>;
}

/** Type for filtering widgets */
export interface GeinsPageWidgetCollectionFilterInputTypeType {
  /** Filter key. Possible values: SiteId, LanguageId, Product, Category, Brand, DiscountCampaign, CustomerType, Parameter */
  key?: InputMaybe<Scalars['String']['input']>;
  /** Filter value. Id (int) or Alias */
  value?: InputMaybe<Scalars['String']['input']>;
}

/** Type containing widget collection information */
export interface GeinsPageWidgetCollectionTypeType {
  /** Collection containers */
  containers?: Maybe<Array<Maybe<GeinsPageWidgetContainerTypeType>>>;
  /** Collection family name */
  familyName?: Maybe<Scalars['String']['output']>;
  /** Collection ID */
  id: Scalars['Int']['output'];
  /** Collection metadata */
  meta?: Maybe<GeinsMetadataTypeType>;
  /** Name */
  name: Scalars['String']['output'];
  /** Collection page area */
  pageArea?: Maybe<GeinsPageAreaTypeType>;
  /** List of tags */
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Title */
  title?: Maybe<Scalars['String']['output']>;
}

/** Type containing widget container information */
export interface GeinsPageWidgetContainerTypeType {
  /** Container class names */
  classNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Container design */
  design: Scalars['String']['output'];
  /** ID */
  id: Scalars['Int']['output'];
  /** Container layout */
  layout: Scalars['String']['output'];
  /** Name */
  name: Scalars['String']['output'];
  /** Container responsive mode */
  responsiveMode: Scalars['String']['output'];
  /** Sort order */
  sortOrder: Scalars['Int']['output'];
  /** Widgets in this container */
  widgets?: Maybe<Array<Maybe<GeinsPageWidgetTypeType>>>;
}

/** Type containing widget image size information */
export interface GeinsPageWidgetImageSizeTypeType {
  /** Image height */
  imageHeight: Scalars['Int']['output'];
  /** Image ratio */
  imageRatio: Scalars['Float']['output'];
  /** Image width */
  imageWidth: Scalars['Int']['output'];
}

/** Type containing widget image information */
export interface GeinsPageWidgetImageTypeType {
  /** Filename */
  fileName: Scalars['String']['output'];
  /** Largest image size */
  largestSize?: Maybe<GeinsPageWidgetImageSizeTypeType>;
  /** Image sizes */
  sizes?: Maybe<Array<Maybe<GeinsPageWidgetImageSizeTypeType>>>;
}

/** Type containing CMS page information */
export interface GeinsPageWidgetPageTypeType {
  /** Active From */
  activeFrom?: Maybe<Scalars['DateTime']['output']>;
  /** Active To */
  activeTo?: Maybe<Scalars['DateTime']['output']>;
  /** Alias */
  alias?: Maybe<Scalars['String']['output']>;
  /** The url to this cms page */
  canonicalUrl?: Maybe<Scalars['String']['output']>;
  /** Collection ID */
  id: Scalars['Int']['output'];
  /** Collection metadata */
  meta?: Maybe<GeinsMetadataTypeType>;
  /** Name */
  name: Scalars['String']['output'];
  /** List of tags */
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Title */
  title?: Maybe<Scalars['String']['output']>;
}

/** Type containing widget information */
export interface GeinsPageWidgetTypeType {
  /** Class names */
  classNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Configuration */
  configuration: Scalars['String']['output'];
  /** ID */
  id: Scalars['String']['output'];
  /** Images */
  images?: Maybe<Array<Maybe<GeinsPageWidgetImageTypeType>>>;
  /** Name */
  name: Scalars['String']['output'];
  /** Size */
  size: Scalars['String']['output'];
  /** Sort order */
  sortOrder: Scalars['Int']['output'];
  /** Widget Type */
  type: Scalars['String']['output'];
}

/** Type containing product parameter group information */
export interface GeinsParameterGroupTypeType {
  /** The parameter group name */
  name: Scalars['String']['output'];
  /** The parameter group order */
  order?: Maybe<Scalars['Int']['output']>;
  /** Parameter group ID */
  parameterGroupId?: Maybe<Scalars['Int']['output']>;
  /** List of parameters */
  parameters?: Maybe<Array<Maybe<GeinsParameterTypeType>>>;
  /** Product ID associated with this parameter group */
  productId: Scalars['Int']['output'];
}

/** Type containing parameter information */
export interface GeinsParameterTypeType {
  /** Parameter description */
  description?: Maybe<Scalars['String']['output']>;
  /** The ID of the associated facet */
  facetId?: Maybe<Scalars['String']['output']>;
  /**
   * The internal identifier of the parameter. This value is the same for all
   * languages and does not change if the parameter name changes.
   */
  identifier?: Maybe<Scalars['String']['output']>;
  /** Parameter label */
  label?: Maybe<Scalars['String']['output']>;
  /** Parameter name */
  name?: Maybe<Scalars['String']['output']>;
  /** The order of the parameter within the group */
  order: Scalars['Int']['output'];
  /** ID of the associated parameter group */
  parameterGroupId: Scalars['Int']['output'];
  /** Parameter ID */
  parameterId: Scalars['Int']['output'];
  /** The ID of the associated parameter value */
  parameterValueId?: Maybe<Scalars['Int']['output']>;
  /** Whether this parameter should be shown within the product specifications */
  show: Scalars['Boolean']['output'];
  /** Whether this parameter should be shown within filter options */
  showFilter: Scalars['Boolean']['output'];
  /** The parameter type */
  type?: Maybe<Scalars['String']['output']>;
  /** Parameter value */
  value?: Maybe<Scalars['String']['output']>;
}

export enum GeinsPaymentCheckout {
  ExternalType = 'EXTERNAL',
  GeinsPayType = 'GEINS_PAY',
  StandardType = 'STANDARD'
}

export interface GeinsPaymentDetailsTypeType {
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
}

/** Type containing payment option information */
export interface GeinsPaymentOptionTypeType {
  /** Checkout type */
  checkoutType?: Maybe<GeinsPaymentCheckout>;
  /** Display name */
  displayName?: Maybe<Scalars['String']['output']>;
  /** Fee excl. VAT */
  feeExVat: Scalars['Decimal']['output'];
  /** Fee excl. VAT, formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34' */
  feeExVatFormatted?: Maybe<Scalars['String']['output']>;
  /** Fee incl. VAT */
  feeIncVat: Scalars['Decimal']['output'];
  /** Fee incl. VAT, formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34' */
  feeIncVatFormatted?: Maybe<Scalars['String']['output']>;
  /** Payment option ID */
  id: Scalars['Int']['output'];
  /** Whether this payment option is the default selection */
  isDefault: Scalars['Boolean']['output'];
  /** Whether this option is the one selected */
  isSelected: Scalars['Boolean']['output'];
  /** Shipping option logo */
  logo?: Maybe<Scalars['String']['output']>;
  /** Name */
  name?: Maybe<Scalars['String']['output']>;
  /** Whether it is a new checkout session */
  newCheckoutSession: Scalars['Boolean']['output'];
  /** Payment option data */
  paymentData?: Maybe<Scalars['String']['output']>;
  /** Payment type */
  paymentType?: Maybe<GeinsPaymentType>;
}

/** Payment types */
export enum GeinsPaymentType {
  /** Avarda */
  AvardaType = 'AVARDA',
  /** GeinsPay */
  GeinsPayType = 'GEINS_PAY',
  /** Klarna */
  KlarnaType = 'KLARNA',
  /** Standard */
  StandardType = 'STANDARD',
  /** Svea */
  SveaType = 'SVEA',
  /** Walley */
  WalleyType = 'WALLEY'
}

export interface GeinsPlaceOrderResponseTypeType {
  orderId?: Maybe<Scalars['String']['output']>;
  publicId?: Maybe<Scalars['String']['output']>;
  redirectUrl?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
}

/** Price range filter */
export interface GeinsPriceFilterInputTypeType {
  /** The highest price you want to include */
  highest?: InputMaybe<Scalars['Float']['input']>;
  /** The lowest price you want to include */
  lowest?: InputMaybe<Scalars['Float']['input']>;
}

/** Price range filter */
export interface GeinsPriceFilterTypeType {
  /** The highest price found in the results */
  highest: Scalars['Float']['output'];
  /** The lowest price found in the results */
  lowest: Scalars['Float']['output'];
}

/** Type containing all information about a product price log item */
export interface GeinsPriceLogItemTypeType {
  /** Date of the price change */
  date: Scalars['String']['output'];
  /** Discount amount excluding VAT */
  discountExVat: Scalars['Decimal']['output'];
  /** Discount (excl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34' */
  discountExVatFormatted?: Maybe<Scalars['String']['output']>;
  /** Discount amount including VAT */
  discountIncVat: Scalars['Decimal']['output'];
  /** Discount (incl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34' */
  discountIncVatFormatted?: Maybe<Scalars['String']['output']>;
  /** Discount percentage */
  discountPercentage: Scalars['Int']['output'];
  /** Whether the price is discounted or not */
  isDiscounted: Scalars['Boolean']['output'];
  /** True if this log items has the lowest price for the last 30 days */
  isLowest: Scalars['Boolean']['output'];
  /** The regular price excluding VAT */
  regularPriceExVat: Scalars['Decimal']['output'];
  /** Regular price (excl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34' */
  regularPriceExVatFormatted?: Maybe<Scalars['String']['output']>;
  /** The regular price including VAT */
  regularPriceIncVat: Scalars['Decimal']['output'];
  /** Regular price (incl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34' */
  regularPriceIncVatFormatted?: Maybe<Scalars['String']['output']>;
  /** The selling price excluding VAT */
  sellingPriceExVat: Scalars['Decimal']['output'];
  /** Selling price (excl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34' */
  sellingPriceExVatFormatted?: Maybe<Scalars['String']['output']>;
  /** The selling price including VAT */
  sellingPriceIncVat: Scalars['Decimal']['output'];
  /** Selling price (incl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34' */
  sellingPriceIncVatFormatted?: Maybe<Scalars['String']['output']>;
  /** VAT amount */
  vat: Scalars['Decimal']['output'];
  /** VAT amount, formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34' */
  vatFormatted?: Maybe<Scalars['String']['output']>;
}

/** Type containing price information */
export interface GeinsPriceTypeType {
  /** Currency information */
  currency?: Maybe<GeinsCurrencyTypeType>;
  /** Discount amount excluding VAT */
  discountExVat: Scalars['Decimal']['output'];
  /** Discount (excl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34' */
  discountExVatFormatted?: Maybe<Scalars['String']['output']>;
  /** Discount amount including VAT */
  discountIncVat: Scalars['Decimal']['output'];
  /** Discount (incl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34' */
  discountIncVatFormatted?: Maybe<Scalars['String']['output']>;
  /** Discount percentage */
  discountPercentage: Scalars['Int']['output'];
  /** Whether the price is discounted or not */
  isDiscounted: Scalars['Boolean']['output'];
  /** The regular price excluding VAT */
  regularPriceExVat: Scalars['Decimal']['output'];
  /** Regular price (excl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34' */
  regularPriceExVatFormatted?: Maybe<Scalars['String']['output']>;
  /** The regular price including VAT */
  regularPriceIncVat: Scalars['Decimal']['output'];
  /** Regular price (incl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34' */
  regularPriceIncVatFormatted?: Maybe<Scalars['String']['output']>;
  /** The selling price excluding VAT */
  sellingPriceExVat: Scalars['Decimal']['output'];
  /** Selling price (excl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34' */
  sellingPriceExVatFormatted?: Maybe<Scalars['String']['output']>;
  /** The selling price including VAT */
  sellingPriceIncVat: Scalars['Decimal']['output'];
  /** Selling price (incl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34' */
  sellingPriceIncVatFormatted?: Maybe<Scalars['String']['output']>;
  /** VAT amount */
  vat: Scalars['Decimal']['output'];
  /** VAT amount, formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34' */
  vatFormatted?: Maybe<Scalars['String']['output']>;
}

/** Type containing all information about a product image */
export interface GeinsProductImageTypeType {
  /** The file name of the product image. */
  fileName: Scalars['String']['output'];
  /** Custom tags associated with the product image. */
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
}

/** Type containing meta data for the package selection that a cart item was added from */
export interface GeinsProductPackageCartItemTypeType {
  /** The group id */
  groupId: Scalars['Int']['output'];
  /** The option id */
  optionId: Scalars['Int']['output'];
  /** The package id */
  packageId: Scalars['Int']['output'];
  /** The package name */
  packageName: Scalars['String']['output'];
}

/** Type containing an option selection for a product package group */
export interface GeinsProductPackageSelectionTypeType {
  /** The group id that the selection is made in */
  groupId: Scalars['Int']['input'];
  /** The selected option id */
  optionId: Scalars['Int']['input'];
  /** The selected SKU */
  skuId: Scalars['Int']['input'];
}

/** Type containing type specific information for a product of the type 'package' */
export interface GeinsProductPackageTypeType {
  /** Groups in this package */
  groups?: Maybe<Array<Maybe<GeinsGroupTypeType>>>;
}

/** Product relation type */
export enum GeinsProductRelation {
  /** Product is an accessory to this product */
  AccessoriesType = 'ACCESSORIES',
  /** Product is related to this product */
  RelatedType = 'RELATED',
  /** Product is similar to this product */
  SimilarType = 'SIMILAR'
}

/** The results of the reviews query. */
export interface GeinsProductReviewResultTypeType {
  /** The average rating for this product */
  averageRating: Scalars['Float']['output'];
  /** The total count of results for the query */
  count: Scalars['Long']['output'];
  /** Results returned by the query */
  reviews?: Maybe<Array<Maybe<GeinsProductReviewTypeType>>>;
}

/** Type containing all information about a product review */
export interface GeinsProductReviewTypeType {
  /** Author of the review */
  author: Scalars['String']['output'];
  /** The product review comment */
  comment: Scalars['String']['output'];
  /** The product rating (1-5) */
  rating: Scalars['Int']['output'];
  /** The date and time for when the review was made */
  reviewDate: Scalars['DateTime']['output'];
}

/** Product info */
export interface GeinsProductTextsTypeType {
  /** Main product info */
  text1?: Maybe<Scalars['String']['output']>;
  /** Secondary product info */
  text2?: Maybe<Scalars['String']['output']>;
  /** Tertiary product info */
  text3?: Maybe<Scalars['String']['output']>;
}

/** Type containing all information about a product */
export interface GeinsProductTypeType {
  /** Alias for the product */
  alias: Scalars['String']['output'];
  /**
   * Alternative full paths to the product
   * @deprecated Use AlternativeUrls instead.
   */
  alternativeCanonicalUrls?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Alternative urls to the product */
  alternativeUrls?: Maybe<Array<Maybe<GeinsAlternativeUrlTypeType>>>;
  /** The product article number */
  articleNumber?: Maybe<Scalars['String']['output']>;
  /** Product brand information */
  brand?: Maybe<GeinsBrandTypeType>;
  /** Breadcrumbs */
  breadcrumbs?: Maybe<Array<Maybe<GeinsBreadcrumbTypeType>>>;
  /** The full path to the product */
  canonicalUrl?: Maybe<Scalars['String']['output']>;
  /** Product category information */
  categories?: Maybe<Array<Maybe<GeinsCategoryTypeType>>>;
  /** The primary category ID */
  categoryId: Scalars['Int']['output'];
  /** The current variant selection */
  currentProductVariant?: Maybe<GeinsVariantTypeType>;
  /** The dimensions of the Product. Note that this can also be set on SKU level */
  dimensions?: Maybe<GeinsDimensionsTypeType>;
  /** Product discount campaigns */
  discountCampaigns?: Maybe<Array<Maybe<GeinsCampaignRuleTypeType>>>;
  /** Type of discount price: None, SalePrice, PriceCampaign or External */
  discountType?: Maybe<GeinsDiscountType>;
  /** The date on which the product was first available (yyyy-mm-dd) */
  firstAvailableOn?: Maybe<Scalars['String']['output']>;
  /** The Freightclass set for this product */
  freightClass?: Maybe<Scalars['String']['output']>;
  /**
   * List of product images
   * @deprecated Use ProductType.ProductImages instead.
   */
  images?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Lowest price and comparison price according to EU price laws */
  lowestPrice?: Maybe<GeinsLowestPriceTypeType>;
  /** Product metadata */
  meta?: Maybe<GeinsMetadataTypeType>;
  /** The product name */
  name?: Maybe<Scalars['String']['output']>;
  /** Product parameter groups */
  parameterGroups?: Maybe<Array<Maybe<GeinsParameterGroupTypeType>>>;
  /** Price log with the prices from the last 30 days */
  priceLog?: Maybe<Array<Maybe<GeinsPriceLogItemTypeType>>>;
  /** Primary category for this product */
  primaryCategory?: Maybe<GeinsCategoryTypeType>;
  /** Product ID */
  productId: Scalars['Int']['output'];
  /** List of product images and their related properties */
  productImages?: Maybe<Array<Maybe<GeinsProductImageTypeType>>>;
  /** Package specific information for this product */
  productPackage?: Maybe<GeinsProductPackageTypeType>;
  /** Product rating */
  rating?: Maybe<GeinsRatingTypeType>;
  /** Product SKUs */
  skus?: Maybe<Array<Maybe<GeinsSkuTypeType>>>;
  /** The Supplier Id */
  supplierId: Scalars['Int']['output'];
  /** Product text info */
  texts?: Maybe<GeinsProductTextsTypeType>;
  /** Product stock information */
  totalStock?: Maybe<GeinsStockTypeType>;
  /** The product type. Either 'product' or 'package' */
  type?: Maybe<Scalars['String']['output']>;
  /** Product price information */
  unitPrice?: Maybe<GeinsPriceTypeType>;
  /** Variant dimensions */
  variantDimensions?: Maybe<Array<Maybe<GeinsVariantDimensionTypeType>>>;
  /** Product variant group */
  variantGroup?: Maybe<GeinsVariantGroupTypeType>;
  /** Weight in grams (g). Note that this can also be set on SKU level */
  weight: Scalars['Int']['output'];
}

/** The results of the products-query. */
export interface GeinsProductsResultTypeType {
  /** The total count of results for the query */
  count: Scalars['Long']['output'];
  /** The filters available for this query */
  filters?: Maybe<GeinsFilterCollectionTypeType>;
  /** Results returned by the query */
  products?: Maybe<Array<Maybe<GeinsProductTypeType>>>;
}

/** Type containing product rating information */
export interface GeinsRatingTypeType {
  /** Rating score */
  score: Scalars['Decimal']['output'];
  /** Vote count */
  voteCount: Scalars['Int']['output'];
}

export interface GeinsRefundTypeType {
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
}

/** Type containing a subset of product information for related products */
export interface GeinsRelatedProductTypeType {
  /** Product alias */
  alias: Scalars['String']['output'];
  /** Product brand information */
  brand?: Maybe<GeinsBrandTypeType>;
  /** Full path to the product */
  canonicalUrl?: Maybe<Scalars['String']['output']>;
  /** Product campaigns */
  discountCampaigns?: Maybe<Array<Maybe<GeinsCampaignRuleTypeType>>>;
  /**
   * List of product images
   * @deprecated Use RelatedProductType.ProductImages instead.
   */
  images?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Product name */
  name?: Maybe<Scalars['String']['output']>;
  /** Product parameter groups. The availability of data in this field needs to be configured. */
  parameterGroups?: Maybe<Array<Maybe<GeinsParameterGroupTypeType>>>;
  /** Primary category for this product */
  primaryCategory?: Maybe<GeinsCategoryTypeType>;
  /** Product primary image */
  primaryImage?: Maybe<Scalars['String']['output']>;
  /** List of product images and their related properties */
  productImages?: Maybe<Array<Maybe<GeinsProductImageTypeType>>>;
  /**
   * Relation type
   * @deprecated Use RelatedProductType.RelationType instead.
   */
  relation?: Maybe<GeinsProductRelation>;
  /** Relation type */
  relationType: Scalars['String']['output'];
  /** Product secondary image */
  secondaryImage?: Maybe<Scalars['String']['output']>;
  /** Product SKUs */
  skus?: Maybe<Array<Maybe<GeinsSkuTypeType>>>;
  /** Product price */
  unitPrice?: Maybe<GeinsPriceTypeType>;
}

export interface GeinsShippingDetailTypeType {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  parcelNumber?: Maybe<Scalars['String']['output']>;
  shippingDate?: Maybe<Scalars['DateTime']['output']>;
  shippingId: Scalars['Int']['output'];
  trackingLink?: Maybe<Scalars['String']['output']>;
}

/** Type containing shipping option information */
export interface GeinsShippingOptionTypeType {
  /** Amount left to recieve free shipping */
  amountLeftToFreeShipping: Scalars['Decimal']['output'];
  /** Amount left to recieve free shipping formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34' */
  amountLeftToFreeShippingFormatted?: Maybe<Scalars['String']['output']>;
  /** Display name */
  displayName?: Maybe<Scalars['String']['output']>;
  /** External ID */
  externalId?: Maybe<Scalars['String']['output']>;
  /** Fee excl. VAT */
  feeExVat: Scalars['Decimal']['output'];
  /** Fee excl. VAT, formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34' */
  feeExVatFormatted?: Maybe<Scalars['String']['output']>;
  /** Fee incl. VAT */
  feeIncVat: Scalars['Decimal']['output'];
  /** Fee incl. VAT, formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34' */
  feeIncVatFormatted?: Maybe<Scalars['String']['output']>;
  /** Shipping option ID */
  id: Scalars['Int']['output'];
  /** Whether this shipping option is the default selection */
  isDefault: Scalars['Boolean']['output'];
  /** Whether this option is the one selected */
  isSelected: Scalars['Boolean']['output'];
  /** Shipping option logo */
  logo?: Maybe<Scalars['String']['output']>;
  /** Name */
  name?: Maybe<Scalars['String']['output']>;
  /** Shipping data */
  shippingData?: Maybe<Scalars['String']['output']>;
  /** Sub-options */
  subOptions?: Maybe<Array<Maybe<GeinsShippingOptionTypeType>>>;
}

/** Type containing all information about a product SKU */
export interface GeinsSkuTypeType {
  /** The article number of the SKU */
  articleNumber: Scalars['String']['output'];
  /** The dimensions of the SKU */
  dimensions?: Maybe<GeinsDimensionsTypeType>;
  /** External ID of the SKU */
  externalId?: Maybe<Scalars['String']['output']>;
  /** SKU GTIN */
  gtin?: Maybe<Scalars['String']['output']>;
  /** Incoming date */
  incoming?: Maybe<Scalars['DateTime']['output']>;
  /** SKU name */
  name?: Maybe<Scalars['String']['output']>;
  /** The associated product ID */
  productId: Scalars['Int']['output'];
  /** Shelf */
  shelf?: Maybe<Scalars['String']['output']>;
  /** ID of the SKU */
  skuId: Scalars['Int']['output'];
  /** Stock information */
  stock?: Maybe<GeinsStockTypeType>;
  /** Weight in grams (g) */
  weight: Scalars['Int']['output'];
}

/** Sort types */
export enum GeinsSortType {
  /** Sort by alphabetical */
  AlphabeticalType = 'ALPHABETICAL',
  /** Sort by alphabetical, in descending order */
  AlphabeticalDescType = 'ALPHABETICAL_DESC',
  /** Sort by available stock balance */
  AvailableStockType = 'AVAILABLE_STOCK',
  /** Sort by available stock balance, in descending order */
  AvailableStockDescType = 'AVAILABLE_STOCK_DESC',
  /** Sort by brand */
  BrandType = 'BRAND',
  /** Sort by custom value 1 */
  Custom_1Type = 'CUSTOM_1',
  /** Sort by custom value 2 */
  Custom_2Type = 'CUSTOM_2',
  /** Sort by custom value 3 */
  Custom_3Type = 'CUSTOM_3',
  /** Sort by custom value 4 */
  Custom_4Type = 'CUSTOM_4',
  /** Sort by custom value 5 */
  Custom_5Type = 'CUSTOM_5',
  /** Sort by facets */
  FacetOrderType = 'FACET_ORDER',
  /** Sort by latest products */
  LatestType = 'LATEST',
  /** Sort by most sold */
  MostSoldType = 'MOST_SOLD',
  /** No sorting */
  NoneType = 'NONE',
  /** Sort by price */
  PriceType = 'PRICE',
  /** Sort by price, in descending order */
  PriceDescType = 'PRICE_DESC',
  /** Sort by relevance */
  RelevanceType = 'RELEVANCE',
  /** Sort by total stock balance, including oversellable */
  TotalStockType = 'TOTAL_STOCK',
  /** Sort by total stock balance, including oversellable, in descending order */
  TotalStockDescType = 'TOTAL_STOCK_DESC',
  /** Sort by votes */
  VotesType = 'VOTES'
}

/** Represents SKU stock information. */
export interface GeinsStockTypeType {
  /** Number of units currently available in the warehouse. */
  inStock: Scalars['Int']['output'];
  /**
   * The date when new stock is arriving. (Deprecated: Use SkuType.Incoming or VariantType.Incoming instead)
   * @deprecated Use SkuType.Incoming or VariantType.Incoming instead
   */
  incoming?: Maybe<Scalars['DateTime']['output']>;
  /** Number of units that can be oversold. */
  oversellable: Scalars['Int']['output'];
  /**
   * The shelf identifier for the stock. (Deprecated: Use SkuType.Shelf or VariantType.Shelf instead)
   * @deprecated Use SkuType.Shelf or VariantType.Shelf instead
   */
  shelf?: Maybe<Scalars['String']['output']>;
  /**
   * Number of units that are always available for sale. This value is never
   * lowered when goods are sold or increased when goods are returned.
   */
  static?: Maybe<Scalars['Int']['output']>;
  /** Total number of units available for sale. TotalStock = InStock + OverSellable + Static. */
  totalStock: Scalars['Int']['output'];
}

export interface GeinsUrlHistoryTypeType {
  newUrl: Scalars['String']['output'];
  oldUrl: Scalars['String']['output'];
}

export interface GeinsUserBalanceTypeType {
  amount: Scalars['Decimal']['output'];
  /** User balance amount. Formatted as a currency string. */
  amountFormatted?: Maybe<Scalars['String']['output']>;
  currency: Scalars['String']['output'];
}

export interface GeinsUserInputTypeType {
  address?: InputMaybe<GeinsAddressInputTypeType>;
  customerType?: InputMaybe<GeinsCustomerType>;
  gender?: InputMaybe<GeinsGender>;
  /** Free-text field to store any data related to the customer. */
  metaData?: InputMaybe<Scalars['String']['input']>;
  newsletter?: InputMaybe<Scalars['Boolean']['input']>;
  personalId?: InputMaybe<Scalars['String']['input']>;
}

export interface GeinsUserTypeType {
  /** The address of the user. */
  address?: Maybe<GeinsAddressTypeType>;
  /**
   * Account balance
   * @deprecated Use Balances instead
   */
  balance: Scalars['Decimal']['output'];
  /**
   * Account balance. Formatted as a currency string.
   * @deprecated Use Balances instead
   */
  balanceFormatted?: Maybe<Scalars['String']['output']>;
  /** User balance per currency */
  balances?: Maybe<Array<Maybe<GeinsUserBalanceTypeType>>>;
  /** The customer type of the user. */
  customerType?: Maybe<GeinsCustomerType>;
  /** The email address of the user. */
  email: Scalars['String']['output'];
  /** The gender of the user. */
  gender?: Maybe<GeinsGender>;
  /** The unique identifier of the user. */
  id: Scalars['Int']['output'];
  /** The membership identifier of the user. */
  memberId: Scalars['Int']['output'];
  /** The type of membership the user has. */
  memberType: Scalars['String']['output'];
  /** Free-text field that can contain any additional metadata related to the customer. */
  metaData?: Maybe<Scalars['String']['output']>;
  /** Indicates if the user is subscribed to the newsletter. */
  newsletter?: Maybe<Scalars['Boolean']['output']>;
  /** The personal identification number of the user. */
  personalId?: Maybe<Scalars['String']['output']>;
}

export interface GeinsValidateOrderConditionsResponseTypeType {
  isValid: Scalars['Boolean']['output'];
  message?: Maybe<Scalars['String']['output']>;
}

export interface GeinsValidateOrderCreationResponseTypeType {
  isValid: Scalars['Boolean']['output'];
  memberType?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
}

/** Type containing variant attribute information */
export interface GeinsVariantAttributeTypeType {
  /** Attribute key */
  key: Scalars['String']['output'];
  /** Attribute value */
  value: Scalars['String']['output'];
}

/** Type containing variant dimension information */
export interface GeinsVariantDimensionTypeType {
  /** Dimension attributes */
  attributes?: Maybe<Array<Maybe<GeinsVariantAttributeTypeType>>>;
  /** The dimension name */
  dimension: Scalars['String']['output'];
  /** Group values */
  group?: Maybe<Array<Maybe<GeinsVariantValueTypeType>>>;
  /** Dimension label */
  label?: Maybe<Scalars['String']['output']>;
  /** The level of this variant dimension */
  level: Scalars['Int']['output'];
  /** Dimension type. e.g. 'product' if it leads to a different product, otherwise 'selection' */
  type: Scalars['String']['output'];
  /** Dimension value */
  value?: Maybe<Scalars['String']['output']>;
}

/** Type containing variant group information */
export interface GeinsVariantGroupTypeType {
  /** The amount of active products in this variant group */
  activeProducts: Scalars['Int']['output'];
  /** If true, only the main product will show up in product lists */
  collapseInLists: Scalars['Boolean']['output'];
  /** ID of the main product in this group */
  mainProductId: Scalars['Int']['output'];
  /** Variant group name */
  name: Scalars['String']['output'];
  /** Variant group ID */
  variantGroupId: Scalars['Int']['output'];
  /** Group variants */
  variants?: Maybe<Array<Maybe<GeinsVariantTypeType>>>;
}

/** Type containing variant information */
export interface GeinsVariantTypeType {
  /** Alias for variant selection. e.g. 'product-4' */
  alias?: Maybe<Scalars['String']['output']>;
  /** Variant attributes */
  attributes?: Maybe<Array<Maybe<GeinsVariantAttributeTypeType>>>;
  /** Canonical URL. Only available for the 'product'-level */
  canonicalUrl?: Maybe<Scalars['String']['output']>;
  /** Variant dimension */
  dimension: Scalars['String']['output'];
  /** Incoming date */
  incoming?: Maybe<Scalars['DateTime']['output']>;
  /** Variant label */
  label?: Maybe<Scalars['String']['output']>;
  /** Level of this variant. Lower value is a more accurate selection */
  level: Scalars['Int']['output'];
  /** Variant name */
  name?: Maybe<Scalars['String']['output']>;
  /** The primary image used for the product. Only available for the 'product'-level */
  primaryImage?: Maybe<Scalars['String']['output']>;
  /** Product ID associated with this variant */
  productId: Scalars['Int']['output'];
  /** Shelf */
  shelf?: Maybe<Scalars['String']['output']>;
  /** SKU ID associated with this variant */
  skuId?: Maybe<Scalars['Int']['output']>;
  /** Stock information for variant */
  stock?: Maybe<GeinsStockTypeType>;
  /** Variant type. In order of accuracy 'sku', 'product', 'selection' */
  type: Scalars['String']['output'];
  /** Variant value */
  value?: Maybe<Scalars['String']['output']>;
  /** List of variants for this variant */
  variants?: Maybe<Array<Maybe<GeinsVariantTypeType>>>;
}

/** Type containing variant value information */
export interface GeinsVariantValueTypeType {
  /** Label */
  label: Scalars['String']['output'];
  /** Value */
  value: Scalars['String']['output'];
}

/** Type containing VAT group information */
export interface GeinsVatGroupTypeType {
  /** VAT amount */
  amount: Scalars['Decimal']['output'];
  /** VAT rate */
  rate: Scalars['Int']['output'];
}

export type GeinsMenuType = {
  id: string,
  title?: string | null,
  menuItems?: Array<{
    id: string,
    label?: string | null,
    open: boolean,
    hidden: boolean,
    targetBlank: boolean,
    type: string,
    order: number,
    title?: string | null,
    canonicalUrl?: string | null,
    value?: string | null,
    children?: Array<{
      id: string,
      label?: string | null,
      open: boolean,
      hidden: boolean,
      targetBlank: boolean,
      type: string,
      order: number,
      title?: string | null,
      canonicalUrl?: string | null,
      value?: string | null,
      children?: Array<{
        id: string,
        label?: string | null,
        open: boolean,
        hidden: boolean,
        targetBlank: boolean,
        type: string,
        order: number,
        title?: string | null,
        canonicalUrl?: string | null,
        value?: string | null
      } | null> | null
    } | null> | null
  } | null> | null
};

export type GeinsMenuItemBaseType = {
  id: string,
  label?: string | null,
  open: boolean,
  hidden: boolean,
  targetBlank: boolean,
  type: string,
  order: number,
  title?: string | null,
  canonicalUrl?: string | null,
  value?: string | null,
  children?: Array<{
    id: string,
    label?: string | null,
    open: boolean,
    hidden: boolean,
    targetBlank: boolean,
    type: string,
    order: number,
    title?: string | null,
    canonicalUrl?: string | null,
    value?: string | null,
    children?: Array<{
      id: string,
      label?: string | null,
      open: boolean,
      hidden: boolean,
      targetBlank: boolean,
      type: string,
      order: number,
      title?: string | null,
      canonicalUrl?: string | null,
      value?: string | null
    } | null> | null
  } | null> | null
};

export type GeinsMenuItemType = {
  id: string,
  label?: string | null,
  open: boolean,
  hidden: boolean,
  targetBlank: boolean,
  type: string,
  order: number,
  title?: string | null,
  canonicalUrl?: string | null,
  value?: string | null
};

export type GeinsMetaType = {
  title?: string | null,
  description?: string | null
};

export type GeinsPageWidgetContainerType = {
  id: number,
  name: string,
  sortOrder: number,
  layout: string,
  responsiveMode: string,
  design: string,
  widgets?: Array<{
    id: string,
    name: string,
    sortOrder: number,
    type: string,
    size: string,
    configuration: string,
    images?: Array<{
      fileName: string,
      largestSize?: {
        imageWidth: number,
        imageHeight: number
      } | null
    } | null> | null
  } | null> | null
};

export type GeinsPageWidgetType = {
  id: string,
  name: string,
  sortOrder: number,
  type: string,
  size: string,
  configuration: string,
  images?: Array<{
    fileName: string,
    largestSize?: {
      imageWidth: number,
      imageHeight: number
    } | null
  } | null> | null
};

export type GeinsChannelFieldsType = {
  id: string,
  name: string,
  type: string,
  url: string,
  defaultLanguageId: string,
  defaultMarketId: string
};

export type GeinsMarketFieldsType = {
  id: string,
  alias?: string | null,
  onlyDisplayInCheckout?: boolean | null,
  virtual?: boolean | null,
  groupKey: string,
  allowedLanguages?: Array<{
    id: string,
    name: string,
    code: string
  } | null> | null,
  country?: {
    name: string,
    code: string
  } | null,
  currency?: {
    code: string,
    symbol: string
  } | null
};

export type GeinsLanguageFieldsType = {
  id: string,
  name: string,
  code: string
};

export type GeinsCountryFieldsType = {
  name: string,
  code: string
};

export type GeinsCurrencyFieldsType = {
  code: string,
  symbol: string
};

export type GeinsCartType = {
  id?: string | null,
  promoCode?: string | null,
  appliedCampaigns?: Array<{
    name?: string | null,
    hideTitle?: boolean | null
  } | null> | null,
  items?: Array<{
    quantity: number,
    skuId: number,
    campaign?: {
      appliedCampaigns?: Array<{
        name?: string | null,
        hideTitle?: boolean | null
      } | null> | null,
      prices?: Array<{
        quantity: number,
        price?: {
          isDiscounted: boolean,
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          vat: number,
          discountPercentage: number,
          regularPriceIncVatFormatted?: string | null,
          sellingPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null
        } | null
      } | null> | null
    } | null,
    unitPrice?: {
      isDiscounted: boolean,
      sellingPriceIncVat: number,
      sellingPriceExVat: number,
      regularPriceIncVat: number,
      regularPriceExVat: number,
      vat: number,
      discountPercentage: number,
      regularPriceIncVatFormatted?: string | null,
      sellingPriceIncVatFormatted?: string | null,
      regularPriceExVatFormatted?: string | null,
      sellingPriceExVatFormatted?: string | null
    } | null,
    product?: {
      productId: number,
      articleNumber?: string | null,
      name?: string | null,
      alias: string,
      canonicalUrl?: string | null,
      brand?: {
        name?: string | null
      } | null,
      productImages?: Array<{
        fileName: string
      } | null> | null,
      primaryCategory?: {
        name: string
      } | null,
      skus?: Array<{
        skuId: number,
        name?: string | null,
        stock?: {
          inStock: number,
          oversellable: number,
          totalStock: number,
          static?: number | null,
          incoming?: string | null
        } | null
      } | null> | null,
      unitPrice?: {
        isDiscounted: boolean,
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        vat: number,
        discountPercentage: number,
        regularPriceIncVatFormatted?: string | null,
        sellingPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null
      } | null
    } | null,
    totalPrice?: {
      isDiscounted: boolean,
      sellingPriceIncVat: number,
      sellingPriceExVat: number,
      regularPriceIncVat: number,
      regularPriceExVat: number,
      vat: number,
      discountPercentage: number,
      regularPriceIncVatFormatted?: string | null,
      sellingPriceIncVatFormatted?: string | null,
      regularPriceExVatFormatted?: string | null,
      sellingPriceExVatFormatted?: string | null
    } | null
  } | null> | null,
  summary?: {
    fixedAmountDiscountIncVat: number,
    fixedAmountDiscountExVat: number,
    balance?: {
      pending: number,
      pendingFormatted?: string | null,
      totalSellingPriceExBalanceExVat: number,
      totalSellingPriceExBalanceIncVat: number,
      totalSellingPriceExBalanceIncVatFormatted?: string | null
    } | null,
    subTotal?: {
      regularPriceIncVatFormatted?: string | null,
      regularPriceExVatFormatted?: string | null,
      sellingPriceIncVatFormatted?: string | null,
      sellingPriceExVatFormatted?: string | null,
      sellingPriceExVat: number,
      sellingPriceIncVat: number,
      vat: number
    } | null,
    shipping?: {
      amountLeftToFreeShipping: number,
      amountLeftToFreeShippingFormatted?: string | null,
      feeExVatFormatted?: string | null,
      feeIncVatFormatted?: string | null,
      feeIncVat: number,
      feeExVat: number,
      isDefault: boolean
    } | null,
    total?: {
      isDiscounted: boolean,
      sellingPriceIncVatFormatted?: string | null,
      sellingPriceExVatFormatted?: string | null,
      sellingPriceIncVat: number,
      sellingPriceExVat: number,
      discountIncVatFormatted?: string | null,
      discountExVatFormatted?: string | null,
      discountExVat: number,
      discountIncVat: number,
      vatFormatted?: string | null,
      vat: number
    } | null
  } | null
};

export type GeinsPriceType = {
  isDiscounted: boolean,
  sellingPriceIncVat: number,
  sellingPriceExVat: number,
  regularPriceIncVat: number,
  regularPriceExVat: number,
  vat: number,
  discountPercentage: number,
  regularPriceIncVatFormatted?: string | null,
  sellingPriceIncVatFormatted?: string | null,
  regularPriceExVatFormatted?: string | null,
  sellingPriceExVatFormatted?: string | null
};

export type GeinsStockType = {
  inStock: number,
  oversellable: number,
  totalStock: number,
  static?: number | null,
  incoming?: string | null
};

export type GeinsAddressType = {
  firstName: string,
  lastName: string,
  company: string,
  mobile: string,
  phone: string,
  careOf: string,
  entryCode: string,
  addressLine1: string,
  addressLine2: string,
  addressLine3: string,
  zip: string,
  city: string,
  state: string,
  country: string
};

export type GeinsUserType = {
  id: number,
  email: string,
  personalId?: string | null,
  customerType?: GeinsCustomerType | null,
  gender?: GeinsGender | null,
  metaData?: string | null,
  address?: {
    firstName: string,
    lastName: string,
    company: string,
    mobile: string,
    phone: string,
    careOf: string,
    entryCode: string,
    addressLine1: string,
    addressLine2: string,
    addressLine3: string,
    zip: string,
    city: string,
    state: string,
    country: string
  } | null,
  balances?: Array<{
    currency: string,
    amount: number
  } | null> | null
};

export type GeinsUserBalanceType = {
  currency: string,
  amount: number
};

export type GeinsOmsCartType = {
  __typename: 'CartType',
  id?: string | null,
  isCompleted: boolean,
  merchantData?: string | null,
  promoCode?: string | null,
  appliedCampaigns?: Array<{
    __typename: 'CampaignRuleType',
    campaignId: string,
    name?: string | null,
    hideTitle?: boolean | null
  } | null> | null,
  items?: Array<{
    __typename: 'CartItemType',
    id: string | number,
    groupKey?: string | number | null,
    skuId: number,
    quantity: number,
    message?: string | null,
    productPackage?: {
      __typename: 'ProductPackageCartItemType',
      packageId: number,
      packageName: string,
      groupId: number,
      optionId: number
    } | null,
    campaign?: {
      __typename: 'CampaignType',
      appliedCampaigns?: Array<{
        __typename: 'CampaignRuleType',
        campaignId: string,
        name?: string | null,
        hideTitle?: boolean | null
      } | null> | null,
      prices?: Array<{
        __typename: 'CampaignPriceType',
        quantity: number,
        price?: {
          __typename: 'PriceType',
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          discountIncVat: number,
          discountExVat: number,
          discountPercentage: number,
          vat: number,
          isDiscounted: boolean,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          regularPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          discountIncVatFormatted?: string | null,
          discountExVatFormatted?: string | null,
          vatFormatted?: string | null,
          currency?: {
            __typename: 'CurrencyType',
            code: string,
            symbol: string,
            rate: number,
            name: string
          } | null
        } | null
      } | null> | null
    } | null,
    product?: {
      __typename: 'ProductType',
      productId: number,
      articleNumber?: string | null,
      name?: string | null,
      alias: string,
      canonicalUrl?: string | null,
      brand?: {
        __typename: 'BrandType',
        name?: string | null
      } | null,
      productImages?: Array<{
        __typename: 'ProductImageType',
        fileName: string
      } | null> | null,
      primaryCategory?: {
        __typename: 'CategoryType',
        categoryId: number,
        name: string,
        order: number
      } | null,
      categories?: Array<{
        __typename: 'CategoryType',
        categoryId: number,
        name: string,
        order: number
      } | null> | null,
      skus?: Array<{
        __typename: 'SkuType',
        skuId: number,
        name?: string | null,
        stock?: {
          __typename: 'StockType',
          inStock: number,
          oversellable: number,
          totalStock: number,
          static?: number | null
        } | null
      } | null> | null,
      unitPrice?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null
    } | null,
    unitPrice?: {
      __typename: 'PriceType',
      sellingPriceIncVat: number,
      sellingPriceExVat: number,
      regularPriceIncVat: number,
      regularPriceExVat: number,
      discountIncVat: number,
      discountExVat: number,
      discountPercentage: number,
      vat: number,
      isDiscounted: boolean,
      sellingPriceIncVatFormatted?: string | null,
      sellingPriceExVatFormatted?: string | null,
      regularPriceIncVatFormatted?: string | null,
      regularPriceExVatFormatted?: string | null,
      discountIncVatFormatted?: string | null,
      discountExVatFormatted?: string | null,
      vatFormatted?: string | null,
      currency?: {
        __typename: 'CurrencyType',
        code: string,
        symbol: string,
        rate: number,
        name: string
      } | null
    } | null,
    totalPrice?: {
      __typename: 'PriceType',
      sellingPriceIncVat: number,
      sellingPriceExVat: number,
      regularPriceIncVat: number,
      regularPriceExVat: number,
      discountIncVat: number,
      discountExVat: number,
      discountPercentage: number,
      vat: number,
      isDiscounted: boolean,
      sellingPriceIncVatFormatted?: string | null,
      sellingPriceExVatFormatted?: string | null,
      regularPriceIncVatFormatted?: string | null,
      regularPriceExVatFormatted?: string | null,
      discountIncVatFormatted?: string | null,
      discountExVatFormatted?: string | null,
      vatFormatted?: string | null,
      currency?: {
        __typename: 'CurrencyType',
        code: string,
        symbol: string,
        rate: number,
        name: string
      } | null
    } | null
  } | null> | null,
  summary?: {
    __typename: 'CartSummaryType',
    fixedAmountDiscountIncVat: number,
    fixedAmountDiscountExVat: number,
    balance?: {
      __typename: 'BalanceType',
      pending: number,
      pendingFormatted?: string | null,
      totalSellingPriceExBalanceExVat: number,
      totalSellingPriceExBalanceIncVat: number,
      totalSellingPriceExBalanceIncVatFormatted?: string | null
    } | null,
    subTotal?: {
      __typename: 'PriceType',
      sellingPriceIncVat: number,
      sellingPriceExVat: number,
      regularPriceIncVat: number,
      regularPriceExVat: number,
      discountIncVat: number,
      discountExVat: number,
      discountPercentage: number,
      vat: number,
      isDiscounted: boolean,
      sellingPriceIncVatFormatted?: string | null,
      sellingPriceExVatFormatted?: string | null,
      regularPriceIncVatFormatted?: string | null,
      regularPriceExVatFormatted?: string | null,
      discountIncVatFormatted?: string | null,
      discountExVatFormatted?: string | null,
      vatFormatted?: string | null,
      currency?: {
        __typename: 'CurrencyType',
        code: string,
        symbol: string,
        rate: number,
        name: string
      } | null
    } | null,
    shipping?: {
      __typename: 'ShippingOptionType',
      amountLeftToFreeShipping: number,
      amountLeftToFreeShippingFormatted?: string | null,
      feeExVatFormatted?: string | null,
      feeIncVatFormatted?: string | null,
      feeIncVat: number,
      feeExVat: number,
      isDefault: boolean
    } | null,
    total?: {
      __typename: 'PriceType',
      sellingPriceIncVat: number,
      sellingPriceExVat: number,
      regularPriceIncVat: number,
      regularPriceExVat: number,
      discountIncVat: number,
      discountExVat: number,
      discountPercentage: number,
      vat: number,
      isDiscounted: boolean,
      sellingPriceIncVatFormatted?: string | null,
      sellingPriceExVatFormatted?: string | null,
      regularPriceIncVatFormatted?: string | null,
      regularPriceExVatFormatted?: string | null,
      discountIncVatFormatted?: string | null,
      discountExVatFormatted?: string | null,
      vatFormatted?: string | null,
      currency?: {
        __typename: 'CurrencyType',
        code: string,
        symbol: string,
        rate: number,
        name: string
      } | null
    } | null
  } | null
};

export type GeinsCampaignRuleType = {
  __typename: 'CampaignRuleType',
  campaignId: string,
  name?: string | null,
  hideTitle?: boolean | null
};

export type GeinsProductPackageCartItemType = {
  __typename: 'ProductPackageCartItemType',
  packageId: number,
  packageName: string,
  groupId: number,
  optionId: number
};

export type GeinsOmsPriceType = {
  __typename: 'PriceType',
  sellingPriceIncVat: number,
  sellingPriceExVat: number,
  regularPriceIncVat: number,
  regularPriceExVat: number,
  discountIncVat: number,
  discountExVat: number,
  discountPercentage: number,
  vat: number,
  isDiscounted: boolean,
  sellingPriceIncVatFormatted?: string | null,
  sellingPriceExVatFormatted?: string | null,
  regularPriceIncVatFormatted?: string | null,
  regularPriceExVatFormatted?: string | null,
  discountIncVatFormatted?: string | null,
  discountExVatFormatted?: string | null,
  vatFormatted?: string | null,
  currency?: {
    __typename: 'CurrencyType',
    code: string,
    symbol: string,
    rate: number,
    name: string
  } | null
};

export type GeinsOmsStockType = {
  inStock: number,
  oversellable: number,
  totalStock: number,
  static?: number | null
};

export type GeinsOmsCheckoutType = {
  email?: string | null,
  identityNumber?: string | null,
  shippingData?: string | null,
  cart?: {
    __typename: 'CartType',
    id?: string | null,
    isCompleted: boolean,
    merchantData?: string | null,
    promoCode?: string | null,
    appliedCampaigns?: Array<{
      __typename: 'CampaignRuleType',
      campaignId: string,
      name?: string | null,
      hideTitle?: boolean | null
    } | null> | null,
    items?: Array<{
      __typename: 'CartItemType',
      id: string | number,
      groupKey?: string | number | null,
      skuId: number,
      quantity: number,
      message?: string | null,
      productPackage?: {
        __typename: 'ProductPackageCartItemType',
        packageId: number,
        packageName: string,
        groupId: number,
        optionId: number
      } | null,
      campaign?: {
        __typename: 'CampaignType',
        appliedCampaigns?: Array<{
          __typename: 'CampaignRuleType',
          campaignId: string,
          name?: string | null,
          hideTitle?: boolean | null
        } | null> | null,
        prices?: Array<{
          __typename: 'CampaignPriceType',
          quantity: number,
          price?: {
            __typename: 'PriceType',
            sellingPriceIncVat: number,
            sellingPriceExVat: number,
            regularPriceIncVat: number,
            regularPriceExVat: number,
            discountIncVat: number,
            discountExVat: number,
            discountPercentage: number,
            vat: number,
            isDiscounted: boolean,
            sellingPriceIncVatFormatted?: string | null,
            sellingPriceExVatFormatted?: string | null,
            regularPriceIncVatFormatted?: string | null,
            regularPriceExVatFormatted?: string | null,
            discountIncVatFormatted?: string | null,
            discountExVatFormatted?: string | null,
            vatFormatted?: string | null,
            currency?: {
              __typename: 'CurrencyType',
              code: string,
              symbol: string,
              rate: number,
              name: string
            } | null
          } | null
        } | null> | null
      } | null,
      product?: {
        __typename: 'ProductType',
        productId: number,
        articleNumber?: string | null,
        name?: string | null,
        alias: string,
        canonicalUrl?: string | null,
        brand?: {
          __typename: 'BrandType',
          name?: string | null
        } | null,
        productImages?: Array<{
          __typename: 'ProductImageType',
          fileName: string
        } | null> | null,
        primaryCategory?: {
          __typename: 'CategoryType',
          categoryId: number,
          name: string,
          order: number
        } | null,
        categories?: Array<{
          __typename: 'CategoryType',
          categoryId: number,
          name: string,
          order: number
        } | null> | null,
        skus?: Array<{
          __typename: 'SkuType',
          skuId: number,
          name?: string | null,
          stock?: {
            __typename: 'StockType',
            inStock: number,
            oversellable: number,
            totalStock: number,
            static?: number | null
          } | null
        } | null> | null,
        unitPrice?: {
          __typename: 'PriceType',
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          discountIncVat: number,
          discountExVat: number,
          discountPercentage: number,
          vat: number,
          isDiscounted: boolean,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          regularPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          discountIncVatFormatted?: string | null,
          discountExVatFormatted?: string | null,
          vatFormatted?: string | null,
          currency?: {
            __typename: 'CurrencyType',
            code: string,
            symbol: string,
            rate: number,
            name: string
          } | null
        } | null
      } | null,
      unitPrice?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null,
      totalPrice?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null
    } | null> | null,
    summary?: {
      __typename: 'CartSummaryType',
      fixedAmountDiscountIncVat: number,
      fixedAmountDiscountExVat: number,
      balance?: {
        __typename: 'BalanceType',
        pending: number,
        pendingFormatted?: string | null,
        totalSellingPriceExBalanceExVat: number,
        totalSellingPriceExBalanceIncVat: number,
        totalSellingPriceExBalanceIncVatFormatted?: string | null
      } | null,
      subTotal?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null,
      shipping?: {
        __typename: 'ShippingOptionType',
        amountLeftToFreeShipping: number,
        amountLeftToFreeShippingFormatted?: string | null,
        feeExVatFormatted?: string | null,
        feeIncVatFormatted?: string | null,
        feeIncVat: number,
        feeExVat: number,
        isDefault: boolean
      } | null,
      total?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null
    } | null
  } | null,
  consents?: Array<{
    type: string,
    checked: boolean
  } | null> | null,
  billingAddress?: {
    firstName: string,
    lastName: string,
    company: string,
    mobile: string,
    phone: string,
    careOf: string,
    entryCode: string,
    addressLine1: string,
    addressLine2: string,
    addressLine3: string,
    zip: string,
    city: string,
    state: string,
    country: string
  } | null,
  shippingAddress?: {
    firstName: string,
    lastName: string,
    company: string,
    mobile: string,
    phone: string,
    careOf: string,
    entryCode: string,
    addressLine1: string,
    addressLine2: string,
    addressLine3: string,
    zip: string,
    city: string,
    state: string,
    country: string
  } | null,
  shippingOptions?: Array<{
    id: number,
    displayName?: string | null,
    logo?: string | null,
    isSelected: boolean,
    feeIncVatFormatted?: string | null,
    feeExVatFormatted?: string | null
  } | null> | null,
  paymentOptions?: Array<{
    id: number,
    logo?: string | null,
    displayName?: string | null,
    checkoutType?: GeinsPaymentCheckout | null,
    paymentType?: GeinsPaymentType | null,
    paymentData?: string | null,
    isSelected: boolean,
    newCheckoutSession: boolean
  } | null> | null
};

export type GeinsOmsAddressType = {
  firstName: string,
  lastName: string,
  addressLine1: string,
  addressLine2: string,
  addressLine3: string,
  entryCode: string,
  careOf: string,
  city: string,
  state: string,
  country: string,
  zip: string,
  company: string,
  mobile: string,
  phone: string
};

export type GeinsOrderSummaryType = {
  id?: number | null,
  customerId?: number | null,
  createdAt?: string | null,
  completedAt?: string | null,
  currency?: string | null,
  desiredDeliveryDate?: string | null,
  message?: string | null,
  status: string,
  updatedAt?: string | null,
  publicId: string | number,
  fromBalance: number,
  fromBalanceFormatted?: string | null,
  billingAddress?: {
    firstName: string,
    lastName: string,
    company: string,
    mobile: string,
    phone: string,
    careOf: string,
    entryCode: string,
    addressLine1: string,
    addressLine2: string,
    addressLine3: string,
    zip: string,
    city: string,
    state: string,
    country: string
  } | null,
  shippingAddress?: {
    firstName: string,
    lastName: string,
    company: string,
    mobile: string,
    phone: string,
    careOf: string,
    entryCode: string,
    addressLine1: string,
    addressLine2: string,
    addressLine3: string,
    zip: string,
    city: string,
    state: string,
    country: string
  } | null,
  cart?: {
    __typename: 'CartType',
    id?: string | null,
    isCompleted: boolean,
    merchantData?: string | null,
    promoCode?: string | null,
    appliedCampaigns?: Array<{
      __typename: 'CampaignRuleType',
      campaignId: string,
      name?: string | null,
      hideTitle?: boolean | null
    } | null> | null,
    items?: Array<{
      __typename: 'CartItemType',
      id: string | number,
      groupKey?: string | number | null,
      skuId: number,
      quantity: number,
      message?: string | null,
      productPackage?: {
        __typename: 'ProductPackageCartItemType',
        packageId: number,
        packageName: string,
        groupId: number,
        optionId: number
      } | null,
      campaign?: {
        __typename: 'CampaignType',
        appliedCampaigns?: Array<{
          __typename: 'CampaignRuleType',
          campaignId: string,
          name?: string | null,
          hideTitle?: boolean | null
        } | null> | null,
        prices?: Array<{
          __typename: 'CampaignPriceType',
          quantity: number,
          price?: {
            __typename: 'PriceType',
            sellingPriceIncVat: number,
            sellingPriceExVat: number,
            regularPriceIncVat: number,
            regularPriceExVat: number,
            discountIncVat: number,
            discountExVat: number,
            discountPercentage: number,
            vat: number,
            isDiscounted: boolean,
            sellingPriceIncVatFormatted?: string | null,
            sellingPriceExVatFormatted?: string | null,
            regularPriceIncVatFormatted?: string | null,
            regularPriceExVatFormatted?: string | null,
            discountIncVatFormatted?: string | null,
            discountExVatFormatted?: string | null,
            vatFormatted?: string | null,
            currency?: {
              __typename: 'CurrencyType',
              code: string,
              symbol: string,
              rate: number,
              name: string
            } | null
          } | null
        } | null> | null
      } | null,
      product?: {
        __typename: 'ProductType',
        productId: number,
        articleNumber?: string | null,
        name?: string | null,
        alias: string,
        canonicalUrl?: string | null,
        brand?: {
          __typename: 'BrandType',
          name?: string | null
        } | null,
        productImages?: Array<{
          __typename: 'ProductImageType',
          fileName: string
        } | null> | null,
        primaryCategory?: {
          __typename: 'CategoryType',
          categoryId: number,
          name: string,
          order: number
        } | null,
        categories?: Array<{
          __typename: 'CategoryType',
          categoryId: number,
          name: string,
          order: number
        } | null> | null,
        skus?: Array<{
          __typename: 'SkuType',
          skuId: number,
          name?: string | null,
          stock?: {
            __typename: 'StockType',
            inStock: number,
            oversellable: number,
            totalStock: number,
            static?: number | null
          } | null
        } | null> | null,
        unitPrice?: {
          __typename: 'PriceType',
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          discountIncVat: number,
          discountExVat: number,
          discountPercentage: number,
          vat: number,
          isDiscounted: boolean,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          regularPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          discountIncVatFormatted?: string | null,
          discountExVatFormatted?: string | null,
          vatFormatted?: string | null,
          currency?: {
            __typename: 'CurrencyType',
            code: string,
            symbol: string,
            rate: number,
            name: string
          } | null
        } | null
      } | null,
      unitPrice?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null,
      totalPrice?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null
    } | null> | null,
    summary?: {
      __typename: 'CartSummaryType',
      fixedAmountDiscountIncVat: number,
      fixedAmountDiscountExVat: number,
      balance?: {
        __typename: 'BalanceType',
        pending: number,
        pendingFormatted?: string | null,
        totalSellingPriceExBalanceExVat: number,
        totalSellingPriceExBalanceIncVat: number,
        totalSellingPriceExBalanceIncVatFormatted?: string | null
      } | null,
      subTotal?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null,
      shipping?: {
        __typename: 'ShippingOptionType',
        amountLeftToFreeShipping: number,
        amountLeftToFreeShippingFormatted?: string | null,
        feeExVatFormatted?: string | null,
        feeIncVatFormatted?: string | null,
        feeIncVat: number,
        feeExVat: number,
        isDefault: boolean
      } | null,
      total?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null
    } | null
  } | null,
  paymentDetails?: Array<{
    id: number,
    paymentId: number,
    transactionId: string,
    displayName: string,
    name: string,
    isPaid: boolean,
    paymentDate?: string | null,
    paymentFee: number,
    paymentOption?: string | null,
    reservationDate: string,
    reservationNumber?: string | null,
    shippingFee: number,
    total: number
  } | null> | null,
  discount?: {
    __typename: 'PriceType',
    sellingPriceIncVat: number,
    sellingPriceExVat: number,
    regularPriceIncVat: number,
    regularPriceExVat: number,
    discountIncVat: number,
    discountExVat: number,
    discountPercentage: number,
    vat: number,
    isDiscounted: boolean,
    sellingPriceIncVatFormatted?: string | null,
    sellingPriceExVatFormatted?: string | null,
    regularPriceIncVatFormatted?: string | null,
    regularPriceExVatFormatted?: string | null,
    discountIncVatFormatted?: string | null,
    discountExVatFormatted?: string | null,
    vatFormatted?: string | null,
    currency?: {
      __typename: 'CurrencyType',
      code: string,
      symbol: string,
      rate: number,
      name: string
    } | null
  } | null,
  orderTotal?: {
    __typename: 'PriceType',
    sellingPriceIncVat: number,
    sellingPriceExVat: number,
    regularPriceIncVat: number,
    regularPriceExVat: number,
    discountIncVat: number,
    discountExVat: number,
    discountPercentage: number,
    vat: number,
    isDiscounted: boolean,
    sellingPriceIncVatFormatted?: string | null,
    sellingPriceExVatFormatted?: string | null,
    regularPriceIncVatFormatted?: string | null,
    regularPriceExVatFormatted?: string | null,
    discountIncVatFormatted?: string | null,
    discountExVatFormatted?: string | null,
    vatFormatted?: string | null,
    currency?: {
      __typename: 'CurrencyType',
      code: string,
      symbol: string,
      rate: number,
      name: string
    } | null
  } | null,
  paymentFee?: {
    __typename: 'PriceType',
    sellingPriceIncVat: number,
    sellingPriceExVat: number,
    regularPriceIncVat: number,
    regularPriceExVat: number,
    discountIncVat: number,
    discountExVat: number,
    discountPercentage: number,
    vat: number,
    isDiscounted: boolean,
    sellingPriceIncVatFormatted?: string | null,
    sellingPriceExVatFormatted?: string | null,
    regularPriceIncVatFormatted?: string | null,
    regularPriceExVatFormatted?: string | null,
    discountIncVatFormatted?: string | null,
    discountExVatFormatted?: string | null,
    vatFormatted?: string | null,
    currency?: {
      __typename: 'CurrencyType',
      code: string,
      symbol: string,
      rate: number,
      name: string
    } | null
  } | null,
  shippingFee?: {
    __typename: 'PriceType',
    sellingPriceIncVat: number,
    sellingPriceExVat: number,
    regularPriceIncVat: number,
    regularPriceExVat: number,
    discountIncVat: number,
    discountExVat: number,
    discountPercentage: number,
    vat: number,
    isDiscounted: boolean,
    sellingPriceIncVatFormatted?: string | null,
    sellingPriceExVatFormatted?: string | null,
    regularPriceIncVatFormatted?: string | null,
    regularPriceExVatFormatted?: string | null,
    discountIncVatFormatted?: string | null,
    discountExVatFormatted?: string | null,
    vatFormatted?: string | null,
    currency?: {
      __typename: 'CurrencyType',
      code: string,
      symbol: string,
      rate: number,
      name: string
    } | null
  } | null,
  vat?: {
    __typename: 'PriceType',
    sellingPriceIncVat: number,
    sellingPriceExVat: number,
    regularPriceIncVat: number,
    regularPriceExVat: number,
    discountIncVat: number,
    discountExVat: number,
    discountPercentage: number,
    vat: number,
    isDiscounted: boolean,
    sellingPriceIncVatFormatted?: string | null,
    sellingPriceExVatFormatted?: string | null,
    regularPriceIncVatFormatted?: string | null,
    regularPriceExVatFormatted?: string | null,
    discountIncVatFormatted?: string | null,
    discountExVatFormatted?: string | null,
    vatFormatted?: string | null,
    currency?: {
      __typename: 'CurrencyType',
      code: string,
      symbol: string,
      rate: number,
      name: string
    } | null
  } | null,
  refunds?: Array<{
    id: number,
    itemId: number,
    articleNumber?: string | null,
    createdAt: string,
    reason?: string | null,
    reasonCode?: number | null,
    refundType?: string | null,
    toBalance: boolean,
    total: number,
    vat: number
  } | null> | null,
  shippingDetails?: Array<{
    id: number,
    name: string,
    parcelNumber?: string | null,
    shippingDate?: string | null,
    shippingId: number,
    trackingLink?: string | null
  } | null> | null
};

export type GeinsPaymentDetailsType = {
  id: number,
  paymentId: number,
  transactionId: string,
  displayName: string,
  name: string,
  isPaid: boolean,
  paymentDate?: string | null,
  paymentFee: number,
  paymentOption?: string | null,
  reservationDate: string,
  reservationNumber?: string | null,
  shippingFee: number,
  total: number
};

export type GeinsRefundType = {
  id: number,
  itemId: number,
  articleNumber?: string | null,
  createdAt: string,
  reason?: string | null,
  reasonCode?: number | null,
  refundType?: string | null,
  toBalance: boolean,
  total: number,
  vat: number
};

export type GeinsShippingDetailsType = {
  id: number,
  name: string,
  parcelNumber?: string | null,
  shippingDate?: string | null,
  shippingId: number,
  trackingLink?: string | null
};

export type GeinsMenuAtLocationVariablesType = Exact<{
  menuLocationId?: InputMaybe<Scalars['String']['input']>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}> | undefined;


export type GeinsMenuAtLocationType = {
  getMenuAtLocation?: {
    id: string,
    title?: string | null,
    menuItems?: Array<{
      id: string,
      label?: string | null,
      open: boolean,
      hidden: boolean,
      targetBlank: boolean,
      type: string,
      order: number,
      title?: string | null,
      canonicalUrl?: string | null,
      value?: string | null,
      children?: Array<{
        id: string,
        label?: string | null,
        open: boolean,
        hidden: boolean,
        targetBlank: boolean,
        type: string,
        order: number,
        title?: string | null,
        canonicalUrl?: string | null,
        value?: string | null,
        children?: Array<{
          id: string,
          label?: string | null,
          open: boolean,
          hidden: boolean,
          targetBlank: boolean,
          type: string,
          order: number,
          title?: string | null,
          canonicalUrl?: string | null,
          value?: string | null
        } | null> | null
      } | null> | null
    } | null> | null
  } | null
};

export type GeinsWidgetAreaPageAliasVariablesType = Exact<{
  family?: InputMaybe<Scalars['String']['input']>;
  areaName?: InputMaybe<Scalars['String']['input']>;
  alias?: InputMaybe<Scalars['String']['input']>;
  displaySetting?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<Array<InputMaybe<GeinsPageWidgetCollectionFilterInputTypeType>> | InputMaybe<GeinsPageWidgetCollectionFilterInputTypeType>>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  customerType?: InputMaybe<GeinsCustomerType>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}> | undefined;


export type GeinsWidgetAreaPageAliasType = {
  widgetArea?: {
    id: number,
    name: string,
    title?: string | null,
    familyName?: string | null,
    tags?: Array<string | null> | null,
    meta?: {
      title?: string | null,
      description?: string | null
    } | null,
    pageArea?: {
      id: number,
      name?: string | null,
      index: number
    } | null,
    containers?: Array<{
      id: number,
      name: string,
      sortOrder: number,
      layout: string,
      responsiveMode: string,
      design: string,
      widgets?: Array<{
        id: string,
        name: string,
        sortOrder: number,
        type: string,
        size: string,
        configuration: string,
        images?: Array<{
          fileName: string,
          largestSize?: {
            imageWidth: number,
            imageHeight: number
          } | null
        } | null> | null
      } | null> | null
    } | null> | null
  } | null
};

export type GeinsWidgetAreaVariablesType = Exact<{
  family?: InputMaybe<Scalars['String']['input']>;
  areaName?: InputMaybe<Scalars['String']['input']>;
  alias?: InputMaybe<Scalars['String']['input']>;
  displaySetting?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<Array<InputMaybe<GeinsPageWidgetCollectionFilterInputTypeType>> | InputMaybe<GeinsPageWidgetCollectionFilterInputTypeType>>;
  preview?: InputMaybe<Scalars['Boolean']['input']>;
  customerType?: InputMaybe<GeinsCustomerType>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}> | undefined;


export type GeinsWidgetAreaType = {
  widgetArea?: {
    tags?: Array<string | null> | null,
    meta?: {
      title?: string | null,
      description?: string | null
    } | null,
    pageArea?: {
      id: number,
      name?: string | null,
      index: number
    } | null,
    containers?: Array<{
      id: number,
      name: string,
      sortOrder: number,
      layout: string,
      responsiveMode: string,
      design: string,
      widgets?: Array<{
        id: string,
        name: string,
        sortOrder: number,
        type: string,
        size: string,
        configuration: string,
        images?: Array<{
          fileName: string,
          largestSize?: {
            imageWidth: number,
            imageHeight: number
          } | null
        } | null> | null
      } | null> | null
    } | null> | null
  } | null
};

export type GeinsGetChannelVariablesType = Exact<{
  channelId?: InputMaybe<Scalars['String']['input']>;
}> | undefined;


export type GeinsGetChannelType = {
  channel?: {
    id: string,
    name: string,
    type: string,
    url: string,
    defaultLanguageId: string,
    defaultMarketId: string,
    markets?: Array<{
      id: string,
      alias?: string | null,
      onlyDisplayInCheckout?: boolean | null,
      virtual?: boolean | null,
      groupKey: string,
      allowedLanguages?: Array<{
        id: string,
        name: string,
        code: string
      } | null> | null,
      country?: {
        name: string,
        code: string
      } | null,
      currency?: {
        code: string,
        symbol: string
      } | null
    } | null> | null,
    languages?: Array<{
      id: string,
      name: string,
      code: string
    } | null> | null
  } | null
};

export type GeinsGetChannelsVariablesType = Exact<{ [key: string]: never; }> | undefined;


export type GeinsGetChannelsType = {
  channels?: Array<{
    id: string,
    name: string,
    type: string,
    url: string,
    defaultLanguageId: string,
    defaultMarketId: string,
    markets?: Array<{
      id: string,
      alias?: string | null,
      onlyDisplayInCheckout?: boolean | null,
      virtual?: boolean | null,
      groupKey: string,
      allowedLanguages?: Array<{
        id: string,
        name: string,
        code: string
      } | null> | null,
      country?: {
        name: string,
        code: string
      } | null,
      currency?: {
        code: string,
        symbol: string
      } | null
    } | null> | null,
    languages?: Array<{
      id: string,
      name: string,
      code: string
    } | null> | null
  } | null> | null
};

export type GeinsUserPasswordResetCommitVariablesType = Exact<{
  resetKey: Scalars['String']['input'];
  password: Scalars['String']['input'];
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GeinsUserPasswordResetCommitType = {
  commitReset?: boolean | null
};

export type GeinsUserRequestPasswordResetVariablesType = Exact<{
  email: Scalars['String']['input'];
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GeinsUserRequestPasswordResetType = {
  requestPasswordReset?: boolean | null
};

export type GeinsUserOrdersVariablesType = Exact<{
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}> | undefined;


export type GeinsUserOrdersType = {
  getOrders?: Array<{
    createdAt?: string | null,
    id?: number | null,
    status: string,
    cart?: {
      id?: string | null,
      promoCode?: string | null,
      appliedCampaigns?: Array<{
        name?: string | null,
        hideTitle?: boolean | null
      } | null> | null,
      items?: Array<{
        quantity: number,
        skuId: number,
        campaign?: {
          appliedCampaigns?: Array<{
            name?: string | null,
            hideTitle?: boolean | null
          } | null> | null,
          prices?: Array<{
            quantity: number,
            price?: {
              isDiscounted: boolean,
              sellingPriceIncVat: number,
              sellingPriceExVat: number,
              regularPriceIncVat: number,
              regularPriceExVat: number,
              vat: number,
              discountPercentage: number,
              regularPriceIncVatFormatted?: string | null,
              sellingPriceIncVatFormatted?: string | null,
              regularPriceExVatFormatted?: string | null,
              sellingPriceExVatFormatted?: string | null
            } | null
          } | null> | null
        } | null,
        unitPrice?: {
          isDiscounted: boolean,
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          vat: number,
          discountPercentage: number,
          regularPriceIncVatFormatted?: string | null,
          sellingPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null
        } | null,
        product?: {
          productId: number,
          articleNumber?: string | null,
          name?: string | null,
          alias: string,
          canonicalUrl?: string | null,
          brand?: {
            name?: string | null
          } | null,
          productImages?: Array<{
            fileName: string
          } | null> | null,
          primaryCategory?: {
            name: string
          } | null,
          skus?: Array<{
            skuId: number,
            name?: string | null,
            stock?: {
              inStock: number,
              oversellable: number,
              totalStock: number,
              static?: number | null,
              incoming?: string | null
            } | null
          } | null> | null,
          unitPrice?: {
            isDiscounted: boolean,
            sellingPriceIncVat: number,
            sellingPriceExVat: number,
            regularPriceIncVat: number,
            regularPriceExVat: number,
            vat: number,
            discountPercentage: number,
            regularPriceIncVatFormatted?: string | null,
            sellingPriceIncVatFormatted?: string | null,
            regularPriceExVatFormatted?: string | null,
            sellingPriceExVatFormatted?: string | null
          } | null
        } | null,
        totalPrice?: {
          isDiscounted: boolean,
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          vat: number,
          discountPercentage: number,
          regularPriceIncVatFormatted?: string | null,
          sellingPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null
        } | null
      } | null> | null,
      summary?: {
        fixedAmountDiscountIncVat: number,
        fixedAmountDiscountExVat: number,
        balance?: {
          pending: number,
          pendingFormatted?: string | null,
          totalSellingPriceExBalanceExVat: number,
          totalSellingPriceExBalanceIncVat: number,
          totalSellingPriceExBalanceIncVatFormatted?: string | null
        } | null,
        subTotal?: {
          regularPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          sellingPriceExVat: number,
          sellingPriceIncVat: number,
          vat: number
        } | null,
        shipping?: {
          amountLeftToFreeShipping: number,
          amountLeftToFreeShippingFormatted?: string | null,
          feeExVatFormatted?: string | null,
          feeIncVatFormatted?: string | null,
          feeIncVat: number,
          feeExVat: number,
          isDefault: boolean
        } | null,
        total?: {
          isDiscounted: boolean,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          discountIncVatFormatted?: string | null,
          discountExVatFormatted?: string | null,
          discountExVat: number,
          discountIncVat: number,
          vatFormatted?: string | null,
          vat: number
        } | null
      } | null
    } | null,
    billingAddress?: {
      firstName: string,
      lastName: string,
      company: string,
      mobile: string,
      phone: string,
      careOf: string,
      entryCode: string,
      addressLine1: string,
      addressLine2: string,
      addressLine3: string,
      zip: string,
      city: string,
      state: string,
      country: string
    } | null,
    shippingAddress?: {
      firstName: string,
      lastName: string,
      company: string,
      mobile: string,
      phone: string,
      careOf: string,
      entryCode: string,
      addressLine1: string,
      addressLine2: string,
      addressLine3: string,
      zip: string,
      city: string,
      state: string,
      country: string
    } | null,
    shippingDetails?: Array<{
      name: string,
      trackingLink?: string | null
    } | null> | null,
    paymentDetails?: Array<{
      displayName: string
    } | null> | null,
    refunds?: Array<{
      id: number,
      itemId: number,
      createdAt: string,
      reason?: string | null,
      total: number,
      vat: number
    } | null> | null
  } | null> | null
};

export type GeinsUserDeleteVariablesType = Exact<{ [key: string]: never; }>;


export type GeinsUserDeleteType = {
  deleteUser?: boolean | null
};

export type GeinsUserGetVariablesType = Exact<{ [key: string]: never; }> | undefined;


export type GeinsUserGetType = {
  getUser?: {
    id: number,
    email: string,
    personalId?: string | null,
    customerType?: GeinsCustomerType | null,
    gender?: GeinsGender | null,
    metaData?: string | null,
    address?: {
      firstName: string,
      lastName: string,
      company: string,
      mobile: string,
      phone: string,
      careOf: string,
      entryCode: string,
      addressLine1: string,
      addressLine2: string,
      addressLine3: string,
      zip: string,
      city: string,
      state: string,
      country: string
    } | null,
    balances?: Array<{
      currency: string,
      amount: number
    } | null> | null
  } | null
};

export type GeinsUserCreateVariablesType = Exact<{
  user: GeinsUserInputTypeType;
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GeinsUserCreateType = {
  updateUser?: {
    email: string
  } | null
};

export type GeinsUserUpdateVariablesType = Exact<{
  user: GeinsUserInputTypeType;
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GeinsUserUpdateType = {
  updateUser?: {
    id: number,
    email: string,
    personalId?: string | null,
    customerType?: GeinsCustomerType | null,
    gender?: GeinsGender | null,
    metaData?: string | null,
    address?: {
      firstName: string,
      lastName: string,
      company: string,
      mobile: string,
      phone: string,
      careOf: string,
      entryCode: string,
      addressLine1: string,
      addressLine2: string,
      addressLine3: string,
      zip: string,
      city: string,
      state: string,
      country: string
    } | null,
    balances?: Array<{
      currency: string,
      amount: number
    } | null> | null
  } | null
};

export type GeinsAddToCartVariablesType = Exact<{
  id: Scalars['String']['input'];
  item: GeinsCartItemInputTypeType;
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GeinsAddToCartType = {
  addToCart?: {
    __typename: 'CartType',
    id?: string | null,
    isCompleted: boolean,
    merchantData?: string | null,
    promoCode?: string | null,
    appliedCampaigns?: Array<{
      __typename: 'CampaignRuleType',
      campaignId: string,
      name?: string | null,
      hideTitle?: boolean | null
    } | null> | null,
    items?: Array<{
      __typename: 'CartItemType',
      id: string | number,
      groupKey?: string | number | null,
      skuId: number,
      quantity: number,
      message?: string | null,
      productPackage?: {
        __typename: 'ProductPackageCartItemType',
        packageId: number,
        packageName: string,
        groupId: number,
        optionId: number
      } | null,
      campaign?: {
        __typename: 'CampaignType',
        appliedCampaigns?: Array<{
          __typename: 'CampaignRuleType',
          campaignId: string,
          name?: string | null,
          hideTitle?: boolean | null
        } | null> | null,
        prices?: Array<{
          __typename: 'CampaignPriceType',
          quantity: number,
          price?: {
            __typename: 'PriceType',
            sellingPriceIncVat: number,
            sellingPriceExVat: number,
            regularPriceIncVat: number,
            regularPriceExVat: number,
            discountIncVat: number,
            discountExVat: number,
            discountPercentage: number,
            vat: number,
            isDiscounted: boolean,
            sellingPriceIncVatFormatted?: string | null,
            sellingPriceExVatFormatted?: string | null,
            regularPriceIncVatFormatted?: string | null,
            regularPriceExVatFormatted?: string | null,
            discountIncVatFormatted?: string | null,
            discountExVatFormatted?: string | null,
            vatFormatted?: string | null,
            currency?: {
              __typename: 'CurrencyType',
              code: string,
              symbol: string,
              rate: number,
              name: string
            } | null
          } | null
        } | null> | null
      } | null,
      product?: {
        __typename: 'ProductType',
        productId: number,
        articleNumber?: string | null,
        name?: string | null,
        alias: string,
        canonicalUrl?: string | null,
        brand?: {
          __typename: 'BrandType',
          name?: string | null
        } | null,
        productImages?: Array<{
          __typename: 'ProductImageType',
          fileName: string
        } | null> | null,
        primaryCategory?: {
          __typename: 'CategoryType',
          categoryId: number,
          name: string,
          order: number
        } | null,
        categories?: Array<{
          __typename: 'CategoryType',
          categoryId: number,
          name: string,
          order: number
        } | null> | null,
        skus?: Array<{
          __typename: 'SkuType',
          skuId: number,
          name?: string | null,
          stock?: {
            __typename: 'StockType',
            inStock: number,
            oversellable: number,
            totalStock: number,
            static?: number | null
          } | null
        } | null> | null,
        unitPrice?: {
          __typename: 'PriceType',
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          discountIncVat: number,
          discountExVat: number,
          discountPercentage: number,
          vat: number,
          isDiscounted: boolean,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          regularPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          discountIncVatFormatted?: string | null,
          discountExVatFormatted?: string | null,
          vatFormatted?: string | null,
          currency?: {
            __typename: 'CurrencyType',
            code: string,
            symbol: string,
            rate: number,
            name: string
          } | null
        } | null
      } | null,
      unitPrice?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null,
      totalPrice?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null
    } | null> | null,
    summary?: {
      __typename: 'CartSummaryType',
      fixedAmountDiscountIncVat: number,
      fixedAmountDiscountExVat: number,
      balance?: {
        __typename: 'BalanceType',
        pending: number,
        pendingFormatted?: string | null,
        totalSellingPriceExBalanceExVat: number,
        totalSellingPriceExBalanceIncVat: number,
        totalSellingPriceExBalanceIncVatFormatted?: string | null
      } | null,
      subTotal?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null,
      shipping?: {
        __typename: 'ShippingOptionType',
        amountLeftToFreeShipping: number,
        amountLeftToFreeShippingFormatted?: string | null,
        feeExVatFormatted?: string | null,
        feeIncVatFormatted?: string | null,
        feeIncVat: number,
        feeExVat: number,
        isDefault: boolean
      } | null,
      total?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null
    } | null
  } | null
};

export type GeinsAddPackageToCartVariablesType = Exact<{
  id: Scalars['String']['input'];
  packageId: Scalars['Int']['input'];
  selections?: InputMaybe<Array<InputMaybe<GeinsProductPackageSelectionTypeType>> | InputMaybe<GeinsProductPackageSelectionTypeType>>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GeinsAddPackageToCartType = {
  addPackageToCart?: {
    __typename: 'CartType',
    id?: string | null,
    isCompleted: boolean,
    merchantData?: string | null,
    promoCode?: string | null,
    appliedCampaigns?: Array<{
      __typename: 'CampaignRuleType',
      campaignId: string,
      name?: string | null,
      hideTitle?: boolean | null
    } | null> | null,
    items?: Array<{
      __typename: 'CartItemType',
      id: string | number,
      groupKey?: string | number | null,
      skuId: number,
      quantity: number,
      message?: string | null,
      productPackage?: {
        __typename: 'ProductPackageCartItemType',
        packageId: number,
        packageName: string,
        groupId: number,
        optionId: number
      } | null,
      campaign?: {
        __typename: 'CampaignType',
        appliedCampaigns?: Array<{
          __typename: 'CampaignRuleType',
          campaignId: string,
          name?: string | null,
          hideTitle?: boolean | null
        } | null> | null,
        prices?: Array<{
          __typename: 'CampaignPriceType',
          quantity: number,
          price?: {
            __typename: 'PriceType',
            sellingPriceIncVat: number,
            sellingPriceExVat: number,
            regularPriceIncVat: number,
            regularPriceExVat: number,
            discountIncVat: number,
            discountExVat: number,
            discountPercentage: number,
            vat: number,
            isDiscounted: boolean,
            sellingPriceIncVatFormatted?: string | null,
            sellingPriceExVatFormatted?: string | null,
            regularPriceIncVatFormatted?: string | null,
            regularPriceExVatFormatted?: string | null,
            discountIncVatFormatted?: string | null,
            discountExVatFormatted?: string | null,
            vatFormatted?: string | null,
            currency?: {
              __typename: 'CurrencyType',
              code: string,
              symbol: string,
              rate: number,
              name: string
            } | null
          } | null
        } | null> | null
      } | null,
      product?: {
        __typename: 'ProductType',
        productId: number,
        articleNumber?: string | null,
        name?: string | null,
        alias: string,
        canonicalUrl?: string | null,
        brand?: {
          __typename: 'BrandType',
          name?: string | null
        } | null,
        productImages?: Array<{
          __typename: 'ProductImageType',
          fileName: string
        } | null> | null,
        primaryCategory?: {
          __typename: 'CategoryType',
          categoryId: number,
          name: string,
          order: number
        } | null,
        categories?: Array<{
          __typename: 'CategoryType',
          categoryId: number,
          name: string,
          order: number
        } | null> | null,
        skus?: Array<{
          __typename: 'SkuType',
          skuId: number,
          name?: string | null,
          stock?: {
            __typename: 'StockType',
            inStock: number,
            oversellable: number,
            totalStock: number,
            static?: number | null
          } | null
        } | null> | null,
        unitPrice?: {
          __typename: 'PriceType',
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          discountIncVat: number,
          discountExVat: number,
          discountPercentage: number,
          vat: number,
          isDiscounted: boolean,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          regularPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          discountIncVatFormatted?: string | null,
          discountExVatFormatted?: string | null,
          vatFormatted?: string | null,
          currency?: {
            __typename: 'CurrencyType',
            code: string,
            symbol: string,
            rate: number,
            name: string
          } | null
        } | null
      } | null,
      unitPrice?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null,
      totalPrice?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null
    } | null> | null,
    summary?: {
      __typename: 'CartSummaryType',
      fixedAmountDiscountIncVat: number,
      fixedAmountDiscountExVat: number,
      balance?: {
        __typename: 'BalanceType',
        pending: number,
        pendingFormatted?: string | null,
        totalSellingPriceExBalanceExVat: number,
        totalSellingPriceExBalanceIncVat: number,
        totalSellingPriceExBalanceIncVatFormatted?: string | null
      } | null,
      subTotal?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null,
      shipping?: {
        __typename: 'ShippingOptionType',
        amountLeftToFreeShipping: number,
        amountLeftToFreeShippingFormatted?: string | null,
        feeExVatFormatted?: string | null,
        feeIncVatFormatted?: string | null,
        feeIncVat: number,
        feeExVat: number,
        isDefault: boolean
      } | null,
      total?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null
    } | null
  } | null
};

export type GeinsCloneCartVariablesType = Exact<{
  id: Scalars['String']['input'];
  resetPromotions?: InputMaybe<Scalars['Boolean']['input']>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GeinsCloneCartType = {
  cloneCart?: {
    __typename: 'CartType',
    id?: string | null,
    isCompleted: boolean,
    merchantData?: string | null,
    promoCode?: string | null,
    appliedCampaigns?: Array<{
      __typename: 'CampaignRuleType',
      campaignId: string,
      name?: string | null,
      hideTitle?: boolean | null
    } | null> | null,
    items?: Array<{
      __typename: 'CartItemType',
      id: string | number,
      groupKey?: string | number | null,
      skuId: number,
      quantity: number,
      message?: string | null,
      productPackage?: {
        __typename: 'ProductPackageCartItemType',
        packageId: number,
        packageName: string,
        groupId: number,
        optionId: number
      } | null,
      campaign?: {
        __typename: 'CampaignType',
        appliedCampaigns?: Array<{
          __typename: 'CampaignRuleType',
          campaignId: string,
          name?: string | null,
          hideTitle?: boolean | null
        } | null> | null,
        prices?: Array<{
          __typename: 'CampaignPriceType',
          quantity: number,
          price?: {
            __typename: 'PriceType',
            sellingPriceIncVat: number,
            sellingPriceExVat: number,
            regularPriceIncVat: number,
            regularPriceExVat: number,
            discountIncVat: number,
            discountExVat: number,
            discountPercentage: number,
            vat: number,
            isDiscounted: boolean,
            sellingPriceIncVatFormatted?: string | null,
            sellingPriceExVatFormatted?: string | null,
            regularPriceIncVatFormatted?: string | null,
            regularPriceExVatFormatted?: string | null,
            discountIncVatFormatted?: string | null,
            discountExVatFormatted?: string | null,
            vatFormatted?: string | null,
            currency?: {
              __typename: 'CurrencyType',
              code: string,
              symbol: string,
              rate: number,
              name: string
            } | null
          } | null
        } | null> | null
      } | null,
      product?: {
        __typename: 'ProductType',
        productId: number,
        articleNumber?: string | null,
        name?: string | null,
        alias: string,
        canonicalUrl?: string | null,
        brand?: {
          __typename: 'BrandType',
          name?: string | null
        } | null,
        productImages?: Array<{
          __typename: 'ProductImageType',
          fileName: string
        } | null> | null,
        primaryCategory?: {
          __typename: 'CategoryType',
          categoryId: number,
          name: string,
          order: number
        } | null,
        categories?: Array<{
          __typename: 'CategoryType',
          categoryId: number,
          name: string,
          order: number
        } | null> | null,
        skus?: Array<{
          __typename: 'SkuType',
          skuId: number,
          name?: string | null,
          stock?: {
            __typename: 'StockType',
            inStock: number,
            oversellable: number,
            totalStock: number,
            static?: number | null
          } | null
        } | null> | null,
        unitPrice?: {
          __typename: 'PriceType',
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          discountIncVat: number,
          discountExVat: number,
          discountPercentage: number,
          vat: number,
          isDiscounted: boolean,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          regularPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          discountIncVatFormatted?: string | null,
          discountExVatFormatted?: string | null,
          vatFormatted?: string | null,
          currency?: {
            __typename: 'CurrencyType',
            code: string,
            symbol: string,
            rate: number,
            name: string
          } | null
        } | null
      } | null,
      unitPrice?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null,
      totalPrice?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null
    } | null> | null,
    summary?: {
      __typename: 'CartSummaryType',
      fixedAmountDiscountIncVat: number,
      fixedAmountDiscountExVat: number,
      balance?: {
        __typename: 'BalanceType',
        pending: number,
        pendingFormatted?: string | null,
        totalSellingPriceExBalanceExVat: number,
        totalSellingPriceExBalanceIncVat: number,
        totalSellingPriceExBalanceIncVatFormatted?: string | null
      } | null,
      subTotal?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null,
      shipping?: {
        __typename: 'ShippingOptionType',
        amountLeftToFreeShipping: number,
        amountLeftToFreeShippingFormatted?: string | null,
        feeExVatFormatted?: string | null,
        feeIncVatFormatted?: string | null,
        feeIncVat: number,
        feeExVat: number,
        isDefault: boolean
      } | null,
      total?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null
    } | null
  } | null
};

export type GeinsCompleteCartVariablesType = Exact<{
  id: Scalars['String']['input'];
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GeinsCompleteCartType = {
  completeCart?: {
    __typename: 'CartType',
    id?: string | null,
    isCompleted: boolean,
    merchantData?: string | null,
    promoCode?: string | null,
    appliedCampaigns?: Array<{
      __typename: 'CampaignRuleType',
      campaignId: string,
      name?: string | null,
      hideTitle?: boolean | null
    } | null> | null,
    items?: Array<{
      __typename: 'CartItemType',
      id: string | number,
      groupKey?: string | number | null,
      skuId: number,
      quantity: number,
      message?: string | null,
      productPackage?: {
        __typename: 'ProductPackageCartItemType',
        packageId: number,
        packageName: string,
        groupId: number,
        optionId: number
      } | null,
      campaign?: {
        __typename: 'CampaignType',
        appliedCampaigns?: Array<{
          __typename: 'CampaignRuleType',
          campaignId: string,
          name?: string | null,
          hideTitle?: boolean | null
        } | null> | null,
        prices?: Array<{
          __typename: 'CampaignPriceType',
          quantity: number,
          price?: {
            __typename: 'PriceType',
            sellingPriceIncVat: number,
            sellingPriceExVat: number,
            regularPriceIncVat: number,
            regularPriceExVat: number,
            discountIncVat: number,
            discountExVat: number,
            discountPercentage: number,
            vat: number,
            isDiscounted: boolean,
            sellingPriceIncVatFormatted?: string | null,
            sellingPriceExVatFormatted?: string | null,
            regularPriceIncVatFormatted?: string | null,
            regularPriceExVatFormatted?: string | null,
            discountIncVatFormatted?: string | null,
            discountExVatFormatted?: string | null,
            vatFormatted?: string | null,
            currency?: {
              __typename: 'CurrencyType',
              code: string,
              symbol: string,
              rate: number,
              name: string
            } | null
          } | null
        } | null> | null
      } | null,
      product?: {
        __typename: 'ProductType',
        productId: number,
        articleNumber?: string | null,
        name?: string | null,
        alias: string,
        canonicalUrl?: string | null,
        brand?: {
          __typename: 'BrandType',
          name?: string | null
        } | null,
        productImages?: Array<{
          __typename: 'ProductImageType',
          fileName: string
        } | null> | null,
        primaryCategory?: {
          __typename: 'CategoryType',
          categoryId: number,
          name: string,
          order: number
        } | null,
        categories?: Array<{
          __typename: 'CategoryType',
          categoryId: number,
          name: string,
          order: number
        } | null> | null,
        skus?: Array<{
          __typename: 'SkuType',
          skuId: number,
          name?: string | null,
          stock?: {
            __typename: 'StockType',
            inStock: number,
            oversellable: number,
            totalStock: number,
            static?: number | null
          } | null
        } | null> | null,
        unitPrice?: {
          __typename: 'PriceType',
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          discountIncVat: number,
          discountExVat: number,
          discountPercentage: number,
          vat: number,
          isDiscounted: boolean,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          regularPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          discountIncVatFormatted?: string | null,
          discountExVatFormatted?: string | null,
          vatFormatted?: string | null,
          currency?: {
            __typename: 'CurrencyType',
            code: string,
            symbol: string,
            rate: number,
            name: string
          } | null
        } | null
      } | null,
      unitPrice?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null,
      totalPrice?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null
    } | null> | null,
    summary?: {
      __typename: 'CartSummaryType',
      fixedAmountDiscountIncVat: number,
      fixedAmountDiscountExVat: number,
      balance?: {
        __typename: 'BalanceType',
        pending: number,
        pendingFormatted?: string | null,
        totalSellingPriceExBalanceExVat: number,
        totalSellingPriceExBalanceIncVat: number,
        totalSellingPriceExBalanceIncVatFormatted?: string | null
      } | null,
      subTotal?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null,
      shipping?: {
        __typename: 'ShippingOptionType',
        amountLeftToFreeShipping: number,
        amountLeftToFreeShippingFormatted?: string | null,
        feeExVatFormatted?: string | null,
        feeIncVatFormatted?: string | null,
        feeIncVat: number,
        feeExVat: number,
        isDefault: boolean
      } | null,
      total?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null
    } | null
  } | null
};

export type GeinsCreateCartVariablesType = Exact<{
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}> | undefined;


export type GeinsCreateCartType = {
  getCart?: {
    __typename: 'CartType',
    id?: string | null,
    isCompleted: boolean,
    merchantData?: string | null,
    promoCode?: string | null,
    appliedCampaigns?: Array<{
      __typename: 'CampaignRuleType',
      campaignId: string,
      name?: string | null,
      hideTitle?: boolean | null
    } | null> | null,
    items?: Array<{
      __typename: 'CartItemType',
      id: string | number,
      groupKey?: string | number | null,
      skuId: number,
      quantity: number,
      message?: string | null,
      productPackage?: {
        __typename: 'ProductPackageCartItemType',
        packageId: number,
        packageName: string,
        groupId: number,
        optionId: number
      } | null,
      campaign?: {
        __typename: 'CampaignType',
        appliedCampaigns?: Array<{
          __typename: 'CampaignRuleType',
          campaignId: string,
          name?: string | null,
          hideTitle?: boolean | null
        } | null> | null,
        prices?: Array<{
          __typename: 'CampaignPriceType',
          quantity: number,
          price?: {
            __typename: 'PriceType',
            sellingPriceIncVat: number,
            sellingPriceExVat: number,
            regularPriceIncVat: number,
            regularPriceExVat: number,
            discountIncVat: number,
            discountExVat: number,
            discountPercentage: number,
            vat: number,
            isDiscounted: boolean,
            sellingPriceIncVatFormatted?: string | null,
            sellingPriceExVatFormatted?: string | null,
            regularPriceIncVatFormatted?: string | null,
            regularPriceExVatFormatted?: string | null,
            discountIncVatFormatted?: string | null,
            discountExVatFormatted?: string | null,
            vatFormatted?: string | null,
            currency?: {
              __typename: 'CurrencyType',
              code: string,
              symbol: string,
              rate: number,
              name: string
            } | null
          } | null
        } | null> | null
      } | null,
      product?: {
        __typename: 'ProductType',
        productId: number,
        articleNumber?: string | null,
        name?: string | null,
        alias: string,
        canonicalUrl?: string | null,
        brand?: {
          __typename: 'BrandType',
          name?: string | null
        } | null,
        productImages?: Array<{
          __typename: 'ProductImageType',
          fileName: string
        } | null> | null,
        primaryCategory?: {
          __typename: 'CategoryType',
          categoryId: number,
          name: string,
          order: number
        } | null,
        categories?: Array<{
          __typename: 'CategoryType',
          categoryId: number,
          name: string,
          order: number
        } | null> | null,
        skus?: Array<{
          __typename: 'SkuType',
          skuId: number,
          name?: string | null,
          stock?: {
            __typename: 'StockType',
            inStock: number,
            oversellable: number,
            totalStock: number,
            static?: number | null
          } | null
        } | null> | null,
        unitPrice?: {
          __typename: 'PriceType',
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          discountIncVat: number,
          discountExVat: number,
          discountPercentage: number,
          vat: number,
          isDiscounted: boolean,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          regularPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          discountIncVatFormatted?: string | null,
          discountExVatFormatted?: string | null,
          vatFormatted?: string | null,
          currency?: {
            __typename: 'CurrencyType',
            code: string,
            symbol: string,
            rate: number,
            name: string
          } | null
        } | null
      } | null,
      unitPrice?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null,
      totalPrice?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null
    } | null> | null,
    summary?: {
      __typename: 'CartSummaryType',
      fixedAmountDiscountIncVat: number,
      fixedAmountDiscountExVat: number,
      balance?: {
        __typename: 'BalanceType',
        pending: number,
        pendingFormatted?: string | null,
        totalSellingPriceExBalanceExVat: number,
        totalSellingPriceExBalanceIncVat: number,
        totalSellingPriceExBalanceIncVatFormatted?: string | null
      } | null,
      subTotal?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null,
      shipping?: {
        __typename: 'ShippingOptionType',
        amountLeftToFreeShipping: number,
        amountLeftToFreeShippingFormatted?: string | null,
        feeExVatFormatted?: string | null,
        feeIncVatFormatted?: string | null,
        feeIncVat: number,
        feeExVat: number,
        isDefault: boolean
      } | null,
      total?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null
    } | null
  } | null
};

export type GeinsGetCartVariablesType = Exact<{
  id?: InputMaybe<Scalars['String']['input']>;
  forceRefresh?: InputMaybe<Scalars['Boolean']['input']>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}> | undefined;


export type GeinsGetCartType = {
  getCart?: {
    __typename: 'CartType',
    id?: string | null,
    isCompleted: boolean,
    merchantData?: string | null,
    promoCode?: string | null,
    appliedCampaigns?: Array<{
      __typename: 'CampaignRuleType',
      campaignId: string,
      name?: string | null,
      hideTitle?: boolean | null
    } | null> | null,
    items?: Array<{
      __typename: 'CartItemType',
      id: string | number,
      groupKey?: string | number | null,
      skuId: number,
      quantity: number,
      message?: string | null,
      productPackage?: {
        __typename: 'ProductPackageCartItemType',
        packageId: number,
        packageName: string,
        groupId: number,
        optionId: number
      } | null,
      campaign?: {
        __typename: 'CampaignType',
        appliedCampaigns?: Array<{
          __typename: 'CampaignRuleType',
          campaignId: string,
          name?: string | null,
          hideTitle?: boolean | null
        } | null> | null,
        prices?: Array<{
          __typename: 'CampaignPriceType',
          quantity: number,
          price?: {
            __typename: 'PriceType',
            sellingPriceIncVat: number,
            sellingPriceExVat: number,
            regularPriceIncVat: number,
            regularPriceExVat: number,
            discountIncVat: number,
            discountExVat: number,
            discountPercentage: number,
            vat: number,
            isDiscounted: boolean,
            sellingPriceIncVatFormatted?: string | null,
            sellingPriceExVatFormatted?: string | null,
            regularPriceIncVatFormatted?: string | null,
            regularPriceExVatFormatted?: string | null,
            discountIncVatFormatted?: string | null,
            discountExVatFormatted?: string | null,
            vatFormatted?: string | null,
            currency?: {
              __typename: 'CurrencyType',
              code: string,
              symbol: string,
              rate: number,
              name: string
            } | null
          } | null
        } | null> | null
      } | null,
      product?: {
        __typename: 'ProductType',
        productId: number,
        articleNumber?: string | null,
        name?: string | null,
        alias: string,
        canonicalUrl?: string | null,
        brand?: {
          __typename: 'BrandType',
          name?: string | null
        } | null,
        productImages?: Array<{
          __typename: 'ProductImageType',
          fileName: string
        } | null> | null,
        primaryCategory?: {
          __typename: 'CategoryType',
          categoryId: number,
          name: string,
          order: number
        } | null,
        categories?: Array<{
          __typename: 'CategoryType',
          categoryId: number,
          name: string,
          order: number
        } | null> | null,
        skus?: Array<{
          __typename: 'SkuType',
          skuId: number,
          name?: string | null,
          stock?: {
            __typename: 'StockType',
            inStock: number,
            oversellable: number,
            totalStock: number,
            static?: number | null
          } | null
        } | null> | null,
        unitPrice?: {
          __typename: 'PriceType',
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          discountIncVat: number,
          discountExVat: number,
          discountPercentage: number,
          vat: number,
          isDiscounted: boolean,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          regularPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          discountIncVatFormatted?: string | null,
          discountExVatFormatted?: string | null,
          vatFormatted?: string | null,
          currency?: {
            __typename: 'CurrencyType',
            code: string,
            symbol: string,
            rate: number,
            name: string
          } | null
        } | null
      } | null,
      unitPrice?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null,
      totalPrice?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null
    } | null> | null,
    summary?: {
      __typename: 'CartSummaryType',
      fixedAmountDiscountIncVat: number,
      fixedAmountDiscountExVat: number,
      balance?: {
        __typename: 'BalanceType',
        pending: number,
        pendingFormatted?: string | null,
        totalSellingPriceExBalanceExVat: number,
        totalSellingPriceExBalanceIncVat: number,
        totalSellingPriceExBalanceIncVatFormatted?: string | null
      } | null,
      subTotal?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null,
      shipping?: {
        __typename: 'ShippingOptionType',
        amountLeftToFreeShipping: number,
        amountLeftToFreeShippingFormatted?: string | null,
        feeExVatFormatted?: string | null,
        feeIncVatFormatted?: string | null,
        feeIncVat: number,
        feeExVat: number,
        isDefault: boolean
      } | null,
      total?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null
    } | null
  } | null
};

export type GeinsSetCartMerchantDataVariablesType = Exact<{
  id: Scalars['String']['input'];
  merchantData: Scalars['String']['input'];
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GeinsSetCartMerchantDataType = {
  setCartMerchantData?: {
    __typename: 'CartType',
    id?: string | null,
    isCompleted: boolean,
    merchantData?: string | null,
    promoCode?: string | null,
    appliedCampaigns?: Array<{
      __typename: 'CampaignRuleType',
      campaignId: string,
      name?: string | null,
      hideTitle?: boolean | null
    } | null> | null,
    items?: Array<{
      __typename: 'CartItemType',
      id: string | number,
      groupKey?: string | number | null,
      skuId: number,
      quantity: number,
      message?: string | null,
      productPackage?: {
        __typename: 'ProductPackageCartItemType',
        packageId: number,
        packageName: string,
        groupId: number,
        optionId: number
      } | null,
      campaign?: {
        __typename: 'CampaignType',
        appliedCampaigns?: Array<{
          __typename: 'CampaignRuleType',
          campaignId: string,
          name?: string | null,
          hideTitle?: boolean | null
        } | null> | null,
        prices?: Array<{
          __typename: 'CampaignPriceType',
          quantity: number,
          price?: {
            __typename: 'PriceType',
            sellingPriceIncVat: number,
            sellingPriceExVat: number,
            regularPriceIncVat: number,
            regularPriceExVat: number,
            discountIncVat: number,
            discountExVat: number,
            discountPercentage: number,
            vat: number,
            isDiscounted: boolean,
            sellingPriceIncVatFormatted?: string | null,
            sellingPriceExVatFormatted?: string | null,
            regularPriceIncVatFormatted?: string | null,
            regularPriceExVatFormatted?: string | null,
            discountIncVatFormatted?: string | null,
            discountExVatFormatted?: string | null,
            vatFormatted?: string | null,
            currency?: {
              __typename: 'CurrencyType',
              code: string,
              symbol: string,
              rate: number,
              name: string
            } | null
          } | null
        } | null> | null
      } | null,
      product?: {
        __typename: 'ProductType',
        productId: number,
        articleNumber?: string | null,
        name?: string | null,
        alias: string,
        canonicalUrl?: string | null,
        brand?: {
          __typename: 'BrandType',
          name?: string | null
        } | null,
        productImages?: Array<{
          __typename: 'ProductImageType',
          fileName: string
        } | null> | null,
        primaryCategory?: {
          __typename: 'CategoryType',
          categoryId: number,
          name: string,
          order: number
        } | null,
        categories?: Array<{
          __typename: 'CategoryType',
          categoryId: number,
          name: string,
          order: number
        } | null> | null,
        skus?: Array<{
          __typename: 'SkuType',
          skuId: number,
          name?: string | null,
          stock?: {
            __typename: 'StockType',
            inStock: number,
            oversellable: number,
            totalStock: number,
            static?: number | null
          } | null
        } | null> | null,
        unitPrice?: {
          __typename: 'PriceType',
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          discountIncVat: number,
          discountExVat: number,
          discountPercentage: number,
          vat: number,
          isDiscounted: boolean,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          regularPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          discountIncVatFormatted?: string | null,
          discountExVatFormatted?: string | null,
          vatFormatted?: string | null,
          currency?: {
            __typename: 'CurrencyType',
            code: string,
            symbol: string,
            rate: number,
            name: string
          } | null
        } | null
      } | null,
      unitPrice?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null,
      totalPrice?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null
    } | null> | null,
    summary?: {
      __typename: 'CartSummaryType',
      fixedAmountDiscountIncVat: number,
      fixedAmountDiscountExVat: number,
      balance?: {
        __typename: 'BalanceType',
        pending: number,
        pendingFormatted?: string | null,
        totalSellingPriceExBalanceExVat: number,
        totalSellingPriceExBalanceIncVat: number,
        totalSellingPriceExBalanceIncVatFormatted?: string | null
      } | null,
      subTotal?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null,
      shipping?: {
        __typename: 'ShippingOptionType',
        amountLeftToFreeShipping: number,
        amountLeftToFreeShippingFormatted?: string | null,
        feeExVatFormatted?: string | null,
        feeIncVatFormatted?: string | null,
        feeIncVat: number,
        feeExVat: number,
        isDefault: boolean
      } | null,
      total?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null
    } | null
  } | null
};

export type GeinsSetCartPromoCodeVariablesType = Exact<{
  id: Scalars['String']['input'];
  promoCode: Scalars['String']['input'];
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GeinsSetCartPromoCodeType = {
  setCartPromoCode?: {
    __typename: 'CartType',
    id?: string | null,
    isCompleted: boolean,
    merchantData?: string | null,
    promoCode?: string | null,
    appliedCampaigns?: Array<{
      __typename: 'CampaignRuleType',
      campaignId: string,
      name?: string | null,
      hideTitle?: boolean | null
    } | null> | null,
    items?: Array<{
      __typename: 'CartItemType',
      id: string | number,
      groupKey?: string | number | null,
      skuId: number,
      quantity: number,
      message?: string | null,
      productPackage?: {
        __typename: 'ProductPackageCartItemType',
        packageId: number,
        packageName: string,
        groupId: number,
        optionId: number
      } | null,
      campaign?: {
        __typename: 'CampaignType',
        appliedCampaigns?: Array<{
          __typename: 'CampaignRuleType',
          campaignId: string,
          name?: string | null,
          hideTitle?: boolean | null
        } | null> | null,
        prices?: Array<{
          __typename: 'CampaignPriceType',
          quantity: number,
          price?: {
            __typename: 'PriceType',
            sellingPriceIncVat: number,
            sellingPriceExVat: number,
            regularPriceIncVat: number,
            regularPriceExVat: number,
            discountIncVat: number,
            discountExVat: number,
            discountPercentage: number,
            vat: number,
            isDiscounted: boolean,
            sellingPriceIncVatFormatted?: string | null,
            sellingPriceExVatFormatted?: string | null,
            regularPriceIncVatFormatted?: string | null,
            regularPriceExVatFormatted?: string | null,
            discountIncVatFormatted?: string | null,
            discountExVatFormatted?: string | null,
            vatFormatted?: string | null,
            currency?: {
              __typename: 'CurrencyType',
              code: string,
              symbol: string,
              rate: number,
              name: string
            } | null
          } | null
        } | null> | null
      } | null,
      product?: {
        __typename: 'ProductType',
        productId: number,
        articleNumber?: string | null,
        name?: string | null,
        alias: string,
        canonicalUrl?: string | null,
        brand?: {
          __typename: 'BrandType',
          name?: string | null
        } | null,
        productImages?: Array<{
          __typename: 'ProductImageType',
          fileName: string
        } | null> | null,
        primaryCategory?: {
          __typename: 'CategoryType',
          categoryId: number,
          name: string,
          order: number
        } | null,
        categories?: Array<{
          __typename: 'CategoryType',
          categoryId: number,
          name: string,
          order: number
        } | null> | null,
        skus?: Array<{
          __typename: 'SkuType',
          skuId: number,
          name?: string | null,
          stock?: {
            __typename: 'StockType',
            inStock: number,
            oversellable: number,
            totalStock: number,
            static?: number | null
          } | null
        } | null> | null,
        unitPrice?: {
          __typename: 'PriceType',
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          discountIncVat: number,
          discountExVat: number,
          discountPercentage: number,
          vat: number,
          isDiscounted: boolean,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          regularPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          discountIncVatFormatted?: string | null,
          discountExVatFormatted?: string | null,
          vatFormatted?: string | null,
          currency?: {
            __typename: 'CurrencyType',
            code: string,
            symbol: string,
            rate: number,
            name: string
          } | null
        } | null
      } | null,
      unitPrice?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null,
      totalPrice?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null
    } | null> | null,
    summary?: {
      __typename: 'CartSummaryType',
      fixedAmountDiscountIncVat: number,
      fixedAmountDiscountExVat: number,
      balance?: {
        __typename: 'BalanceType',
        pending: number,
        pendingFormatted?: string | null,
        totalSellingPriceExBalanceExVat: number,
        totalSellingPriceExBalanceIncVat: number,
        totalSellingPriceExBalanceIncVatFormatted?: string | null
      } | null,
      subTotal?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null,
      shipping?: {
        __typename: 'ShippingOptionType',
        amountLeftToFreeShipping: number,
        amountLeftToFreeShippingFormatted?: string | null,
        feeExVatFormatted?: string | null,
        feeIncVatFormatted?: string | null,
        feeIncVat: number,
        feeExVat: number,
        isDefault: boolean
      } | null,
      total?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null
    } | null
  } | null
};

export type GeinsSetCartShippingFeeVariablesType = Exact<{
  id: Scalars['String']['input'];
  shippingFee: Scalars['Decimal']['input'];
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GeinsSetCartShippingFeeType = {
  setCartShippingFee?: {
    cart?: {
      __typename: 'CartType',
      id?: string | null,
      isCompleted: boolean,
      merchantData?: string | null,
      promoCode?: string | null,
      appliedCampaigns?: Array<{
        __typename: 'CampaignRuleType',
        campaignId: string,
        name?: string | null,
        hideTitle?: boolean | null
      } | null> | null,
      items?: Array<{
        __typename: 'CartItemType',
        id: string | number,
        groupKey?: string | number | null,
        skuId: number,
        quantity: number,
        message?: string | null,
        productPackage?: {
          __typename: 'ProductPackageCartItemType',
          packageId: number,
          packageName: string,
          groupId: number,
          optionId: number
        } | null,
        campaign?: {
          __typename: 'CampaignType',
          appliedCampaigns?: Array<{
            __typename: 'CampaignRuleType',
            campaignId: string,
            name?: string | null,
            hideTitle?: boolean | null
          } | null> | null,
          prices?: Array<{
            __typename: 'CampaignPriceType',
            quantity: number,
            price?: {
              __typename: 'PriceType',
              sellingPriceIncVat: number,
              sellingPriceExVat: number,
              regularPriceIncVat: number,
              regularPriceExVat: number,
              discountIncVat: number,
              discountExVat: number,
              discountPercentage: number,
              vat: number,
              isDiscounted: boolean,
              sellingPriceIncVatFormatted?: string | null,
              sellingPriceExVatFormatted?: string | null,
              regularPriceIncVatFormatted?: string | null,
              regularPriceExVatFormatted?: string | null,
              discountIncVatFormatted?: string | null,
              discountExVatFormatted?: string | null,
              vatFormatted?: string | null,
              currency?: {
                __typename: 'CurrencyType',
                code: string,
                symbol: string,
                rate: number,
                name: string
              } | null
            } | null
          } | null> | null
        } | null,
        product?: {
          __typename: 'ProductType',
          productId: number,
          articleNumber?: string | null,
          name?: string | null,
          alias: string,
          canonicalUrl?: string | null,
          brand?: {
            __typename: 'BrandType',
            name?: string | null
          } | null,
          productImages?: Array<{
            __typename: 'ProductImageType',
            fileName: string
          } | null> | null,
          primaryCategory?: {
            __typename: 'CategoryType',
            categoryId: number,
            name: string,
            order: number
          } | null,
          categories?: Array<{
            __typename: 'CategoryType',
            categoryId: number,
            name: string,
            order: number
          } | null> | null,
          skus?: Array<{
            __typename: 'SkuType',
            skuId: number,
            name?: string | null,
            stock?: {
              __typename: 'StockType',
              inStock: number,
              oversellable: number,
              totalStock: number,
              static?: number | null
            } | null
          } | null> | null,
          unitPrice?: {
            __typename: 'PriceType',
            sellingPriceIncVat: number,
            sellingPriceExVat: number,
            regularPriceIncVat: number,
            regularPriceExVat: number,
            discountIncVat: number,
            discountExVat: number,
            discountPercentage: number,
            vat: number,
            isDiscounted: boolean,
            sellingPriceIncVatFormatted?: string | null,
            sellingPriceExVatFormatted?: string | null,
            regularPriceIncVatFormatted?: string | null,
            regularPriceExVatFormatted?: string | null,
            discountIncVatFormatted?: string | null,
            discountExVatFormatted?: string | null,
            vatFormatted?: string | null,
            currency?: {
              __typename: 'CurrencyType',
              code: string,
              symbol: string,
              rate: number,
              name: string
            } | null
          } | null
        } | null,
        unitPrice?: {
          __typename: 'PriceType',
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          discountIncVat: number,
          discountExVat: number,
          discountPercentage: number,
          vat: number,
          isDiscounted: boolean,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          regularPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          discountIncVatFormatted?: string | null,
          discountExVatFormatted?: string | null,
          vatFormatted?: string | null,
          currency?: {
            __typename: 'CurrencyType',
            code: string,
            symbol: string,
            rate: number,
            name: string
          } | null
        } | null,
        totalPrice?: {
          __typename: 'PriceType',
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          discountIncVat: number,
          discountExVat: number,
          discountPercentage: number,
          vat: number,
          isDiscounted: boolean,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          regularPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          discountIncVatFormatted?: string | null,
          discountExVatFormatted?: string | null,
          vatFormatted?: string | null,
          currency?: {
            __typename: 'CurrencyType',
            code: string,
            symbol: string,
            rate: number,
            name: string
          } | null
        } | null
      } | null> | null,
      summary?: {
        __typename: 'CartSummaryType',
        fixedAmountDiscountIncVat: number,
        fixedAmountDiscountExVat: number,
        balance?: {
          __typename: 'BalanceType',
          pending: number,
          pendingFormatted?: string | null,
          totalSellingPriceExBalanceExVat: number,
          totalSellingPriceExBalanceIncVat: number,
          totalSellingPriceExBalanceIncVatFormatted?: string | null
        } | null,
        subTotal?: {
          __typename: 'PriceType',
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          discountIncVat: number,
          discountExVat: number,
          discountPercentage: number,
          vat: number,
          isDiscounted: boolean,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          regularPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          discountIncVatFormatted?: string | null,
          discountExVatFormatted?: string | null,
          vatFormatted?: string | null,
          currency?: {
            __typename: 'CurrencyType',
            code: string,
            symbol: string,
            rate: number,
            name: string
          } | null
        } | null,
        shipping?: {
          __typename: 'ShippingOptionType',
          amountLeftToFreeShipping: number,
          amountLeftToFreeShippingFormatted?: string | null,
          feeExVatFormatted?: string | null,
          feeIncVatFormatted?: string | null,
          feeIncVat: number,
          feeExVat: number,
          isDefault: boolean
        } | null,
        total?: {
          __typename: 'PriceType',
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          discountIncVat: number,
          discountExVat: number,
          discountPercentage: number,
          vat: number,
          isDiscounted: boolean,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          regularPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          discountIncVatFormatted?: string | null,
          discountExVatFormatted?: string | null,
          vatFormatted?: string | null,
          currency?: {
            __typename: 'CurrencyType',
            code: string,
            symbol: string,
            rate: number,
            name: string
          } | null
        } | null
      } | null
    } | null
  } | null
};

export type GeinsUpdateCartGroupVariablesType = Exact<{
  id: Scalars['String']['input'];
  item: GeinsCartGroupInputTypeType;
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GeinsUpdateCartGroupType = {
  updateCartGroup?: {
    __typename: 'CartType',
    id?: string | null,
    isCompleted: boolean,
    merchantData?: string | null,
    promoCode?: string | null,
    appliedCampaigns?: Array<{
      __typename: 'CampaignRuleType',
      campaignId: string,
      name?: string | null,
      hideTitle?: boolean | null
    } | null> | null,
    items?: Array<{
      __typename: 'CartItemType',
      id: string | number,
      groupKey?: string | number | null,
      skuId: number,
      quantity: number,
      message?: string | null,
      productPackage?: {
        __typename: 'ProductPackageCartItemType',
        packageId: number,
        packageName: string,
        groupId: number,
        optionId: number
      } | null,
      campaign?: {
        __typename: 'CampaignType',
        appliedCampaigns?: Array<{
          __typename: 'CampaignRuleType',
          campaignId: string,
          name?: string | null,
          hideTitle?: boolean | null
        } | null> | null,
        prices?: Array<{
          __typename: 'CampaignPriceType',
          quantity: number,
          price?: {
            __typename: 'PriceType',
            sellingPriceIncVat: number,
            sellingPriceExVat: number,
            regularPriceIncVat: number,
            regularPriceExVat: number,
            discountIncVat: number,
            discountExVat: number,
            discountPercentage: number,
            vat: number,
            isDiscounted: boolean,
            sellingPriceIncVatFormatted?: string | null,
            sellingPriceExVatFormatted?: string | null,
            regularPriceIncVatFormatted?: string | null,
            regularPriceExVatFormatted?: string | null,
            discountIncVatFormatted?: string | null,
            discountExVatFormatted?: string | null,
            vatFormatted?: string | null,
            currency?: {
              __typename: 'CurrencyType',
              code: string,
              symbol: string,
              rate: number,
              name: string
            } | null
          } | null
        } | null> | null
      } | null,
      product?: {
        __typename: 'ProductType',
        productId: number,
        articleNumber?: string | null,
        name?: string | null,
        alias: string,
        canonicalUrl?: string | null,
        brand?: {
          __typename: 'BrandType',
          name?: string | null
        } | null,
        productImages?: Array<{
          __typename: 'ProductImageType',
          fileName: string
        } | null> | null,
        primaryCategory?: {
          __typename: 'CategoryType',
          categoryId: number,
          name: string,
          order: number
        } | null,
        categories?: Array<{
          __typename: 'CategoryType',
          categoryId: number,
          name: string,
          order: number
        } | null> | null,
        skus?: Array<{
          __typename: 'SkuType',
          skuId: number,
          name?: string | null,
          stock?: {
            __typename: 'StockType',
            inStock: number,
            oversellable: number,
            totalStock: number,
            static?: number | null
          } | null
        } | null> | null,
        unitPrice?: {
          __typename: 'PriceType',
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          discountIncVat: number,
          discountExVat: number,
          discountPercentage: number,
          vat: number,
          isDiscounted: boolean,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          regularPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          discountIncVatFormatted?: string | null,
          discountExVatFormatted?: string | null,
          vatFormatted?: string | null,
          currency?: {
            __typename: 'CurrencyType',
            code: string,
            symbol: string,
            rate: number,
            name: string
          } | null
        } | null
      } | null,
      unitPrice?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null,
      totalPrice?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null
    } | null> | null,
    summary?: {
      __typename: 'CartSummaryType',
      fixedAmountDiscountIncVat: number,
      fixedAmountDiscountExVat: number,
      balance?: {
        __typename: 'BalanceType',
        pending: number,
        pendingFormatted?: string | null,
        totalSellingPriceExBalanceExVat: number,
        totalSellingPriceExBalanceIncVat: number,
        totalSellingPriceExBalanceIncVatFormatted?: string | null
      } | null,
      subTotal?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null,
      shipping?: {
        __typename: 'ShippingOptionType',
        amountLeftToFreeShipping: number,
        amountLeftToFreeShippingFormatted?: string | null,
        feeExVatFormatted?: string | null,
        feeIncVatFormatted?: string | null,
        feeIncVat: number,
        feeExVat: number,
        isDefault: boolean
      } | null,
      total?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null
    } | null
  } | null
};

export type GeinsUpdateSilentCartItemVariablesType = Exact<{
  id: Scalars['String']['input'];
  item: GeinsCartItemInputTypeType;
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GeinsUpdateSilentCartItemType = {
  updateCartItem?: {
    __typename: 'CartType',
    id?: string | null
  } | null
};

export type GeinsUpdateCartItemVariablesType = Exact<{
  id: Scalars['String']['input'];
  item: GeinsCartItemInputTypeType;
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GeinsUpdateCartItemType = {
  updateCartItem?: {
    __typename: 'CartType',
    id?: string | null,
    isCompleted: boolean,
    merchantData?: string | null,
    promoCode?: string | null,
    appliedCampaigns?: Array<{
      __typename: 'CampaignRuleType',
      campaignId: string,
      name?: string | null,
      hideTitle?: boolean | null
    } | null> | null,
    items?: Array<{
      __typename: 'CartItemType',
      id: string | number,
      groupKey?: string | number | null,
      skuId: number,
      quantity: number,
      message?: string | null,
      productPackage?: {
        __typename: 'ProductPackageCartItemType',
        packageId: number,
        packageName: string,
        groupId: number,
        optionId: number
      } | null,
      campaign?: {
        __typename: 'CampaignType',
        appliedCampaigns?: Array<{
          __typename: 'CampaignRuleType',
          campaignId: string,
          name?: string | null,
          hideTitle?: boolean | null
        } | null> | null,
        prices?: Array<{
          __typename: 'CampaignPriceType',
          quantity: number,
          price?: {
            __typename: 'PriceType',
            sellingPriceIncVat: number,
            sellingPriceExVat: number,
            regularPriceIncVat: number,
            regularPriceExVat: number,
            discountIncVat: number,
            discountExVat: number,
            discountPercentage: number,
            vat: number,
            isDiscounted: boolean,
            sellingPriceIncVatFormatted?: string | null,
            sellingPriceExVatFormatted?: string | null,
            regularPriceIncVatFormatted?: string | null,
            regularPriceExVatFormatted?: string | null,
            discountIncVatFormatted?: string | null,
            discountExVatFormatted?: string | null,
            vatFormatted?: string | null,
            currency?: {
              __typename: 'CurrencyType',
              code: string,
              symbol: string,
              rate: number,
              name: string
            } | null
          } | null
        } | null> | null
      } | null,
      product?: {
        __typename: 'ProductType',
        productId: number,
        articleNumber?: string | null,
        name?: string | null,
        alias: string,
        canonicalUrl?: string | null,
        brand?: {
          __typename: 'BrandType',
          name?: string | null
        } | null,
        productImages?: Array<{
          __typename: 'ProductImageType',
          fileName: string
        } | null> | null,
        primaryCategory?: {
          __typename: 'CategoryType',
          categoryId: number,
          name: string,
          order: number
        } | null,
        categories?: Array<{
          __typename: 'CategoryType',
          categoryId: number,
          name: string,
          order: number
        } | null> | null,
        skus?: Array<{
          __typename: 'SkuType',
          skuId: number,
          name?: string | null,
          stock?: {
            __typename: 'StockType',
            inStock: number,
            oversellable: number,
            totalStock: number,
            static?: number | null
          } | null
        } | null> | null,
        unitPrice?: {
          __typename: 'PriceType',
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          discountIncVat: number,
          discountExVat: number,
          discountPercentage: number,
          vat: number,
          isDiscounted: boolean,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          regularPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          discountIncVatFormatted?: string | null,
          discountExVatFormatted?: string | null,
          vatFormatted?: string | null,
          currency?: {
            __typename: 'CurrencyType',
            code: string,
            symbol: string,
            rate: number,
            name: string
          } | null
        } | null
      } | null,
      unitPrice?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null,
      totalPrice?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null
    } | null> | null,
    summary?: {
      __typename: 'CartSummaryType',
      fixedAmountDiscountIncVat: number,
      fixedAmountDiscountExVat: number,
      balance?: {
        __typename: 'BalanceType',
        pending: number,
        pendingFormatted?: string | null,
        totalSellingPriceExBalanceExVat: number,
        totalSellingPriceExBalanceIncVat: number,
        totalSellingPriceExBalanceIncVatFormatted?: string | null
      } | null,
      subTotal?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null,
      shipping?: {
        __typename: 'ShippingOptionType',
        amountLeftToFreeShipping: number,
        amountLeftToFreeShippingFormatted?: string | null,
        feeExVatFormatted?: string | null,
        feeIncVatFormatted?: string | null,
        feeIncVat: number,
        feeExVat: number,
        isDefault: boolean
      } | null,
      total?: {
        __typename: 'PriceType',
        sellingPriceIncVat: number,
        sellingPriceExVat: number,
        regularPriceIncVat: number,
        regularPriceExVat: number,
        discountIncVat: number,
        discountExVat: number,
        discountPercentage: number,
        vat: number,
        isDiscounted: boolean,
        sellingPriceIncVatFormatted?: string | null,
        sellingPriceExVatFormatted?: string | null,
        regularPriceIncVatFormatted?: string | null,
        regularPriceExVatFormatted?: string | null,
        discountIncVatFormatted?: string | null,
        discountExVatFormatted?: string | null,
        vatFormatted?: string | null,
        currency?: {
          __typename: 'CurrencyType',
          code: string,
          symbol: string,
          rate: number,
          name: string
        } | null
      } | null
    } | null
  } | null
};

export type GeinsCreateOrUpdateCheckoutVariablesType = Exact<{
  cartId: Scalars['String']['input'];
  checkout?: InputMaybe<GeinsCheckoutInputTypeType>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GeinsCreateOrUpdateCheckoutType = {
  createOrUpdateCheckout?: {
    email?: string | null,
    identityNumber?: string | null,
    shippingData?: string | null,
    cart?: {
      __typename: 'CartType',
      id?: string | null,
      isCompleted: boolean,
      merchantData?: string | null,
      promoCode?: string | null,
      appliedCampaigns?: Array<{
        __typename: 'CampaignRuleType',
        campaignId: string,
        name?: string | null,
        hideTitle?: boolean | null
      } | null> | null,
      items?: Array<{
        __typename: 'CartItemType',
        id: string | number,
        groupKey?: string | number | null,
        skuId: number,
        quantity: number,
        message?: string | null,
        productPackage?: {
          __typename: 'ProductPackageCartItemType',
          packageId: number,
          packageName: string,
          groupId: number,
          optionId: number
        } | null,
        campaign?: {
          __typename: 'CampaignType',
          appliedCampaigns?: Array<{
            __typename: 'CampaignRuleType',
            campaignId: string,
            name?: string | null,
            hideTitle?: boolean | null
          } | null> | null,
          prices?: Array<{
            __typename: 'CampaignPriceType',
            quantity: number,
            price?: {
              __typename: 'PriceType',
              sellingPriceIncVat: number,
              sellingPriceExVat: number,
              regularPriceIncVat: number,
              regularPriceExVat: number,
              discountIncVat: number,
              discountExVat: number,
              discountPercentage: number,
              vat: number,
              isDiscounted: boolean,
              sellingPriceIncVatFormatted?: string | null,
              sellingPriceExVatFormatted?: string | null,
              regularPriceIncVatFormatted?: string | null,
              regularPriceExVatFormatted?: string | null,
              discountIncVatFormatted?: string | null,
              discountExVatFormatted?: string | null,
              vatFormatted?: string | null,
              currency?: {
                __typename: 'CurrencyType',
                code: string,
                symbol: string,
                rate: number,
                name: string
              } | null
            } | null
          } | null> | null
        } | null,
        product?: {
          __typename: 'ProductType',
          productId: number,
          articleNumber?: string | null,
          name?: string | null,
          alias: string,
          canonicalUrl?: string | null,
          brand?: {
            __typename: 'BrandType',
            name?: string | null
          } | null,
          productImages?: Array<{
            __typename: 'ProductImageType',
            fileName: string
          } | null> | null,
          primaryCategory?: {
            __typename: 'CategoryType',
            categoryId: number,
            name: string,
            order: number
          } | null,
          categories?: Array<{
            __typename: 'CategoryType',
            categoryId: number,
            name: string,
            order: number
          } | null> | null,
          skus?: Array<{
            __typename: 'SkuType',
            skuId: number,
            name?: string | null,
            stock?: {
              __typename: 'StockType',
              inStock: number,
              oversellable: number,
              totalStock: number,
              static?: number | null
            } | null
          } | null> | null,
          unitPrice?: {
            __typename: 'PriceType',
            sellingPriceIncVat: number,
            sellingPriceExVat: number,
            regularPriceIncVat: number,
            regularPriceExVat: number,
            discountIncVat: number,
            discountExVat: number,
            discountPercentage: number,
            vat: number,
            isDiscounted: boolean,
            sellingPriceIncVatFormatted?: string | null,
            sellingPriceExVatFormatted?: string | null,
            regularPriceIncVatFormatted?: string | null,
            regularPriceExVatFormatted?: string | null,
            discountIncVatFormatted?: string | null,
            discountExVatFormatted?: string | null,
            vatFormatted?: string | null,
            currency?: {
              __typename: 'CurrencyType',
              code: string,
              symbol: string,
              rate: number,
              name: string
            } | null
          } | null
        } | null,
        unitPrice?: {
          __typename: 'PriceType',
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          discountIncVat: number,
          discountExVat: number,
          discountPercentage: number,
          vat: number,
          isDiscounted: boolean,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          regularPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          discountIncVatFormatted?: string | null,
          discountExVatFormatted?: string | null,
          vatFormatted?: string | null,
          currency?: {
            __typename: 'CurrencyType',
            code: string,
            symbol: string,
            rate: number,
            name: string
          } | null
        } | null,
        totalPrice?: {
          __typename: 'PriceType',
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          discountIncVat: number,
          discountExVat: number,
          discountPercentage: number,
          vat: number,
          isDiscounted: boolean,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          regularPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          discountIncVatFormatted?: string | null,
          discountExVatFormatted?: string | null,
          vatFormatted?: string | null,
          currency?: {
            __typename: 'CurrencyType',
            code: string,
            symbol: string,
            rate: number,
            name: string
          } | null
        } | null
      } | null> | null,
      summary?: {
        __typename: 'CartSummaryType',
        fixedAmountDiscountIncVat: number,
        fixedAmountDiscountExVat: number,
        balance?: {
          __typename: 'BalanceType',
          pending: number,
          pendingFormatted?: string | null,
          totalSellingPriceExBalanceExVat: number,
          totalSellingPriceExBalanceIncVat: number,
          totalSellingPriceExBalanceIncVatFormatted?: string | null
        } | null,
        subTotal?: {
          __typename: 'PriceType',
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          discountIncVat: number,
          discountExVat: number,
          discountPercentage: number,
          vat: number,
          isDiscounted: boolean,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          regularPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          discountIncVatFormatted?: string | null,
          discountExVatFormatted?: string | null,
          vatFormatted?: string | null,
          currency?: {
            __typename: 'CurrencyType',
            code: string,
            symbol: string,
            rate: number,
            name: string
          } | null
        } | null,
        shipping?: {
          __typename: 'ShippingOptionType',
          amountLeftToFreeShipping: number,
          amountLeftToFreeShippingFormatted?: string | null,
          feeExVatFormatted?: string | null,
          feeIncVatFormatted?: string | null,
          feeIncVat: number,
          feeExVat: number,
          isDefault: boolean
        } | null,
        total?: {
          __typename: 'PriceType',
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          discountIncVat: number,
          discountExVat: number,
          discountPercentage: number,
          vat: number,
          isDiscounted: boolean,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          regularPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          discountIncVatFormatted?: string | null,
          discountExVatFormatted?: string | null,
          vatFormatted?: string | null,
          currency?: {
            __typename: 'CurrencyType',
            code: string,
            symbol: string,
            rate: number,
            name: string
          } | null
        } | null
      } | null
    } | null,
    consents?: Array<{
      type: string,
      checked: boolean
    } | null> | null,
    billingAddress?: {
      firstName: string,
      lastName: string,
      company: string,
      mobile: string,
      phone: string,
      careOf: string,
      entryCode: string,
      addressLine1: string,
      addressLine2: string,
      addressLine3: string,
      zip: string,
      city: string,
      state: string,
      country: string
    } | null,
    shippingAddress?: {
      firstName: string,
      lastName: string,
      company: string,
      mobile: string,
      phone: string,
      careOf: string,
      entryCode: string,
      addressLine1: string,
      addressLine2: string,
      addressLine3: string,
      zip: string,
      city: string,
      state: string,
      country: string
    } | null,
    shippingOptions?: Array<{
      id: number,
      displayName?: string | null,
      logo?: string | null,
      isSelected: boolean,
      feeIncVatFormatted?: string | null,
      feeExVatFormatted?: string | null
    } | null> | null,
    paymentOptions?: Array<{
      id: number,
      logo?: string | null,
      displayName?: string | null,
      checkoutType?: GeinsPaymentCheckout | null,
      paymentType?: GeinsPaymentType | null,
      paymentData?: string | null,
      isSelected: boolean,
      newCheckoutSession: boolean
    } | null> | null
  } | null
};

export type GeinsCheckoutSummaryVariablesType = Exact<{
  id: Scalars['String']['input'];
  paymentType: GeinsPaymentType;
  checkoutMarket?: InputMaybe<Scalars['String']['input']>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
}> | undefined;


export type GeinsCheckoutSummaryType = {
  checkout?: {
    htmlSnippet?: string | null,
    completed?: boolean | null,
    nthPurchase: number,
    order?: {
      status?: string | null,
      orderId?: string | null,
      transactionId?: string | null,
      externalOrderId?: string | null,
      marketId: string,
      languageId?: string | null,
      message?: string | null,
      metaData?: string | null,
      customerId: number,
      customerTypeId: number,
      customerGroupId: number,
      organizationNumber?: string | null,
      ipAddress?: string | null,
      paymentId: number,
      shippingId: number,
      pickupPoint?: string | null,
      desiredDeliveryDate?: string | null,
      promoCode?: string | null,
      campaignIds?: Array<string | null> | null,
      campaignNames?: Array<string | null> | null,
      currency?: string | null,
      discountExVat: number,
      discountIncVat: number,
      itemValueExVat: number,
      itemValueIncVat: number,
      orderValueExVat: number,
      orderValueIncVat: number,
      paymentFeeExVat: number,
      paymentFeeIncVat: number,
      shippingFeeExVat: number,
      shippingFeeIncVat: number,
      sum: number,
      billingAddress?: {
        company: string,
        firstName: string,
        lastName: string,
        zip: string,
        phone: string,
        addressLine1: string,
        addressLine2: string,
        city: string,
        country: string,
        mobile: string,
        careOf: string
      } | null,
      shippingAddress?: {
        company: string,
        firstName: string,
        lastName: string,
        zip: string,
        phone: string,
        addressLine1: string,
        addressLine2: string,
        city: string,
        country: string,
        mobile: string,
        careOf: string
      } | null,
      rows?: Array<{
        articleNumber?: string | null,
        brand?: string | null,
        categories?: Array<string | null> | null,
        campaignIds?: Array<string | null> | null,
        campaignNames?: Array<string | null> | null,
        discountExVat: number,
        discountIncVat: number,
        discountRate: number,
        externalId?: string | null,
        gtin?: string | null,
        imageUrl?: string | null,
        height: number,
        length: number,
        width: number,
        weight: number,
        message?: string | null,
        name?: string | null,
        quantity: number,
        sku?: string | null,
        variant?: string | null,
        priceExVat: number,
        priceIncVat: number,
        currency?: string | null,
        productId: number,
        productUrl?: string | null,
        productPriceCampaignId?: number | null,
        productPriceListId?: number | null
      } | null> | null
    } | null
  } | null
};

export type GeinsCheckoutVariablesType = Exact<{
  id: Scalars['String']['input'];
  paymentType: GeinsPaymentType;
  cartId?: InputMaybe<Scalars['String']['input']>;
  checkoutMarket?: InputMaybe<Scalars['String']['input']>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
}> | undefined;


export type GeinsCheckoutType = {
  checkout?: {
    htmlSnippet?: string | null,
    completed?: boolean | null,
    nthPurchase: number,
    order?: {
      orderId?: string | null,
      transactionId?: string | null,
      firstName?: string | null,
      lastName?: string | null,
      email?: string | null,
      zip?: string | null,
      currency?: string | null,
      itemValueExVat: number,
      itemValueIncVat: number
    } | null,
    cart?: {
      __typename: 'CartType',
      id?: string | null,
      isCompleted: boolean,
      merchantData?: string | null,
      promoCode?: string | null,
      appliedCampaigns?: Array<{
        __typename: 'CampaignRuleType',
        campaignId: string,
        name?: string | null,
        hideTitle?: boolean | null
      } | null> | null,
      items?: Array<{
        __typename: 'CartItemType',
        id: string | number,
        groupKey?: string | number | null,
        skuId: number,
        quantity: number,
        message?: string | null,
        productPackage?: {
          __typename: 'ProductPackageCartItemType',
          packageId: number,
          packageName: string,
          groupId: number,
          optionId: number
        } | null,
        campaign?: {
          __typename: 'CampaignType',
          appliedCampaigns?: Array<{
            __typename: 'CampaignRuleType',
            campaignId: string,
            name?: string | null,
            hideTitle?: boolean | null
          } | null> | null,
          prices?: Array<{
            __typename: 'CampaignPriceType',
            quantity: number,
            price?: {
              __typename: 'PriceType',
              sellingPriceIncVat: number,
              sellingPriceExVat: number,
              regularPriceIncVat: number,
              regularPriceExVat: number,
              discountIncVat: number,
              discountExVat: number,
              discountPercentage: number,
              vat: number,
              isDiscounted: boolean,
              sellingPriceIncVatFormatted?: string | null,
              sellingPriceExVatFormatted?: string | null,
              regularPriceIncVatFormatted?: string | null,
              regularPriceExVatFormatted?: string | null,
              discountIncVatFormatted?: string | null,
              discountExVatFormatted?: string | null,
              vatFormatted?: string | null,
              currency?: {
                __typename: 'CurrencyType',
                code: string,
                symbol: string,
                rate: number,
                name: string
              } | null
            } | null
          } | null> | null
        } | null,
        product?: {
          __typename: 'ProductType',
          productId: number,
          articleNumber?: string | null,
          name?: string | null,
          alias: string,
          canonicalUrl?: string | null,
          brand?: {
            __typename: 'BrandType',
            name?: string | null
          } | null,
          productImages?: Array<{
            __typename: 'ProductImageType',
            fileName: string
          } | null> | null,
          primaryCategory?: {
            __typename: 'CategoryType',
            categoryId: number,
            name: string,
            order: number
          } | null,
          categories?: Array<{
            __typename: 'CategoryType',
            categoryId: number,
            name: string,
            order: number
          } | null> | null,
          skus?: Array<{
            __typename: 'SkuType',
            skuId: number,
            name?: string | null,
            stock?: {
              __typename: 'StockType',
              inStock: number,
              oversellable: number,
              totalStock: number,
              static?: number | null
            } | null
          } | null> | null,
          unitPrice?: {
            __typename: 'PriceType',
            sellingPriceIncVat: number,
            sellingPriceExVat: number,
            regularPriceIncVat: number,
            regularPriceExVat: number,
            discountIncVat: number,
            discountExVat: number,
            discountPercentage: number,
            vat: number,
            isDiscounted: boolean,
            sellingPriceIncVatFormatted?: string | null,
            sellingPriceExVatFormatted?: string | null,
            regularPriceIncVatFormatted?: string | null,
            regularPriceExVatFormatted?: string | null,
            discountIncVatFormatted?: string | null,
            discountExVatFormatted?: string | null,
            vatFormatted?: string | null,
            currency?: {
              __typename: 'CurrencyType',
              code: string,
              symbol: string,
              rate: number,
              name: string
            } | null
          } | null
        } | null,
        unitPrice?: {
          __typename: 'PriceType',
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          discountIncVat: number,
          discountExVat: number,
          discountPercentage: number,
          vat: number,
          isDiscounted: boolean,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          regularPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          discountIncVatFormatted?: string | null,
          discountExVatFormatted?: string | null,
          vatFormatted?: string | null,
          currency?: {
            __typename: 'CurrencyType',
            code: string,
            symbol: string,
            rate: number,
            name: string
          } | null
        } | null,
        totalPrice?: {
          __typename: 'PriceType',
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          discountIncVat: number,
          discountExVat: number,
          discountPercentage: number,
          vat: number,
          isDiscounted: boolean,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          regularPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          discountIncVatFormatted?: string | null,
          discountExVatFormatted?: string | null,
          vatFormatted?: string | null,
          currency?: {
            __typename: 'CurrencyType',
            code: string,
            symbol: string,
            rate: number,
            name: string
          } | null
        } | null
      } | null> | null,
      summary?: {
        __typename: 'CartSummaryType',
        fixedAmountDiscountIncVat: number,
        fixedAmountDiscountExVat: number,
        balance?: {
          __typename: 'BalanceType',
          pending: number,
          pendingFormatted?: string | null,
          totalSellingPriceExBalanceExVat: number,
          totalSellingPriceExBalanceIncVat: number,
          totalSellingPriceExBalanceIncVatFormatted?: string | null
        } | null,
        subTotal?: {
          __typename: 'PriceType',
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          discountIncVat: number,
          discountExVat: number,
          discountPercentage: number,
          vat: number,
          isDiscounted: boolean,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          regularPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          discountIncVatFormatted?: string | null,
          discountExVatFormatted?: string | null,
          vatFormatted?: string | null,
          currency?: {
            __typename: 'CurrencyType',
            code: string,
            symbol: string,
            rate: number,
            name: string
          } | null
        } | null,
        shipping?: {
          __typename: 'ShippingOptionType',
          amountLeftToFreeShipping: number,
          amountLeftToFreeShippingFormatted?: string | null,
          feeExVatFormatted?: string | null,
          feeIncVatFormatted?: string | null,
          feeIncVat: number,
          feeExVat: number,
          isDefault: boolean
        } | null,
        total?: {
          __typename: 'PriceType',
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          discountIncVat: number,
          discountExVat: number,
          discountPercentage: number,
          vat: number,
          isDiscounted: boolean,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          regularPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          discountIncVatFormatted?: string | null,
          discountExVatFormatted?: string | null,
          vatFormatted?: string | null,
          currency?: {
            __typename: 'CurrencyType',
            code: string,
            symbol: string,
            rate: number,
            name: string
          } | null
        } | null
      } | null
    } | null
  } | null
};

export type GeinsValidateOrderConditionsVariablesType = Exact<{
  cartId: Scalars['String']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}> | undefined;


export type GeinsValidateOrderConditionsType = {
  validateOrderConditions?: {
    isValid: boolean,
    message?: string | null
  } | null
};

export type GeinsValidateOrderCreationVariablesType = Exact<{
  cartId: Scalars['String']['input'];
  checkout: GeinsCheckoutInputTypeType;
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}> | undefined;


export type GeinsValidateOrderCreationType = {
  validateOrderCreation?: {
    isValid: boolean,
    message?: string | null,
    memberType?: string | null
  } | null
};

export type GeinsPlaceOrderVariablesType = Exact<{
  cartId: Scalars['String']['input'];
  checkout: GeinsCheckoutInputTypeType;
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GeinsPlaceOrderType = {
  placeOrder?: {
    orderId?: string | null,
    publicId?: string | null,
    status?: string | null
  } | null
};

export type GeinsGetOrderPublicVariablesType = Exact<{
  publicOrderId: Scalars['Guid']['input'];
  channelId?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['String']['input']>;
  marketId?: InputMaybe<Scalars['String']['input']>;
}> | undefined;


export type GeinsGetOrderPublicType = {
  getOrderPublic?: {
    id?: number | null,
    customerId?: number | null,
    createdAt?: string | null,
    completedAt?: string | null,
    currency?: string | null,
    desiredDeliveryDate?: string | null,
    message?: string | null,
    status: string,
    updatedAt?: string | null,
    publicId: string | number,
    fromBalance: number,
    fromBalanceFormatted?: string | null,
    billingAddress?: {
      firstName: string,
      lastName: string,
      company: string,
      mobile: string,
      phone: string,
      careOf: string,
      entryCode: string,
      addressLine1: string,
      addressLine2: string,
      addressLine3: string,
      zip: string,
      city: string,
      state: string,
      country: string
    } | null,
    shippingAddress?: {
      firstName: string,
      lastName: string,
      company: string,
      mobile: string,
      phone: string,
      careOf: string,
      entryCode: string,
      addressLine1: string,
      addressLine2: string,
      addressLine3: string,
      zip: string,
      city: string,
      state: string,
      country: string
    } | null,
    cart?: {
      __typename: 'CartType',
      id?: string | null,
      isCompleted: boolean,
      merchantData?: string | null,
      promoCode?: string | null,
      appliedCampaigns?: Array<{
        __typename: 'CampaignRuleType',
        campaignId: string,
        name?: string | null,
        hideTitle?: boolean | null
      } | null> | null,
      items?: Array<{
        __typename: 'CartItemType',
        id: string | number,
        groupKey?: string | number | null,
        skuId: number,
        quantity: number,
        message?: string | null,
        productPackage?: {
          __typename: 'ProductPackageCartItemType',
          packageId: number,
          packageName: string,
          groupId: number,
          optionId: number
        } | null,
        campaign?: {
          __typename: 'CampaignType',
          appliedCampaigns?: Array<{
            __typename: 'CampaignRuleType',
            campaignId: string,
            name?: string | null,
            hideTitle?: boolean | null
          } | null> | null,
          prices?: Array<{
            __typename: 'CampaignPriceType',
            quantity: number,
            price?: {
              __typename: 'PriceType',
              sellingPriceIncVat: number,
              sellingPriceExVat: number,
              regularPriceIncVat: number,
              regularPriceExVat: number,
              discountIncVat: number,
              discountExVat: number,
              discountPercentage: number,
              vat: number,
              isDiscounted: boolean,
              sellingPriceIncVatFormatted?: string | null,
              sellingPriceExVatFormatted?: string | null,
              regularPriceIncVatFormatted?: string | null,
              regularPriceExVatFormatted?: string | null,
              discountIncVatFormatted?: string | null,
              discountExVatFormatted?: string | null,
              vatFormatted?: string | null,
              currency?: {
                __typename: 'CurrencyType',
                code: string,
                symbol: string,
                rate: number,
                name: string
              } | null
            } | null
          } | null> | null
        } | null,
        product?: {
          __typename: 'ProductType',
          productId: number,
          articleNumber?: string | null,
          name?: string | null,
          alias: string,
          canonicalUrl?: string | null,
          brand?: {
            __typename: 'BrandType',
            name?: string | null
          } | null,
          productImages?: Array<{
            __typename: 'ProductImageType',
            fileName: string
          } | null> | null,
          primaryCategory?: {
            __typename: 'CategoryType',
            categoryId: number,
            name: string,
            order: number
          } | null,
          categories?: Array<{
            __typename: 'CategoryType',
            categoryId: number,
            name: string,
            order: number
          } | null> | null,
          skus?: Array<{
            __typename: 'SkuType',
            skuId: number,
            name?: string | null,
            stock?: {
              __typename: 'StockType',
              inStock: number,
              oversellable: number,
              totalStock: number,
              static?: number | null
            } | null
          } | null> | null,
          unitPrice?: {
            __typename: 'PriceType',
            sellingPriceIncVat: number,
            sellingPriceExVat: number,
            regularPriceIncVat: number,
            regularPriceExVat: number,
            discountIncVat: number,
            discountExVat: number,
            discountPercentage: number,
            vat: number,
            isDiscounted: boolean,
            sellingPriceIncVatFormatted?: string | null,
            sellingPriceExVatFormatted?: string | null,
            regularPriceIncVatFormatted?: string | null,
            regularPriceExVatFormatted?: string | null,
            discountIncVatFormatted?: string | null,
            discountExVatFormatted?: string | null,
            vatFormatted?: string | null,
            currency?: {
              __typename: 'CurrencyType',
              code: string,
              symbol: string,
              rate: number,
              name: string
            } | null
          } | null
        } | null,
        unitPrice?: {
          __typename: 'PriceType',
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          discountIncVat: number,
          discountExVat: number,
          discountPercentage: number,
          vat: number,
          isDiscounted: boolean,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          regularPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          discountIncVatFormatted?: string | null,
          discountExVatFormatted?: string | null,
          vatFormatted?: string | null,
          currency?: {
            __typename: 'CurrencyType',
            code: string,
            symbol: string,
            rate: number,
            name: string
          } | null
        } | null,
        totalPrice?: {
          __typename: 'PriceType',
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          discountIncVat: number,
          discountExVat: number,
          discountPercentage: number,
          vat: number,
          isDiscounted: boolean,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          regularPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          discountIncVatFormatted?: string | null,
          discountExVatFormatted?: string | null,
          vatFormatted?: string | null,
          currency?: {
            __typename: 'CurrencyType',
            code: string,
            symbol: string,
            rate: number,
            name: string
          } | null
        } | null
      } | null> | null,
      summary?: {
        __typename: 'CartSummaryType',
        fixedAmountDiscountIncVat: number,
        fixedAmountDiscountExVat: number,
        balance?: {
          __typename: 'BalanceType',
          pending: number,
          pendingFormatted?: string | null,
          totalSellingPriceExBalanceExVat: number,
          totalSellingPriceExBalanceIncVat: number,
          totalSellingPriceExBalanceIncVatFormatted?: string | null
        } | null,
        subTotal?: {
          __typename: 'PriceType',
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          discountIncVat: number,
          discountExVat: number,
          discountPercentage: number,
          vat: number,
          isDiscounted: boolean,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          regularPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          discountIncVatFormatted?: string | null,
          discountExVatFormatted?: string | null,
          vatFormatted?: string | null,
          currency?: {
            __typename: 'CurrencyType',
            code: string,
            symbol: string,
            rate: number,
            name: string
          } | null
        } | null,
        shipping?: {
          __typename: 'ShippingOptionType',
          amountLeftToFreeShipping: number,
          amountLeftToFreeShippingFormatted?: string | null,
          feeExVatFormatted?: string | null,
          feeIncVatFormatted?: string | null,
          feeIncVat: number,
          feeExVat: number,
          isDefault: boolean
        } | null,
        total?: {
          __typename: 'PriceType',
          sellingPriceIncVat: number,
          sellingPriceExVat: number,
          regularPriceIncVat: number,
          regularPriceExVat: number,
          discountIncVat: number,
          discountExVat: number,
          discountPercentage: number,
          vat: number,
          isDiscounted: boolean,
          sellingPriceIncVatFormatted?: string | null,
          sellingPriceExVatFormatted?: string | null,
          regularPriceIncVatFormatted?: string | null,
          regularPriceExVatFormatted?: string | null,
          discountIncVatFormatted?: string | null,
          discountExVatFormatted?: string | null,
          vatFormatted?: string | null,
          currency?: {
            __typename: 'CurrencyType',
            code: string,
            symbol: string,
            rate: number,
            name: string
          } | null
        } | null
      } | null
    } | null,
    paymentDetails?: Array<{
      id: number,
      paymentId: number,
      transactionId: string,
      displayName: string,
      name: string,
      isPaid: boolean,
      paymentDate?: string | null,
      paymentFee: number,
      paymentOption?: string | null,
      reservationDate: string,
      reservationNumber?: string | null,
      shippingFee: number,
      total: number
    } | null> | null,
    discount?: {
      __typename: 'PriceType',
      sellingPriceIncVat: number,
      sellingPriceExVat: number,
      regularPriceIncVat: number,
      regularPriceExVat: number,
      discountIncVat: number,
      discountExVat: number,
      discountPercentage: number,
      vat: number,
      isDiscounted: boolean,
      sellingPriceIncVatFormatted?: string | null,
      sellingPriceExVatFormatted?: string | null,
      regularPriceIncVatFormatted?: string | null,
      regularPriceExVatFormatted?: string | null,
      discountIncVatFormatted?: string | null,
      discountExVatFormatted?: string | null,
      vatFormatted?: string | null,
      currency?: {
        __typename: 'CurrencyType',
        code: string,
        symbol: string,
        rate: number,
        name: string
      } | null
    } | null,
    orderTotal?: {
      __typename: 'PriceType',
      sellingPriceIncVat: number,
      sellingPriceExVat: number,
      regularPriceIncVat: number,
      regularPriceExVat: number,
      discountIncVat: number,
      discountExVat: number,
      discountPercentage: number,
      vat: number,
      isDiscounted: boolean,
      sellingPriceIncVatFormatted?: string | null,
      sellingPriceExVatFormatted?: string | null,
      regularPriceIncVatFormatted?: string | null,
      regularPriceExVatFormatted?: string | null,
      discountIncVatFormatted?: string | null,
      discountExVatFormatted?: string | null,
      vatFormatted?: string | null,
      currency?: {
        __typename: 'CurrencyType',
        code: string,
        symbol: string,
        rate: number,
        name: string
      } | null
    } | null,
    paymentFee?: {
      __typename: 'PriceType',
      sellingPriceIncVat: number,
      sellingPriceExVat: number,
      regularPriceIncVat: number,
      regularPriceExVat: number,
      discountIncVat: number,
      discountExVat: number,
      discountPercentage: number,
      vat: number,
      isDiscounted: boolean,
      sellingPriceIncVatFormatted?: string | null,
      sellingPriceExVatFormatted?: string | null,
      regularPriceIncVatFormatted?: string | null,
      regularPriceExVatFormatted?: string | null,
      discountIncVatFormatted?: string | null,
      discountExVatFormatted?: string | null,
      vatFormatted?: string | null,
      currency?: {
        __typename: 'CurrencyType',
        code: string,
        symbol: string,
        rate: number,
        name: string
      } | null
    } | null,
    shippingFee?: {
      __typename: 'PriceType',
      sellingPriceIncVat: number,
      sellingPriceExVat: number,
      regularPriceIncVat: number,
      regularPriceExVat: number,
      discountIncVat: number,
      discountExVat: number,
      discountPercentage: number,
      vat: number,
      isDiscounted: boolean,
      sellingPriceIncVatFormatted?: string | null,
      sellingPriceExVatFormatted?: string | null,
      regularPriceIncVatFormatted?: string | null,
      regularPriceExVatFormatted?: string | null,
      discountIncVatFormatted?: string | null,
      discountExVatFormatted?: string | null,
      vatFormatted?: string | null,
      currency?: {
        __typename: 'CurrencyType',
        code: string,
        symbol: string,
        rate: number,
        name: string
      } | null
    } | null,
    vat?: {
      __typename: 'PriceType',
      sellingPriceIncVat: number,
      sellingPriceExVat: number,
      regularPriceIncVat: number,
      regularPriceExVat: number,
      discountIncVat: number,
      discountExVat: number,
      discountPercentage: number,
      vat: number,
      isDiscounted: boolean,
      sellingPriceIncVatFormatted?: string | null,
      sellingPriceExVatFormatted?: string | null,
      regularPriceIncVatFormatted?: string | null,
      regularPriceExVatFormatted?: string | null,
      discountIncVatFormatted?: string | null,
      discountExVatFormatted?: string | null,
      vatFormatted?: string | null,
      currency?: {
        __typename: 'CurrencyType',
        code: string,
        symbol: string,
        rate: number,
        name: string
      } | null
    } | null,
    refunds?: Array<{
      id: number,
      itemId: number,
      articleNumber?: string | null,
      createdAt: string,
      reason?: string | null,
      reasonCode?: number | null,
      refundType?: string | null,
      toBalance: boolean,
      total: number,
      vat: number
    } | null> | null,
    shippingDetails?: Array<{
      id: number,
      name: string,
      parcelNumber?: string | null,
      shippingDate?: string | null,
      shippingId: number,
      trackingLink?: string | null
    } | null> | null
  } | null
};

/**
 * @typedef {Object} AddressInputType
 * @property {string} [addressLine1]
 * @property {string} [addressLine2]
 * @property {string} [addressLine3]
 * @property {string} [careOf]
 * @property {string} [city]
 * @property {string} [company]
 * @property {string} [country]
 * @property {string} [entryCode]
 * @property {string} [firstName]
 * @property {string} [lastName]
 * @property {string} [mobile]
 * @property {string} [phone]
 * @property {string} [state]
 * @property {string} [zip]
 */

/**
 * @typedef {Object} AddressType
 * @property {string} addressLine1 - The first line of the address.
 * @property {string} addressLine2 - The second line of the address.
 * @property {string} addressLine3 - The third line of the address.
 * @property {string} careOf - The care of (c/o) name for the address.
 * @property {string} city - The city of the address.
 * @property {string} company - The company name associated with the address.
 * @property {string} country - The country of the address. Can be either a valid english country name or ISO code
 * @property {string} entryCode - The entry code for the address.
 * @property {string} firstName - The first name of the address holder.
 * @property {string} lastName - The last name of the address holder.
 * @property {string} mobile - The mobile phone number associated with the address.
 * @property {string} phone - The phone number associated with the address.
 * @property {string} state - The state of the address.
 * @property {string} zip - The zip code of the address.
 */

/**
 * Type containing information about alternative urls to an entity
 * @typedef {Object} AlternativeUrlType
 * @property {string} channelId - The id of the channel that the alternative url exists on
 * @property {string} [country] - The country code of the alternative url
 * @property {string} culture - The culture of the alternative url
 * @property {string} language - The language code of the alternative url
 * @property {string} url - Alternative url
 */

/**
 * Type containing account balance information
 * @typedef {Object} BalanceType
 * @property {Decimal} pending - The amount that will be used for this order
 * @property {string} [pendingFormatted] - Pending balance, formatted as a currency string
 * @property {Decimal} remaining - The remaining account balance
 * @property {string} [remainingFormatted] - Remaining account balance, formatted as a currency string
 * @property {Decimal} totalSellingPriceExBalanceExVat - The cart total selling price excl. VAT if balance hadn't been withdrawn.
 * @property {string} [totalSellingPriceExBalanceExVatFormatted] - Cart total excl. VAT, excl. balance, formatted as a currency string
 * @property {Decimal} totalSellingPriceExBalanceIncVat - The cart total selling price incl. VAT if balance hadn't been withdrawn .
 * @property {string} [totalSellingPriceExBalanceIncVatFormatted] - Cart total incl. VAT, excl. balance, formatted as a currency string
 */

/**
 * Type containing brand listing information
 * @typedef {Object} BrandListType
 * @property {string} [alias] - Brand alias
 * @property {Array<(string|null|undefined)>} [alternativeCanonicalUrls] - Alternative full paths to the brand - DEPRECATED: Use AlternativeUrls instead.
 * @property {Array<(AlternativeUrlType|null|undefined)>} [alternativeUrls] - Alternative urls to the brand
 * @property {string} [backgroundImage] - Background image
 * @property {number} brandId - Brand ID
 * @property {string} [canonicalUrl] - The full path for this brand. e.g. '/l/brand-1'
 * @property {string} [description] - Brand description
 * @property {string} [logo] - Brand logo
 * @property {string} [name] - Brand name
 * @property {string} [primaryImage] - Primary image
 * @property {string} [secondaryDescription] - Secondary description
 */

/**
 * Type containing brand information
 * @typedef {Object} BrandType
 * @property {string} [alias] - Brand alias
 * @property {Array<(string|null|undefined)>} [alternativeCanonicalUrls] - Alternative full paths to the brand - DEPRECATED: Use AlternativeUrls instead.
 * @property {Array<(AlternativeUrlType|null|undefined)>} [alternativeUrls] - Alternative urls to the brand
 * @property {number} brandId - Brand ID
 * @property {string} [canonicalUrl] - The full path for this brand. e.g. '/l/brand-1'
 * @property {string} [description] - Brand description
 * @property {string} [name] - Brand name
 */

/**
 * Type containing breadcrumb information
 * @typedef {Object} BreadcrumbType
 * @property {number} categoryId - Category ID
 * @property {string} name - Breadcrumb display name
 * @property {number} parentCategoryId - Parent category ID
 * @property {string} [url] - Breadcrumb path
 */

/**
 * Type containing campaign price information
 * @typedef {Object} CampaignPriceType
 * @property {Decimal} discount - Campaign price discount
 * @property {Decimal} discountPercentage - Campaign price discount percentage
 * @property {PriceType} [price] - Campaign price
 * @property {number} quantity - Campaign price quantity
 */

/**
 * Type containing campaign rule information
 * @typedef {Object} CampaignRuleType
 * @property {string} [action] - Campaign action
 * @property {string} [actionValue] - Campaign action value
 * @property {string} campaignId - Campaign ID
 * @property {string} [canonicalUrl] - The url to this campaign, if any
 * @property {string} [category] - Campaign category
 * @property {boolean} [hideTitle] - Whether to hide the campaign title
 * @property {string} [name] - Campaign name
 * @property {string} [ruleType] - Campaign rule type
 */

/**
 * Type containing campaign information
 * @typedef {Object} CampaignType
 * @property {Array<(CampaignRuleType|null|undefined)>} [appliedCampaigns] - Applied campaigns
 * @property {Array<(CampaignPriceType|null|undefined)>} [prices] - Campaign prices
 */

/**
 * Type containing information about cart fees
 * @typedef {Object} CartFeesType
 * @property {Decimal} paymentFeeExVat - Payment fee excl. VAT
 * @property {Decimal} paymentFeeIncVat - Payment fee incl. VAT
 * @property {Decimal} shippingFeeExVat - Shipping fee excl. VAT
 * @property {Decimal} shippingFeeIncVat - Shipping fee incl. VAT
 */

/**
 * @typedef {Object} CartGroupInputType
 * @property {string} [groupKey]
 * @property {number} quantity
 */

/**
 * @typedef {Object} CartItemInputType
 * @property {string} [groupKey]
 * @property {string} [id]
 * @property {string} [message]
 * @property {number} quantity
 * @property {number} [skuId]
 */

/**
 * Type containing cart item information
 * @typedef {Object} CartItemType
 * @property {CampaignType} [campaign] - Campaign
 * @property {string} [groupKey] - The key of the group that this cart item belong to
 * @property {string} id - Cart item Id
 * @property {boolean} isCampaignFreeGift - Indicates if the cart item is a free gift from a campaign
 * @property {string} [message] - Custom message
 * @property {ProductType} [product] - Product
 * @property {ProductPackageCartItemType} [productPackage] - Contains package meta data if the cart item was part of package
 * @property {number} quantity - Quantity
 * @property {number} skuId - SKU Id
 * @property {PriceType} [totalPrice] - Total price
 * @property {PriceType} [unitPrice] - Price per unit
 */

/**
 * Type containing cart summary information
 * @typedef {Object} CartSummaryType
 * @property {BalanceType} [balance] - Account balance information
 * @property {CartFeesType} [fees] - Cart fee information
 * @property {Decimal} fixedAmountDiscountExVat - Cart fixed discount amount excl. VAT
 * @property {Decimal} fixedAmountDiscountIncVat - Cart fixed discount amount incl. VAT
 * @property {PaymentOptionType} [payment] - Cart payment option information
 * @property {ShippingOptionType} [shipping] - Cart shipping option information
 * @property {PriceType} [subTotal] - Cart sub-total
 * @property {PriceType} [total] - Cart total
 * @property {Array<(VatGroupType|null|undefined)>} [vats] - Cart VAT information
 */

/**
 * Type containing cart information
 * @typedef {Object} CartType
 * @property {Array<(CampaignRuleType|null|undefined)>} [appliedCampaigns] - Campaigns applied to this cart
 * @property {Decimal} fixedDiscount - Cart fixed discount
 * @property {boolean} freeShipping - Whether the cart has free shipping
 * @property {string} [id] - The cart ID
 * @property {boolean} isCompleted - If true, the cart can not be modified further
 * @property {Array<(CartItemType|null|undefined)>} [items] - The cart items
 * @property {string} [merchantData] - Cart merchant data
 * @property {string} [promoCode] - Cart promo code
 * @property {CartSummaryType} [summary] - The cart summary
 */

/**
 * Type containing category information
 * @typedef {Object} CategoryType
 * @property {string} [alias] - Category alias
 * @property {Array<(string|null|undefined)>} [alternativeCanonicalUrls] - Alternative full paths to the category - DEPRECATED: Use AlternativeUrls instead.
 * @property {Array<(AlternativeUrlType|null|undefined)>} [alternativeUrls] - Alternative urls to the category
 * @property {string} [backgroundImage] - Background image
 * @property {string} canonicalUrl - The full path to the category. e.g. '/l/category-1'
 * @property {number} categoryId - Category ID
 * @property {string} [description] - Category description
 * @property {GoogleTaxonomyType} [googleTaxonomy] - Google taxonomy data for this category
 * @property {boolean} [isHidden] - Category is hidden
 * @property {string} name - Category name
 * @property {number} order - Category display order
 * @property {number} parentCategoryId - Parent category ID
 * @property {string} [primaryImage] - Primary image
 * @property {string} [secondaryDescription] - Category secondary description
 */

/**
 * Type containing all information about the channel-type
 * @typedef {Object} ChannelType
 * @property {string} defaultLanguageId - Default language ID used if no other is specified, or an invalid is supplied.
 * @property {string} defaultMarketId - Default market ID used if no other is specified, or an invalid is supplied.
 * @property {string} id - ID
 * @property {Array<(LanguageType|null|undefined)>} [languages]
 * @property {Array<(MarketType|null|undefined)>} [markets]
 * @property {string} name - Name
 * @property {string} type - Type
 * @property {string} url - Base URL
 */

/**
 * @typedef {Object} CheckoutAndOrderType
 * @property {string} htmlSnippet - HTML-snippet
 * @property {CheckoutOrderType} [order] - Order details
 */

/**
 * @typedef {Object} CheckoutDataType
 * @property {CartType} [cart] - The order details represented as a cart object.
 * @property {boolean} [completed] - Indicates if the purchase has been completed. This may not be available for all payment types
 * @property {string} [htmlSnippet] - HTML-snippet
 * @property {boolean} newCheckoutSession - True if this is a new checkout session
 * @property {number} nthPurchase - The total number of purchases that the customer has done including this one
 * @property {CheckoutOrderType} [order] - Order details
 */

/**
 * @typedef {Object} CheckoutInputType
 * @property {Array<(string|null|undefined)>} [acceptedConsents] - The consents accepted by the customer.
 * @property {AddressInputType} [billingAddress] - The billing address for the order.
 * @property {CheckoutUrlsInputType} [checkoutUrls] - The URLs for the checkout process. These are optional and if not supplied,
 * default values configured in the respective integration to the payment
 * provider will be used. Placeholders that can be used in the URLs:
 * {geins.cartid} - the cart id, {payment.uid} - the unique payment identifier
 * (external order id). Note that some payment providers do not support this and
 * others only accept https.
 * @property {CustomerType} [customerType] - The type of customer.
 * @property {DateTime} [desiredDeliveryDate] - The desired delivery date for the order.
 * @property {string} [email] - The email address of the customer.
 * @property {Decimal} [externalShippingFee] - The external shipping fee for the order.
 * @property {string} [externalShippingId] - The external ID of the shipping method.
 * @property {string} [identityNumber] - The identity number of the customer.
 * @property {string} [merchantData] - Additional data from the merchant.
 * @property {string} [message] - A message from the customer.
 * @property {number} [paymentId] - The ID of the payment method.
 * @property {string} [pickupPoint] - The pickup point for the order.
 * @property {AddressInputType} [shippingAddress] - The shipping address for the order.
 * @property {number} [shippingId] - The ID of the shipping method.
 * @property {boolean} [skipShippingValidation] - When set to true, the submitted ShippingId will be set on the order regardless
 * of it being available in the list of shipping options.
 */

/**
 * @typedef {Object} CheckoutOrderRowType
 * @property {string} [articleNumber] - Article number
 * @property {string} [brand] - Brand name
 * @property {Array<(string|null|undefined)>} [campaignIds] - Campaign IDs
 * @property {Array<(string|null|undefined)>} [campaignNames] - Campaign names
 * @property {Array<(string|null|undefined)>} [categories] - Categories
 * @property {string} [currency] - Currency ISO code
 * @property {Decimal} discountExVat - Discount excl. VAT
 * @property {Decimal} discountIncVat - Discount incl. VAT
 * @property {number} discountRate - Discount rate
 * @property {string} [externalId] - ExternalId
 * @property {string} [gtin] - GTIN
 * @property {number} height - Height
 * @property {string} [imageUrl] - Product image URL
 * @property {number} length - Length
 * @property {string} [message] - Message
 * @property {string} [name] - Name
 * @property {Decimal} priceExVat - Price excl. VAT
 * @property {Decimal} priceIncVat - Price incl. VAT
 * @property {number} productId - ProductId
 * @property {number} [productPriceCampaignId] - ProductPriceCampaignId
 * @property {number} [productPriceListId] - Product price list ID
 * @property {string} [productUrl] - ProductUrl
 * @property {number} quantity - Quantity
 * @property {string} [sku] - SKU
 * @property {string} [variant] - Variant
 * @property {number} weight - Weight
 * @property {number} width - Width
 */

/**
 * @typedef {Object} CheckoutOrderType
 * @property {string} [address1] - Address Line 1 - DEPRECATED: Use Billing Address instead
 * @property {string} [address2] - Address Line 2 - DEPRECATED: Use Billing Address instead
 * @property {Decimal} balance - Amount used from Balance
 * @property {AddressType} [billingAddress] - Billing address
 * @property {Array<(string|null|undefined)>} [campaignIds] - Campaign IDs
 * @property {Array<(string|null|undefined)>} [campaignNames] - Campaign names
 * @property {string} [city] - City - DEPRECATED: Use Billing Address instead
 * @property {string} [company] - Company - DEPRECATED: Use Billing Address instead
 * @property {string} [country] - Country - DEPRECATED: Use Billing Address instead
 * @property {string} [currency] - Currency
 * @property {number} customerGroupId - CustomerGroup ID
 * @property {number} customerId - Customer ID
 * @property {number} customerTypeId - Customer Type ID
 * @property {DateTime} [desiredDeliveryDate] - Desired Delivery Date
 * @property {Decimal} discountExVat - Discount excl. VAT
 * @property {Decimal} discountIncVat - Discount incl. VAT
 * @property {string} [email] - E-mail - DEPRECATED: Use Billing Address instead
 * @property {string} [externalOrderId] - External Order ID
 * @property {string} [firstName] - First name - DEPRECATED: Use Billing Address instead
 * @property {GenderType} gender - Gender
 * @property {string} [ipAddress] - IP Address
 * @property {Decimal} itemValueExVat - Represents the total sum of the prices for all order rows, excluding VAT
 * @property {Decimal} itemValueIncVat - Represents the total sum of the prices for all order rows
 * @property {string} [languageId] - Locale
 * @property {string} [lastName] - Last name - DEPRECATED: Use Billing Address instead
 * @property {string} marketId - Market ID.
 * @property {string} [message] - Order message
 * @property {string} [metaData] - Meta Data
 * @property {string} [orderId] - Order ID
 * @property {Decimal} orderValueExVat - Order value excluding VAT (item value + fees - balance)
 * @property {Decimal} orderValueIncVat - Order value including VAT (item value + fees - balance)
 * @property {string} [organizationNumber] - Organization Number
 * @property {Decimal} paymentFeeExVat - Payment fee excl. VAT
 * @property {Decimal} paymentFeeIncVat - Payment fee incl. VAT
 * @property {number} paymentId - Payment ID
 * @property {string} [personalId] - Personal ID
 * @property {string} [phone] - Phone number - DEPRECATED: Use Billing Address instead
 * @property {string} [pickupPoint] - Pickup Point
 * @property {string} [promoCode] - Promo Code
 * @property {Array<(CheckoutOrderRowType|null|undefined)>} [rows] - Order rows
 * @property {string} [secondaryTransactionId] - Secondary transaction ID - DEPRECATED: Not used any more
 * @property {AddressType} [shippingAddress] - Shipping address
 * @property {Decimal} shippingFeeExVat - Shipping fee excl. VAT
 * @property {Decimal} shippingFeeIncVat - Shipping fee incl. VAT
 * @property {number} shippingId - Shipping ID
 * @property {string} [status] - Order Status
 * @property {Decimal} sum - Order sum. Amount to pay.
 * @property {string} [transactionId] - Payment Provider Transaction ID
 * @property {string} [userAgent] - User Agent
 * @property {string} [zip] - Zip code - DEPRECATED: Use Billing Address instead
 */

/**
 * @typedef {("CUSTOMER_BLACKLISTED"|"OK")} CheckoutStatus
 */

/**
 * @typedef {Object} CheckoutType
 * @property {AddressType} [billingAddress]
 * @property {CartType} [cart]
 * @property {CheckoutStatus} [checkoutStatus]
 * @property {Array<(ConsentType|null|undefined)>} [consents] - DEPRECATED: The consent module is not supported any more.
 * @property {string} [email]
 * @property {string} [identityNumber]
 * @property {Array<(PaymentOptionType|null|undefined)>} [paymentOptions]
 * @property {AddressType} [shippingAddress]
 * @property {string} [shippingData]
 * @property {Array<(ShippingOptionType|null|undefined)>} [shippingOptions]
 */

/**
 * @typedef {Object} CheckoutUrlsInputType
 * @property {string} [checkoutPageUrl] - The absolute URL to the Checkout page.
 * @property {string} [redirectUrl] - The absolute redirect URL. This is usually the URL to which the payment provider redirects after a successful payment.
 * @property {string} [termsPageUrl] - The absolute URL to the Terms page.
 */

/**
 * @typedef {Object} ConsentType
 * @property {boolean} autoAccept
 * @property {boolean} checked
 * @property {string} description
 * @property {string} name
 * @property {string} type
 */

/**
 * Type containing all information about the country-type
 * @typedef {Object} CountryType
 * @property {string} code - Two-letter ISO code
 * @property {string} name - Name
 */

/**
 * Type containing all information about the currency-type
 * @typedef {Object} CurrencyType
 * @property {string} code - Currency code
 * @property {string} name - Name
 * @property {Decimal} rate - Currency rate used to convert from this currency to default currency
 * @property {string} symbol - Currency symbol
 */

/**
 * Customer type
 * @typedef {("ORGANIZATION"|"PERSON")} CustomerType
 */

/**
 * The `DateTime` scalar type represents a date and time. `DateTime` expects
 * timestamps to be formatted in accordance with the
 * [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard.
 * @typedef {*} DateTime
 */

/**
 * @typedef {*} Decimal
 */

/**
 * SKU dimensions
 * @typedef {Object} DimensionsType
 * @property {number} height - Height
 * @property {number} length - Length
 * @property {number} width - Width
 */

/**
 * @typedef {("EXTERNAL"|"NONE"|"PRICE_CAMPAIGN"|"SALE_PRICE")} DiscountType
 */

/**
 * Type containing collection of filters
 * @typedef {Object} FilterCollectionType
 * @property {Array<(FilterType|null|undefined)>} [facets] - The collection of facet values returned from the query
 * @property {PriceFilterType} [price] - The lowest / highest price found in the results
 */

/**
 * Filter options
 * @typedef {Object} FilterInputType
 * @property {Array<(string|null|undefined)>} [articleNumbers] - A list of article numbers to filter on. The maximum number of values is 600.
 * If Product IDs filter is present, it takes priority and the article number
 * filter will not be applied. When the article number filter is set, no other
 * filters will be applied. The result is sorted in the exact same way as the
 * input list regardless of what sort method has been set.
 * @property {Array<(number|null|undefined)>} [brandIds] - A list of brand IDs to filter on. When set, all matching brands will be added to the include filter.
 * @property {Array<(number|null|undefined)>} [categoryIds] - A list of category IDs to filter on. When set, all matching categories will be added to the include filter.
 * @property {Array<(number|null|undefined)>} [discountCampaignIds] - A list of discount campaign IDs to filter on. When set, all matching campaigns will be added to the include filter.
 * @property {Array<(string|null|undefined)>} [exclude] - A list of string values, that when specified will exclude products that are associated with one of those values
 * @property {Array<(number|null|undefined)>} [excludeBrandIds] - A list of brand IDs to filter on. When set, all matching brands will be added to the exclude filter.
 * @property {Array<(number|null|undefined)>} [excludeCategoryIds] - A list of category IDs to filter on. When set, all matching categories will be added to the exclude filter.
 * @property {Array<(number|null|undefined)>} [excludeDiscountCampaignIds] - A list of discount campaign IDs to filter on. When set, all matching campaigns will be added to the exclude filter.
 * @property {Array<(string|null|undefined)>} [excludeFacets] - A list of string values, that when specified will exclude products that are associated with one of the facets
 * @property {Array<(string|null|undefined)>} [facets] - A list of string values, that when specified will only include products associated with those values
 * @property {FilterMode} [filterMode] - Filter mode
 * @property {Array<(string|null|undefined)>} [include] - A list of string values, that when specified will only include products associated with those values
 * @property {boolean} [includeCollapsed] - Include collapsed products
 * @property {IncludeMode} [includeMode] - A value to control how values in the Include-field are combined logically.
 * @property {PriceFilterInputType} [price] - Price filter
 * @property {string} [priceListIdentifier] - Limits products to only those found in the price list with the specified identifier.
 * @property {Array<(number|null|undefined)>} [productIds] - A list of product IDs to filter on. The maximum number of values is 600. When
 * the product IDs filter is set, no other filters will be applied. The result is
 * sorted in the exact same way as the input list regardless of what sort method has been set.
 * @property {string} [searchText] - Search text to filter by
 * @property {SortType} [sort] - Use this to sort the results in a particular way
 */

/**
 * Filter mode
 * @typedef {("BY_GROUP"|"CURRENT")} FilterMode
 */

/**
 * Filter group
 * @typedef {Object} FilterType
 * @property {string} filterId - ID for this filter type
 * @property {string} [group] - Parameter group name
 * @property {string} [label] - Parameter group display name
 * @property {number} order - The display order of this filter group. Only supported for type Parameter
 * @property {string} [type] - Filter type. e.g. 'Parameter', 'Category', 'Sku'
 * @property {Array<(FilterValueType|null|undefined)>} [values] - Collection of facet values in this group
 */

/**
 * Filter value
 * @typedef {Object} FilterValueType
 * @property {string} _id - FacetId_Count
 * @property {Long} count - The amount of products in the results associated with this facet
 * @property {string} [facetId] - Facet ID. Use this in the Facets-list in the products-query to retrieve products associated with it
 * @property {boolean} hidden - If the filter for this facet is hidden
 * @property {string} [label] - Facet display name
 * @property {number} order - The display order of this facet
 * @property {string} [parentId] - Parent ID. Only available for category-facets.0
 * @property {string} [url] - The path associated with this facet. e.g. '/c/category-1'
 */

/**
 * @typedef {Object} GeinsMerchantApiMutation
 * @property {CartType} [addPackageToCart]
 * @property {CartType} [addToCart]
 * @property {CartType} [clearCart] - Clears all items in the cart
 * @property {CartType} [cloneCart] - Clones the cart
 * @property {boolean} [commitReset]
 * @property {CartType} [completeCart] - Marks the cart as completed, and makes it read-only
 * @property {CheckoutType} [createOrUpdateCheckout]
 * @property {boolean} [deleteUser]
 * @property {boolean} [monitorProductAvailability]
 * @property {PlaceOrderResponseType} [placeOrder]
 * @property {boolean} [postProductReview]
 * @property {boolean} [requestPasswordReset]
 * @property {CartType} [setCartMerchantData] - Set custom merchant data on the cart
 * @property {CartType} [setCartPromoCode] - Set a promo code on the cart
 * @property {CheckoutType} [setCartShippingFee]
 * @property {boolean} [subscribeToNewsletter]
 * @property {CartType} [updateCartGroup] - Update the quantity of an entire cart group
 * @property {CartType} [updateCartItem] - Update the cart item
 * @property {UserType} [updateUser]
 */

/**
 * @typedef {Object} GeinsMerchantApiQuery
 * @property {Array<(BrandListType|null|undefined)>} [brands] - Get all brands.
 * @property {Array<(CategoryType|null|undefined)>} [categories] - Get all categories.
 * @property {CategoryType} [category] - Gets a category with the specified ID. Use either alias or categoryId. If both are provided, categoryId will be used.
 * @property {ChannelType} [channel] - Gets a channel with the specified ID.
 * @property {Array<(ChannelType|null|undefined)>} [channels] - Gets all available channels.
 * @property {CheckoutDataType} [checkout] - Gets checkout data with a html snippet, checkout order data for the specified
 * order and the User. If the order was recently completed, the html snippet will
 * contain the "Thank you"-content.
 * @property {Array<(PageWidgetPageType|null|undefined)>} [cmsPages] - Gets all CMS pages.
 * @property {CartType} [getCart] - Get the cart
 * @property {string} [getCheckout] - Gets html snippet for the specified external order. If the order was recently
 * completed, the html snippet will contain the "Thank you"-content. - DEPRECATED: Use Checkout instead
 * @property {CheckoutAndOrderType} [getCheckoutAndOrder] - Gets html snippet and checkout order data for the specified external order. If
 * the order was recently completed, the html snippet will contain the "Thank you"-content. - DEPRECATED: Use Checkout instead
 * @property {MenuType} [getMenuAtLocation] - Get a menu
 * @property {OrderType} [getOrder] - Get a specific order with details
 * @property {OrderType} [getOrderPublic] - Get a specific order with details via public id
 * @property {Array<(OrderType|null|undefined)>} [getOrders] - Get orders for the current user
 * @property {UserType} [getUser] - Get the current user
 * @property {PageInfoType} [listPageInfo] - Gets information about the specified list page.
 * @property {ProductType} [product] - Gets a product with the specified ID. Use either alias or productId. If both are provided, productId will be used.
 * @property {ProductsResultType} [products] - Gets all products according to the values provided.
 * @property {Array<(RelatedProductType|null|undefined)>} [relatedProducts] - Gets related products for the specified alias.
 * @property {ProductReviewResultType} [reviews] - Gets all products reviews to the values provided.
 * @property {UrlHistoryType} [urlHistory] - Gets an alternate url for a given url.
 * @property {ValidateOrderConditionsResponseType} [validateOrderConditions] - Validates the conditions required for placing an order, including product
 * stock availability, customer balance, payment method selection, shipping
 * method selection, and customer eligibility to complete the purchase.
 * @property {ValidateOrderCreationResponseType} [validateOrderCreation] - DEPRECATED: Use ValidateOrderConditions instead
 * @property {PageWidgetCollectionType} [widgetArea] - Gets the page area and widgets from the specifed family.
 */

/**
 * @typedef {("MAN"|"UNSET"|"UNSPECIFIED"|"WOMAN")} Gender
 */

/**
 * @typedef {("FEMALE"|"MALE"|"UNKNOWN")} GenderType
 */

/**
 * Type containing Google taxonomy data
 * @typedef {Object} GoogleTaxonomyType
 * @property {number} [id] - Google taxonomy ID
 * @property {string} [name] - Google taxonomy name
 * @property {number} [parentId] - Parent Google taxonomy ID
 * @property {string} [path] - Google taxonomy path
 */

/**
 * Type containing information for a group in a product package
 * @typedef {Object} GroupType
 * @property {string} [description] - The package group description
 * @property {number} groupId - The package group id
 * @property {string} [image] - The package group image
 * @property {string} [name] - The package group name
 * @property {Array<(OptionType|null|undefined)>} [options] - Options in this package group
 * @property {boolean} required - 'true' if this package group is required in order to place the package in cart
 * @property {number} sortOrder - The sort order of this package group relative to other groups
 */

/**
 * @typedef {*} Guid
 */

/**
 * @typedef {("INTERSECT"|"UNION")} IncludeMode
 */

/**
 * Type containing all information about the language-type
 * @typedef {Object} LanguageType
 * @property {string} code - Two-letter ISO code
 * @property {string} id - Language ID
 * @property {string} name - Language name
 */

/**
 * @typedef {*} Long
 */

/**
 * Type containing information about the lowest price during last 30 days and the
 * legal comparison price (EU). Observe that discount is calculated against
 * comparison price and not the regular price.
 * @typedef {Object} LowestPriceType
 * @property {Decimal} comparisonPriceExVat - The comparison price excluding VAT
 * @property {string} [comparisonPriceExVatFormatted] - Comparison price (excl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34'
 * @property {Decimal} comparisonPriceIncVat - The comparison price including VAT
 * @property {string} [comparisonPriceIncVatFormatted] - Comparison price (incl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34'
 * @property {Decimal} discountExVat - Discount amount excluding VAT.
 * @property {string} [discountExVatFormatted] - Discount (excl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34'
 * @property {Decimal} discountIncVat - Discount amount including VAT.
 * @property {string} [discountIncVatFormatted] - Discount (incl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34'
 * @property {number} discountPercentage - Discount percentage.
 * @property {boolean} isDiscounted - Whether the price is discounted or not
 * @property {Decimal} lowestPriceExVat - The lowest price excluding VAT
 * @property {string} [lowestPriceExVatFormatted] - Lowest price (excl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34'
 * @property {Decimal} lowestPriceIncVat - The lowest price including VAT
 * @property {string} [lowestPriceIncVatFormatted] - Lowest price (incl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34'
 * @property {Decimal} sellingPriceExVat - The selling price excluding VAT
 * @property {string} [sellingPriceExVatFormatted] - Selling price (excl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34'
 * @property {Decimal} sellingPriceIncVat - The selling price including VAT
 * @property {string} [sellingPriceIncVatFormatted] - Selling price (incl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34'
 * @property {Decimal} vat - VAT amount
 * @property {string} [vatFormatted] - VAT amount, formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34'
 */

/**
 * Type containing all information about the market-type
 * @typedef {Object} MarketType
 * @property {string} [alias] - The part of the market id that is used in the url.
 * @property {Array<(LanguageType|null|undefined)>} [allowedLanguages]
 * @property {CountryType} [country] - Country
 * @property {CurrencyType} [currency] - Currency
 * @property {string} defaultLanguageId - Default language ID used if no other is specified, or an invalid is supplied.
 * @property {string} groupKey - Group key used to group related markets together, i.e. if they belong to the same region or continent.
 * @property {string} id - ID
 * @property {boolean} [onlyDisplayInCheckout] - Indicates if the market should only be displayed in the checkout process.
 * @property {boolean} [virtual] - If true, indicates that the market is virtual. Virtual markets cannot be used in the checkout process
 */

/**
 * @typedef {Object} MenuItemType
 * @property {string} [canonicalUrl]
 * @property {Array<(MenuItemType|null|undefined)>} [children]
 * @property {boolean} hidden
 * @property {string} id
 * @property {string} [label]
 * @property {boolean} open
 * @property {number} order
 * @property {boolean} targetBlank
 * @property {string} [title]
 * @property {string} type
 * @property {string} [value]
 */

/**
 * @typedef {Object} MenuType
 * @property {Array<(string|null|undefined)>} [channels]
 * @property {string} id
 * @property {Array<(string|null|undefined)>} [languages]
 * @property {Array<(string|null|undefined)>} [locations]
 * @property {Array<(MenuItemType|null|undefined)>} [menuItems]
 * @property {string} [name]
 * @property {string} [title]
 */

/**
 * Type containing metadata
 * @typedef {Object} MetadataType
 * @property {string} [description] - Description
 * @property {string} [keywords] - Keywords
 * @property {string} [title] - Title
 */

/**
 * Type containing information for an option in a product package group
 * @typedef {Object} OptionType
 * @property {boolean} isSelected - 'true' if this option should be selected by default
 * @property {string} [name] - The name of the option
 * @property {number} optionId - The option id
 * @property {ProductType} [product] - The product that this options refers to
 * @property {number} quantity - The quantity of items that is chosen if this option is selected
 * @property {number} sortOrder - The sort order of this option relative to other options
 */

/**
 * @typedef {Object} OrderType
 * @property {AddressType} [billingAddress]
 * @property {CartType} [cart]
 * @property {DateTime} [completedAt]
 * @property {DateTime} [createdAt]
 * @property {string} [currency]
 * @property {number} [customerId]
 * @property {DateTime} [desiredDeliveryDate]
 * @property {PriceType} [discount]
 * @property {Decimal} fromBalance - The amount taken from account balance
 * @property {string} [fromBalanceFormatted] - The amount taken from account balance. Formatted as a currency string.
 * @property {number} [id]
 * @property {string} [message]
 * @property {PriceType} [orderTotal]
 * @property {Array<(PaymentDetailsType|null|undefined)>} [paymentDetails]
 * @property {PriceType} [paymentFee]
 * @property {string} publicId
 * @property {Array<(RefundType|null|undefined)>} [refunds]
 * @property {AddressType} [shippingAddress]
 * @property {Array<(ShippingDetailType|null|undefined)>} [shippingDetails]
 * @property {PriceType} [shippingFee]
 * @property {string} status
 * @property {DateTime} [updatedAt]
 * @property {PriceType} [vat]
 */

/**
 * Type containing widget page area information
 * @typedef {Object} PageAreaType
 * @property {number} id - ID
 * @property {number} index - Index
 * @property {string} [name] - Name
 */

/**
 * Type containing page information
 * @typedef {Object} PageInfoType
 * @property {string} alias - Alias
 * @property {Array<(string|null|undefined)>} [alternativeCanonicalUrls] - Alternative full paths to the page - DEPRECATED: Use AlternativeUrls instead.
 * @property {Array<(AlternativeUrlType|null|undefined)>} [alternativeUrls] - Alternative urls to the page
 * @property {string} [backgroundImage] - Background image
 * @property {string} [canonicalUrl] - Full path to the page
 * @property {boolean} hideDescription - Whether the descriptions should be hidden
 * @property {boolean} hideTitle - Whether the Name-field should be hidden
 * @property {number} id - Page ID
 * @property {string} [logo] - Logo
 * @property {MetadataType} [meta] - Page metadata
 * @property {string} name - Name
 * @property {string} [primaryDescription] - Primary description
 * @property {string} [primaryImage] - Primary image
 * @property {string} [secondaryDescription] - Secondary description
 * @property {Array<(CategoryType|null|undefined)>} [subCategories] - Page sub-categories
 */

/**
 * Type for filtering widgets
 * @typedef {Object} PageWidgetCollectionFilterInputType
 * @property {string} [key] - Filter key. Possible values: SiteId, LanguageId, Product, Category, Brand, DiscountCampaign, CustomerType, Parameter
 * @property {string} [value] - Filter value. Id (int) or Alias
 */

/**
 * Type containing widget collection information
 * @typedef {Object} PageWidgetCollectionType
 * @property {Array<(PageWidgetContainerType|null|undefined)>} [containers] - Collection containers
 * @property {string} [familyName] - Collection family name
 * @property {number} id - Collection ID
 * @property {MetadataType} [meta] - Collection metadata
 * @property {string} name - Name
 * @property {PageAreaType} [pageArea] - Collection page area
 * @property {Array<(string|null|undefined)>} [tags] - List of tags
 * @property {string} [title] - Title
 */

/**
 * Type containing widget container information
 * @typedef {Object} PageWidgetContainerType
 * @property {Array<(string|null|undefined)>} [classNames] - Container class names
 * @property {string} design - Container design
 * @property {number} id - ID
 * @property {string} layout - Container layout
 * @property {string} name - Name
 * @property {string} responsiveMode - Container responsive mode
 * @property {number} sortOrder - Sort order
 * @property {Array<(PageWidgetType|null|undefined)>} [widgets] - Widgets in this container
 */

/**
 * Type containing widget image size information
 * @typedef {Object} PageWidgetImageSizeType
 * @property {number} imageHeight - Image height
 * @property {number} imageRatio - Image ratio
 * @property {number} imageWidth - Image width
 */

/**
 * Type containing widget image information
 * @typedef {Object} PageWidgetImageType
 * @property {string} fileName - Filename
 * @property {PageWidgetImageSizeType} [largestSize] - Largest image size
 * @property {Array<(PageWidgetImageSizeType|null|undefined)>} [sizes] - Image sizes
 */

/**
 * Type containing CMS page information
 * @typedef {Object} PageWidgetPageType
 * @property {DateTime} [activeFrom] - Active From
 * @property {DateTime} [activeTo] - Active To
 * @property {string} [alias] - Alias
 * @property {string} [canonicalUrl] - The url to this cms page
 * @property {number} id - Collection ID
 * @property {MetadataType} [meta] - Collection metadata
 * @property {string} name - Name
 * @property {Array<(string|null|undefined)>} [tags] - List of tags
 * @property {string} [title] - Title
 */

/**
 * Type containing widget information
 * @typedef {Object} PageWidgetType
 * @property {Array<(string|null|undefined)>} [classNames] - Class names
 * @property {string} configuration - Configuration
 * @property {string} id - ID
 * @property {Array<(PageWidgetImageType|null|undefined)>} [images] - Images
 * @property {string} name - Name
 * @property {string} size - Size
 * @property {number} sortOrder - Sort order
 * @property {string} type - Widget Type
 */

/**
 * Type containing product parameter group information
 * @typedef {Object} ParameterGroupType
 * @property {string} name - The parameter group name
 * @property {number} [order] - The parameter group order
 * @property {number} [parameterGroupId] - Parameter group ID
 * @property {Array<(ParameterType|null|undefined)>} [parameters] - List of parameters
 * @property {number} productId - Product ID associated with this parameter group
 */

/**
 * Type containing parameter information
 * @typedef {Object} ParameterType
 * @property {string} [description] - Parameter description
 * @property {string} [facetId] - The ID of the associated facet
 * @property {string} [identifier] - The internal identifier of the parameter. This value is the same for all
 * languages and does not change if the parameter name changes.
 * @property {string} [label] - Parameter label
 * @property {string} [name] - Parameter name
 * @property {number} order - The order of the parameter within the group
 * @property {number} parameterGroupId - ID of the associated parameter group
 * @property {number} parameterId - Parameter ID
 * @property {number} [parameterValueId] - The ID of the associated parameter value
 * @property {boolean} show - Whether this parameter should be shown within the product specifications
 * @property {boolean} showFilter - Whether this parameter should be shown within filter options
 * @property {string} [type] - The parameter type
 * @property {string} [value] - Parameter value
 */

/**
 * @typedef {("EXTERNAL"|"GEINS_PAY"|"STANDARD")} PaymentCheckout
 */

/**
 * @typedef {Object} PaymentDetailsType
 * @property {string} displayName
 * @property {number} id
 * @property {boolean} isPaid
 * @property {string} name
 * @property {DateTime} [paymentDate]
 * @property {number} paymentFee
 * @property {number} paymentId
 * @property {string} [paymentOption]
 * @property {DateTime} reservationDate
 * @property {string} [reservationNumber]
 * @property {number} shippingFee
 * @property {number} total
 * @property {string} transactionId
 */

/**
 * Type containing payment option information
 * @typedef {Object} PaymentOptionType
 * @property {PaymentCheckout} [checkoutType] - Checkout type
 * @property {string} [displayName] - Display name
 * @property {Decimal} feeExVat - Fee excl. VAT
 * @property {string} [feeExVatFormatted] - Fee excl. VAT, formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34'
 * @property {Decimal} feeIncVat - Fee incl. VAT
 * @property {string} [feeIncVatFormatted] - Fee incl. VAT, formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34'
 * @property {number} id - Payment option ID
 * @property {boolean} isDefault - Whether this payment option is the default selection
 * @property {boolean} isSelected - Whether this option is the one selected
 * @property {string} [logo] - Shipping option logo
 * @property {string} [name] - Name
 * @property {boolean} newCheckoutSession - Whether it is a new checkout session
 * @property {string} [paymentData] - Payment option data
 * @property {PaymentType} [paymentType] - Payment type
 */

/**
 * Payment types
 * @typedef {("AVARDA"|"GEINS_PAY"|"KLARNA"|"STANDARD"|"SVEA"|"WALLEY")} PaymentType
 */

/**
 * @typedef {Object} PlaceOrderResponseType
 * @property {string} [orderId]
 * @property {string} [publicId]
 * @property {string} [redirectUrl]
 * @property {string} [status]
 */

/**
 * Price range filter
 * @typedef {Object} PriceFilterInputType
 * @property {number} [highest] - The highest price you want to include
 * @property {number} [lowest] - The lowest price you want to include
 */

/**
 * Price range filter
 * @typedef {Object} PriceFilterType
 * @property {number} highest - The highest price found in the results
 * @property {number} lowest - The lowest price found in the results
 */

/**
 * Type containing all information about a product price log item
 * @typedef {Object} PriceLogItemType
 * @property {string} date - Date of the price change
 * @property {Decimal} discountExVat - Discount amount excluding VAT
 * @property {string} [discountExVatFormatted] - Discount (excl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34'
 * @property {Decimal} discountIncVat - Discount amount including VAT
 * @property {string} [discountIncVatFormatted] - Discount (incl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34'
 * @property {number} discountPercentage - Discount percentage
 * @property {boolean} isDiscounted - Whether the price is discounted or not
 * @property {boolean} isLowest - True if this log items has the lowest price for the last 30 days
 * @property {Decimal} regularPriceExVat - The regular price excluding VAT
 * @property {string} [regularPriceExVatFormatted] - Regular price (excl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34'
 * @property {Decimal} regularPriceIncVat - The regular price including VAT
 * @property {string} [regularPriceIncVatFormatted] - Regular price (incl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34'
 * @property {Decimal} sellingPriceExVat - The selling price excluding VAT
 * @property {string} [sellingPriceExVatFormatted] - Selling price (excl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34'
 * @property {Decimal} sellingPriceIncVat - The selling price including VAT
 * @property {string} [sellingPriceIncVatFormatted] - Selling price (incl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34'
 * @property {Decimal} vat - VAT amount
 * @property {string} [vatFormatted] - VAT amount, formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34'
 */

/**
 * Type containing price information
 * @typedef {Object} PriceType
 * @property {CurrencyType} [currency] - Currency information
 * @property {Decimal} discountExVat - Discount amount excluding VAT
 * @property {string} [discountExVatFormatted] - Discount (excl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34'
 * @property {Decimal} discountIncVat - Discount amount including VAT
 * @property {string} [discountIncVatFormatted] - Discount (incl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34'
 * @property {number} discountPercentage - Discount percentage
 * @property {boolean} isDiscounted - Whether the price is discounted or not
 * @property {Decimal} regularPriceExVat - The regular price excluding VAT
 * @property {string} [regularPriceExVatFormatted] - Regular price (excl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34'
 * @property {Decimal} regularPriceIncVat - The regular price including VAT
 * @property {string} [regularPriceIncVatFormatted] - Regular price (incl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34'
 * @property {Decimal} sellingPriceExVat - The selling price excluding VAT
 * @property {string} [sellingPriceExVatFormatted] - Selling price (excl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34'
 * @property {Decimal} sellingPriceIncVat - The selling price including VAT
 * @property {string} [sellingPriceIncVatFormatted] - Selling price (incl. VAT), formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34'
 * @property {Decimal} vat - VAT amount
 * @property {string} [vatFormatted] - VAT amount, formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34'
 */

/**
 * Type containing all information about a product image
 * @typedef {Object} ProductImageType
 * @property {string} fileName - The file name of the product image.
 * @property {Array<(string|null|undefined)>} [tags] - Custom tags associated with the product image.
 */

/**
 * Type containing meta data for the package selection that a cart item was added from
 * @typedef {Object} ProductPackageCartItemType
 * @property {number} groupId - The group id
 * @property {number} optionId - The option id
 * @property {number} packageId - The package id
 * @property {string} packageName - The package name
 */

/**
 * Type containing an option selection for a product package group
 * @typedef {Object} ProductPackageSelectionType
 * @property {number} groupId - The group id that the selection is made in
 * @property {number} optionId - The selected option id
 * @property {number} skuId - The selected SKU
 */

/**
 * Type containing type specific information for a product of the type 'package'
 * @typedef {Object} ProductPackageType
 * @property {Array<(GroupType|null|undefined)>} [groups] - Groups in this package
 */

/**
 * Product relation type
 * @typedef {("ACCESSORIES"|"RELATED"|"SIMILAR")} ProductRelation
 */

/**
 * The results of the reviews query.
 * @typedef {Object} ProductReviewResultType
 * @property {number} averageRating - The average rating for this product
 * @property {Long} count - The total count of results for the query
 * @property {Array<(ProductReviewType|null|undefined)>} [reviews] - Results returned by the query
 */

/**
 * Type containing all information about a product review
 * @typedef {Object} ProductReviewType
 * @property {string} author - Author of the review
 * @property {string} comment - The product review comment
 * @property {number} rating - The product rating (1-5)
 * @property {DateTime} reviewDate - The date and time for when the review was made
 */

/**
 * Product info
 * @typedef {Object} ProductTextsType
 * @property {string} [text1] - Main product info
 * @property {string} [text2] - Secondary product info
 * @property {string} [text3] - Tertiary product info
 */

/**
 * Type containing all information about a product
 * @typedef {Object} ProductType
 * @property {string} alias - Alias for the product
 * @property {Array<(string|null|undefined)>} [alternativeCanonicalUrls] - Alternative full paths to the product - DEPRECATED: Use AlternativeUrls instead.
 * @property {Array<(AlternativeUrlType|null|undefined)>} [alternativeUrls] - Alternative urls to the product
 * @property {string} [articleNumber] - The product article number
 * @property {BrandType} [brand] - Product brand information
 * @property {Array<(BreadcrumbType|null|undefined)>} [breadcrumbs] - Breadcrumbs
 * @property {string} [canonicalUrl] - The full path to the product
 * @property {Array<(CategoryType|null|undefined)>} [categories] - Product category information
 * @property {number} categoryId - The primary category ID
 * @property {VariantType} [currentProductVariant] - The current variant selection
 * @property {DimensionsType} [dimensions] - The dimensions of the Product. Note that this can also be set on SKU level
 * @property {Array<(CampaignRuleType|null|undefined)>} [discountCampaigns] - Product discount campaigns
 * @property {DiscountType} [discountType] - Type of discount price: None, SalePrice, PriceCampaign or External
 * @property {string} [firstAvailableOn] - The date on which the product was first available (yyyy-mm-dd)
 * @property {string} [freightClass] - The Freightclass set for this product
 * @property {Array<(string|null|undefined)>} [images] - List of product images - DEPRECATED: Use ProductType.ProductImages instead.
 * @property {LowestPriceType} [lowestPrice] - Lowest price and comparison price according to EU price laws
 * @property {MetadataType} [meta] - Product metadata
 * @property {string} [name] - The product name
 * @property {Array<(ParameterGroupType|null|undefined)>} [parameterGroups] - Product parameter groups
 * @property {Array<(PriceLogItemType|null|undefined)>} [priceLog] - Price log with the prices from the last 30 days
 * @property {CategoryType} [primaryCategory] - Primary category for this product
 * @property {number} productId - Product ID
 * @property {Array<(ProductImageType|null|undefined)>} [productImages] - List of product images and their related properties
 * @property {ProductPackageType} [productPackage] - Package specific information for this product
 * @property {RatingType} [rating] - Product rating
 * @property {Array<(SkuType|null|undefined)>} [skus] - Product SKUs
 * @property {number} supplierId - The Supplier Id
 * @property {ProductTextsType} [texts] - Product text info
 * @property {StockType} [totalStock] - Product stock information
 * @property {string} [type] - The product type. Either 'product' or 'package'
 * @property {PriceType} [unitPrice] - Product price information
 * @property {Array<(VariantDimensionType|null|undefined)>} [variantDimensions] - Variant dimensions
 * @property {VariantGroupType} [variantGroup] - Product variant group
 * @property {number} weight - Weight in grams (g). Note that this can also be set on SKU level
 */

/**
 * The results of the products-query.
 * @typedef {Object} ProductsResultType
 * @property {Long} count - The total count of results for the query
 * @property {FilterCollectionType} [filters] - The filters available for this query
 * @property {Array<(ProductType|null|undefined)>} [products] - Results returned by the query
 */

/**
 * Type containing product rating information
 * @typedef {Object} RatingType
 * @property {Decimal} score - Rating score
 * @property {number} voteCount - Vote count
 */

/**
 * @typedef {Object} RefundType
 * @property {string} [articleNumber]
 * @property {DateTime} createdAt
 * @property {number} id
 * @property {number} itemId
 * @property {string} [reason]
 * @property {number} [reasonCode]
 * @property {string} [refundType]
 * @property {boolean} toBalance
 * @property {number} total
 * @property {number} vat
 */

/**
 * Type containing a subset of product information for related products
 * @typedef {Object} RelatedProductType
 * @property {string} alias - Product alias
 * @property {BrandType} [brand] - Product brand information
 * @property {string} [canonicalUrl] - Full path to the product
 * @property {Array<(CampaignRuleType|null|undefined)>} [discountCampaigns] - Product campaigns
 * @property {Array<(string|null|undefined)>} [images] - List of product images - DEPRECATED: Use RelatedProductType.ProductImages instead.
 * @property {string} [name] - Product name
 * @property {Array<(ParameterGroupType|null|undefined)>} [parameterGroups] - Product parameter groups. The availability of data in this field needs to be configured.
 * @property {CategoryType} [primaryCategory] - Primary category for this product
 * @property {string} [primaryImage] - Product primary image
 * @property {Array<(ProductImageType|null|undefined)>} [productImages] - List of product images and their related properties
 * @property {ProductRelation} [relation] - Relation type - DEPRECATED: Use RelatedProductType.RelationType instead.
 * @property {string} relationType - Relation type
 * @property {string} [secondaryImage] - Product secondary image
 * @property {Array<(SkuType|null|undefined)>} [skus] - Product SKUs
 * @property {PriceType} [unitPrice] - Product price
 */

/**
 * @typedef {Object} ShippingDetailType
 * @property {number} id
 * @property {string} name
 * @property {string} [parcelNumber]
 * @property {DateTime} [shippingDate]
 * @property {number} shippingId
 * @property {string} [trackingLink]
 */

/**
 * Type containing shipping option information
 * @typedef {Object} ShippingOptionType
 * @property {Decimal} amountLeftToFreeShipping - Amount left to recieve free shipping
 * @property {string} [amountLeftToFreeShippingFormatted] - Amount left to recieve free shipping formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34'
 * @property {string} [displayName] - Display name
 * @property {string} [externalId] - External ID
 * @property {Decimal} feeExVat - Fee excl. VAT
 * @property {string} [feeExVatFormatted] - Fee excl. VAT, formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34'
 * @property {Decimal} feeIncVat - Fee incl. VAT
 * @property {string} [feeIncVatFormatted] - Fee incl. VAT, formatted with currency info. e.g. '299 kr', '123,45 SEK', '$12.34'
 * @property {number} id - Shipping option ID
 * @property {boolean} isDefault - Whether this shipping option is the default selection
 * @property {boolean} isSelected - Whether this option is the one selected
 * @property {string} [logo] - Shipping option logo
 * @property {string} [name] - Name
 * @property {string} [shippingData] - Shipping data
 * @property {Array<(ShippingOptionType|null|undefined)>} [subOptions] - Sub-options
 */

/**
 * Type containing all information about a product SKU
 * @typedef {Object} SkuType
 * @property {string} articleNumber - The article number of the SKU
 * @property {DimensionsType} [dimensions] - The dimensions of the SKU
 * @property {string} [externalId] - External ID of the SKU
 * @property {string} [gtin] - SKU GTIN
 * @property {DateTime} [incoming] - Incoming date
 * @property {string} [name] - SKU name
 * @property {number} productId - The associated product ID
 * @property {string} [shelf] - Shelf
 * @property {number} skuId - ID of the SKU
 * @property {StockType} [stock] - Stock information
 * @property {number} weight - Weight in grams (g)
 */

/**
 * Sort types
 * @typedef {("ALPHABETICAL"|"ALPHABETICAL_DESC"|"AVAILABLE_STOCK"|"AVAILABLE_STOCK_DESC"|"BRAND"|"CUSTOM_1"|"CUSTOM_2"|"CUSTOM_3"|"CUSTOM_4"|"CUSTOM_5"|"FACET_ORDER"|"LATEST"|"MOST_SOLD"|"NONE"|"PRICE"|"PRICE_DESC"|"RELEVANCE"|"TOTAL_STOCK"|"TOTAL_STOCK_DESC"|"VOTES")} SortType
 */

/**
 * Represents SKU stock information.
 * @typedef {Object} StockType
 * @property {number} inStock - Number of units currently available in the warehouse.
 * @property {DateTime} [incoming] - The date when new stock is arriving. (Deprecated: Use SkuType.Incoming or VariantType.Incoming instead) - DEPRECATED: Use SkuType.Incoming or VariantType.Incoming instead
 * @property {number} oversellable - Number of units that can be oversold.
 * @property {string} [shelf] - The shelf identifier for the stock. (Deprecated: Use SkuType.Shelf or VariantType.Shelf instead) - DEPRECATED: Use SkuType.Shelf or VariantType.Shelf instead
 * @property {number} [static] - Number of units that are always available for sale. This value is never
 * lowered when goods are sold or increased when goods are returned.
 * @property {number} totalStock - Total number of units available for sale. TotalStock = InStock + OverSellable + Static.
 */

/**
 * @typedef {Object} UrlHistoryType
 * @property {string} newUrl
 * @property {string} oldUrl
 */

/**
 * @typedef {Object} UserBalanceType
 * @property {Decimal} amount
 * @property {string} [amountFormatted] - User balance amount. Formatted as a currency string.
 * @property {string} currency
 */

/**
 * @typedef {Object} UserInputType
 * @property {AddressInputType} [address]
 * @property {CustomerType} [customerType]
 * @property {Gender} [gender]
 * @property {string} [metaData] - Free-text field to store any data related to the customer.
 * @property {boolean} [newsletter]
 * @property {string} [personalId]
 */

/**
 * @typedef {Object} UserType
 * @property {AddressType} [address] - The address of the user.
 * @property {Decimal} balance - Account balance - DEPRECATED: Use Balances instead
 * @property {string} [balanceFormatted] - Account balance. Formatted as a currency string. - DEPRECATED: Use Balances instead
 * @property {Array<(UserBalanceType|null|undefined)>} [balances] - User balance per currency
 * @property {CustomerType} [customerType] - The customer type of the user.
 * @property {string} email - The email address of the user.
 * @property {Gender} [gender] - The gender of the user.
 * @property {number} id - The unique identifier of the user.
 * @property {number} memberId - The membership identifier of the user.
 * @property {string} memberType - The type of membership the user has.
 * @property {string} [metaData] - Free-text field that can contain any additional metadata related to the customer.
 * @property {boolean} [newsletter] - Indicates if the user is subscribed to the newsletter.
 * @property {string} [personalId] - The personal identification number of the user.
 */

/**
 * @typedef {Object} ValidateOrderConditionsResponseType
 * @property {boolean} isValid
 * @property {string} [message]
 */

/**
 * @typedef {Object} ValidateOrderCreationResponseType
 * @property {boolean} isValid
 * @property {string} [memberType]
 * @property {string} [message]
 */

/**
 * Type containing variant attribute information
 * @typedef {Object} VariantAttributeType
 * @property {string} key - Attribute key
 * @property {string} value - Attribute value
 */

/**
 * Type containing variant dimension information
 * @typedef {Object} VariantDimensionType
 * @property {Array<(VariantAttributeType|null|undefined)>} [attributes] - Dimension attributes
 * @property {string} dimension - The dimension name
 * @property {Array<(VariantValueType|null|undefined)>} [group] - Group values
 * @property {string} [label] - Dimension label
 * @property {number} level - The level of this variant dimension
 * @property {string} type - Dimension type. e.g. 'product' if it leads to a different product, otherwise 'selection'
 * @property {string} [value] - Dimension value
 */

/**
 * Type containing variant group information
 * @typedef {Object} VariantGroupType
 * @property {number} activeProducts - The amount of active products in this variant group
 * @property {boolean} collapseInLists - If true, only the main product will show up in product lists
 * @property {number} mainProductId - ID of the main product in this group
 * @property {string} name - Variant group name
 * @property {number} variantGroupId - Variant group ID
 * @property {Array<(VariantType|null|undefined)>} [variants] - Group variants
 */

/**
 * Type containing variant information
 * @typedef {Object} VariantType
 * @property {string} [alias] - Alias for variant selection. e.g. 'product-4'
 * @property {Array<(VariantAttributeType|null|undefined)>} [attributes] - Variant attributes
 * @property {string} [canonicalUrl] - Canonical URL. Only available for the 'product'-level
 * @property {string} dimension - Variant dimension
 * @property {DateTime} [incoming] - Incoming date
 * @property {string} [label] - Variant label
 * @property {number} level - Level of this variant. Lower value is a more accurate selection
 * @property {string} [name] - Variant name
 * @property {string} [primaryImage] - The primary image used for the product. Only available for the 'product'-level
 * @property {number} productId - Product ID associated with this variant
 * @property {string} [shelf] - Shelf
 * @property {number} [skuId] - SKU ID associated with this variant
 * @property {StockType} [stock] - Stock information for variant
 * @property {string} type - Variant type. In order of accuracy 'sku', 'product', 'selection'
 * @property {string} [value] - Variant value
 * @property {Array<(VariantType|null|undefined)>} [variants] - List of variants for this variant
 */

/**
 * Type containing variant value information
 * @typedef {Object} VariantValueType
 * @property {string} label - Label
 * @property {string} value - Value
 */

/**
 * Type containing VAT group information
 * @typedef {Object} VatGroupType
 * @property {Decimal} amount - VAT amount
 * @property {number} rate - VAT rate
 */