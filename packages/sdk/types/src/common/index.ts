import type { GeinsChannelTypeType } from '../generated';
export * from './channel';
export * from './event';

export enum CustomerType {
  PERSON = 'PERSON',
  ORGANIZATION = 'ORGANIZATION',
}

export enum GeinsLogLevel {
  NONE = 'NONE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

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
  logLevel?: GeinsLogLevel;
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
