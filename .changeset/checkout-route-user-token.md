---
"@geins/oms": patch
---

Route `userToken` through every checkout mutation so the Merchant API
receives the `Authorization: Bearer ...` header on `placeOrder`,
`get`, `validate`, `validateOrder`, and `summary`.

Checkout methods previously spread the `RequestContext` straight into
GraphQL variables. `createVariables` strips `userToken` (it is an auth
concern, not a GraphQL field), but checkout methods never re-attached
it to the request options, so checkout mutations including `placeOrder`
ran unauthenticated even when callers supplied a userToken. This left
Geins unable to identify the buyer for user-scoped behaviour the
checkout pipeline relies on (CRM price lists, restricted product
access, etc), and orders fell back to anonymous pricing on the order
line even though the cart line was correct.

Checkout methods now build their options through a `buildOptions`
helper that mirrors the one introduced for cart in
`fix(oms): route userToken through cart mutations`: it extracts the
userToken and attaches it to the top-level `userToken` option (where
the API client picks it up for the Authorization header) while merging
the remaining context fields into the variables. Affected methods:
`get`, `validate`, `validateOrder`, `createOrder` (the `placeOrder`
GraphQL mutation), `summary`.
