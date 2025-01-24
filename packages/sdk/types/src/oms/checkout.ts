import { CustomerType, GeinsSettings } from '../common';
import { GeinsUserType } from '../generated';
import type { AddressType, ShippingOptionType, PaymentOptionType } from '../shared';
import type { CartType } from '../oms/cart';

enum CheckoutStatus {
  OK = 'OK',
  CUSTOMER_BLACKLISTED = 'CUSTOMER_BLACKLISTED',
}

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

export type CheckoutRedirectsType = {
  success?: string;
  continue?: string;
  cancel?: string;
  error?: string;
};

export type CheckoutSettings = {
  paymentId?: number;
  shippingId?: number;
  customerType?: CustomerType;
  billingAddress?: AddressInputType;
  shippingAddress?: AddressInputType;
  redirectUrls?: CheckoutRedirectsType;
};

export type CheckoutTokenPayload = {
  cartId: string;
  user?: GeinsUserType;
  checkoutSettings: CheckoutSettings;
  geinsSettings: GeinsSettings;
};
