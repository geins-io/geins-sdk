import { OrderType } from '@geins/types';
//import { parseAddress } from './shared';
import { logWrite } from '@geins/core';

function cleanObject<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v != null),
  ) as Partial<T>;
}

export function parseOrder(data: any): OrderType {
  if (!data || !data.data || !data.data.getOrder) {
    return {};
  }
  const order = data.data.getOrder;
  logWrite('parseOrder', order);

  // go over all the properties of type OrderType and map them to the order object
  const orderType: OrderType = {
    id: order.id,
    publicId: order.publicId,
    status: order.status,
    createdAt: order.createdAt,
    ...(order.updatedAt && { updatedAt: order.updatedAt }),
    ...(order.desiredDeliveryDate && {
      desiredDeliveryDate: order.desiredDeliveryDate,
    }),
    ...(order.message && { message: order.message }),
    ...(order.billingAddress && { billingAddress: order.billingAddress }),
    ...(order.shippingAddress && { shippingAddress: order.shippingAddress }),
    ...(order.shippingDetails && { shippingDetails: order.shippingDetails }),
    ...(order.paymentDetails && { paymentDetails: order.paymentDetails }),
    orderTotal: order.orderTotal,
    refunds: order.refunds,
  };
  return {
    id: order.id,
    status: order.status,
    ...(order.customerId && { customerId: order.customerId }),
  };
}
