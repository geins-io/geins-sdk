import type { GeinsChannelTypeType } from '../generated';
export * from './channel';
export * from './event';

/* export type GeinsCustomerTypeType = 'PERSON' | 'ORGANIZATION'; */

export type Environment = 'prod' | 'qa' | 'dev';
export enum RuntimeContext {
  SERVER = 'server',
  CLIENT = 'client',
  HYBRID = 'hybrid',
}

export interface KeyValue {
  key: string;
  value: string;
}

export type GeinsSettings = {
  apiKey: string;
  accountName: string;
  channel: string;
  tld: string;
  locale: string;
  market: string;
  environment?: Environment;
};

export interface GeinsChannelInterface {
  current: () => Promise<GeinsChannelTypeType | undefined>;
  all: () => Promise<GeinsChannelTypeType[] | undefined>;
}

export enum LinkAttributeRelEnum {
  follow = 'follow',
  noopener = 'noopener',
  noreferrer = 'noreferrer',
  alternate = 'alternate',
  author = 'author',
  bookmark = 'bookmark',
  external = 'external',
  help = 'help',
  license = 'license',
  next = 'next',
  nofollow = 'nofollow',
  prev = 'prev',
  search = 'search',
  tag = 'tag',
}
