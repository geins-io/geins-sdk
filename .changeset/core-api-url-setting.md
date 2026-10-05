---
"@geins/types": patch
"@geins/core": patch
"@geins/cms": patch
"@geins/crm": patch
"@geins/oms": patch
---

Add an optional `apiUrl` to `GeinsSettings` for the merchant API GraphQL endpoint.

It defaults to `https://merchantapi.geins.io/graphql`, so nothing changes unless
it is set. When set, every GraphQL call (core, channel, CMS, CRM, OMS) goes to
that URL. `buildEndpoints` takes it as an optional fourth argument.

Known limit: only the GraphQL endpoint moves. Sign-in (`/auth/sign`) and
redirect history (`/redirect/urlhistory`, `/redirect/aliashistory`) stay on
the default host.
