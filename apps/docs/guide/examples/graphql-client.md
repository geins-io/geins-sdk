# Get data from the Merchant API with the GraphQLClient

## Accessing the GraphQLClient

Once you have an instance of GeinsCore (refer to the [initialization guide](../../packages/core/)), you can access the `GraphQLClient` through the graphql property.

```typescript
const graphqlClient = geinsCore.graphql;
```

## Getting data when customer is logged in

To get data from the Merchant API when the customer is logged in, you need to pass the customer token in the request headers. You can get the customer token from the `GeinsCore` instance.

```typescript
const customerToken = geinsCore.customerToken;
```
