export enum UserGenderType {
  UNSPECIFIED = 'UNSPECIFIED',
  WOMAN = 'WOMAN',
  MAN = 'MAN',
}

export enum UserCustomerType {
  PERSON = 'PERSON',
  ORGANIZATION = 'ORGANIZATION',
}

type UserAddressInputType = {
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

export type UserInputType = {
  address?: UserAddressInputType;
  gender?: UserGenderType;
  newsletter?: Boolean;
  /**
   * The unique identifier of the entity.
   * If the entity is a person, this field should be the person's ID.
   * If the entity is an organization, this field should be the organization's ID.
   */
  entityId?: String;
  customerType?: UserCustomerType;
  metaData?: String;
};
