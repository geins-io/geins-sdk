import { UserAddressType } from '@geins/types';

export function parseAddress(data: any): UserAddressType | undefined {
  if (!data) {
    return undefined;
  }
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    addressLine1: data.addressLine1,
    addressLine2: data.addressLine2,
    addressLine3: data.addressLine3,
    entryCode: data.entryCode,
    careOf: data.careOf,
    city: data.city,
    state: data.state,
    country: data.country,
    zip: data.zip,
    company: data.company,
    mobile: data.mobile,
    phone: data.phone,
  };
}
