import { GeinsPaymentType } from '../generated';

export enum PaymentOptionCheckoutType {
  STANDARD = 'STANDARD',
  EXTERNAL = 'EXTERNAL',
  GEINS_PAY = 'GEINS_PAY',
}

export type ShippingOptionType = {
  id: number;
  name?: string;
  displayName?: string;
  feeIncVat: number;
  feeExVat: number;
  isDefault: boolean;
  isSelected: boolean;
  externalId?: string;
  shippingData?: string;
  amountLeftToFreeShipping: number;
  logo?: string;
  subOptions?: ShippingOptionType[];
  amountLeftToFreeShippingFormatted?: string;
  feeIncVatFormatted?: string;
  feeExVatFormatted?: string;
};

export type PaymentOptionType = {
  id: number;
  name?: string;
  displayName?: string;
  logo?: string;
  feeIncVat: number;
  feeExVat: number;
  isDefault: boolean;
  isSelected: boolean;
  checkoutType?: PaymentOptionCheckoutType;
  paymentType?: GeinsPaymentType;
  paymentData?: string;
};

export type CheckoutRedirectsType = {
  terms?: string;
  privacy?: string;
  success?: string;
  cancel?: string;
  continue?: string;
};
