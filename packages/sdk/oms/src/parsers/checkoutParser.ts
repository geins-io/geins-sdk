import { findObjectWithProperty, CheckoutType, ValidateOrderCreationResponseType } from '@geins/core';
import { parseCart } from './cartParser';
import { parseAddress } from './sharedParsers';

export function parseCheckoutSummary(data: any, locale: string): any | undefined {
  const checkoutSummary = findObjectWithProperty(data, '__typename', 'CheckoutDataType');
  if (!checkoutSummary) {
    return undefined;
  }
  return {};
}

export function parseCheckout(data: any, locale: string): CheckoutType | undefined {
  const checkout = findObjectWithProperty(data, '__typename', 'CheckoutType');
  if (!checkout) {
    return undefined;
  }

  return {
    identityNumber: checkout.identityNumber,
    cart: parseCart(checkout.cart, locale),
    paymentOptions: checkout.paymentOptions,
    shippingOptions: checkout.shippingOptions,
    consents: checkout.consents,
    email: checkout.email,
    billingAddress: parseAddress(checkout.billingAddress),
    shippingAddress: parseAddress(checkout.shippingAddress),
    shippingData: checkout.shippingData,
  };
}

export function parseValidateOrder(data: any): ValidateOrderCreationResponseType | undefined {
  const validateOrder = findObjectWithProperty(data, '__typename', 'ValidateOrderCreationResponseType');
  if (!validateOrder) {
    return undefined;
  }

  return {
    isValid: validateOrder.isValid,
    message: validateOrder.message,
  };
}
