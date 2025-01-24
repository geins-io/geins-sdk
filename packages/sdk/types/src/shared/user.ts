import { CustomerType } from '../common';

export type AddressType = {
  firstName?: string;
  lastName?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  entryCode?: string;
  careOf?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  company?: string;
  mobile?: string;
  phone?: string;
};

export enum Gender {
  UNSET = 'unset',
  UNSPECIFIED = 'unspecified',
  WOMAN = 'woman',
  MAN = 'man',
}

export type UserBalanceType = {
  amount: number;
  currency: string;
};

export type UserType = {
  id: number;
  email: string;
  address?: AddressType;
  gender?: Gender;
  customerType: CustomerType;
  newsletter: boolean;
  personalId?: string;
  memberType: string;
  memberId: number;
  balances?: UserBalanceType[];
  metaData?: string;
};
