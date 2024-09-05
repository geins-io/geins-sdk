// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2024-08-19',
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
