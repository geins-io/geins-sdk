---
'@geins/core': patch
'@geins/oms': patch
'@geins/cms': patch
'@geins/types': patch
---

Let one call set its own request timeout, or none.

- A per-call `timeoutMs` of `0` in the request context now means no timeout for that call, instead of the client's limit. A positive value still takes precedence over the client's, and no value still uses it.
- `checkout.createOrder` sends `0`: an order the merchant API places after the client gave up would otherwise read as failed.
- `menu.get`, `area.get` and `page.get` take an optional third argument, `{ timeoutMs }` (`GeinsCallOptions`), passed in the request context.
