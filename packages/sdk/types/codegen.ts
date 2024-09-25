import type { CodegenConfig } from '@graphql-codegen/cli';
const config: CodegenConfig = {
  schema: '../../../schemas/schema-w-docblocks.graphql',
  documents: ['../core/src/graphql/**/*.gql', '../crm/src/graphql/**/*.gql'],
  generates: {
    'src/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-operations', 'jsdoc'],
      config: {
        // typesPrefix: 'I', # not now
        addDocBlocks: true,
        declarationKind: 'interface',
        skipTypename: true,
        useTypeImports: true,
        scalars: {
          ID: 'string | number',
          Int: 'number',
          Float: 'number',
          Long: 'number',
          String: 'string',
          Boolean: 'boolean',
          Guid: 'string',
          DateTime: 'string',
          Decimal: 'number',
        },
      },
    },
  },
};

export default config;
