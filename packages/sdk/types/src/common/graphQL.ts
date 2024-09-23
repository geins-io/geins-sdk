/**
 * @typedef {Object} OrderType
 * @property {number} [id] - The unique identifier of the order.
 * @property {number} [customerId] - The ID of the customer who placed the order.
 * @property {string} [createdAt] - The date and time when the order was created, represented as a string.
 * @property {string} [completedAt] - The date and time when the order was completed, represented as a string.
 * @property {string} [currency] - The currency used for the order.
 * @property {string} [desiredDeliveryDate] - The preferred delivery date for the order, represented as a string.
 * @property {string} [message] - Optional message related to the order.
 * @property {string} [status] - The current status of the order.
 * @property {string} [updatedAt] - The date and time when the order was last updated, represented as a string.
 * @property {string} [publicId] - The public ID of the order.
 * @property {AddressType} [billingAddress] - The billing address associated with the order.
 * @property {AddressType} [shippingAddress] - The shipping address associated with the order.
 * @property {CartType} [cart] - The cart associated with the order.
 * @property {PaymentDetailsType[]} [paymentDetails] - Details of payments made for the order.
 * @property {PriceType} [discount] - The discount applied to the order.
 * @property {PriceType} [orderTotal] - The total price of the order.
 * @property {PriceType} [paymentFee] - The payment fee for the order.
 * @property {PriceType} [shippingFee] - The shipping fee for the order.
 * @property {PriceType} [vat] - The VAT applied to the order.
 * @property {number} [fromBalance] - The amount taken from the account balance.
 * @property {string} [fromBalanceFormatted] - The formatted string of the balance used.
 * @property {RefundType[]} [refunds] - Any refunds associated with the order.
 * @property {ShippingDetailType[]} [shippingDetails] - Details about the shipping of the order.
 */
export type OrderType = {
  id?: number;
  customerId?: number;
  createdAt?: string;
  completedAt?: string;
  currency?: string;
  desiredDeliveryDate?: string;
  message?: string;
  status?: string;
  updatedAt?: string;
  publicId?: string;
  billingAddress?: AddressType;
  shippingAddress?: AddressType;
  cart?: CartType;
  paymentDetails?: PaymentDetailsType[];
  discount?: PriceType;
  orderTotal?: PriceType;
  paymentFee?: PriceType;
  shippingFee?: PriceType;
  vat?: PriceType;
  fromBalance?: number;
  fromBalanceFormatted?: string;
  refunds?: RefundType[];
  shippingDetails?: ShippingDetailType[];
};

/**
 * @typedef {Object} CartType
 * @property {string} [id] - The unique identifier of the cart.
 * @property {CartItemType[]} [items] - The list of items in the cart.
 * @property {boolean} [isCompleted] - Indicates if the cart has been completed.
 * @property {string} [promoCode] - The promo code applied to the cart, if any.
 * @property {boolean} [freeShipping] - Indicates if the cart qualifies for free shipping.
 * @property {number} [fixedDiscount] - The fixed discount applied to the cart.
 * @property {CampaignRuleType[]} [appliedCampaigns] - Campaigns applied to the cart.
 * @property {CartSummaryType} [summary] - The summary of the cart, including totals and fees.
 */
export type CartType = {
  id?: string;
  items?: CartItemType[];
  isCompleted?: boolean;
  promoCode?: string;
  freeShipping?: boolean;
  fixedDiscount?: number;
  appliedCampaigns?: CampaignRuleType[];
  summary?: CartSummaryType;
};

/**
 * @typedef {Object} CartItemType
 * @property {ProductType} [product] - The product associated with the cart item.
 * @property {number} [skuId] - The SKU ID of the product.
 * @property {string} [id] - The unique identifier of the cart item.
 * @property {PriceType} [totalPrice] - The total price of the cart item.
 * @property {PriceType} [unitPrice] - The price per unit of the product.
 * @property {number} [quantity] - The quantity of the product in the cart.
 * @property {CampaignType} [campaign] - The campaign associated with this cart item, if any.
 * @property {string} [groupKey] - The key of the group that this cart item belongs to.
 * @property {ProductPackageCartItemType} [productPackage] - Package metadata if the cart item was part of a package.
 * @property {string} [message] - A custom message related to the cart item.
 */
export type CartItemType = {
  product?: ProductType;
  skuId?: number;
  id?: string;
  totalPrice?: PriceType;
  unitPrice?: PriceType;
  quantity?: number;
  campaign?: CampaignType;
  groupKey?: string;
  productPackage?: ProductPackageCartItemType;
  message?: string;
};

