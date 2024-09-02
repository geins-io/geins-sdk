import { buildEndpoints, GeinsCore } from '@geins/core';
import { GeinsCMS } from '@geins/cms';
import { AuthService } from '@geins/crm';
import type {
  Channel,
  MerchantApiCredentials,
  ContentAreaVariables,
  MenuType,
  ContentAreaType,
} from '@geins/types';
const runtimeConfig = useRuntimeConfig();
const channel: Channel = {
  siteId: runtimeConfig.public.channel.siteId,
  siteTopDomain: runtimeConfig.public.channel.siteTopDomain,
};

const geinsCredentials: MerchantApiCredentials = {
  ...runtimeConfig.public.geins,
};

const languageId = runtimeConfig.public.defaultLanguage;
const marketId = runtimeConfig.public.defaultMarket;

const geinsCore = new GeinsCore(geinsCredentials, channel, {
  marketId,
  languageId,
});

export default defineEventHandler(async (event) => {
  const geinsCMS = new GeinsCMS(geinsCore);
  geinsCMS.menu.location('Frontpage').then((response) => {
    if (response.loading) {
      console.info('loading');
      return;
    }
    if (!response.data) {
      console.info('no data');
      return;
    }
    const data = response.data;
    console.info(data);
  });
});
