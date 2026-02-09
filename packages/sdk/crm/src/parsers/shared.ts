import { GeinsAddressTypeType } from '@geins/types';

/**
 * Normalizes a partial address into a full {@link GeinsAddressTypeType} with empty-string defaults.
 * @param data - Partial address data from the API.
 * @returns The normalized address, or undefined if data is falsy.
 */
export function parseAddress(data: Partial<GeinsAddressTypeType>): GeinsAddressTypeType | undefined {
  if (!data) {
    return undefined;
  }
  return {
    firstName: data.firstName ?? '',
    lastName: data.lastName ?? '',
    addressLine1: data.addressLine1 ?? '',
    addressLine2: data.addressLine2 ?? '',
    addressLine3: data.addressLine3 ?? '',
    entryCode: data.entryCode ?? '',
    careOf: data.careOf ?? '',
    city: data.city ?? '',
    state: data.state ?? '',
    country: data.country ?? '',
    zip: data.zip ?? '',
    company: data.company ?? '',
    mobile: data.mobile ?? '',
    phone: data.phone ?? '',
  };
}
