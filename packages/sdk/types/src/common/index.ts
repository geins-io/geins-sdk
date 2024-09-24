export * from './channel';

/* export type CustomerType = 'PERSON' | 'ORGANIZATION'; */

export type Environment = 'prod' | 'qa' | 'dev';

export interface KeyValue {
  key: string;
  value: string;
}

export type GeinsCredentials = {
  apiKey: string;
  accountName: string;
  channel: string;
  tld: string;
  locale: string;
  market: string;
  environment?: Environment;
};
