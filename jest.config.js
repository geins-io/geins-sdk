// Root jest.config.js
/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: 'node',
  roots: ['<rootDir>/packages/sdk'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node',
    'gql',
    'graphql',
  ],
  transform: {
    // Use ts-jest with configuration settings directly in the transform object
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json', // Specify the path to your TypeScript config
      },
    ],
    '^.+\\.(gql|graphql)$': 'jest-transform-stub', // Use jest-transform-stub for .gql and .graphql files
  },
  moduleNameMapper: {
    '\\.(gql|graphql)$': 'jest-transform-stub',
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
};
