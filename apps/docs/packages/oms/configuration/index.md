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

Every method takes an optional `requestContext` (language, market, channel and `userToken`) and an optional `options` object with a per-call timeout, see [Call options](#call-options). The API settles a session's customer and currency when the session is created, so pass the signed-in buyer's `userToken` from `create` on.

What the SDK itself does on every call:

- **Stateless.** Like the cart service, it holds no per-request state, so one instance can serve concurrent requests.
- **No cache.** Every call bypasses the Apollo cache. A session's nodes carry template ids that repeat across sessions, so normalising them would mix one session into another.
- **No retry on a mutation.** A commit or a configured add sent twice would be two lines, so a mutation is sent once.
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
      instanceId: string;
      selected: boolean;
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

A session's `sections` hold its variables and option groups, and option groups hold options. Variables and options carry `available`, `readOnly`, their `selectionSource` and their own `messages`; option groups carry `available` and `messages`, sections `visible` and `messages`. A UI can follow the rules the provider applied from these without knowing them. A committed section (`CommittedConfigurationSectionType`) holds only what the buyer saw and chose. The full node types are in `packages/sdk/types/src/oms/configuration.ts`: `ConfigurationSectionType`, `ConfigurationVariableType`, `ConfigurationOptionGroupType`, `ConfigurationOptionType` and their committed counterparts.

Lists are never `null` and hold no `null` rows, with two exceptions in the order reads: `items` keeps a `null` row in its place (see [Orders](#orders)), and a committed row's `sections` is `null` when the structure was not recorded. Ids stay nullable as the schema declares them. Enum values such as `selectionSource` are typed as the known members but can be any string, so a value added in the API reaches you unchanged.

## Lifecycle

A configured product goes from a session to a cart line in four calls:

1. **`create`** opens a session for a product and answers its first evaluated state.
2. **`applyChanges`** sends the buyer's choices as a batch and answers the whole re-evaluated document. Repeat it as often as the buyer changes something.
3. **`commit`** freezes the session at its current price and answers a committed id.
4. **`addCartItem`** puts the committed id in the cart as a line of its own.

A cart line carries the committed id, not the session id, because a cart outlives a session.

A session expires at its `expiresAt`. `renew` pushes the expiry out. Once a session has expired, been deleted or been committed, reading it afterwards answers `ConfigurationGone`.

To change a configured line already in the cart:

1. **`reopenCartItem`** opens a new session from the line's committed configuration, at the line's quantity and at today's price.
2. **`applyChanges`** and **`commit`** as above.
3. **`updateCartItem`** puts the new committed id on the line.

Until `updateCartItem`, the API keeps the line on the configuration it already has, so a buyer who abandons the edit loses nothing.

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
      { skuId: 5001, quantity: 1, configurationId: committed.committedConfigurationId },
      { userToken },
    );
  }
}
```

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
- `OPTION` selects or deselects an option by `optionId` and `instanceId`, optionally with a `quantity` and a `lock`.
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

Opens a configured cart line's committed configuration again as a new session, at the line's quantity and at today's price. Commit that session and pass the new committed id to [`updateCartItem`](#swap-a-line-s-configuration); until then the line keeps the configuration it has.

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

Puts a cart line, named by its `id`, on another committed configuration and answers the cart's lines.

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

Answers the cart's lines, each with its committed id and configuration. An unconfigured line has `configurationId` and `configuration` set to `null`. A configured line added before the API copied configurations onto lines has its `configurationId` but `configuration: null`, so tell a configured line by its `configurationId`. The API copies the configuration onto the line when the line is added or updated, so this read makes no call to the provider. `configuration.sections` is absent on a line committed before the API recorded the structure; read `summary` then.

```typescript
const lines = await geinsOMS.configuration.getCartLines(cartId, { userToken });
const configured = lines?.items.filter((item) => item.configurationId !== null) ?? [];
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
class ConfigurationError extends GeinsError {
  readonly providerErrors: { code?: ConfigurationErrorCode; message: string }[];
  /** Every provider code in the answer, in order. */
  readonly providerCodes: ConfigurationErrorCode[];
  /** The first provider code, if any. */
  readonly providerCode?: ConfigurationErrorCode;
  /** The message of the first GraphQL error, if any. */
  readonly providerMessage?: string;
  readonly status?: number;
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

| Code                          | What it means                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------------- |
| `ConfigurationNotFound`       | No session has this id.                                                                                 |
| `ConfigurationGone`           | The session existed but is finished: it expired, was deleted, or was committed.                         |
| `MissingCustomerNumber`       | The session has no customer to settle on, for example a `create` without a signed-in buyer.             |
| `ConfigurationFailed`         | The provider refused the request, for example a change in `applyChanges`; `providerMessage` says which. |
| `ConfigurationMismatch`       | The committed configuration is not for the article it was added with.                                   |
| `LoginRequired`               | The cart holds a configured line and needs a signed-in buyer to be read.                                |
| `ConfigurationNotReopenable`  | The cart line's configuration cannot be opened again.                                                   |
| `CartItemNotConfigured`       | The cart line carries no configuration.                                                                 |
| `CartBelongsToAnotherCompany` | The cart belongs to another company than the signed-in buyer's.                                         |
