import { GeinsCore } from '@geins/core';
import type { Channel, MerchantApiCredentials } from '@geins/types';
import { useRuntimeConfig } from '#app';

export function useGeinsCore() {
  const config = useRuntimeConfig();

  const channel: Channel = {
    siteId: config.public.geins.defaultChannelId,
    siteTopDomain: config.public.geins.defaultTLD,
  };

  const apiCredentials: MerchantApiCredentials = {
    apiKey: config.public.geins.apiKey,
    accountName: config.public.geins.accountName,
    environment: config.public.geins.environment,
  };

  const languageId = config.public.geins.defaultLocale;
  const marketId = config.public.geins.defaultMarket;

  const geinsCore = new GeinsCore(apiCredentials, channel, {
    marketId,
    languageId,
  });

  return {
    geinsCore,
  };
}
