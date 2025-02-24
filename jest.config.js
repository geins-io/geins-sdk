// global config for jest
/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: 'node',
  roots: ['<rootDir>/packages/sdk'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'gql', 'graphql'],
  moduleNameMapper: {
    '^@cacheable/node-cache$': '<rootDir>/node_modules/@cacheable/node-cache',
    '^@geins/core$': '<rootDir>/packages/sdk/core/src',
    '^@geins/cms$': '<rootDir>/packages/sdk/cms/src',
    '^@geins/crm$': '<rootDir>/packages/sdk/crm/src',
    '^@geins/oms$': '<rootDir>/packages/sdk/oms/src',
  },
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
      },
    ],
    '^.+\\.(gql|graphql)$': '@graphql-tools/jest-transform',
  },
  setupFiles: ['<rootDir>/jest.setup.cjs'],
  globals: {
    graphql: {
      noDescription: true,
    },
  },
};
