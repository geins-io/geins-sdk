import { defu } from 'defu';
import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit';

// Module options TypeScript interface definition
export interface ModuleOptions {
  /**
   * Geins API key
   * @default process.env.GEINS_API_KEY
   * @type string
   */
  apiKey: string;
  /**
   * Geins account name
   * @default process.env.GEINS_ACCOUNT_NAME
   * @type string
   */
  accountName: string;
  /**
   * Geins environment
   * @default process.env.GEINS_ENV || 'prod'
   * @example 'qa'
   * @type string
   */
  env: 'prod' | 'qa' | 'dev';
  /**
   * Geins default channel
   * @default process.env.GEINS_CHANNEL
   * @example '1'
   * @type string
   */
  defaultChannelId: string;
  /**
   * Geins default top level domain
   * @default process.env.GEINS_TLD
   * @example 'se'
   * @type string
   */
  defaultTLD: string;
  /**
   * Geins default locale
   * @default process.env.GEINS_LOCALE
   * @example 'sv-SE'
   * @type string
   */
  defaultLocale: string;
  /**
   * Geins default market
   * @default process.env.GEINS_MARKET
   * @example 'se'
   * @type string
   */
  defaultMarket: string;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-geins',
    configKey: 'geins',
    compatibility: {
      nuxt: '>=3.13.0',
    },
  },
  // Default configuration options of the Nuxt module
  defaults: {
    apiKey: process.env.GEINS_API_KEY || '',
    accountName: process.env.GEINS_ACCOUNT_NAME || '',
    defaultChannelId: process.env.GEINS_CHANNEL || '',
    defaultTLD: process.env.GEINS_TLD || '',
    defaultLocale: process.env.GEINS_LOCALE || '',
    defaultMarket: process.env.GEINS_MARKET || '',
  },
  setup(options, nuxt) {
    // Default runtimeConfig
    nuxt.options.runtimeConfig.public.geins = defu(
      nuxt.options.runtimeConfig.public.geins,
      options,
    );
    nuxt.options.runtimeConfig.strapi = defu(
      nuxt.options.runtimeConfig.geins,
      options,
    );

    const resolver = createResolver(import.meta.url);

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'));
  },
});
