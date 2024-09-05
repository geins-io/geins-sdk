// https://nuxt.com/docs/api/configuration/nuxt-config
/* import { RoutingService } from './utils/routingService';
import { RoutingStoreNodeCache } from './utils/routingStoreNodeCache';
const routingStore = new RoutingStoreNodeCache();
async function getRoutingRules() {
  const routingService = RoutingService.getInstance(
    process.env.GEINS_API_KEY || 'CF2FF80B-6F85-4CD9-ACE5-F41962891E07',
    routingStore,
  );

  await routingService.fillRoutes();
  const rules = await routingService.getRoutingRules();
  console.log('Rules:', rules);
  return rules;
} */
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2024-08-19',
  // ... other configuration options

  modules: ['nuxt-geins'],
  geins: {
    debug: true,
    credentials: {
      apiKey:
        process.env.GEINS_API_KEY || 'CF2FF80B-6F85-4CD9-ACE5-F41962891E07',
      accountName: process.env.GEINS_ACCOUNT_NAME || 'demogeins',
      environment: 'prod',
      channel: process.env.GEINS_CHANNEL || '1',
      tld: process.env.GEINS_TLD || 'se',
      locale: process.env.GEINS_LOCALE || 'sv-SE',
      market: process.env.GEINS_MARKET || 'se',
    },
  },
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
  routeRules: {
    '/from': {
      redirect: {
        to: '/routes',
        statusCode: 302,
      },
    },
  },
});
