import js from '@eslint/js';
import globals from 'globals';
import turbo from 'eslint-plugin-turbo';
import onlyWarn from 'eslint-plugin-only-warn';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import unusedImports from 'eslint-plugin-unused-imports';

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
      'unused-imports': unusedImports,
    },
    rules: {
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'max-len': ['error', { code: 210, ignoreUrls: true }],
      'function-paren-newline': ['error', 'consistent'],
      'function-call-argument-newline': ['error', 'consistent'],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-unused-vars': 'off', // Turned off in favor of unused-imports/no-unused-vars
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'prettier/prettier': [
        'error',
        {
          printWidth: 210,
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
