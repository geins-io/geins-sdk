import type {
  CreateOrderResponseType,
  OrderSummaryType,
  PaymentDetailsType,
  RefundType,
  ShippingDetailType,
} from '@geins/core';
import { findObjectWithProperty } from '@geins/core';
import type {
  GeinsPlaceOrderResponseTypeType,
  GeinsCheckoutDataTypeType,
  GeinsOrderTypeType,
  GeinsRefundTypeType,
  GeinsShippingDetailTypeType,
  GeinsPaymentDetailsTypeType,
} from '@geins/types';
import { parseCart } from './cartParser';
import { parseAddress, parsePrice } from './sharedParsers';

/**
 * Parses a place-order GraphQL response into a CreateOrderResponseType.
 * @param data - Raw data potentially containing a PlaceOrderResponseType.
 * @param locale - Locale string (reserved for future formatting).
 * @returns Parsed order response with orderId and publicId, or undefined if not found.
 */
export function parseOrder(data: unknown, locale: string): CreateOrderResponseType | undefined {
  const order = findObjectWithProperty<GeinsPlaceOrderResponseTypeType>(data, '__typename', 'PlaceOrderResponseType');
  if (!order) {
    return undefined;
  }

  return {
    created: true,
    orderId: order.orderId ?? undefined,
    publicId: order.publicId ?? undefined,
  };
}

/**
 * Parses a checkout data response into a partial OrderSummaryType (limited fields from checkout context).
 * @param data - Raw data potentially containing a CheckoutDataType.
 * @param locale - Locale string used for currency formatting.
 * @returns Partial order summary from checkout data, or undefined if not found.
 */
export function parseCheckoutOrderSummary(data: unknown, locale: string): OrderSummaryType | undefined {
  const checkoutData = findObjectWithProperty<GeinsCheckoutDataTypeType>(data, '__typename', 'CheckoutDataType');
  if (!checkoutData) {
    return undefined;
  }

  const order = checkoutData.order;

  return {
    id: order?.orderId ?? undefined,
    customerId: order ? String(order.customerId) : undefined,
    createdAt: undefined,
    completedAt: undefined,
    currency: order?.currency ?? undefined,
    desiredDeliveryDate: order?.desiredDeliveryDate ?? undefined,
    message: order?.message ?? undefined,
    status: order?.status ?? undefined,
    updatedAt: undefined,
    publicId: undefined,
    billingAddress: parseAddress(order?.billingAddress ?? undefined),
    shippingAddress: parseAddress(order?.shippingAddress ?? undefined),
    cart: parseCart(checkoutData.cart, locale),
    paymentDetails: undefined,
    discount: undefined,
    orderTotal: undefined,
    paymentFee: undefined,
    shippingFee: undefined,
    vat: undefined,
    fromBalance: order?.balance ?? undefined,
    fromBalanceFormatted: undefined,
    refunds: undefined,
    shippingDetails: undefined,
  };
}

/**
 * Parses a full OrderType GraphQL response into a normalized OrderSummaryType.
 * @param data - Raw data potentially containing an OrderType.
 * @param locale - Locale string used for currency formatting.
 * @returns Complete order summary with cart, prices, refunds, and shipping, or undefined if not found.
 */
export function parseOrderSummary(data: unknown, locale: string): OrderSummaryType | undefined {
  const orderSummary = findObjectWithProperty<GeinsOrderTypeType>(data, '__typename', 'OrderType');
  if (!orderSummary) {
    return undefined;
  }

  return {
    id: orderSummary.id != null ? String(orderSummary.id) : undefined,
    customerId: orderSummary.customerId != null ? String(orderSummary.customerId) : undefined,
    createdAt: orderSummary.createdAt ?? undefined,
    completedAt: orderSummary.completedAt ?? undefined,
    currency: orderSummary.currency ?? undefined,
    desiredDeliveryDate: orderSummary.desiredDeliveryDate ?? undefined,
    message: orderSummary.message ?? undefined,
    status: orderSummary.status,
    updatedAt: orderSummary.updatedAt ?? undefined,
    publicId: String(orderSummary.publicId),
    billingAddress: parseAddress(orderSummary.billingAddress ?? undefined),
    shippingAddress: parseAddress(orderSummary.shippingAddress ?? undefined),
    cart: parseCart(orderSummary.cart, locale),
    paymentDetails: parsePaymentDetails(orderSummary.paymentDetails ?? undefined),
    discount: parsePrice(orderSummary.discount ?? undefined, locale),
    orderTotal: parsePrice(orderSummary.orderTotal ?? undefined, locale),
    paymentFee: parsePrice(orderSummary.paymentFee ?? undefined, locale),
    shippingFee: parsePrice(orderSummary.shippingFee ?? undefined, locale),
    vat: parsePrice(orderSummary.vat ?? undefined, locale),
    fromBalance: orderSummary.fromBalance,
    fromBalanceFormatted: orderSummary.fromBalanceFormatted ?? undefined,
    refunds: parseRefunds(orderSummary.refunds ?? undefined),
    shippingDetails: parseShippingDetails(orderSummary.shippingDetails ?? undefined),
  };
}

