/**
 * Endpoints for the current environment.
 * - main: The main api endpoint used to query Geins.
 * - auth: The auth endpoint.
 * - authSign: The auth sign endpoint.
 * - image: The base image url
 */
export interface GeinsEndpoints {
  main: string;
  auth: string;
  authSign: string;
  image: string;
}

export interface GeinsBaseApiVars {
  [key: string]: unknown;
  channelId?: string | null;
  marketId?: string | null;
  languageId?: string | null;
}

export interface ManagementApiCredentials {
  apiKey: string;
  username: string;
  password: string;
}
