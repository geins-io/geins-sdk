import {
  UserType,
  UserCustomerType,
  UserGenderType,
  UserAddressType,
  UserBalanceType,
} from '@geins/types';

export function parseUser(data: any): UserType {
  if (!data || !data.data || !data.data.getUser) {
    throw new Error('Invalid user data');
  }
  const user = data.data.getUser;

  return {
    id: user.id,
    email: user.email,
    address: parseAddress(user.address),
    gender: parseGender(user.gender),
    customerType: parseCustomerType(user.customerType),
    newsletter: user.newsletter === 'true',
    entityId: user.entityId,
    memberType: user.memberType,
    memberId: user.memberId,
    balances: parseBalances(user.balances),
    metaData: user.metaData,
  };
}

function parseAddress(data: any): UserAddressType | undefined {
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

function parseBalances(data: any): UserBalanceType[] | undefined {
  if (!data) {
    return undefined;
  }
  return data.map((balance: any) => {
    return {
      currency: balance.currency,
      amount: balance.amount,
      amountFormatted: balance.amountFormatted,
    };
  });
}

function parseGender(data: string): UserGenderType | undefined {
  if (!data) {
    return undefined;
  }
  switch (data) {
    case 'WOMAN':
      return UserGenderType.Female;
    case 'MAN':
      return UserGenderType.Male;
    default:
      return UserGenderType.Other;
  }
}

function parseCustomerType(data: string): UserCustomerType | undefined {
  if (!data) {
    return undefined;
  }
  switch (data) {
    case 'PERSON':
      return UserCustomerType.Private;
    case 'ORGANIZATION':
      return UserCustomerType.Organization;
    default:
      return UserCustomerType.Private;
  }
}
