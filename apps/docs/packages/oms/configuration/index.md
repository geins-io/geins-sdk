---
title: Configuration (CPQ)
description: How to configure a product, commit it and put it in a cart with the Geins OMS Package
tags:
  - sdk
  - oms
  - configuration
  - cpq
---

# Configuration (CPQ)

## Overview

The `ConfigurationService` is the CPQ (configure, price, quote) area of the merchant API. A buyer configures a product in a session, the session is committed at its current price, and the committed configuration goes into the cart as a line of its own. The service also reads what a configured line carries on a cart and on an order.

Reach it through `geinsOMS.configuration`:

```typescript
import { GeinsCore } from '@geins/core';
import { GeinsOMS } from '@geins/oms';

const geinsCore = new GeinsCore(mySettings);
const geinsOMS = new GeinsOMS(geinsCore);

const configuration = await geinsOMS.configuration.create(
  { articleNumber: 'ABC-123', quantity: 1 },
  { userToken },
);
```

Every method takes an optional `requestContext` (language, market, channel and `userToken`) and an optional `options` object with a per-call timeout, see [Call options](#call-options).

### Before you start

- **CPQ is enabled on the account.** Without it, every call fails with `NotAvailable`.
- **The buyer is signed in, and their company has an ERP customer number.** Pass the buyer's `userToken` on every call, `create` included. A signed-out buyer, or a company without a customer number, gets `MissingCustomerNumber`.
- **Every call passes the same channel, market and language.** The API settles a session's customer and currency when the session is created; a later call in a market with another currency is refused with `ConfigurationCurrencyMismatch`.

The [CPQ guide](https://www.geins.io/developers/guides/working-with-configurations) describes the API behind this service in full.

What the SDK itself does on every call:

- **Stateless.** Like the cart service, it holds no per-request state, so one instance can serve concurrent requests.
- **No cache.** Every call bypasses the Apollo cache. A session's nodes carry template ids that repeat across sessions, so normalising them would mix one session into another.
- **No retry on a mutation.** A configured add sent twice is two cart lines, because configured lines never merge, so a mutation is sent once.
- **`null` for a missing answer.** A method answers `null` when the response does not hold what it asked for, for example a session without an id.
- **One error type.** Every failure from the API is thrown as a `ConfigurationError` carrying the API's own codes, see [Errors](#errors).

## Types

The inputs, and the shapes the methods answer, all from `@geins/types`:

```typescript [@geins/types]
/** One change in a batch. */
type ConfigurationChangeInputType =
  | { type: 'VARIABLE'; variableId: string; value: ConfigurationValue }
  | {
      type: 'OPTION';
      optionId: string;
      instanceId?: string;
      selected?: boolean;
      quantity?: number;
      lock?: 'NONE' | 'LOCK' | 'UNLOCK';
    }
  | { type: 'QUANTITY'; quantity: number };

type ConfigurationValue = string | number | boolean | null;

type ConfiguredCartItemInputType = {
  skuId: number;
  quantity: number;
  configurationId: string; // the committed id
};

type ConfiguredCartItemUpdateInputType = {
  id: string; // the cart line's id
  quantity: number;
  configurationId: string; // the new committed id
};

type ConfigurationCallOptions = {
  timeoutMs?: number;
};

/** A configuration session: the whole re-evaluated document. */
type ConfigurationType = {
  configurationId: string;
  expiresAt: string;
  isValid: boolean;
  articleNumber: string | null;
  quantity: number | null;
  unitPrice: PriceType | null;
  discountPercent: number | null;
  weightPerUnit: number | null;
  templateId: string | null;
  templateVersion: string | null;
  messages: ConfigurationMessageType[];
  sections: ConfigurationSectionType[];
};

/** What a commit answers. */
type CommittedConfigurationType = {
  committedConfigurationId: string;
  configurationId: string | null;
  articleNumber: string | null;
  quantity: number | null;
  unitPrice: PriceType | null;
  discountPercent: number | null;
  weightPerUnit: number | null;
  summary: ConfigurationSummaryLineType[];
};

type ConfigurationRenewalType = {
  expiresAt: string;
};

type ConfigurationSummaryLineType = {
  label: string | null;
  value: string | null;
};

/** The committed configuration a cart line is, as the line carries it. */
type CartItemConfigurationType = {
  committedConfigurationId?: string; // the line's configurationId; absent on an order
  articleNumber?: string; // the configured product's article number
  discountPercent?: number; // the discount the ERP applied at commit, in percent
  weightPerUnit?: number; // the weight of one configured product, in the ERP's own unit
  summary: ConfigurationSummaryLineType[];
  sections?: CommittedConfigurationSectionType[];
};

type ConfiguredCartLinesType = {
  id: string | null;
  items: {
    id: string | null;
    quantity: number | null;
    configurationId: string | null;
    configuration: CartItemConfigurationType | null;
  }[];
};

type ConfiguredOrderLinesType = {
  items: ({
    product: { productId: number | null; type: string | null } | null;
    configuration: CartItemConfigurationType | null;
  } | null)[];
};

type CommittedOrderLinesType = {
  items: ({
    product: { productId: number | null } | null;
    configuration: { sections: CommittedConfigurationSectionType[] | null } | null;
  } | null)[];
};
```

A session's `sections` hold its variables and option groups, and option groups hold options. Variables and options carry `available`, `readOnly`, their `selectionSource` and their own `messages`; option groups carry `available` and `messages`, sections `visible` and `messages`. A UI can follow the rules the provider applied from these without knowing them:

- **Order:** sort a parent's sections, variables and option groups together on `sortIndex`, nulls last. The SDK keeps the order the API answered, and when every `sortIndex` is `null`, keep that order.
- **Visibility:** hide a section whose `visible` is `false`; disable a variable, option group or option whose `available` is `false`.
- **Read-only:** a variable or option with `readOnly: true` cannot be edited, and a change to it is refused. A `LOCK` you send yourself does not make an option read-only.
- **Lock:** a `LOCK` keeps the option from being changed by later rule cascades.
- **Option groups:** `minSelections` and `maxSelections` give the selection rules (`maxSelections: 1` is single-select); `quantityEditable`, with `minQuantity` and `maxQuantity`, says whether and how far a quantity can change.
- **Add to cart:** enable it only when the session's `isValid` is `true`.
- **Option prices:** `option.unitPrice` is the ERP price the cart charges. `option.product` is the matching Geins catalogue product, often `null`, and its own price is not the CPQ price.

The guide's [rendering rules](https://www.geins.io/developers/guides/working-with-configurations#2-render-the-tree) give them in full. A committed section (`CommittedConfigurationSectionType`) holds only what the buyer saw and chose. The full node types are in `packages/sdk/types/src/oms/configuration.ts`: `ConfigurationSectionType`, `ConfigurationVariableType`, `ConfigurationOptionGroupType`, `ConfigurationOptionType` and their committed counterparts.

Lists are never `null` and hold no `null` rows, with two exceptions in the order reads: `items` keeps a `null` row in its place (see [Orders](#orders)), and a committed row's `sections` is `null` when the structure was not recorded. Ids stay nullable as the schema declares them. Enum values such as `selectionSource` are typed as the known members but can be any string, so a value added in the API reaches you unchanged.

## Lifecycle

A configured product goes from a session to a cart line in four calls:

1. **`create`** opens a session for a product and answers its first evaluated state.
2. **`applyChanges`** sends the buyer's choices as a batch and answers the whole re-evaluated document. Repeat it as often as the buyer changes something.
3. **`commit`** freezes the session at its current price and answers a committed id.
4. **`addCartItem`** puts the committed id in the cart as a line of its own.

A cart line carries the committed id, not the session id, because a cart outlives a session. Three ids are in play:

| Id                                          | What it is                                                                  | Comes from                 | Taken by                                                 |
| ------------------------------------------- | --------------------------------------------------------------------------- | -------------------------- | -------------------------------------------------------- |
| Session id (`configurationId` on a session) | A live session, until its `expiresAt`                                       | `create`, `reopenCartItem` | `get`, `applyChanges`, `commit`, `renew`, `delete`       |
| Committed id (`committedConfigurationId`)   | The configuration frozen at commit, with its price; it outlives the session | `commit`                   | `addCartItem` and `updateCartItem`, as `configurationId` |
| Cart line id (`id` on a cart line)          | The line, as long as it is in the cart                                      | The cart                   | `updateCartItem` (`id`), `reopenCartItem` (`itemId`)     |

The ERP sets a configured product's price net of VAT. The API works out the inc-VAT side from the configured article's VAT rate in the market, and it equals the net where the configured article carries no VAT rate.

A session expires at its `expiresAt`. `renew` pushes the expiry out: renew while the buyer is active, and `delete` the session when the buyer leaves, as the guide's [session lifetime](https://www.geins.io/developers/guides/working-with-configurations#3-apply-changes) says. Once a session has expired, been deleted or been committed, reading it afterwards answers `ConfigurationGone`.

To change a configured line already in the cart:

1. **`reopenCartItem`** opens a new session from the line's committed configuration, at the line's quantity and at today's price.
2. **`applyChanges`** and **`commit`** as above.
3. **`updateCartItem`** puts the new committed id on the line.

Until `updateCartItem`, the API keeps the line on the configuration it already has, so a buyer who abandons the edit loses nothing.

To change a configured line's quantity at the right price, take the same three steps with a `QUANTITY` change, and pass `updateCartItem` the new committed `quantity`. The cart quantity should match the committed one: the committed price was quoted for it.

```typescript
const session = await geinsOMS.configuration.create({ productId: 1001, quantity: 1 }, { userToken });
if (!session) throw new Error('No session');

const evaluated = await geinsOMS.configuration.applyChanges(
  session.configurationId,
  [{ type: 'VARIABLE', variableId: 'width', value: 1200 }],
  { userToken },
);

if (evaluated?.isValid) {
  const committed = await geinsOMS.configuration.commit(session.configurationId, { userToken });
  if (committed) {
    await geinsOMS.configuration.addCartItem(
      cartId,
      { skuId: 5001, quantity: committed.quantity ?? 1, configurationId: committed.committedConfigurationId },
      { userToken },
    );
  }
}
```

Add the line at the committed `quantity`: the committed price was quoted for it.

## Sessions

### Create

```typescript
create(
  input: { productId?: number; articleNumber?: string; quantity: number },
  requestContext?: RequestContext,
  options?: ConfigurationCallOptions,
): Promise<ConfigurationType | null>
```

Opens a session for a product, named by its Geins `productId` or its `articleNumber` (one of the two, not both), and answers its first evaluated state. The API settles the session's customer and currency here; no later call moves them.

```typescript
const session = await geinsOMS.configuration.create({ articleNumber: 'ABC-123', quantity: 2 }, { userToken });
```

### Get

```typescript
get(
  configurationId: string,
  requestContext?: RequestContext,
  options?: ConfigurationCallOptions,
): Promise<ConfigurationType | null>
```

Reads a live session in full. A session that has run out answers `ConfigurationGone`, which the API keeps apart from an id that never existed (`ConfigurationNotFound`).

```typescript
const session = await geinsOMS.configuration.get(configurationId, { userToken });
```

### Apply changes

```typescript
applyChanges(
  configurationId: string,
  changes: ConfigurationChangeInputType[],
  requestContext?: RequestContext,
  options?: ConfigurationCallOptions,
): Promise<ConfigurationType | null>
```

Applies a batch of changes in order and answers the whole re-evaluated document. The API applies the whole batch or none of it. Replace what you hold with the answer rather than merging into it.

A change acts on one of three things:

- `VARIABLE` sets a variable's `value`.
- `OPTION` selects or deselects an option by `optionId` and `instanceId`, optionally with a `quantity` and a `lock`. Without `instanceId`, the change acts on the option's only instance; send it when an option has several. `selected` may be left out when `quantity` or a `lock` of `LOCK` or `UNLOCK` is sent, and the selection is then kept; with none of them (or `lock: 'NONE'`), the API refuses with `ConfigurationFailed`.
- `QUANTITY` sets how many of the configured product are ordered.

```typescript
const session = await geinsOMS.configuration.applyChanges(
  configurationId,
  [
    { type: 'VARIABLE', variableId: 'width', value: 1200 },
    { type: 'OPTION', optionId: 'handle', instanceId: '1', selected: true, quantity: 2 },
    { type: 'QUANTITY', quantity: 3 },
  ],
  { userToken },
);
```

### Renew

```typescript
renew(
  configurationId: string,
  requestContext?: RequestContext,
  options?: ConfigurationCallOptions,
): Promise<ConfigurationRenewalType | null>
```

Pushes a session's expiry out and answers the new one.

```typescript
const renewal = await geinsOMS.configuration.renew(configurationId, { userToken });
console.log(renewal?.expiresAt);
```

### Commit

```typescript
commit(
  configurationId: string,
  requestContext?: RequestContext,
  options?: ConfigurationCallOptions,
): Promise<CommittedConfigurationType | null>
```

Freezes the session at its current price and answers the committed configuration. Its `committedConfigurationId` is what a cart line's `configurationId` carries; `summary` is the buyer's selections as one line each.

In a market whose currency is not the session's, the API commits anyway and answers `ConfigurationCurrencyMismatch`. The error's `data` holds the committed configuration, without a price; see [Data with an error](#data-with-an-error).

```typescript
const committed = await geinsOMS.configuration.commit(configurationId, { userToken });
const lineConfigurationId = committed?.committedConfigurationId;
```

### Delete

```typescript
delete(
  configurationId: string,
  requestContext?: RequestContext,
  options?: ConfigurationCallOptions,
): Promise<boolean | null>
```

Abandons a session and answers whether it was released. Reading it afterwards answers `ConfigurationGone`.

```typescript
const released = await geinsOMS.configuration.delete(configurationId, { userToken });
```

### Reopen a cart line

```typescript
reopenCartItem(
  cartId: string,
  itemId: string,
  requestContext?: RequestContext,
  options?: ConfigurationCallOptions,
): Promise<ConfigurationType | null>
```

Opens a configured cart line's committed configuration again as a new session, at the line's quantity and at today's price. Commit that session and pass the new committed id to [`updateCartItem`](#swap-a-line-s-configuration); until then the line keeps the configuration it has. `ConfigurationNotReopenable` means the configuration cannot be revised: the buyer configures the product again from scratch.

```typescript
const session = await geinsOMS.configuration.reopenCartItem(cartId, cartLineId, { userToken });
```

## Configured cart lines

These methods work on the same cart as the [cart service](../cart/index.md), but answer only what a configured line needs: each line's id, quantity, committed id and configuration.

### Add a configured line

```typescript
addCartItem(
  cartId: string,
  item: ConfiguredCartItemInputType,
  requestContext?: RequestContext,
  options?: ConfigurationCallOptions,
): Promise<ConfiguredCartLinesType | null>
```

Adds a committed configuration to the cart as a line of its own and answers the cart's lines. `skuId` is the configured product's SKU; `configurationId` is the committed id from `commit`.

```typescript
const lines = await geinsOMS.configuration.addCartItem(
  cartId,
  { skuId: 5001, quantity: 1, configurationId: committed.committedConfigurationId },
  { userToken },
);
```

### Swap a line's configuration

```typescript
updateCartItem(
  cartId: string,
  item: ConfiguredCartItemUpdateInputType,
  requestContext?: RequestContext,
  options?: ConfigurationCallOptions,
): Promise<ConfiguredCartLinesType | null>
```

Puts a cart line, named by its `id`, on another committed configuration and answers the cart's lines. With `configurationId: ""` the line loses its configuration: it keeps `configurationId: ""` (not `null`) and reads `configuration: null`.

When the API refuses the new configuration, the line keeps the one it has, and the error's `data` holds the cart's lines, unchanged; see [Data with an error](#data-with-an-error).

```typescript
const lines = await geinsOMS.configuration.updateCartItem(
  cartId,
  { id: cartLineId, quantity: 1, configurationId: recommitted.committedConfigurationId },
  { userToken },
);
```

### Read the cart's configured lines

```typescript
getCartLines(
  cartId: string,
  requestContext?: RequestContext,
  options?: ConfigurationCallOptions,
): Promise<ConfiguredCartLinesType | null>
```

Answers the cart's lines, each with its committed id and configuration. An unconfigured line has `configurationId` and `configuration` set to `null`, and a line whose configuration was removed has `configurationId: ""`. A configured line added before the API copied configurations onto lines has its `configurationId` but `configuration: null`, so tell a configured line by its `configurationId`. The API copies the configuration onto the line when the line is added or updated, so this read makes no call to the provider. `configuration.sections` is absent on a line committed before the API recorded the structure; read `summary` then.

```typescript
const lines = await geinsOMS.configuration.getCartLines(cartId, { userToken });
const configured = lines?.items.filter((item) => !!item.configurationId) ?? [];
```

## Orders

Both order reads answer an order's rows **by position**: a `null` row keeps its place, so `items[i]` matches row `i` of the order read through the [order service](../order/index.md). An order row carries no committed id, so a reorder cannot reuse a price that is no longer quotable. The API reads the configuration from the provider with the order, and answers `null` for it where the provider could not answer.

### Read an order's configured lines

```typescript
getOrderLines(
  publicOrderId: string,
  requestContext?: RequestContext,
  options?: ConfigurationCallOptions,
): Promise<ConfiguredOrderLinesType | null>
```

Answers each row's product id and product type, and, when the row is configured, its configuration: the `summary`, and the committed `sections` where the API recorded them.

**Deprecated.** The order read [`order.get`](../order/get.md#configured-rows) carries each row's product type and configuration itself, so this second read of the order is no longer needed.

```typescript
const order = await geinsOMS.configuration.getOrderLines(publicOrderId, { userToken });
order?.items.forEach((row, position) => {
  row?.configuration?.summary.forEach(({ label, value }) => console.log(position, label, value));
});
```

### Read the choices an order line was committed with

```typescript
getOrderLineChoices(
  publicOrderId: string,
  requestContext?: RequestContext,
  options?: ConfigurationCallOptions,
): Promise<CommittedOrderLinesType | null>
```

Answers each row's product id and the structure its configuration was committed with: sections, variables with their committed values, and the selected options with their quantities and prices. `sections` is `null` for a row committed before the API recorded the structure.

```typescript
const choices = await geinsOMS.configuration.getOrderLineChoices(publicOrderId, { userToken });
const firstRowSections = choices?.items[0]?.configuration?.sections ?? [];
```

## Call options

Every method takes `options` last. `timeoutMs` sets this call's deadline in milliseconds, over the client's own:

```typescript
const session = await geinsOMS.configuration.get(configurationId, { userToken }, { timeoutMs: 5000 });
```

## Errors

Every failure from the API (a GraphQL error, a non-2xx answer, a timeout or a network error) is a `ConfigurationError` from `@geins/core`; a settings error such as a missing language or market is a `GeinsError`. Its `code` is `GeinsErrorCode.CONFIGURATION_FAILED`; the API's own codes are carried as sent rather than mapped, so you can branch on a code the SDK does not know yet.

```typescript
class ConfigurationError<TData = unknown> extends GeinsError {
  readonly providerErrors: { code?: ConfigurationErrorCode; message: string }[];
  /** Every provider code in the answer, in order. */
  readonly providerCodes: ConfigurationErrorCode[];
  /** The first provider code, if any. */
  readonly providerCode?: ConfigurationErrorCode;
  /** The message of the first GraphQL error, if any. */
  readonly providerMessage?: string;
  readonly status?: number;
  /** What the API answered alongside the errors, parsed as the method answers it. */
  readonly data?: TData;
}
```

Check with `isConfigurationError`, not `instanceof`: the SDK is built for ES5, where an `Error` subclass is a plain `Error` at run time.

```typescript
import { isConfigurationError } from '@geins/core';

try {
  await geinsOMS.configuration.get(configurationId, { userToken });
} catch (error) {
  if (isConfigurationError(error) && error.providerCode === 'ConfigurationGone') {
    // The session expired or was finished: start a new one.
  }
}
```

The codes the API is known to send. Any other string can arrive.

| Code                                          | What it means                                                                                               | What to do                                                                                       |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `NotAvailable`                                | CPQ is not enabled on the account.                                                                          | Hide the configurator.                                                                           |
| `MissingCustomerNumber`                       | No customer to settle the session on: the buyer is signed out, or their company has no ERP customer number. | Ask the buyer to sign in; otherwise the account needs setting up.                                |
| `InvalidProductReference` / `ProductNotFound` | `create` named no product it can configure, by `productId` or `articleNumber`.                              | Fix the input.                                                                                   |
| `ConfigurationNotFound`                       | No session or committed configuration has this id.                                                          | Start a new session.                                                                             |
| `ConfigurationGone`                           | The session existed but is finished: it expired, was deleted, or was committed.                             | Start a new session.                                                                             |
| `ConfigurationFailed`                         | The provider refused the request, for example a change in `applyChanges`; `providerMessage` says which.     | Change the input. A refused change fails the same way on every retry.                            |
| `ConfigurationCurrencyMismatch`               | The session is priced in another currency than the call's market.                                           | Open a new session in this market.                                                               |
| `ConfigurationMismatch`                       | The committed configuration is not for the article of the cart line's SKU.                                  | Add with the configured article's SKU, or swap the line onto a configuration of its own article. |
| `LoginRequired`                               | The cart holds a configured line and needs a signed-in buyer to be read.                                    | Ask the buyer to sign in.                                                                        |
| `ConfigurationNotReopenable`                  | The cart line's configuration cannot be opened again.                                                       | Configure the product again from scratch.                                                        |
| `CartItemNotConfigured`                       | The cart line carries no configuration.                                                                     | Read the cart again; there is nothing to reopen.                                                 |
| `CartBelongsToAnotherCompany`                 | The cart belongs to another company than the signed-in buyer's.                                             | Read the buyer's own cart again.                                                                 |

### Data with an error

Some refusals come with an answer. The SDK still throws, and the error's `data` holds that answer, parsed as the method answers it; `data` is absent when the API answered nothing. `TData` is the method's own answer type, which `isConfigurationError` takes as a parameter.

| Method           | `data` with the error                                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `updateCartItem` | The cart's lines, unchanged, when the new configuration is refused (`ConfigurationMismatch`, `ConfigurationNotFound`). |
| `commit`         | The committed configuration without a price, with `ConfigurationCurrencyMismatch`: the API committed anyway.           |

```typescript
import { isConfigurationError } from '@geins/core';
import type { ConfiguredCartLinesType } from '@geins/types';

try {
  await geinsOMS.configuration.updateCartItem(
    cartId,
    { id: cartLineId, quantity: 1, configurationId },
    { userToken },
  );
} catch (error) {
  if (isConfigurationError<ConfiguredCartLinesType>(error) && error.data) {
    // The line kept its configuration: show the cart as it is.
    renderCart(error.data.items);
  }
}
```