/**
 * @typedef {Object} ProductType
 * @property {number} [productId] - The unique identifier of the product.
 * @property {string} [name] - The name of the product.
 * @property {string} [alias] - The alias of the product.
 * @property {string} [articleNumber] - The article number of the product.
 * @property {number} [categoryId] - The ID of the primary category the product belongs to.
 * @property {string} [canonicalUrl] - The full path to the product.
 * @property {string[]} [alternativeCanonicalUrls] - Deprecated: Use alternativeUrls instead.
 * @property {AlternativeUrlType[]} [alternativeUrls] - Alternative URLs for the product.
 * @property {string} [firstAvailableOn] - The date the product was first available.
 * @property {ProductTextsType} [texts] - Text information about the product.
 * @property {string} [type] - The type of the product, either 'product' or 'package'.
 * @property {SkuType[]} [skus] - The SKUs associated with the product.
 * @property {BrandType} [brand] - Brand information for the product.
 * @property {CategoryType[]} [categories] - Categories associated with the product.
 * @property {PriceType} [unitPrice] - Price information for the product.
 * @property {LowestPriceType} [lowestPrice] - Lowest price and comparison price according to EU price laws.
 * @property {string[]} [images] - Deprecated: Use productImages instead.
 * @property {ProductImageType[]} [productImages] - List of product images and their related properties.
 * @property {ParameterGroupType[]} [parameterGroups] - Parameter groups associated with the product.
 * @property {VariantDimensionType[]} [variantDimensions] - Variant dimensions associated with the product.
 * @property {VariantGroupType} [variantGroup] - Information about the product's variant group.
 * @property {RatingType} [rating] - Rating information for the product.
 * @property {StockType} [totalStock] - Stock information for the product.
 * @property {MetadataType} [meta] - Metadata for the product.
 * @property {CategoryType} [primaryCategory] - The primary category for the product.
 * @property {VariantType} [currentProductVariant] - The current variant selection for the product.
 * @property {BreadcrumbType[]} [breadcrumbs] - Breadcrumbs for the product.
 * @property {CampaignRuleType[]} [discountCampaigns] - Discount campaigns associated with the product.
 * @property {PriceLogItemType[]} [priceLog] - Price log items from the last 30 days.
 * @property {string} [discountType] - The type of discount: None, Sale, or Campaign.
 * @property {ProductPackageType} [productPackage] - Package-specific information for the product.
 * @property {DimensionsType} [dimensions] - Dimensions of the product (can also be set on SKU level).
 * @property {number} [weight] - The weight of the product in grams.
 * @property {string} [freightClass] - The freight class set for the product.
 * @property {number} [supplierId] - The supplier ID of the product.
 */
export type ProductType = {
  productId?: number;
  name?: string;
  alias?: string;
  articleNumber?: string;
  categoryId?: number;
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
  discountType?: string;
  productPackage?: ProductPackageType;
  dimensions?: DimensionsType;
  weight?: number;
  freightClass?: string;
  supplierId?: number;
};

/**
 * @typedef {Object} CampaignRuleType
 * @property {string} [campaignId] - The unique identifier of the campaign.
 * @property {string} [name] - The name of the campaign.
 * @property {boolean} [hideTitle] - Whether the campaign title should be hidden.
 * @property {string} [ruleType] - The type of campaign rule.
 * @property {string} [category] - The category of the campaign.
 * @property {string} [action] - The action triggered by the campaign.
 * @property {string} [actionValue] - The value associated with the campaign action.
 * @property {string} [canonicalUrl] - The URL for this campaign, if any.
 */
export type CampaignRuleType = {
  campaignId?: string;
  name?: string;
  hideTitle?: boolean;
  ruleType?: string;
  category?: string;
  action?: string;
  actionValue?: string;
  canonicalUrl?: string;
};

/**
 * @typedef {Object} AddressType
 * @property {string} firstName - The first name of the recipient.
 * @property {string} lastName - The last name of the recipient.
 * @property {string} addressLine1 - The first line of the address.
 * @property {string} [addressLine2] - The second line of the address (optional).
 * @property {string} [addressLine3] - The third line of the address (optional).
 * @property {string} [entryCode] - The entry code for the address (optional).
 * @property {string} [careOf] - Care of information (optional).
 * @property {string} city - The city for the address.
 * @property {string} state - The state for the address (optional).
 * @property {string} country - The country for the address.
 * @property {string} zip - The zip or postal code for the address.
 * @property {string} [company] - The company associated with the address (optional).
 * @property {string} [mobile] - The mobile number associated with the address (optional).
 * @property {string} [phone] - The phone number associated with the address (optional).
 */
