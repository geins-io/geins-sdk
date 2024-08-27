import { GeinsCore, Channel, MerchantApiCredentials } from '@geins/core';
// import { GeinsCRM } from '@geins/crm';

export default defineEventHandler(async (event) => {
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
  // const geinsCRM = new GeinsCRM(geinsCore);

  const { total = 10, offset = 0 } = getQuery(event);
  console.log('sercer event', geinsCore.client);
  return {
    status: 200,
    body: {
      data: {},
    },
  };
});
