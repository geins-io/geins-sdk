export enum CustomerType {
  PERSON = 'PERSON',
  ORGANIZATION = 'ORGANIZATION',
}

export enum Environment {
  PRODUCTION = 'prod',
  TEST = 'qa',
}

export type KeyValue = {
  key: string;
  value: string;
};
