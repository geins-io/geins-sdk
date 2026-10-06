export { gql } from '@apollo/client/core';
export * from '@geins/types';

// API Client
export { TelemetryCollector } from './api-client/links/telemetryLink';
export { ManagementApiClient } from './api-client/managementApiClient';
export { FetchPolicyOptions, MerchantApiClient, OperationType } from './api-client/merchantApiClient';
export type {
  GraphQLQueryOptions,
  MerchantApiClientOptions,
  RequestOptions,
} from './api-client/merchantApiClient';

// Base
export { BaseApiService } from './base/baseApiService';
export type { ApiClientGetter } from './base/baseApiService';
export { BasePackage } from './base/basePackage';

// Constants
export { AUTH_HEADERS } from './constants/headerNames';
export { GEINS_IMAGE_FOLDER } from './constants/image';
export { CHECKOUT_PARAMETERS } from './constants/parameters';
export {
  AUTH_STORAGE_KEYS,
  AUTH_STORAGE_MAX_AGE,
  CART_STORAGE_KEYS,
  CART_STORAGE_MAX_AGE,
  LISTS_STORAGE_KEYS,
  LISTS_STORAGE_MAX_AGE,
} from './constants/storageKeys';

// Errors
export { AuthError, TokenExpiredError, TokenRefreshError } from './errors/authError';
export { CartError } from './errors/cartError';
export { CheckoutError, OrderError } from './errors/checkoutError';
export { ConfigurationError, isConfigurationError, toConfigurationError } from './errors/configurationError';
export type {
  ConfigurationErrorCode,
  ConfigurationErrorDetails,
  ConfigurationProviderError,
} from './errors/configurationError';
export { GeinsError, GeinsErrorCode } from './errors/geinsError';
export {
  NetworkRequestError,
  RateLimitError,
  RetryExhaustedError,
  TimeoutError,
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
  extractParametersFromUrl,
  findObjectWithProperty,
  isServerContext,
  parseErrorMessage,
} from './utils/helpers';
export { buildGeinsImageUrl, buildGeinsRawUrl, buildGeinsThumbnailUrl } from './utils/imageUrl';
export { decodeJWT, encodeJWT } from './utils/jwtUtils';
export { Logger, sdkLogger } from './utils/logger';
export { paginate, paginateAll } from './utils/paginator';
