import { CustomerType, GeinsSettings } from '../common';
import { GeinsUserType } from '../generated';
import type { AddressType, ShippingOptionType, PaymentOptionType, CheckoutRedirectsType } from '../shared';
import type { CartType } from '../oms/cart';

enum CheckoutStatus {
  OK = 'OK',
  CUSTOMER_BLACKLISTED = 'CUSTOMER_BLACKLISTED',
}

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
  skipShippingValidation: boolean;
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
  checkoutUrls: CheckoutUrlsInputType;
};

export type ConsentType = {
  type?: string;
  name?: string;
  description?: string;
  checked?: boolean;
  autoAccept?: boolean;
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
  shippingData?: string;
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
  logoUrl?: string;
  backgroundColor?: string;
  text?: {
    backgroundColor?: string;
    textColor?: string;
  };
  buttons?: {
    backgroundColor?: string;
    textColor?: string;
  };
  validation?: {
    backgroundColor?: string;
    textColor?: string;
  };
};

export type CheckoutSettings = {
  isCartEditable?: boolean;
  selectedPaymentMethodId?: number;
  selectedShippingMethodId?: number;
  availablePaymentMethodIds?: number[];
  availableShippingMethodIds?: number[];
  customerType?: CustomerType;
  billingAddress?: AddressInputType;
  shippingAddress?: AddressInputType;
  redirectUrls?: CheckoutRedirectsType;
  style?: CheckoutStyleType;
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
  cloneCart?: boolean;
  selectedPaymentMethodId?: number;
  selectedShippingMethodId?: number;
  availablePaymentMethodIds?: number[];
  availableShippingMethodIds?: number[];
  redirectUrls?: CheckoutRedirectsType;
  checkoutStyle?: CheckoutStyleType;
  geinsSettings?: GeinsSettings;
};
