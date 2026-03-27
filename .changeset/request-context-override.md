---
"@geins/types": patch
"@geins/core": patch
"@geins/oms": patch
"@geins/cms": patch
"@geins/crm": patch
---

Add RequestContext for per-request locale/market overrides

All service methods across OMS (cart, checkout, orders), CMS (menus, content areas, pages), and CRM (users, password reset, user orders) now accept an optional `requestContext` parameter. This allows multi-tenant server-side applications to override the SDK instance's default `languageId`, `marketId`, and `channelId` on a per-request basis.

**Non-breaking change** — the `requestContext` parameter is optional on all methods. Existing consumers require zero changes.

```typescript
import type { RequestContext } from '@geins/types';

// Override locale for this specific request
const ctx: RequestContext = { languageId: 'sv-SE', marketId: 'se' };
await oms.cart.addItem(cartId, item, ctx);
await oms.checkout.createOrder(options, ctx);
await cms.menu.get('main', ctx);
```