export type AddressType = {
  firstName?: string;
  lastName?: string;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  entryCode?: string;
  careOf?: string;
  city?: string;
  state?: string;
  country: string;
  zip?: string;
  company?: string;
  mobile?: string;
  phone?: string;
};

/**
 * @typedef {Object} PaymentDetailsType
 * @property {number} id - The unique identifier for the payment.
 * @property {number} paymentId - The ID for the payment option.
 * @property {string} transactionId - The transaction ID for the payment.
 * @property {string} displayName - The display name of the payment method.
 * @property {string} name - The name of the payment method.
 * @property {boolean} isPaid - Indicates if the payment has been made.
 * @property {string} [paymentDate] - The date of payment (optional).
 * @property {number} paymentFee - The fee associated with the payment.
 * @property {string} [paymentOption] - Additional payment option information (optional).
 * @property {string} reservationDate - The reservation date of the payment.
 * @property {string} [reservationNumber] - The reservation number for the payment (optional).
 * @property {number} shippingFee - The shipping fee for the order.
 * @property {number} total - The total amount of the payment.
 */
export type PaymentDetailsType = {
  id?: number;
  paymentId?: number;
  transactionId?: string;
  displayName?: string;
  name?: string;
  isPaid?: boolean;
  paymentDate?: string;
  paymentFee?: number;
  paymentOption?: string;
  reservationDate: string;
  reservationNumber?: string;
  shippingFee?: number;
  total?: number;
};

/**
 * @typedef {Object} PriceType
 * @property {number} sellingPriceIncVat - The selling price including VAT.
 * @property {number} sellingPriceExVat - The selling price excluding VAT.
 * @property {number} regularPriceIncVat - The regular price including VAT.
 * @property {number} regularPriceExVat - The regular price excluding VAT.
 * @property {number} discountIncVat - The discount amount including VAT.
 * @property {number} discountExVat - The discount amount excluding VAT.
 * @property {number} discountPercentage - The discount percentage.
 * @property {number} vat - The VAT amount.
 * @property {boolean} isDiscounted - Indicates if the price is discounted.
 * @property {string} sellingPriceIncVatFormatted - Formatted selling price including VAT.
 * @property {string} sellingPriceExVatFormatted - Formatted selling price excluding VAT.
 * @property {string} regularPriceIncVatFormatted - Formatted regular price including VAT.
 * @property {string} regularPriceExVatFormatted - Formatted regular price excluding VAT.
 * @property {string} discountIncVatFormatted - Formatted discount amount including VAT.
 * @property {string} discountExVatFormatted - Formatted discount amount excluding VAT.
 * @property {string} vatFormatted - Formatted VAT amount.
 */
export type PriceType = {
  sellingPriceIncVat: number;
  sellingPriceExVat: number;
  regularPriceIncVat: number;
  regularPriceExVat: number;
  discountIncVat: number;
  discountExVat: number;
  discountPercentage: number;
  vat: number;
  isDiscounted: boolean;
  sellingPriceIncVatFormatted: string;
  sellingPriceExVatFormatted: string;
  regularPriceIncVatFormatted: string;
  regularPriceExVatFormatted: string;
  discountIncVatFormatted: string;
  discountExVatFormatted: string;
  vatFormatted: string;
};

/**
 * @typedef {Object} CartSummaryType
 * @property {PriceType} [total] - The total price of the cart.
 * @property {PriceType} [subTotal] - The subtotal price of the cart.
 * @property {VatGroupType[]} [vats] - VAT information for the cart.
 * @property {CartFeesType} [fees] - Fees related to the cart.
 * @property {BalanceType} [balance] - Account balance information.
 * @property {number} [fixedAmountDiscountIncVat] - Fixed discount amount including VAT.
 * @property {number} [fixedAmountDiscountExVat] - Fixed discount amount excluding VAT.
 * @property {ShippingOptionType} [shipping] - Shipping option information.
 * @property {PaymentOptionType} [payment] - Payment option information.
 */
export type CartSummaryType = {
  total?: PriceType;
  subTotal?: PriceType;
  vats?: VatGroupType[];
  fees?: CartFeesType;
  balance?: BalanceType;
  fixedAmountDiscountIncVat?: number;
  fixedAmountDiscountExVat?: number;
  shipping?: ShippingOptionType;
  payment?: PaymentOptionType;
};

/**
 * @typedef {Object} CampaignType
 * @property {CampaignRuleType[]} [appliedCampaigns] - Campaigns applied to this cart item.
 * @property {CampaignPriceType[]} [prices] - Campaign price information for this cart item.
 */
