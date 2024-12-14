import js from '@eslint/js';
import globals from 'globals';
import turbo from 'eslint-plugin-turbo';
import onlyWarn from 'eslint-plugin-only-warn';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

/** Workaround - https://github.com/sindresorhus/globals/issues/239 */
const GLOBALS_BROWSER_FIX = Object.assign({}, globals.browser, {
  AudioWorkletGlobalScope: globals.browser['AudioWorkletGlobalScope '],
});
delete GLOBALS_BROWSER_FIX['AudioWorkletGlobalScope '];

/** @type {import('eslint-config')} */
export const geinsSharedConfig = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        //...globals.browser,
        ...globals.node,
        ...GLOBALS_BROWSER_FIX,
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
    rules: {
      'brace-style': ['error', '1tbs', { allowSingleLine: true }], // Allow single-line braces
      'max-len': ['error', { code: 110, ignoreUrls: true }], // Set maximum line length to 100 characters
      'function-paren-newline': ['error', 'consistent'], // Ensure function parameters are consistently on a single line
      'function-call-argument-newline': ['error', 'consistent'], // Ensure function call arguments are consistently on a single line
      'no-console': ['error', { allow: ['warn', 'error'] }], // Allow only console.warn and console.error
      'prettier/prettier': [
        'error',
        {
          printWidth: 110,
          singleQuote: true,
          trailingComma: 'none',
          arrowParens: 'always',
          bracketSpacing: true,
          endOfLine: 'lf',
        },
      ],
    },
  },
  prettierRecommended,
];
