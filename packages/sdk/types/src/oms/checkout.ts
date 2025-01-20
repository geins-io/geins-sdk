import { CustomerType, GeinsSettings } from '../common';
import { GeinsUserType } from '../generated';

export type CheckoutInputType = {
  paymentId: number;
  shippingId: number;
  skipShippingValidation: boolean;
  externalShippingId?: string;
  pickupPoint?: string;
  desiredDeliveryDate?: Date;
  message?: string;
  acceptedConsents?: string[];
  shippingAddress: AddressInputType;
  billingAddress: AddressInputType;
  identityNumber?: string;
  email: string;
  customerType: CustomerType;
  externalShippingFee?: number;
  merchantData?: string;
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

export type CheckoutSettings = {
  paymentId?: number;
  shippingId?: number;
  customerType?: CustomerType;
  billingAddress?: AddressInputType;
  shippingAddress?: AddressInputType;
  redirectUrls?: {
    success?: string;
    cancel?: string;
    error?: string;
    change?: string;
  };
};

export type CheckoutTokenPayload = {
  cartId: string;
  user?: GeinsUserType;
  checkoutSettings: CheckoutSettings;
  geinsSettings: GeinsSettings;
};
