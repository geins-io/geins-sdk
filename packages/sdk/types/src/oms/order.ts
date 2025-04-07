import type { CartType } from '../oms/cart';
import type { AddressType, PriceType } from '../shared';

export type ShippingDetailType = {
  id?: string;
  name?: string;
  parcelNumber?: string;
  shippingDate?: string;
  shippingId?: string;
  trackingLink?: string;
};

export type PaymentDetailsType = {
  id?: string;
  paymentId?: string;
  transactionId?: string;
  displayName?: string;
  name?: string;
  isPaid?: string;
  paymentDate?: string;
  paymentFee?: string;
  paymentOption?: string;
  reservationDate?: string;
  reservationNumber?: string;
  shippingFee?: string;
  total?: string;
};

export type RefundType = {
  id: number;
  itemId: number;
  articleNumber?: string;
  createdAt: string;
  reason?: string;
  reasonCode?: number;
  refundType?: string;
  toBalance: boolean;
  total: number;
  vat: number;
};

export type OrderSummaryType = {
  id?: string;
  customerId?: string;
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

export type ValidateOrderConditionsResponseType = {
  isValid: boolean;
  message: string;
};

export type ValidateOrderCreationResponseType = {
  isValid?: boolean;
  message?: string;
  customerGroup?: string;
};
