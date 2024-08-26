import { Environment } from '../common';

export type MerchantApiCredentials = {
  apiKey: string;
  accountName: string;
  environment?: Environment | string | null;
};

export type ManagementApiCredentials = {
  apiKey: string;
  username: string;
  password: string;
};

export type Channel = {
  siteId: string;
  siteTopDomain: string;
};

export type MarketLanguage = {
  languageId: string;
  marketId: string;
};
