// https://nuxt.com/docs/api/configuration/nuxt-config
// import { RoutingService } from './utils/routingService';

import cache from './server/utils/cache';
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2024-08-19',
  // ... other configuration options

  // modules: [
  //   '@geins/nuxt',
  // ],
// https://merchantapi.geins.io/redirect/urlhistory/CF2FF80B-6F85-4CD9-ACE5-F41962891E07`?offset=`{DATE_TIME}`
  runtimeConfig: {
    public: {
      geins: {
        apiKey:
          process.env.GEINS_API_KEY || 'CF2FF80B-6F85-4CD9-ACE5-F41962891E07',
        accountName: process.env.GEINS_ACCOUNT_NAME || 'demogeins',
      },
      channel: {
        siteId: process.env.GEINS_SITE_ID || '1',
        siteTopDomain: process.env.GEINS_TOP_DOMAIN || 'se',
      },
      defaultLanguage: process.env.GEINS_LANGUAGE_ID || 'sv-SE',
      defaultMarket: process.env.GEINS_MARKET_ID || 'se',
    },
    apiCredentials: {}, // Add this line
  },

  // routingService.ts
  hooks: {
    'nitro:build:before': async () => {
        // Assuming you are fetching data from some API or database
      const dataToCache: { [key: string]: string } = {
        exampleKey: 'exampleValue',
        anotherKey: 'anotherValue',
      };

      // Populate the cache
      Object.keys(dataToCache).forEach(key => {
        cache.set(key, dataToCache[key]);
      });

      console.log('Cache contents after population:', cache.keys(), cache.mget(cache.keys()));
    }
  }

});

