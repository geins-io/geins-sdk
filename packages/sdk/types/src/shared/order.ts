declare enum PaymentOptionCheckoutType {
  STANDARD = 'STANDARD',
  EXTERNAL = 'EXTERNAL',
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
  paymentType?: string;
  paymentData?: string;
};

export type CheckoutRedirectsType = {
  terms?: string;
  success?: string;
  change?: string;
  cancel?: string;
  error?: string;
};
