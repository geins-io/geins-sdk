// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2024-08-19',
   // ... other configuration options
  
    modules: [
    '@geins/nuxt',
  ],
  
  
  runtimeConfig: {
    public: {
      geins: {
        apiKey: process.env.GEINS_API_KEY || 'CF2FF80B-6F85-4CD9-ACE5-F41962891E07',
        accountName: process.env.GEINS_ACCOUNT_NAME || 'demogeins',
        environment: process.env.GEINS_ENVIRONMENT || 'PRODUCTION'
      },
      localization: {
        channelId: process.env.GEINS_CHANNEL_ID || '1|se',
        marketId: process.env.GEINS_MARKET_ID || 'se',
        languageId: process.env.GEINS_LANGUAGE_ID || 'sv-SE'
      }
    }
  }
})
