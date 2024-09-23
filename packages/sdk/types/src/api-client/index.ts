export interface GeinsEndpoints {
  main: string;
  auth: string;
  authSign: string;
  image: string;
}

export interface GeinsBaseApiVars {
  channelId?: string | null;
  marketId?: string | null;
  languageId?: string | null;
}

export interface ManagementApiCredentials {
  apiKey: string;
  username: string;
  password: string;
}