export type CampaignType = {
  appliedCampaigns?: CampaignRuleType[];
  prices?: CampaignPriceType[];
};

/**
 * @typedef {Object} ProductPackageCartItemType
 * @property {number} [packageId] - The ID of the package.
 * @property {string} [packageName] - The name of the package.
 * @property {number} [groupId] - The ID of the group in the package.
 * @property {number} [optionId] - The ID of the option selected in the package group.
 */
export type ProductPackageCartItemType = {
  packageId?: number;
  packageName?: string;
  groupId?: number;
  optionId?: number;
};

/**
 * @typedef {Object} SkuType
 * @property {number} [skuId] - The unique identifier for the SKU.
 * @property {number} [productId] - The ID of the associated product.
 * @property {string} [articleNumber] - The article number for the SKU.
 * @property {string} [name] - The name of the SKU.
 * @property {string} [externalId] - The external identifier for the SKU.
 * @property {string} [gtin] - The GTIN (Global Trade Item Number) for the SKU.
 * @property {StockType} [stock] - Stock information for the SKU.
 * @property {DimensionsType} [dimensions] - Dimensions of the SKU.
 * @property {string} [shelf] - The shelf information for the SKU.
 * @property {string} [incoming] - Incoming date for the SKU.
 * @property {number} [weight] - Weight of the SKU in grams.
 */
export type SkuType = {
  skuId?: number;
  productId?: number;
  articleNumber?: string;
  name?: string;
  externalId?: string;
  gtin?: string;
  stock?: StockType;
  dimensions?: DimensionsType;
  shelf?: string;
  incoming?: string;
  weight?: number;
};

/**
 * @typedef {Object} StockType
 * @property {number} [totalStock] - The total units available in stock.
 * @property {number} [inStock] - The units currently available in stock.
 * @property {number} [oversellable] - The number of units that can be oversold.
 * @property {number} [static] - Amount of units that are always available.
 * @property {string} [incoming] - Incoming date for restock.
 * @property {string} [shelf] - Shelf location for the stock.
 */
export type StockType = {
  totalStock?: number;
  inStock?: number;
  oversellable?: number;
  static?: number;
  incoming?: string;
  shelf?: string;
};

/**
 * @typedef {Object} DimensionsType
 * @property {number} length - The length of the product in millimeters.
 * @property {number} width - The width of the product in millimeters.
 * @property {number} height - The height of the product in millimeters.
 */
export type DimensionsType = {
  length?: number;
  width?: number;
  height?: number;
};

/**
 * @typedef {Object} CampaignPriceType
 * @property {number} quantity - The quantity for which the campaign price applies.
 * @property {number} discount - The discount amount applied by the campaign.
 * @property {number} discountPercentage - The percentage discount provided by the campaign.
 * @property {PriceType} price - The price after the campaign discount.
 */
export type CampaignPriceType = {
  quantity?: number;
  discount?: number;
  discountPercentage?: number;
  price?: PriceType;
};

/**
 * @typedef {Object} PaymentOptionType
 * @property {number} id - The unique identifier for the payment option.
 * @property {string} name - The name of the payment option.
 * @property {string} displayName - The display name of the payment option.
 * @property {string} logo - The logo URL for the payment option.
 * @property {number} feeIncVat - The fee including VAT.
 * @property {number} feeExVat - The fee excluding VAT.
 * @property {boolean} isDefault - Indicates if this is the default payment option.
 * @property {boolean} isSelected - Indicates if this payment option is selected.
 * @property {string} paymentType - The type of payment (e.g., "Klarna", "Standard").
 * @property {string} paymentData - Additional data related to the payment option.
 * @property {boolean} newCheckoutSession - Whether this is a new checkout session.
 * @property {string} feeIncVatFormatted - The formatted fee including VAT.
 * @property {string} feeExVatFormatted - The formatted fee excluding VAT.
 */
export type PaymentOptionType = {
  id?: number;
  name?: string;
  displayName?: string;
  logo?: string;
  feeIncVat?: number;
  feeExVat?: number;
  isDefault?: boolean;
  isSelected?: boolean;
  paymentType?: string;
  paymentData?: string;
  newCheckoutSession?: boolean;
  feeIncVatFormatted?: string;
  feeExVatFormatted?: string;
};

