---
'@geins/types': patch
'@geins/core': patch
'@geins/cms': patch
'@geins/crm': patch
'@geins/oms': patch
---

Read each cart line's configuration in the cart and checkout reads.

Every cart document of the cart service (`get`, `create`, `copy`, `complete`, `addItem`,
`updateItem`, `addPackageItem`, `updatePackageItem`, `setMerchantData`, `setPromotionCode`,
`setShippingFee`) and the checkout's cart (`checkout.get`, `createOrUpdateCheckout`) now select,
on each line:

```graphql
configurationId
configuration {
  summary {
    label
    value
  }
}
```

through the new `OmsCartItemConfiguration` fragment. `CartItemType` has both as optional fields:
`configurationId` and `configuration` (`CartItemConfigurationType`, `{ summary }`). A line that is
not configured answers `null` for both, which parses to `undefined`. A configuration committed with
an empty summary stays `{ summary: [] }`. A package entry from `groupCartItems` carries neither; each
of its rows keeps its own.

The order read (`order.get`) is unchanged: on an order, `configuration` is read from cpq with the
order, so it stays with `configuration.getOrderLines`. This replaces the 0.11.0 note that the cart
reads select no configuration.
