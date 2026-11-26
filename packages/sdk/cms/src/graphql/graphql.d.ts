// Both the build (@rollup/plugin-graphql) and the tests (@graphql-tools/jest-transform)
// import a .gql file as a parsed document.
declare module '*.graphql' {
  const value: import('graphql').DocumentNode;
  export default value;
}
declare module '*.gql' {
  const value: import('graphql').DocumentNode;
  export default value;
}
