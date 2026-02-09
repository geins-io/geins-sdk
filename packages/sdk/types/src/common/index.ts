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
  requestConfig?: GeinsRequestConfig;
};

export interface GeinsRequestConfig {
  retry?: GeinsRetryConfig | false;
  timeoutMs?: number;
  interceptors?: GeinsInterceptors;
  telemetry?: GeinsTelemetryConfig | false;
}

export interface GeinsTelemetryConfig {
  onMetrics?: (snapshot: GeinsTelemetrySnapshot) => void;
  flushIntervalMs?: number;
}

export interface GeinsTelemetrySnapshot {
  totalRequests: number;
  successCount: number;
  errorCount: number;
  timeoutCount: number;
  retryCount: number;
  avgDurationMs: number;
  p95DurationMs: number;
}

export interface GeinsRetryConfig {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  jitter?: boolean;
}

export interface GeinsInterceptors {
  onRequest?: (context: GeinsRequestContext) => void | Promise<void>;
  onResponse?: (context: GeinsResponseContext) => void;
  onError?: (context: GeinsErrorContext) => void;
}

export interface GeinsRequestContext {
  requestId: string;
  operationName: string;
  headers: Record<string, string>;
  timestamp: number;
}

export interface GeinsResponseContext {
  requestId: string;
  operationName: string;
  durationMs: number;
  data: unknown;
}

export interface GeinsErrorContext {
  requestId: string;
  operationName: string;
  durationMs: number;
  error: Error;
  retryCount: number;
}

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


