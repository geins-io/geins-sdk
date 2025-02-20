import type {
  CreateOrderResponseType,
  OrderSummaryType,
  PaymentDetailsType,
  RefundType,
  ShippingDetailType,
} from '@geins/core';
import { findObjectWithProperty } from '@geins/core';
import { parseCart } from './cartParser';
import { parseAddress, parsePrice } from './sharedParsers';

export function parseOrder(data: any, locale: string): CreateOrderResponseType | undefined {
  const order = findObjectWithProperty(data, '__typename', 'PlaceOrderResponseType');
  if (!order) {
    return undefined;
  }

  return {
    created: true,
    orderId: order.orderId,
    publicId: order.publicId,
  };
}

export function parseCheckoutOrderSummary(data: any, locale: string): OrderSummaryType | undefined {
  const orderSummary = findObjectWithProperty(data, '__typename', 'CheckoutDataType');
  if (!orderSummary) {
    return undefined;
  }

  return {
    id: orderSummary.id,
    customerId: orderSummary.customerId,
    createdAt: orderSummary.createdAt,
    completedAt: orderSummary.completedAt,
    currency: orderSummary.currency,
    desiredDeliveryDate: orderSummary.desiredDeliveryDate,
    message: orderSummary.message,
    status: orderSummary.status,
    updatedAt: orderSummary.updatedAt,
    publicId: orderSummary.publicId,
    billingAddress: parseAddress(orderSummary.billingAddress),
    shippingAddress: parseAddress(orderSummary.shippingAddress),
    cart: parseCart(orderSummary.cart, locale),
    paymentDetails: parsePaymentDetails(orderSummary.paymentDetails),
    discount: parsePrice(orderSummary.discount, locale),
    orderTotal: parsePrice(orderSummary.orderTotal, locale),
    paymentFee: parsePrice(orderSummary.paymentFee, locale),
    shippingFee: parsePrice(orderSummary.shippingFee, locale),
    vat: parsePrice(orderSummary.vat, locale),
    fromBalance: orderSummary.fromBalance,
    fromBalanceFormatted: orderSummary.fromBalanceFormatted,
    refunds: parseRefunds(orderSummary.refunds),
    shippingDetails: parseShippingDetails(orderSummary.shippingDetails),
  };
}

export function parseOrderSummary(data: any, locale: string): OrderSummaryType | undefined {
  const orderSummary = findObjectWithProperty(data, '__typename', 'OrderType');
  if (!orderSummary) {
    return undefined;
  }

  return {
    id: orderSummary.id,
    customerId: orderSummary.customerId,
    createdAt: orderSummary.createdAt,
    completedAt: orderSummary.completedAt,
    currency: orderSummary.currency,
    desiredDeliveryDate: orderSummary.desiredDeliveryDate,
    message: orderSummary.message,
    status: orderSummary.status,
    updatedAt: orderSummary.updatedAt,
    publicId: orderSummary.publicId,
    billingAddress: parseAddress(orderSummary.billingAddress),
    shippingAddress: parseAddress(orderSummary.shippingAddress),
    cart: parseCart(orderSummary.cart, locale),
    paymentDetails: parsePaymentDetails(orderSummary.paymentDetails),
    discount: parsePrice(orderSummary.discount, locale),
    orderTotal: parsePrice(orderSummary.orderTotal, locale),
    paymentFee: parsePrice(orderSummary.paymentFee, locale),
    shippingFee: parsePrice(orderSummary.shippingFee, locale),
    vat: parsePrice(orderSummary.vat, locale),
    fromBalance: orderSummary.fromBalance,
    fromBalanceFormatted: orderSummary.fromBalanceFormatted,
    refunds: parseRefunds(orderSummary.refunds),
    shippingDetails: parseShippingDetails(orderSummary.shippingDetails),
  };
}

export function parseRefunds(data: any): RefundType[] | undefined {
  if (!Array.isArray(data)) {
    return undefined;
  }
  return data.map((item) => parseRefund(item)).filter((item): item is RefundType => item !== undefined);
}

export function parseRefund(data: any): RefundType | undefined {
  const refund = findObjectWithProperty(data, '__typename', 'RefundType');

  if (!refund) {
    return undefined;
  }

  return {
    id: refund.id,
    itemId: refund.itemId,
    articleNumber: refund.articleNumber,
    createdAt: refund.createdAt,
    reason: refund.reason,
    reasonCode: refund.reasonCode,
    refundType: refund.refundType,
    toBalance: refund.toBalance,
    total: refund.total,
    vat: refund.vat,
  };
}

export function parseShippingDetails(data: any): ShippingDetailType[] | undefined {
  if (!Array.isArray(data)) {
    return undefined;
  }
  return data
    .map((item) => parseShippingDetail(item))
    .filter((item): item is ShippingDetailType => item !== undefined);
}

export function parseShippingDetail(data: any): ShippingDetailType | undefined {
  const shippingDetail = findObjectWithProperty(data, '__typename', 'ShippingDetailType');

  if (!shippingDetail) {
    return undefined;
  }

  return {
    id: shippingDetail.id,
    name: shippingDetail.name,
    parcelNumber: shippingDetail.parcelNumber,
    shippingDate: shippingDetail.shippingDate,
    shippingId: shippingDetail.shippingId,
    trackingLink: shippingDetail.trackingLink,
  };
}

export function parsePaymentDetails(data: any): PaymentDetailsType[] | undefined {
  if (!Array.isArray(data)) {
    return undefined;
  }
  return data
    .map((item) => parsePaymentDetail(item))
    .filter((item): item is PaymentDetailsType => item !== undefined);
}

export function parsePaymentDetail(data: any): PaymentDetailsType | undefined {
  const paymentDetail = findObjectWithProperty(data, '__typename', 'PaymentDetailsType');

  if (!paymentDetail) {
    return undefined;
  }
  return {
    id: paymentDetail.id,
    paymentId: paymentDetail.paymentId,
    transactionId: paymentDetail.transactionId,
    displayName: paymentDetail.displayName,
    name: paymentDetail.name,
    isPaid: paymentDetail.isPaid,
    paymentDate: paymentDetail.paymentDate,
    paymentFee: paymentDetail.paymentFee,
    paymentOption: paymentDetail.paymentOption,
    reservationDate: paymentDetail.reservationDate,
    reservationNumber: paymentDetail.reservationNumber,
    shippingFee: paymentDetail.shippingFee,
    total: paymentDetail.total,
  };
}
