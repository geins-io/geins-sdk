import {
  UserOrdersOrderType,
  UserOrdersShippingDetailType,
  UserOrdersPaymentDetailsType,
  UserOrdersPriceType,
  UserOrdersRefundType,
} from '@geins/types';

import { parseAddress } from './shared';
import { logWrite } from '@geins/core';

export function parseUserOrders(data: any): UserOrdersOrderType[] {
  logWrite('parseUserOrders', data.data);
  if (!data || !data.data || !data.data.getOrders) {
    return [];
  }

  const orders = data.data.getOrders;
  return orders.map((order: any) => {
    return parseUserOrder(order);
  });
}

export function parseUserOrder(data: any): UserOrdersOrderType {
  return {
    id: data.id,
    publicId: data.publicId,
    status: data.status,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    desiredDeliveryDate: data.desiredDeliveryDate,
    message: data.message,

    billingAddress: parseAddress(data.billingAddress),
    shippingAddress: parseAddress(data.shippingAddress),

    shippingDetails: parseShippingDetails(data.shippingDetails),
    paymentDetails: parseUserOrderPaymentDetails(data.paymentDetails),

    orderTotal: parseUserOrderTotal(data.orderTotal),

    refunds: parseUserOrderRefund(data.refunds),
  };
}

export function parseUserOrderTotal(data: any): UserOrdersPriceType {
  if (!data) {
    throw new Error('Invalid total data');
  }

  return {
    isDiscounted: data.isDiscounted,
    regularPriceIncVat: data.regularPriceIncVat,
    regularPriceExVat: data.regularPriceExVat,
    sellingPriceIncVat: data.sellingPriceIncVat,
    sellingPriceExVat: data.sellingPriceExVat,
    vat: data.vat,
    discountPercentage: data.discountPercentage,
    regularPriceIncVatFormatted: data.regularPriceIncVatFormatted,
    sellingPriceIncVatFormatted: data.sellingPriceIncVatFormatted,
    regularPriceExVatFormatted: data.regularPriceExVatFormatted,
    sellingPriceExVatFormatted: data.sellingPriceExVatFormatted,
  };
}

export function parseShippingDetails(
  data: any,
): UserOrdersShippingDetailType[] {
  if (!data || !Array.isArray(data)) {
    throw new Error('Invalid shipping data');
  }
  return data.map((item: any): UserOrdersShippingDetailType => {
    return {
      name: item.name,
      trackingLink: item.trackingLink,
    };
  });
}

export function parseUserOrderPaymentDetails(
  data: any,
): UserOrdersPaymentDetailsType[] {
  if (!data || !Array.isArray(data)) {
    throw new Error('Invalid payment data');
  }
  return data.map((item: any): UserOrdersPaymentDetailsType => {
    return {
      displayName: item.displayName,
    };
  });
}

export function parseUserOrderRefund(data: any): UserOrdersRefundType[] {
  if (!data || !Array.isArray(data)) {
    return [];
  }
  return data.map((item: any): UserOrdersRefundType => {
    return {
      id: item.id,
      itemId: item.itemId,
      articleNumber: item.articleNumber,
      createdAt: item.createdAt,
      reason: item.reason,
      total: item.total,
      vat: item.vat,
    };
  });
}
