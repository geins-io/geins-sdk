export { gql } from '@apollo/client/core';
export * from '@geins/types';

// API Client
export {
  MerchantApiClient,
  FetchPolicyOptions,
  OperationType,
} from './api-client/merchantApiClient';
export type {
  GraphQLQueryOptions,
  RequestOptions,
  MerchantApiClientOptions,
} from './api-client/merchantApiClient';
export { ManagementApiClient } from './api-client/managementApiClient';
export { TelemetryCollector } from './api-client/links/telemetryLink';

// Base
export { BaseApiService } from './base/baseApiService';
export type { ApiClientGetter } from './base/baseApiService';
export { BasePackage } from './base/basePackage';

// Constants
export {
  AUTH_STORAGE_KEYS,
  AUTH_STORAGE_MAX_AGE,
  CART_STORAGE_KEYS,
  CART_STORAGE_MAX_AGE,
} from './constants/storageKeys';
export { AUTH_HEADERS } from './constants/headerNames';
export { CHECKOUT_PARAMETERS } from './constants/parameters';

// Errors
export { GeinsError, GeinsErrorCode } from './errors/geinsError';
export { AuthError, TokenExpiredError, TokenRefreshError } from './errors/authError';
export { CartError } from './errors/cartError';
export { CheckoutError, OrderError } from './errors/checkoutError';
export {
  NetworkRequestError,
  TimeoutError,
  RateLimitError,
  RetryExhaustedError,
} from './errors/networkError';

// Main class
export { GeinsCore } from './geinsCore';

// Logic
export { Channel } from './logic/channel';

// Services
export { CookieService } from './services/cookieService';
export type { CookieServiceConfig, CookieType } from './services/cookieService';
export { CookieStorageAdapter } from './services/cookieStorageAdapter';
export { EventService } from './services/eventService';
export { GraphQLService } from './services/graphQLService';
export { MemoryStorage } from './services/memoryStorage';
export type { StorageInterface, StorageSetOptions } from './services/storageInterface';

// Utils
export {
  buildEndpoints,
  findObjectWithProperty,
  extractParametersFromUrl,
  parseErrorMessage,
  isServerContext,
} from './utils/helpers';
export { decodeJWT, encodeJWT } from './utils/jwtUtils';
export { paginate, paginateAll } from './utils/paginator';
