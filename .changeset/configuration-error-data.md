---
'@geins/core': patch
'@geins/oms': patch
'@geins/types': patch
---

Keep the data the merchant API answers alongside a configuration error.

A refused `updateCartItem` answers the cart's lines, unchanged, and a commit in a market of another
currency than the session's answers the committed configuration without a price, both together
with the error. `ConfigurationError` now carries that answer as `data`, parsed as the method
answers it, and takes the method's answer type as a parameter: `ConfigurationError<TData>`, with
`isConfigurationError<TData>()` to narrow to it. `providerErrors`, `providerCodes`,
`providerCode` and `providerMessage` are unchanged, and so is `status` for a 2xx answer. A query
whose non-2xx answer carries data now reports that status (for example 400) instead of none, as
mutations already did. For an answer with errors and a 2xx status, the `cause` is an `ApolloError`
built from those errors rather than the one Apollo threw; its message is the same.

The configuration service reads every answer with Apollo's `errorPolicy: 'all'`, still without the
cache, so nothing from an answer with errors is stored. `RequestOptions` takes an `errorPolicy`
that `runQuery` and `runMutation` pass to Apollo; without it nothing changes.

`ConfigurationErrorCode` gains `NotAvailable`, `InvalidProductReference`, `ProductNotFound` and
`ConfigurationCurrencyMismatch`.

A cart line's and an order row's `configuration`, as the cart service, `order.get` and the
configuration service read it, now carries `committedConfigurationId`, `articleNumber`, `discountPercent` and `weightPerUnit` as
optional fields of `CartItemConfigurationType`, each absent where the API answers none
(`committedConfigurationId` always is on an order).

An `OPTION` change in `ConfigurationChangeInputType` may leave out `instanceId`, and then acts on the
option's only instance. It may leave out `selected` when it sends a `quantity` or a `lock` of `LOCK`
or `UNLOCK`, as the API takes it.
