---
'@geins/types': patch
'@geins/core': patch
'@geins/cms': patch
'@geins/crm': patch
'@geins/oms': patch
---

Stop server-side mutations from filling the Apollo cache.

A mutation now uses the `fetchPolicy` its caller asks for (`no-cache` or `network-only`).
With nothing asked, it is `no-cache` on the server, as queries already are, and `network-only`
in the browser as before. Until now every mutation ran `network-only`, so on a server each cart,
checkout and CRM mutation wrote its result into the shared client's cache, and nothing evicted it.

Browser change: the cart and checkout services already ask for `no-cache`, so their mutations in
the browser no longer write to the cache either. Their queries were already `no-cache`, so nothing
read those writes.