/**
 * @typedef {Object} ShippingOptionType
 * @property {number} id - The unique identifier for the shipping option.
 * @property {string} name - The name of the shipping option.
 * @property {string} displayName - The display name of the shipping option.
 * @property {number} feeIncVat - The fee including VAT for the shipping option.
 * @property {number} feeExVat - The fee excluding VAT for the shipping option.
 * @property {boolean} isDefault - Indicates if this is the default shipping option.
 * @property {boolean} isSelected - Indicates if this shipping option is selected.
 * @property {string} externalId - External identifier for the shipping option.
 * @property {string} shippingData - Additional shipping data.
 * @property {number} amountLeftToFreeShipping - Amount left to qualify for free shipping.
 * @property {string} logo - The logo URL for the shipping option.
 * @property {ShippingOptionType[]} [subOptions] - Sub-options for the shipping option.
 * @property {string} amountLeftToFreeShippingFormatted - Formatted amount left for free shipping.
 * @property {string} feeIncVatFormatted - The formatted fee including VAT.
 * @property {string} feeExVatFormatted - The formatted fee excluding VAT.
 */
export type ShippingOptionType = {
  id?: number;
  name?: string;
  displayName?: string;
  feeIncVat?: number;
  feeExVat?: number;
  isDefault?: boolean;
  isSelected?: boolean;
  externalId?: string;
  shippingData?: string;
  amountLeftToFreeShipping?: number;
  logo?: string;
  subOptions?: ShippingOptionType[];
  amountLeftToFreeShippingFormatted?: string;
  feeIncVatFormatted?: string;
  feeExVatFormatted?: string;
};

/**
 * @typedef {Object} BalanceType
 * @property {number} remaining - The remaining account balance.
 * @property {number} pending - The amount pending to be used from the balance.
 * @property {number} totalSellingPriceExBalanceIncVat - The cart total selling price including VAT, excluding the balance used.
 * @property {number} totalSellingPriceExBalanceExVat - The cart total selling price excluding VAT, excluding the balance used.
 * @property {string} remainingFormatted - The remaining balance formatted as a currency string.
 * @property {string} pendingFormatted - The pending balance formatted as a currency string.
 * @property {string} totalSellingPriceExBalanceIncVatFormatted - The formatted total selling price including VAT, excluding the balance used.
 * @property {string} totalSellingPriceExBalanceExVatFormatted - The formatted total selling price excluding VAT, excluding the balance used.
 */
export type BalanceType = {
  remaining?: number;
  pending?: number;
  totalSellingPriceExBalanceIncVat?: number;
  totalSellingPriceExBalanceExVat?: number;
  remainingFormatted?: string;
  pendingFormatted?: string;
  totalSellingPriceExBalanceIncVatFormatted?: string;
  totalSellingPriceExBalanceExVatFormatted?: string;
};

/**
 * @typedef {Object} CartFeesType
 * @property {number} paymentFeeIncVat - Payment fee including VAT.
 * @property {number} paymentFeeExVat - Payment fee excluding VAT.
 * @property {number} shippingFeeIncVat - Shipping fee including VAT.
 * @property {number} shippingFeeExVat - Shipping fee excluding VAT.
 */
export type CartFeesType = {
  paymentFeeIncVat?: number;
  paymentFeeExVat?: number;
  shippingFeeIncVat?: number;
  shippingFeeExVat?: number;
};

/**
 * @typedef {Object} VatGroupType
 * @property {number} rate - The VAT rate as a percentage.
 * @property {number} amount - The VAT amount.
 */
export type VatGroupType = {
  rate?: number;
  amount?: number;
};

/**
 * @typedef {Object} AlternativeUrlType
 * @property {string} url - The alternative URL.
 * @property {string} culture - The culture of the alternative URL.
 * @property {string} language - The language code for the alternative URL.
 * @property {string} [country] - The country code for the alternative URL.
 * @property {string} channelId - The ID of the channel that the alternative URL belongs to.
 */
export type AlternativeUrlType = {
  url?: string;
  culture?: string;
  language?: string;
  country?: string;
  channelId: string;
};

/**
 * @typedef {Object} ProductTextsType
 * @property {string} [text1] - Main product information.
 * @property {string} [text2] - Secondary product information.
 * @property {string} [text3] - Tertiary product information.
 */
export type ProductTextsType = {
  text1?: string;
  text2?: string;
  text3?: string;
};

/**
 * @typedef {Object} BrandType
 * @property {number} brandId - The unique identifier for the brand.
 * @property {string} [alias] - The alias of the brand.
 * @property {string} [canonicalUrl] - The full path to the brand.
 * @property {string[]} [alternativeCanonicalUrls] - Deprecated: Use alternativeUrls instead.
 * @property {AlternativeUrlType[]} [alternativeUrls] - Alternative URLs for the brand.
 * @property {string} [name] - The name of the brand.
 * @property {string} [description] - The description of the brand.
 */
