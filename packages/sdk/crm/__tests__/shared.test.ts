import { parseAddress } from '../src/parsers/shared';

describe('CRM parseAddress', () => {
  it('returns undefined for falsy data', () => {
    expect(parseAddress(null as any)).toBeUndefined();
    expect(parseAddress(undefined as any)).toBeUndefined();
  });

  it('parses a full address', () => {
    const input = {
      firstName: 'John',
      lastName: 'Doe',
      addressLine1: '123 Main St',
      addressLine2: 'Apt 4',
      addressLine3: '',
      entryCode: '1234',
      careOf: 'Jane Doe',
      city: 'Stockholm',
      state: 'Stockholm',
      country: 'SE',
      zip: '11122',
      company: 'Acme Inc',
      mobile: '+46701234567',
      phone: '+4681234567',
    };
    const result = parseAddress(input as any);
    expect(result).toBeDefined();
    expect(result!.firstName).toBe('John');
    expect(result!.lastName).toBe('Doe');
    expect(result!.addressLine1).toBe('123 Main St');
    expect(result!.city).toBe('Stockholm');
    expect(result!.zip).toBe('11122');
    expect(result!.company).toBe('Acme Inc');
    expect(result!.mobile).toBe('+46701234567');
  });

  it('defaults missing fields to empty string', () => {
    const result = parseAddress({} as any);
    expect(result).toBeDefined();
    expect(result!.firstName).toBe('');
    expect(result!.lastName).toBe('');
    expect(result!.addressLine1).toBe('');
    expect(result!.city).toBe('');
    expect(result!.zip).toBe('');
    expect(result!.mobile).toBe('');
    expect(result!.phone).toBe('');
  });

  it('defaults null fields to empty string', () => {
    const input = {
      firstName: null,
      lastName: null,
      city: null,
    };
    const result = parseAddress(input as any);
    expect(result!.firstName).toBe('');
    expect(result!.lastName).toBe('');
    expect(result!.city).toBe('');
  });

  it('preserves empty strings', () => {
    const input = {
      firstName: '',
      lastName: '',
    };
    const result = parseAddress(input as any);
    expect(result!.firstName).toBe('');
    expect(result!.lastName).toBe('');
  });

  it('handles partial address (only some fields)', () => {
    const input = {
      firstName: 'Jane',
      city: 'Gothenburg',
    };
    const result = parseAddress(input as any);
    expect(result!.firstName).toBe('Jane');
    expect(result!.city).toBe('Gothenburg');
    expect(result!.lastName).toBe('');
    expect(result!.addressLine1).toBe('');
  });
});
