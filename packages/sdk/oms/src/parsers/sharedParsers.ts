import type { AddressType, CurrencyType, PriceType } from '@geins/core';
import { findObjectWithProperty } from '@geins/core';

export function parseAddress(data: any): AddressType | undefined {
  const address = findObjectWithProperty(data, '__typename', 'AddressType');

  if (!address) {
    return undefined;
  }

  return {
    firstName: address.firstName,
    lastName: address.lastName,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2,
    addressLine3: address.addressLine3,
    entryCode: address.entryCode,
    careOf: address.careOf,
    city: address.city,
    state: address.state,
    country: address.country,
    zip: address.zip,
    company: address.company,
    mobile: address.mobile,
    phone: address.phone,
  };
}

export function parseCurrency(data: any): CurrencyType | undefined {
  if (!data) {
    return undefined;
  }

  return {
    name: data?.name || '',
    symbol: data?.symbol || '',
    code: data?.code || '',
    rate: data?.rate || 0,
  };
}

export function parsePrice(data: any, locale: string): PriceType {
  const price: PriceType = {
    sellingPriceIncVat: 0,
    sellingPriceExVat: 0,
    regularPriceIncVat: 0,
    regularPriceExVat: 0,
    discountIncVat: 0,
    discountExVat: 0,
    discountPercentage: 0,
    vat: 0,
    isDiscounted: false,
    sellingPriceIncVatFormatted: '',
    sellingPriceExVatFormatted: '',
    regularPriceIncVatFormatted: '',
    regularPriceExVatFormatted: '',
    discountIncVatFormatted: '',
    discountExVatFormatted: '',
    vatFormatted: '',
  };

  if (!data) {
    return price;
  }

  price.currency = parseCurrency(data.currency);
  price.sellingPriceIncVat = data.sellingPriceIncVat || 0;
  price.sellingPriceExVat = data.sellingPriceExVat || 0;
  price.regularPriceIncVat = data.regularPriceIncVat || 0;
  price.regularPriceExVat = data.regularPriceExVat || 0;
  price.discountIncVat = data.discountIncVat || 0;
  price.discountExVat = data.discountExVat || 0;
  price.discountPercentage = data.discountPercentage || 0;
  price.vat = data.vat || 0;
  price.isDiscounted = data.isDiscounted || false;

  if (price.currency?.code) {
    price.sellingPriceIncVatFormatted = parseMoneyCurrencyString(
      data.sellingPriceIncVat,
      locale,
      price.currency.code,
    );

    price.sellingPriceExVatFormatted = parseMoneyCurrencyString(
      data.sellingPriceExVat,
      locale,
      price.currency.code,
    );

    price.regularPriceIncVatFormatted = parseMoneyCurrencyString(
      data.regularPriceIncVat,
      locale,
      price.currency.code,
    );

    price.regularPriceExVatFormatted = parseMoneyCurrencyString(
      data.regularPriceExVat,
      locale,
      price.currency.code,
    );

    price.discountIncVatFormatted = parseMoneyCurrencyString(
      data.discountIncVat,
      locale,
      price.currency.code,
    );

    price.discountExVatFormatted = parseMoneyCurrencyString(data.discountExVat, locale, price.currency.code);
    price.vatFormatted = parseMoneyCurrencyString(data.vat, locale, price.currency.code);
  }

  return price;
}

export function parseMoneyCurrencyString(data: any, locale: string, currency: string): string {
  if (!data || !currency || !locale) {
    return '';
  }
  return (
    data.toLocaleString(locale, {
      style: 'currency',
      currency: currency,
    }) || ''
  );
}