export type BrandType = {
  brandId?: number;
  alias?: string;
  canonicalUrl?: string;
  alternativeCanonicalUrls?: string[];
  alternativeUrls?: AlternativeUrlType[];
  name?: string;
  description?: string;
};

/**
 * @typedef {Object} CategoryType
 * @property {number} categoryId - The unique identifier for the category.
 * @property {number} parentCategoryId - The ID of the parent category.
 * @property {number} [order] - The display order of the category.
 * @property {string} alias - The alias of the category.
 * @property {string} canonicalUrl - The full path to the category.
 * @property {string[]} [alternativeCanonicalUrls] - Deprecated: Use alternativeUrls instead.
 * @property {AlternativeUrlType[]} [alternativeUrls] - Alternative URLs for the category.
 * @property {string} name - The name of the category.
 * @property {string} [description] - The description of the category.
 * @property {boolean} [isHidden] - Indicates if the category is hidden.
 */
export type CategoryType = {
  categoryId?: number;
  parentCategoryId?: number;
  order?: number;
  alias?: string;
  canonicalUrl: string;
  alternativeCanonicalUrls?: string[];
  alternativeUrls?: AlternativeUrlType[];
  name?: string;
  description?: string;
  isHidden?: boolean;
};

/**
 * @typedef {Object} LowestPriceType
 * @property {number} sellingPriceIncVat - The selling price including VAT.
 * @property {number} sellingPriceExVat - The selling price excluding VAT.
 * @property {number} comparisonPriceIncVat - The comparison price including VAT.
 * @property {number} comparisonPriceExVat - The comparison price excluding VAT.
 * @property {number} lowestPriceIncVat - The lowest price including VAT.
 * @property {number} lowestPriceExVat - The lowest price excluding VAT.
 * @property {number} discountIncVat - The discount amount including VAT.
 * @property {number} discountExVat - The discount amount excluding VAT.
 * @property {number} discountPercentage - The discount percentage.
 * @property {number} vat - The VAT amount.
 * @property {boolean} isDiscounted - Indicates if the price is discounted.
 * @property {string} sellingPriceIncVatFormatted - The formatted selling price including VAT.
 * @property {string} comparisonPriceIncVatFormatted - The formatted comparison price including VAT.
 * @property {string} lowestPriceIncVatFormatted - The formatted lowest price including VAT.
 */
export type LowestPriceType = {
  sellingPriceIncVat?: number;
  sellingPriceExVat?: number;
  comparisonPriceIncVat?: number;
  comparisonPriceExVat?: number;
  lowestPriceIncVat?: number;
  lowestPriceExVat?: number;
  discountIncVat?: number;
  discountExVat?: number;
  discountPercentage?: number;
  vat?: number;
  isDiscounted?: boolean;
  sellingPriceIncVatFormatted?: string;
  comparisonPriceIncVatFormatted?: string;
  lowestPriceIncVatFormatted?: string;
};

/**
 * @typedef {Object} ProductImageType
 * @property {string} fileName - The file name of the product image.
 * @property {string[]} [tags] - Custom tags associated with the product image.
 */
export type ProductImageType = {
  fileName?: string;
  tags?: string[];
};

/**
 * @typedef {Object} ParameterGroupType
 * @property {number} [parameterGroupId] - The unique identifier for the parameter group.
 * @property {number} productId - The ID of the associated product.
 * @property {string} name - The name of the parameter group.
 * @property {ParameterType[]} [parameters] - The list of parameters within the group.
 */
export type ParameterGroupType = {
  parameterGroupId?: number;
  productId?: number;
  name?: string;
  parameters?: ParameterType[];
};

/**
 * @typedef {Object} VariantDimensionType
 * @property {number} level - The level of this variant dimension.
 * @property {string} dimension - The name of the variant dimension.
 * @property {string} type - The type of the variant dimension.
 * @property {string} [value] - The value of the variant dimension.
 * @property {string} [label] - The label of the variant dimension.
 * @property {VariantAttributeType[]} [attributes] - The attributes associated with the variant dimension.
 * @property {VariantValueType[]} [group] - The group values of the variant dimension.
 */
export type VariantDimensionType = {
  level?: number;
  dimension?: string;
  type?: string;
  value?: string;
  label?: string;
  attributes?: VariantAttributeType[];
  group?: VariantValueType[];
};

