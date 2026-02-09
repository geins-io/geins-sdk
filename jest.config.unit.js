// Unit tests only — no real API calls, safe to run without .env
import baseConfig from './jest.config.js';

/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  ...baseConfig,
  testPathIgnorePatterns: [
    // Integration tests that hit the real Geins API
    'packages/sdk/core/__tests__/GeinsCore\\.test\\.ts',
    'packages/sdk/core/__tests__/Graphql\\.test\\.ts',
    'packages/sdk/core/__tests__/Channel\\.test\\.ts',
    'packages/sdk/crm/__tests__/GeinsCRM\\.auth\\.test\\.ts',
    'packages/sdk/crm/__tests__/GeinsCRM\\.user\\.test\\.ts',
    'packages/sdk/cms/__tests__/GeinsCMS\\.page\\.test\\.ts',
    'packages/sdk/cms/__tests__/GeinsCMS\\.area\\.test\\.ts',
    'packages/sdk/oms/__tests__/GeinsOMS\\.cart\\.test\\.ts',
    'packages/sdk/oms/__tests__/GeinsOMS\\.checkout\\.test\\.ts',
  ],
};
