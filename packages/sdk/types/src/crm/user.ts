export enum UserGenderType {
  Female = 'WOMAN',
  Male = 'MAN',
  Other = 'UNSPECIFIED',
}

export enum UserCustomerType {
  Private = 'PERSON',
  Organization = 'ORGANIZATION',
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
  /**
   * The unique identifier of the entity.
   * If the entity is a person, this field should be the person's ID.
   * If the entity is an organization, this field should be the organization's ID.
   */
  entityId?: String;
  address?: UserAddressInputType;
  gender?: UserGenderType;
  newsletter?: Boolean;
  customerType?: UserCustomerType;
  /**
   * The metadata associated with the entity.
   */
  metaData?: String;
};