/**
 * @typedef {Object} VariantGroupType
 * @property {number} variantGroupId - The unique identifier for the variant group.
 * @property {string} name - The name of the variant group.
 * @property {number} mainProductId - The ID of the main product in this variant group.
 * @property {boolean} collapseInLists - Indicates if only the main product will show up in product lists.
 * @property {number} activeProducts - The number of active products in this variant group.
 * @property {VariantType[]} variants - The list of variants in this group.
 */
export type VariantGroupType = {
  variantGroupId?: number;
  name?: string;
  mainProductId?: number;
  collapseInLists?: boolean;
  activeProducts?: number;
  variants?: VariantType[];
};

/**
 * @typedef {Object} RatingType
 * @property {number} score - The rating score.
 * @property {number} voteCount - The number of votes.
 */
export type RatingType = {
  score?: number;
  voteCount?: number;
};

/**
 * @typedef {Object} MetadataType
 * @property {string} [title] - The meta title for the product.
 * @property {string} [description] - The meta description for the product.
 * @property {string} [keywords] - The meta keywords for the product.
 */
export type MetadataType = {
  title?: string;
  description?: string;
  keywords?: string;
};

/**
 * @typedef {Object} BreadcrumbType
 * @property {number} categoryId - The ID of the category in the breadcrumb.
 * @property {number} parentCategoryId - The ID of the parent category in the breadcrumb.
 * @property {string} url - The URL path of the breadcrumb.
 * @property {string} name - The display name of the breadcrumb.
 */
export type BreadcrumbType = {
  categoryId?: number;
  parentCategoryId?: number;
  url?: string;
  name?: string;
};

/**
 * @typedef {Object} PriceLogItemType
 * @property {number} sellingPriceIncVat - The selling price including VAT.
 * @property {number} sellingPriceExVat - The selling price excluding VAT.
 * @property {number} regularPriceIncVat - The regular price including VAT.
 * @property {number} regularPriceExVat - The regular price excluding VAT.
 * @property {number} discountIncVat - The discount amount including VAT.
 * @property {number} discountExVat - The discount amount excluding VAT.
 * @property {number} discountPercentage - The discount percentage.
 * @property {number} vat - The VAT amount.
 * @property {boolean} isDiscounted - Indicates if the price is discounted.
 * @property {boolean} isLowest - Indicates if this price was the lowest in the last 30 days.
 * @property {string} date - The date of the price change.
 * @property {string} sellingPriceIncVatFormatted - The formatted selling price including VAT.
 * @property {string} sellingPriceExVatFormatted - The formatted selling price excluding VAT.
 * @property {string} regularPriceIncVatFormatted - The formatted regular price including VAT.
 * @property {string} regularPriceExVatFormatted - The formatted regular price excluding VAT.
 * @property {string} discountIncVatFormatted - The formatted discount amount including VAT.
 * @property {string} discountExVatFormatted - The formatted discount amount excluding VAT.
 * @property {string} vatFormatted - The formatted VAT amount.
 */
export type PriceLogItemType = {
  sellingPriceIncVat?: number;
  sellingPriceExVat?: number;
  regularPriceIncVat?: number;
  regularPriceExVat?: number;
  discountIncVat?: number;
  discountExVat?: number;
  discountPercentage?: number;
  vat?: number;
  isDiscounted?: boolean;
  isLowest?: boolean;
  date?: string;
  sellingPriceIncVatFormatted?: string;
  sellingPriceExVatFormatted?: string;
  regularPriceIncVatFormatted?: string;
  regularPriceExVatFormatted?: string;
  discountIncVatFormatted?: string;
  discountExVatFormatted?: string;
  vatFormatted?: string;
};

/**
 * @typedef {Object} ProductPackageType
 * @property {GroupType[]} groups - The groups in this package.
 */
export type ProductPackageType = {
  groups?: GroupType[];
};

/**
 * @typedef {Object} GroupType
 * @property {number} groupId - The unique identifier of the group.
 * @property {string} [name] - The name of the group.
 * @property {string} [description] - The description of the group.
 * @property {string} [image] - The image URL of the group.
 * @property {boolean} required - Indicates if this group is required in the package.
 * @property {number} sortOrder - The sort order of the group relative to others.
 * @property {OptionType[]} [options] - The options available in this group.
 */
export type GroupType = {
  groupId?: number;
  name?: string;
  description?: string;
  image?: string;
  required: boolean;
  sortOrder: number;
  options?: OptionType[];
};

/**
 * @typedef {Object} VariantAttributeType
 * @property {string} key - The attribute key.
 * @property {string} value - The attribute value.
 */
export type VariantAttributeType = {
  key?: string;
  value?: string;
};

