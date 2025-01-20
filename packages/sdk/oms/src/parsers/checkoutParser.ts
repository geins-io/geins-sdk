import { findObjectWithProperty } from '@geins/core';
import { parseCart } from './cartParser';

export function parseCheckout(data: any, locale: string): any | undefined {
  const checkout = findObjectWithProperty(data, '__typename', 'CheckoutType');
  if (!checkout) {
    return undefined;
  }

  // todo fix parser to return correct data
  return {
    cart: parseCart(checkout.cart, locale),
    paymentOptions: checkout.paymentOptions,
    shippingOptions: checkout.shippingOptions,
  };
}
