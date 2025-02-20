import type { CodegenConfig } from '@graphql-codegen/cli';
const config: CodegenConfig = {
  schema: '../../../schemas/schema-w-docblocks.graphql',
  documents: ['../core/src/graphql/**/*.gql', '../cms/src/graphql/**/*.gql', '../crm/src/graphql/**/*.gql'],
  generates: {
    'src/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-operations', 'jsdoc'],
      config: {
        typesPrefix: 'Geins',
        typesSuffix: 'Type',
        addDocBlocks: true,
        printFieldsOnNewLines: true,
        declarationKind: 'interface',
        skipTypename: true,
        useTypeImports: true,
        preResolveTypes: true,
        flattenGeneratedTypes: true,
        flattenGeneratedTypesIncludeFragments: true,
        avoidOptionals: false,
        allowUndefinedQueryVariables: true,
        //globalNamespace: 'Geins',
        //directiveArgumentAndInputFieldMappingTypeSuffix: 'DirectiveArgs',
        extractAllFieldsToTypes: false,
        omitOperationSuffix: true,
        //operationResultSuffix: 'Result',
        // namingConvention: 'change-case-all#camelCase',
        enumPrefix: true,
        enumSuffix: false,

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