/**
 * @typedef {Object} VariantType
 * @property {number} level - The level of this variant.
 * @property {string} dimension - The dimension name of the variant.
 * @property {string} type - The variant type (e.g., "sku", "product", "selection").
 * @property {string} [value] - The value of the variant.
 * @property {string} [label] - The label of the variant.
 * @property {number} [skuId] - The SKU ID associated with this variant.
 * @property {string} [incoming] - The incoming date for the variant.
 * @property {string} [shelf] - The shelf location for the variant.
 * @property {StockType} [stock] - Stock information for the variant.
 * @property {number} productId - The ID of the product associated with this variant.
 * @property {string} [name] - The name of the variant.
 * @property {string} [alias] - The alias for the variant selection.
 * @property {string} [canonicalUrl] - The canonical URL for the variant.
 * @property {string} [primaryImage] - The primary image used for the variant.
 * @property {VariantAttributeType[]} [attributes] - Attributes of the variant.
 * @property {VariantType[]} [variants] - Sub-variants of this variant.
 */
export type VariantType = {
  level?: number;
  dimension?: string;
  type?: string;
  value?: string;
  label?: string;
  skuId?: number;
  incoming?: string;
  shelf?: string;
  stock?: StockType;
  productId?: number;
  name?: string;
  alias?: string;
  canonicalUrl?: string;
  primaryImage?: string;
  attributes?: VariantAttributeType[];
  variants?: VariantType[];
};

/**
 * @typedef {Object} VariantValueType
 * @property {string} label - The label of the variant value.
 * @property {string} value - The value of the variant.
 */
export type VariantValueType = {
  label: string;
  value: string;
};

/**
 * @typedef {Object} ParameterType
 * @property {number} parameterId - The unique identifier of the parameter.
 * @property {number} parameterGroupId - The ID of the associated parameter group.
 * @property {string} [type] - The type of the parameter.
 * @property {string} [name] - The name of the parameter.
 * @property {string} [label] - The label of the parameter.
 * @property {string} [description] - The description of the parameter.
 * @property {string} [value] - The value of the parameter.
 * @property {boolean} show - Indicates if the parameter should be shown in product specifications.
 * @property {boolean} showFilter - Indicates if the parameter should be shown within filter options.
 * @property {string} [identifier] - The internal identifier of the parameter.
 * @property {string} [facetId] - The ID of the associated facet.
 */
export type ParameterType = {
  parameterId?: number;
  parameterGroupId?: number;
  type?: string;
  name?: string;
  label?: string;
  description?: string;
  value?: string;
  show?: boolean;
  showFilter?: boolean;
  identifier?: string;
  facetId?: string;
};

/**
 * @typedef {Object} ShippingDetailType
 * @property {number} id - The unique identifier of the shipping detail.
 * @property {string} name - The name of the shipping detail.
 * @property {string} [parcelNumber] - The parcel number for the shipment.
 * @property {string} [shippingDate] - The shipping date.
 * @property {number} shippingId - The ID of the shipping method used.
 * @property {string} [trackingLink] - The tracking link for the shipment.
 */
export type ShippingDetailType = {
  id?: number;
  name?: string;
  parcelNumber?: string;
  shippingDate?: string;
  shippingId?: number;
  trackingLink?: string;
};

/**
 * @typedef {Object} RefundType
 * @property {number} id - The unique identifier for the refund.
 * @property {number} itemId - The ID of the item being refunded.
 * @property {string} [articleNumber] - The article number of the refunded item.
 * @property {string} createdAt - The date and time the refund was created.
 * @property {string} [reason] - The reason for the refund.
 * @property {number} [reasonCode] - The reason code for the refund.
 * @property {string} [refundType] - The type of refund (e.g., partial, full).
 * @property {boolean} toBalance - Indicates if the refund is being credited to the account balance.
 * @property {number} total - The total amount refunded.
 * @property {number} vat - The VAT amount refunded.
 */
export type RefundType = {
  id?: number;
  itemId?: number;
  articleNumber?: string;
  createdAt?: string;
  reason?: string;
  reasonCode?: number;
  refundType?: string;
  toBalance?: boolean;
  total?: number;
  vat?: number;
};

/**
 * @typedef {Object} OptionType
 * @property {number} [optionId] - The unique identifier of the option.
 * @property {number} [quantity] - The quantity of items selected for this option.
 * @property {boolean} [isSelected] - Indicates whether this option is selected by default.
 * @property {number} [sortOrder] - The sort order of this option relative to other options.
 * @property {ProductType} [product] - The product associated with this option.
 */
export type OptionType = {
  optionId?: number;
  quantity?: number;
  isSelected?: boolean;
  sortOrder?: number;
  product?: ProductType;
};
