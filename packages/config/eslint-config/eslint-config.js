import js from '@eslint/js';
import globals from 'globals';
import turbo from 'eslint-plugin-turbo';
import onlyWarn from 'eslint-plugin-only-warn';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import { createConfigForNuxt } from '@nuxt/eslint-config/flat';

/** @type {import('eslint-config')} */
export const geinsSharedConfig = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    ignores: ['**/dist/', '**/.output/', '**/.turbo/'],
  },
  {
    plugins: {
      turbo,
      'only-warn': onlyWarn,
    },
  },
  prettierRecommended,
];

const nuxtConfig = createConfigForNuxt();
geinsSharedConfig.forEach((config) => {
  nuxtConfig.append(config);
});
export const geinsSharedConfigNuxt = nuxtConfig;
