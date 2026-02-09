// Integration tests only — requires .env with real API credentials
import baseConfig from './jest.config.js';

/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  ...baseConfig,
  testMatch: [
    '**/core/__tests__/GeinsCore.test.ts',
    '**/core/__tests__/Graphql.test.ts',
    '**/core/__tests__/Channel.test.ts',
    '**/crm/__tests__/GeinsCRM.auth.test.ts',
    '**/crm/__tests__/GeinsCRM.user.test.ts',
    '**/cms/__tests__/GeinsCMS.page.test.ts',
    '**/cms/__tests__/GeinsCMS.area.test.ts',
    '**/oms/__tests__/GeinsOMS.cart.test.ts',
    '**/oms/__tests__/GeinsOMS.checkout.test.ts',
  ],
};
