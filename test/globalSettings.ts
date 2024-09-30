// test-utils/globalSettings.ts

import { Environment, GeinsSettings } from '@geins/types';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

// Define and export global settings based on environment variables
export const validSettings: GeinsSettings = {
  apiKey: process.env.GEINS_API_KEY!,
  accountName: process.env.GEINS_ACCOUNT_NAME!,
  channel: process.env.GEINS_CHANNEL!,
  tld: process.env.GEINS_TLD!,
  locale: process.env.GEINS_LOCALE!,
  market: process.env.GEINS_MARKET!,
  environment: (process.env.GEINS_ENVIRONMENT || 'prod') as Environment,
};

export const validUserCredentials = {
  username: process.env.GEINS_USERNAME!,
  password: process.env.GEINS_PASSWORD!,
};
