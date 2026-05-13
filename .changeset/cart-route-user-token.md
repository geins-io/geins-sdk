---
'@geins/cms': patch
'@geins/core': patch
'@geins/crm': patch
'@geins/oms': patch
'@geins/types': patch
---

Route `userToken` through cart mutations so the Merchant API receives the
`Authorization: Bearer ...` header on every cart operation.

Cart methods previously spread the `RequestContext` straight into GraphQL
variables. `createVariables` strips `userToken` (it is an auth concern, not a
GraphQL field), but cart methods never re-attached it to the request options,
so cart mutations ran unauthenticated even when callers supplied a userToken.
This left Geins unable to identify the buyer for any user-scoped behaviour the
cart pipeline relies on (price lists, restricted product access, etc).

Cart methods now build their options through a small `buildOptions` helper that
mirrors `createQueryOptions` from `BaseApiService`: it extracts the userToken
and attaches it to the top-level `userToken` option (where the API client picks
it up for the Authorization header) while merging the remaining context fields
into the variables. Affected methods: `create`, `get`, `complete`, `copy`,
`addItem`, `updateItem`, `deleteItem`, `addPackageItem`, `updatePackageItem`,
`setPromotionCode`, `removePromotionCode`, `setShippingFee`, `setMerchantData`.