/**
 * Parses an array of refund objects, filtering out invalid entries.
 * @param data - Raw array of refund data.
 * @returns Parsed refunds, or undefined if data is not an array.
 */
export function parseRefunds(
  data: Array<GeinsRefundTypeType | null> | null | undefined,
): RefundType[] | undefined {
  if (!Array.isArray(data)) {
    return undefined;
  }
  return data.map((item) => parseRefund(item)).filter((item): item is RefundType => item !== undefined);
}

/**
 * Parses a single refund object by locating a RefundType.
 * @param data - Raw refund data.
 * @returns Parsed refund, or undefined if not found.
 */
export function parseRefund(data: GeinsRefundTypeType | null | undefined): RefundType | undefined {
  const refund = findObjectWithProperty<GeinsRefundTypeType>(data, '__typename', 'RefundType');

  if (!refund) {
    return undefined;
  }

  return {
    id: refund.id,
    itemId: refund.itemId,
    articleNumber: refund.articleNumber ?? undefined,
    createdAt: refund.createdAt,
    reason: refund.reason ?? undefined,
    reasonCode: refund.reasonCode ?? undefined,
    refundType: refund.refundType ?? undefined,
    toBalance: refund.toBalance,
    total: refund.total,
    vat: refund.vat,
  };
}

/**
 * Parses an array of shipping detail objects, filtering out invalid entries.
 * @param data - Raw array of shipping detail data.
 * @returns Parsed shipping details, or undefined if data is not an array.
 */
export function parseShippingDetails(
  data: Array<GeinsShippingDetailTypeType | null> | null | undefined,
): ShippingDetailType[] | undefined {
  if (!Array.isArray(data)) {
    return undefined;
  }
  return data
    .map((item) => parseShippingDetail(item))
    .filter((item): item is ShippingDetailType => item !== undefined);
}

/**
 * Parses a single shipping detail object by locating a ShippingDetailType.
 * @param data - Raw shipping detail data.
 * @returns Parsed shipping detail, or undefined if not found.
 */
export function parseShippingDetail(
  data: GeinsShippingDetailTypeType | null | undefined,
): ShippingDetailType | undefined {
  const shippingDetail = findObjectWithProperty<GeinsShippingDetailTypeType>(data, '__typename', 'ShippingDetailType');

  if (!shippingDetail) {
    return undefined;
  }

  return {
    id: String(shippingDetail.id),
    name: shippingDetail.name,
    parcelNumber: shippingDetail.parcelNumber ?? undefined,
    shippingDate: shippingDetail.shippingDate ?? undefined,
    shippingId: String(shippingDetail.shippingId),
    trackingLink: shippingDetail.trackingLink ?? undefined,
  };
}

/**
 * Parses an array of payment detail objects, filtering out invalid entries.
 * @param data - Raw array of payment detail data.
 * @returns Parsed payment details, or undefined if data is not an array.
 */
export function parsePaymentDetails(
  data: Array<GeinsPaymentDetailsTypeType | null> | null | undefined,
): PaymentDetailsType[] | undefined {
  if (!Array.isArray(data)) {
    return undefined;
  }
  return data
    .map((item) => parsePaymentDetail(item))
    .filter((item): item is PaymentDetailsType => item !== undefined);
}

/**
 * Parses a single payment detail object by locating a PaymentDetailsType.
 * @param data - Raw payment detail data.
 * @returns Parsed payment detail, or undefined if not found.
 */
export function parsePaymentDetail(
  data: GeinsPaymentDetailsTypeType | null | undefined,
): PaymentDetailsType | undefined {
  const paymentDetail = findObjectWithProperty<GeinsPaymentDetailsTypeType>(data, '__typename', 'PaymentDetailsType');

  if (!paymentDetail) {
    return undefined;
  }
  return {
    id: String(paymentDetail.id),
    paymentId: String(paymentDetail.paymentId),
    transactionId: paymentDetail.transactionId ?? undefined,
    displayName: paymentDetail.displayName,
    name: paymentDetail.name,
    isPaid: String(paymentDetail.isPaid),
    paymentDate: paymentDetail.paymentDate ?? undefined,
    paymentFee: String(paymentDetail.paymentFee),
    paymentOption: paymentDetail.paymentOption ?? undefined,
    reservationDate: paymentDetail.reservationDate ?? undefined,
    reservationNumber: paymentDetail.reservationNumber ?? undefined,
    shippingFee: String(paymentDetail.shippingFee),
    total: String(paymentDetail.total),
  };
}
