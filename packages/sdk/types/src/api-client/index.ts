import { Environment } from '../common';

export type MerchantApiCredentials = {
  apiKey: string;
  accountName: string;
  environment?: Environment;
};

export type ManagementApiCredentials = {
  apiKey: string;
  username: string;
  password: string;
};

export type GeinsAPILocalization = {
  channelId: string;
  marketId: string;
  languageId: string;
};
