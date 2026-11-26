---
'@geins/types': minor
'@geins/cms': minor
---

Fetch a menu to an optional depth.

`MenuVariables` gains `depth`, the levels of menu items `menu.get` and `menu.getRaw` fetch,
counting the top items as 1. It defaults to 3, and a read without it sends the same query as
before. Any other depth nests the menu fragment's `children` field that many levels deep.

The SDK accepts 1–6. This is the SDK's own limit for navigation menus, not the API's: the
Merchant API itself refuses more than 60 levels (`MAX_DEPTH_EXCEEDED`, measured; not
documented). A depth outside 1–6, or one that is not an integer, throws a `GeinsError` with
`INVALID_ARGUMENT` before any request is sent.
