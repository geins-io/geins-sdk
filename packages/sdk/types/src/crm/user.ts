export enum UserGenderType {
  Female = 'WOMAN',
  Male = 'MAN',
  Other = 'UNSPECIFIED',
}

export enum UserCustomerType {
  Private = 'PERSON',
  Organization = 'ORGANIZATION',
}

export type UserAddressType = {
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
