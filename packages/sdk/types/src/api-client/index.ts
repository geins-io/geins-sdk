import { Environment } from '../common';

export interface MerchantApiCredentials {
  apiKey: string;
  accountName: string;
  environment?: Environment;
};

export interface ManagementApiCredentials {
  apiKey: string;
  username: string;
  password: string;
};

export interface Channel {
  siteId: string;
  siteTopDomain: string;
};

export interface MarketLanguage {
  languageId: string;
  marketId: string;
};


export interface GeinsCredentials {
  apiKey: string;
  accountName: string;
  channelId: number;
  tld: string;
  locale: string;
  market: string;
  environment?: Environment;
}