/* import { UserAddressType } from './user';

export type UserOrdersOrderType = {
  id: number;
  publicId: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  desiredDeliveryDate?: string;
  message?: string;

  billingAddress?: UserAddressType;
  shippingAddress?: UserAddressType;

  shippingDetails?: UserOrdersShippingDetailType[];
  paymentDetails?: UserOrdersPaymentDetailsType[];

  orderTotal: UserOrdersPriceType;

  refunds: UserOrdersRefundType[];
};

export type UserOrdersShippingDetailType = {
  name: string;
  trackingLink?: string;
};

export type UserOrdersPaymentDetailsType = {
  displayName: string;
};

export type UserOrdersPriceType = {
  isDiscounted: boolean;
  sellingPriceIncVat: number;
  sellingPriceExVat: number;
  regularPriceIncVat: number;
  regularPriceExVat: number;
  vat: number;
  discountPercentage: number;
  regularPriceIncVatFormatted?: string;
  sellingPriceIncVatFormatted?: string;
  regularPriceExVatFormatted?: string;
  sellingPriceExVatFormatted?: string;
};

export type UserOrdersRefundType = {
  id: number;
  itemId: number;
  articleNumber?: string;
  createdAt: string;
  reason?: string;
  total: number;
  vat: number;
};
 */
