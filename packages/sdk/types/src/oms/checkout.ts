import { CustomerType, GeinsSettings } from '../common';
import type { GeinsUserType } from '../generated';
import type { CartType } from '../oms/cart';
import type { AddressType, CheckoutRedirectsType, PaymentOptionType, ShippingOptionType } from '../shared';

enum CheckoutStatus {
  OK = 'OK',
  CUSTOMER_BLACKLISTED = 'CUSTOMER_BLACKLISTED',
}

export type CreateOrderResponseType = {
  created?: boolean;
  orderId?: string;
  publicId?: string;
  message?: string;
};

export type ConsentType = {
  type?: string;
  name?: string;
  description?: string;
  checked?: boolean;
  autoAccept?: boolean;
};

export type CheckoutQueryParameters = {
  'geins-cart'?: string;
  'geins-pm'?: string;
  'geins-pt'?: string;
  'geins-uid'?: string;
};

export type CheckoutUrlsInputType = {
  termsPageUrl?: string;
  redirectUrl?: string;
  checkoutPageUrl?: string;
};

export type CheckoutInputType = {
  paymentId?: number;
  shippingId?: number;
  skipShippingValidation?: boolean;
  externalShippingId?: string;
  pickupPoint?: string;
  desiredDeliveryDate?: Date;
  message?: string;
  acceptedConsents?: string[];
  shippingAddress?: AddressInputType;
  billingAddress?: AddressInputType;
  identityNumber?: string;
  email?: string;
  customerType?: CustomerType;
  externalShippingFee?: number;
  merchantData?: string;
  checkoutUrls?: CheckoutUrlsInputType;
};

export type GetCheckoutOptions = {
  cartId?: string;
  paymentMethodId?: number;
  shippingMethodId?: number;
  checkoutOptions?: CheckoutInputType;
  checkoutMarketId?: number;
};

export type ValidateOrderConditionsArgs = {
  cartId: string;
  email?: string;
};

export type CreateOrderOptions = {
  cartId?: string;
  checkoutOptions: CheckoutInputType;
  checkoutMarketId?: string;
};

export type CheckoutType = {
  email?: string;
  identityNumber?: string;
  cart?: CartType;
  billingAddress?: AddressType;
  shippingAddress?: AddressType;
  consents?: ConsentType[];
  paymentOptions?: PaymentOptionType[];
  shippingOptions?: ShippingOptionType[];
  checkoutStatus?: CheckoutStatus;
};

export type AddressInputType = {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  entryCode?: string;
  careOf?: string;
  city: string;
  state?: string;
  country: string;
  zip: string;
  company?: string;
  mobile?: string;
  phone?: string;
};

export type CheckoutStyleType = {
  logoSize?: string;
  radius?: string;
  background?: string;
  foreground?: string;
  card?: string;
  cardForeground?: string;
  accent?: string;
  accentForeground?: string;
  border?: string;
  sale?: string;
  error?: string;
};

export type CheckoutBrandingType = {
  title?: string;
  icon?: string;
  logo?: string;
  styles?: CheckoutStyleType;
};

export type CheckoutSettings = {
  isCartEditable?: boolean;
  copyCart?: boolean;
  selectedPaymentMethodId?: number;
  selectedShippingMethodId?: number;
  availablePaymentMethodIds?: number[];
  availableShippingMethodIds?: number[];
  customerType?: CustomerType;
  billingAddress?: AddressInputType;
  shippingAddress?: AddressInputType;
  redirectUrls?: CheckoutRedirectsType;
  branding?: CheckoutBrandingType;
};

export type CheckoutTokenPayload = {
  cartId: string;
  user?: GeinsUserType;
  checkoutSettings: CheckoutSettings;
  geinsSettings: GeinsSettings;
};

export type GenerateCheckoutTokenOptions = {
  cartId?: string;
  customerType?: CustomerType;
  user?: GeinsUserType;
  isCartEditable?: boolean;
  copyCart?: boolean;
  selectedPaymentMethodId?: number;
  selectedShippingMethodId?: number;
  availablePaymentMethodIds?: number[];
  availableShippingMethodIds?: number[];
  redirectUrls?: CheckoutRedirectsType;
  branding?: CheckoutBrandingType;
  geinsSettings?: GeinsSettings;
};

export type CheckoutSummaryType = {
  htmlSnippet?: string;
  order?: CheckoutSummaryOrderType;
  nthPurchase?: number;
};

export type CheckoutSummaryOrderType = {
  status?: string;
  orderId?: string;
  transactionId?: string;
  marketId?: string;
  languageId?: string;
  message?: string;
  merchantData?: string;
  customerId?: number;
  customerTypeId?: number;
  customerGroupId?: number;
  organizationNumber?: string;
  ipAddress?: string;
  paymentId?: number;
  shippingId?: number;
  pickupPoint?: string;
  desiredDeliveryDate?: string;
  promoCode?: string;
  appliedCampaignIds?: string[];
  appliedCampaigns?: string[];
  total?: CheckoutSummaryOrderTotalType;
  billingAddress?: AddressType;
  shippingAddress?: AddressType;
  rows?: CheckoutSummaryOrderRowType[];
};

export type CheckoutSummaryOrderTotalType = {
  itemValueExVat?: number;
  itemValueExVatFormatted?: string;
  itemValueIncVat?: number;
  itemValueIncVatFormatted?: string;
  orderValueExVat?: number;
  orderValueExVatFormatted?: string;
  orderValueIncVat?: number;
  orderValueIncVatFormatted?: string;
  paymentFeeExVat?: number;
  paymentFeeExVatFormatted?: string;
  paymentFeeIncVat?: number;
  paymentFeeIncVatFormatted?: string;
  shippingFeeExVat?: number;
  shippingFeeExVatFormatted?: string;
  shippingFeeIncVat?: number;
  shippingFeeIncVatFormatted?: string;
  discountExVat?: number;
  discountExVatFormatted?: string;
  discountIncVat?: number;
  discountIncVatFormatted?: string;
  sum?: number;
  sumFormatted?: string;
  currency?: string;
};

export type CheckoutSummaryOrderRowType = {
  quantity?: number;
  skuId?: string;
  articleNumber?: string;
  gtin?: string;
  name?: string;
  weight?: number;
  height?: number;
  length?: number;
  width?: number;
  message?: string;
  product?: CheckoutSummaryProductType;
  price?: CheckoutSummaryPriceType;
};

export type CheckoutSummaryProductType = {
  name?: string;
  brand?: string;
  imageUrl?: string;
  categories?: string[];
  productId?: number;
  productUrl?: string;
};

export type CheckoutSummaryPriceType = {
  campaignIds?: string[];
  campaignNames?: string[];
  productPriceCampaignId?: string | null;
  productPriceListId?: string | null;
  discountRate?: number;
  discountExVat?: number;
  discountExVatFormatted?: string;
  discountIncVat?: number;
  discountIncVatFormatted?: string;
  priceExVat?: number;
  priceExVatFormatted?: string;
  priceIncVat?: number;
  priceIncVatFormatted?: string;
  currency?: string;
};
