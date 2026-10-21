---
'@geins/types': patch
'@geins/core': patch
'@geins/oms': patch
---

Keep the code of a refused order.

`checkout.createOrder` still answers a refused order with `{ created: false, message }`, and now adds
`code` when Geins sent an `extensions.code` with the refusal (for example `INVALID_IDENTITY_NUMBER`).
Before this, the code was dropped and only the message was left. Many refusals carry no code, such as
validation errors, so `code` is optional. `CreateOrderResponseType` gets `code?: string`, and
`@geins/core` exports `graphQLErrorCode(error)`, which reads the first code from a failed call's
GraphQL errors. A placed order is answered as before.
