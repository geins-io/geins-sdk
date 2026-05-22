---
"@geins/types": patch
"@geins/core": patch
"@geins/cms": patch
"@geins/crm": patch
"@geins/oms": patch
---

Surface `availableChannels` on the user response from `crm.user.get()`.

The merchant API exposes `UserType.availableChannels` returning the channels
a buyer is authorized to use, with the markets allowed per channel and each
market's currency. Storefronts need this on login to switch the active
market to one the buyer is permitted on. Passing a channel or market the
buyer is not allowed to use can return empty or invalid catalog responses,
which is the failure mode B2B portals were hitting when the active market
mismatched the company's pricelist currency.

The user GraphQL fragment now selects:

```graphql
availableChannels {
  channelId
  availableMarkets {
    id
    alias
    currency { code }
  }
}
```

`UserChannelType` is added to the schema and `availableChannels` is
exposed on `GeinsUserTypeType` via the generated types.
