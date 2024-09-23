import {
  UserType,
  UserCustomerType,
  UserGenderType,
  UserAddressType,
  UserBalanceType,
} from '@geins/types';
import { parseAddress } from './shared';

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
