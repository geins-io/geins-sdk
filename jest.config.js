// global config for jest
/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: 'node',
  roots: ['<rootDir>/packages/sdk'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'gql', 'graphql'],
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
