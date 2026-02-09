import type { AddressType, CurrencyType, PriceType } from '@geins/core';
import { findObjectWithProperty } from '@geins/core';
import type { GeinsAddressTypeType, GeinsPriceTypeType, GeinsCurrencyTypeType } from '@geins/types';

/**
 * Parses an address from a raw GraphQL response by locating an AddressType object.
 * @param data - Raw data potentially containing an AddressType.
 * @returns Parsed address, or undefined if not found.
 */
export function parseAddress(data: unknown): AddressType | undefined {
  const address = findObjectWithProperty<GeinsAddressTypeType>(data, '__typename', 'AddressType');

  if (!address) {
    return undefined;
  }

  return {
    firstName: address.firstName ?? undefined,
    lastName: address.lastName ?? undefined,
    addressLine1: address.addressLine1 ?? undefined,
    addressLine2: address.addressLine2 ?? undefined,
    addressLine3: address.addressLine3 ?? undefined,
    entryCode: address.entryCode ?? undefined,
    careOf: address.careOf ?? undefined,
    city: address.city ?? undefined,
    state: address.state ?? undefined,
    country: address.country ?? undefined,
    zip: address.zip ?? undefined,
    company: address.company ?? undefined,
    mobile: address.mobile ?? undefined,
    phone: address.phone ?? undefined,
  };
}

/**
 * Parses a Geins currency object into a normalized CurrencyType.
 * @param data - Raw currency data.
 * @returns Parsed currency, or undefined if data is null/undefined.
 */
export function parseCurrency(data: GeinsCurrencyTypeType | null | undefined): CurrencyType | undefined {
  if (!data) {
    return undefined;
  }

  return {
    name: data.name || '',
    symbol: data.symbol || '',
    code: data.code || '',
    rate: data.rate || 0,
  };
}

/**
 * Parses a Geins price object into a normalized PriceType with formatted currency strings.
 * @param data - Raw price data.
 * @param locale - Locale string used for currency formatting.
 * @returns Parsed price with all fields defaulting to zero/empty if data is null.
 */
export function parsePrice(data: GeinsPriceTypeType | null | undefined, locale: string): PriceType {
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

  price.currency = parseCurrency(data.currency ?? undefined);
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

/**
 * Formats a number as a locale-specific currency string.
 * @param data - Numeric value to format.
 * @param locale - Locale string for formatting.
 * @param currency - ISO currency code.
 * @returns Formatted currency string, or empty string if any input is missing.
 */
export function parseMoneyCurrencyString(data: number | null | undefined, locale: string, currency: string): string {
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
