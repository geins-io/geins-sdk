import { parseAddress, parseCurrency, parsePrice, parseMoneyCurrencyString } from '../src/parsers/sharedParsers';

describe('sharedParsers', () => {
  describe('parseAddress', () => {
    it('returns undefined when data has no AddressType __typename', () => {
      expect(parseAddress(undefined)).toBeUndefined();
      expect(parseAddress(null)).toBeUndefined();
      expect(parseAddress({})).toBeUndefined();
      expect(parseAddress({ firstName: 'John' })).toBeUndefined();
    });

    it('parses a valid address with __typename', () => {
      const input = {
        __typename: 'AddressType',
        firstName: 'John',
        lastName: 'Doe',
        addressLine1: '123 Main St',
        city: 'Stockholm',
        country: 'SE',
        zip: '11122',
      };
      const result = parseAddress(input);
      expect(result).toBeDefined();
      expect(result!.firstName).toBe('John');
      expect(result!.lastName).toBe('Doe');
      expect(result!.addressLine1).toBe('123 Main St');
      expect(result!.city).toBe('Stockholm');
      expect(result!.country).toBe('SE');
      expect(result!.zip).toBe('11122');
    });

    it('uses undefined for missing optional fields', () => {
      const input = {
        __typename: 'AddressType',
        firstName: 'Jane',
      };
      const result = parseAddress(input);
      expect(result).toBeDefined();
      expect(result!.firstName).toBe('Jane');
      expect(result!.lastName).toBeUndefined();
      expect(result!.addressLine2).toBeUndefined();
      expect(result!.careOf).toBeUndefined();
      expect(result!.mobile).toBeUndefined();
    });

    it('finds nested address with __typename', () => {
      const input = {
        data: {
          billingAddress: {
            __typename: 'AddressType',
            firstName: 'Nested',
            city: 'Gothenburg',
          },
        },
      };
      const result = parseAddress(input);
      expect(result).toBeDefined();
      expect(result!.firstName).toBe('Nested');
      expect(result!.city).toBe('Gothenburg');
    });

    it('handles null values in fields gracefully', () => {
      const input = {
        __typename: 'AddressType',
        firstName: null,
        lastName: null,
        city: null,
      };
      const result = parseAddress(input);
      expect(result).toBeDefined();
      expect(result!.firstName).toBeUndefined();
      expect(result!.lastName).toBeUndefined();
      expect(result!.city).toBeUndefined();
    });
  });

  describe('parseCurrency', () => {
    it('returns undefined for null or undefined', () => {
      expect(parseCurrency(null)).toBeUndefined();
      expect(parseCurrency(undefined)).toBeUndefined();
    });

    it('parses a valid currency', () => {
      const result = parseCurrency({ code: 'SEK', symbol: 'kr', name: 'Swedish Krona', rate: 1 });
      expect(result).toEqual({ code: 'SEK', symbol: 'kr', name: 'Swedish Krona', rate: 1 });
    });

    it('defaults missing fields to empty string or zero', () => {
      const result = parseCurrency({} as any);
      expect(result).toEqual({ code: '', symbol: '', name: '', rate: 0 });
    });

    it('handles falsy but valid values', () => {
      const result = parseCurrency({ code: '', symbol: '', name: '', rate: 0 } as any);
      expect(result).toEqual({ code: '', symbol: '', name: '', rate: 0 });
    });
  });

  describe('parsePrice', () => {
    it('returns default price when data is null', () => {
      const result = parsePrice(null, 'en-US');
      expect(result.sellingPriceIncVat).toBe(0);
      expect(result.regularPriceIncVat).toBe(0);
      expect(result.discountIncVat).toBe(0);
      expect(result.isDiscounted).toBe(false);
      expect(result.sellingPriceIncVatFormatted).toBe('');
    });

    it('returns default price when data is undefined', () => {
      const result = parsePrice(undefined, 'en-US');
      expect(result.sellingPriceIncVat).toBe(0);
      expect(result.vat).toBe(0);
    });

    it('parses price data with currency formatting', () => {
      const data = {
        sellingPriceIncVat: 100,
        sellingPriceExVat: 80,
        regularPriceIncVat: 120,
        regularPriceExVat: 96,
        discountIncVat: 20,
        discountExVat: 16,
        discountPercentage: 17,
        vat: 20,
        isDiscounted: true,
        currency: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
      };
      const result = parsePrice(data as any, 'en-US');
      expect(result.sellingPriceIncVat).toBe(100);
      expect(result.sellingPriceExVat).toBe(80);
      expect(result.regularPriceIncVat).toBe(120);
      expect(result.discountIncVat).toBe(20);
      expect(result.isDiscounted).toBe(true);
      expect(result.currency).toEqual({ code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 });
      // Formatted strings should be non-empty when currency code exists
      expect(result.sellingPriceIncVatFormatted).not.toBe('');
      expect(result.regularPriceIncVatFormatted).not.toBe('');
    });

    it('skips formatting when currency code is missing', () => {
      const data = {
        sellingPriceIncVat: 100,
        currency: { code: '', symbol: '', name: '', rate: 0 },
      };
      const result = parsePrice(data as any, 'en-US');
      expect(result.sellingPriceIncVat).toBe(100);
      // No formatting when currency code is empty
      expect(result.sellingPriceIncVatFormatted).toBe('');
    });

    it('handles null currency gracefully', () => {
      const data = {
        sellingPriceIncVat: 50,
        currency: null,
      };
      const result = parsePrice(data as any, 'en-US');
      expect(result.sellingPriceIncVat).toBe(50);
      expect(result.currency).toBeUndefined();
      expect(result.sellingPriceIncVatFormatted).toBe('');
    });

    it('defaults numeric fields from falsy to zero', () => {
      const data = {
        sellingPriceIncVat: 0,
        sellingPriceExVat: null,
        regularPriceIncVat: undefined,
        currency: null,
      };
      const result = parsePrice(data as any, 'en-US');
      expect(result.sellingPriceIncVat).toBe(0);
      expect(result.sellingPriceExVat).toBe(0);
      expect(result.regularPriceIncVat).toBe(0);
    });
  });

  describe('parseMoneyCurrencyString', () => {
    it('returns empty string for null data', () => {
      expect(parseMoneyCurrencyString(null, 'en-US', 'USD')).toBe('');
    });

    it('returns empty string for undefined data', () => {
      expect(parseMoneyCurrencyString(undefined, 'en-US', 'USD')).toBe('');
    });

    it('returns empty string for zero (falsy) data', () => {
      expect(parseMoneyCurrencyString(0, 'en-US', 'USD')).toBe('');
    });

    it('returns empty string when currency is empty', () => {
      expect(parseMoneyCurrencyString(100, 'en-US', '')).toBe('');
    });

    it('returns empty string when locale is empty', () => {
      expect(parseMoneyCurrencyString(100, '', 'USD')).toBe('');
    });

    it('formats valid values correctly', () => {
      const result = parseMoneyCurrencyString(100, 'en-US', 'USD');
      expect(result).toContain('100');
      expect(result).not.toBe('');
    });

    it('handles negative values', () => {
      const result = parseMoneyCurrencyString(-50, 'en-US', 'USD');
      expect(result).not.toBe('');
      expect(result).toContain('50');
    });

    it('handles decimal values', () => {
      const result = parseMoneyCurrencyString(99.99, 'en-US', 'USD');
      expect(result).toContain('99.99');
    });
  });
});
