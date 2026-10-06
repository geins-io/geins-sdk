---
'@geins/types': minor
'@geins/core': minor
'@geins/cms': minor
'@geins/crm': minor
'@geins/oms': minor
---

Add the CPQ (configure, price, quote) area as `oms.configuration`.

`ConfigurationService` covers the configuration session (`create`, `get`, `applyChanges`, `renew`,
`commit`, `delete`, `reopenCartItem`), a configured cart line (`addCartItem`, `updateCartItem`,
`getCartLines`) and an order's configured rows (`getOrderLines`, `getOrderLineChoices`). Every call
runs without the Apollo cache, a mutation is never retried, and each call can take its own
`timeoutMs`. A failure is a `ConfigurationError` that carries every provider error as sent
(`providerErrors`, each with its `code` and `message`, plus `providerCodes`, `providerCode`,
`providerMessage` and `status`), whether it arrives with a 2xx or a non-2xx answer. Recognise one
with `isConfigurationError`: built for ES5, an `Error` subclass is a plain `Error` at run time, so
`instanceof ConfigurationError` cannot tell.

In `@geins/core`, a call's `requestOptions.context` now reaches the link chain. The timeout link
reads a per-call `timeoutMs` there, and the retry link skips an operation whose context sets
`retry: false`. Without them nothing changes.

The CPQ area is not on the default merchant API endpoint yet; set `apiUrl` to an endpoint that
serves it. The cart and order reads of the cart and order services are unchanged and select no
configuration.
