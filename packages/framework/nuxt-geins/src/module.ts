import { defu } from 'defu';
import {
  defineNuxtModule,
  addImportsDir,
  addPlugin,
  createResolver,
  logger,
} from '@nuxt/kit';

import type { GeinsCredentials } from '@geins/types';

export interface ModuleOptionsCredentials extends GeinsCredentials {
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
   * @example 'prod'
   * @type string
   */
  environment: 'prod' | 'qa' | 'dev';
  /**
   * Geins default channel
   * @default process.env.GEINS_CHANNEL
   * @example '1'
   * @type string
   */
  channel: string;
  /**
   * Geins default top level domain
   * @default process.env.GEINS_TLD
   * @example 'se'
   * @type string
   */
  tld: string;
  /**
   * Geins default locale
   * @default process.env.GEINS_LOCALE
   * @example 'sv-SE'
   * @type string
   */
  locale: string;
  /**
   * Geins default market
   * @default process.env.GEINS_MARKET
   * @example 'se'
   * @type string
   */
  market: string;
}

export interface ModuleOptions {
  /**
   * Geins credentials
   * @type GeinsCredentials
   */
  credentials: ModuleOptionsCredentials;
  /**
   * Enable debug mode
   * @default false
   * @type boolean
   */
  debug: boolean;
}

export interface ModulePublicRuntimeConfig {
  geins: ModuleOptions;
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
    credentials: {
      apiKey: process.env.GEINS_API_KEY || '',
      accountName: process.env.GEINS_ACCOUNT_NAME || '',
      channel: process.env.GEINS_CHANNEL || '',
      tld: process.env.GEINS_TLD || '',
      locale: process.env.GEINS_LOCALE || '',
      market: process.env.GEINS_MARKET || '',
      environment: (process.env.GEINS_ENV as 'prod' | 'qa' | 'dev') || 'prod',
    },
  },
  setup(options, nuxt) {
    // Default runtimeConfig
    nuxt.options.runtimeConfig.public.geins = defu(
      nuxt.options.runtimeConfig.public.geins,
      options,
    );
    // nuxt.options.runtimeConfig.geins = defu(
    //   nuxt.options.runtimeConfig.geins,
    //   options,
    // );

    const { resolve } = createResolver(import.meta.url);

    // Transpile runtime
    const runtimeDir = resolve('./runtime');
    nuxt.options.build.transpile.push(runtimeDir);

    // Add plugins
    addPlugin(resolve(runtimeDir, 'plugin'));

    // Add composables
    addImportsDir(resolve(runtimeDir, 'composables'));

    // Add log message
    const message = 'Using Geins Nuxt Module';
    const greenCheckmark = '\x1B[32m✔\x1B[0m';
    const boxSpace = 8;

    const align = (text: string, width: number) => {
      return ' '.repeat(width) + text;
    };

    const centeredMessage = align(`${greenCheckmark}  ${message}`, boxSpace);

    logger.box({
      message: centeredMessage,
      style: {
        borderColor: 'whiteBright',
        borderStyle: 'double',
      },
    });
  },
});
