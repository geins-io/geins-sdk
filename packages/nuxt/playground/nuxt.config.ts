export default defineNuxtConfig({
  modules: ['../src/module'],
  geins: {
    apiKey: 'process.env.GEINS_API_KEY',
    accountName: process.env.GEINS_ACCOUNT_NAME,
    environment: process.env.GEINS_ENVIRONMENT || 'PRODUCTION',
  },
  devtools: { enabled: true },
  compatibilityDate: '2024-08-19',
});
