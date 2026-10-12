---
'@geins/types': patch
'@geins/core': patch
'@geins/cms': patch
'@geins/crm': patch
'@geins/oms': patch
---

Read each order row's configuration and product type in the order read.

The order read (`order.get`) now selects, on each row, the line configuration through
`OmsCartItemConfiguration` (`configurationId`, `configuration.summary` and the committed
`configuration.sections`) and the product's `type`:

```graphql
items {
  product {
    type
  }
}
```

`CartItemProductType` gets `type?: string`, the Geins product type (`product`, `configurable`).
Only the order read selects it; every cart read leaves it `undefined`. A configured row is one
whose `product.type` is `configurable`. Its `configuration` is `undefined` when the API could not
read it from the provider, so never tell a configured row by its `configuration`. A row that is not
configured reads `configuration` as `undefined` too. An order row has no committed id, so
`configurationId` is `undefined` on every order row.

On an account with CPQ, the order read now includes the configuration read from the provider, so
it can take longer than before. There is no option to leave it out.

`configuration.getOrderLines` is deprecated: it reads the same fields with a second
`getOrderPublic` call. `configuration.getOrderLineChoices` is unchanged. This replaces the 0.11.1
note that the order read stays on `configuration.getOrderLines`.
