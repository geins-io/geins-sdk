import type {
  CartItemConfigurationType,
  CommittedConfigurationOptionGroupType,
  CommittedConfigurationSectionType,
  CommittedConfigurationType,
  CommittedOrderLinesType,
  ConfigurationMessageType,
  ConfigurationOptionGroupType,
  ConfigurationOptionProductType,
  ConfigurationOptionType,
  ConfigurationSectionType,
  ConfigurationSummaryLineType,
  ConfigurationType,
  ConfigurationValue,
  ConfigurationVariableType,
  ConfiguredCartLinesType,
  ConfiguredOrderLinesType,
  PriceType,
} from '@geins/types';

// ---------------------------------------------------------------------------
// The CPQ area as the merchant API sends it, normalised: a `Decimal` arrives
// as a number or a string depending on the serializer and becomes a number;
// null lists become empty and null rows are dropped, except an order's rows,
// which keep their place; `__typename` is stripped. Nothing is renamed, and a
// node without an id is kept: what to do with it is the caller's decision.
// ---------------------------------------------------------------------------

type Wire = Record<string, unknown>;

function record(value: unknown): Wire | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? (value as Wire) : null;
}

function rows(value: unknown): Wire[] {
  return Array.isArray(value) ? value.map(record).filter((row): row is Wire => row !== null) : [];
}

function decimal(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isNaN(number) ? null : number;
}

function text(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function int(value: unknown): number | null {
  return typeof value === 'number' ? value : null;
}

function flag(value: unknown): boolean {
  return value === true;
}

function cpqValue(value: unknown): ConfigurationValue {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ? value : null;
}

/** A copy without `__typename`, at every level. */
function withoutTypename<T>(value: unknown): T {
  if (Array.isArray(value)) return value.map((item) => withoutTypename(item)) as T;
  const object = record(value);
  if (!object) return value as T;
  return Object.keys(object).reduce<Wire>((copy, key) => {
    if (key !== '__typename') copy[key] = withoutTypename(object[key]);
    return copy;
  }, {}) as T;
}

function price(value: unknown): PriceType | null {
  return record(value) ? withoutTypename<PriceType>(value) : null;
}

function messages(value: unknown): ConfigurationMessageType[] {
  return rows(value).map((message) => ({
    severity: text(message.severity) ?? 'UNKNOWN',
    text: text(message.text),
  }));
}

function product(value: unknown): ConfigurationOptionProductType | null {
  const wire = record(value);
  if (!wire) return null;
  return {
    productId: int(wire.productId),
    name: text(wire.name),
    articleNumber: text(wire.articleNumber),
    alias: text(wire.alias),
    canonicalUrl: text(wire.canonicalUrl),
    productImages: rows(wire.productImages).map((image) => ({ fileName: text(image.fileName) })),
  };
}

function variable(wire: Wire): ConfigurationVariableType {
  return {
    id: text(wire.id),
    name: text(wire.name),
    description: text(wire.description),
    valueType: text(wire.valueType) ?? 'UNKNOWN',
    value: cpqValue(wire.value),
    defaultValue: cpqValue(wire.defaultValue),
    required: flag(wire.required),
    available: flag(wire.available),
    readOnly: flag(wire.readOnly),
    min: decimal(wire.min),
    max: decimal(wire.max),
    step: decimal(wire.step),
    decimals: int(wire.decimals),
    unit: text(wire.unit),
    selectionSource: text(wire.selectionSource) ?? 'UNKNOWN',
    valueSource: text(wire.valueSource) ?? 'UNKNOWN',
    sortIndex: int(wire.sortIndex),
    messages: messages(wire.messages),
  };
}

function option(wire: Wire): ConfigurationOptionType {
  return {
    id: text(wire.id),
    instanceId: text(wire.instanceId),
    articleNumber: text(wire.articleNumber),
    name: text(wire.name),
    description: text(wire.description),
    selected: flag(wire.selected),
    available: flag(wire.available),
    readOnly: flag(wire.readOnly),
    selectionSource: text(wire.selectionSource) ?? 'UNKNOWN',
    quantity: decimal(wire.quantity),
    defaultQuantity: decimal(wire.defaultQuantity),
    minQuantity: decimal(wire.minQuantity),
    maxQuantity: decimal(wire.maxQuantity),
    unitPrice: price(wire.unitPrice),
    discountPercent: decimal(wire.discountPercent),
    product: product(wire.product),
    messages: messages(wire.messages),
  };
}

function optionGroup(wire: Wire): ConfigurationOptionGroupType {
  return {
    id: text(wire.id),
    code: text(wire.code),
    name: text(wire.name),
    description: text(wire.description),
    available: flag(wire.available),
    minSelections: int(wire.minSelections),
    maxSelections: int(wire.maxSelections),
    minQuantity: decimal(wire.minQuantity),
    maxQuantity: decimal(wire.maxQuantity),
    quantityEditable: flag(wire.quantityEditable),
    sortIndex: int(wire.sortIndex),
    optionGroups: rows(wire.optionGroups).map(optionGroup),
    options: rows(wire.options).map(option),
    messages: messages(wire.messages),
  };
}

function section(wire: Wire): ConfigurationSectionType {
  return {
    id: text(wire.id),
    name: text(wire.name),
    description: text(wire.description),
    visible: flag(wire.visible),
    sortIndex: int(wire.sortIndex),
    sections: rows(wire.sections).map(section),
    variables: rows(wire.variables).map(variable),
    optionGroups: rows(wire.optionGroups).map(optionGroup),
    messages: messages(wire.messages),
  };
}

/** A configuration session's document; null when the answer holds none, or one without its id or expiry. */
export function parseConfiguration(value: unknown): ConfigurationType | null {
  const wire = record(value);
  const configurationId = text(wire?.configurationId);
  const expiresAt = text(wire?.expiresAt);
  if (!wire || configurationId === null || expiresAt === null) return null;
  return {
    configurationId,
    expiresAt,
    isValid: flag(wire.isValid),
    articleNumber: text(wire.articleNumber),
    quantity: decimal(wire.quantity),
    unitPrice: price(wire.unitPrice),
    discountPercent: decimal(wire.discountPercent),
    weightPerUnit: decimal(wire.weightPerUnit),
    templateId: text(wire.templateId),
    templateVersion: text(wire.templateVersion),
    messages: messages(wire.messages),
    sections: rows(wire.sections).map(section),
  };
}

/** A committed configuration's summary rows; a null row is dropped. */
export function parseConfigurationSummary(value: unknown): ConfigurationSummaryLineType[] {
  return rows(value).map((line) => ({ label: text(line.label), value: text(line.value) }));
}

function committedGroup(wire: Wire): CommittedConfigurationOptionGroupType {
  return {
    id: text(wire.id),
    code: text(wire.code),
    name: text(wire.name),
    sortIndex: int(wire.sortIndex),
    options: rows(wire.options).map((option) => ({
      id: text(option.id),
      instanceId: text(option.instanceId),
      articleNumber: text(option.articleNumber),
      name: text(option.name),
      quantity: decimal(option.quantity),
      unitPrice: price(option.unitPrice),
      discountPercent: decimal(option.discountPercent),
    })),
    optionGroups: rows(wire.optionGroups).map(committedGroup),
  };
}

function committedSection(wire: Wire): CommittedConfigurationSectionType {
  return {
    id: text(wire.id),
    name: text(wire.name),
    sortIndex: int(wire.sortIndex),
    variables: rows(wire.variables).map((variable) => ({
      id: text(variable.id),
      name: text(variable.name),
      sortIndex: int(variable.sortIndex),
      valueType: text(variable.valueType) ?? 'UNKNOWN',
      value: text(variable.value),
      unit: text(variable.unit),
      decimals: int(variable.decimals),
    })),
    optionGroups: rows(wire.optionGroups).map(committedGroup),
    sections: rows(wire.sections).map(committedSection),
  };
}

/**
 * A configured line's committed configuration; null for a line that has none.
 * `sections` is left out when the answer has none to give.
 */
export function parseCartItemConfiguration(value: unknown): CartItemConfigurationType | null {
  const wire = record(value);
  if (!wire) return null;
  const summary = parseConfigurationSummary(wire.summary);
  return Array.isArray(wire.sections)
    ? { summary, sections: rows(wire.sections).map(committedSection) }
    : { summary };
}

/** What a commit answers; null when the answer holds no record, or one without its committed id. */
export function parseCommittedConfiguration(value: unknown): CommittedConfigurationType | null {
  const wire = record(value);
  const committedConfigurationId = text(wire?.committedConfigurationId);
  if (!wire || committedConfigurationId === null) return null;
  return {
    committedConfigurationId,
    configurationId: text(wire.configurationId),
    articleNumber: text(wire.articleNumber),
    quantity: decimal(wire.quantity),
    unitPrice: price(wire.unitPrice),
    discountPercent: decimal(wire.discountPercent),
    weightPerUnit: decimal(wire.weightPerUnit),
    summary: parseConfigurationSummary(wire.summary),
  };
}

/** A cart's lines with their configuration; null for a cart the answer does not hold. */
export function parseConfiguredCartLines(value: unknown): ConfiguredCartLinesType | null {
  const wire = record(value);
  if (!wire) return null;
  return {
    id: text(wire.id),
    items: rows(wire.items).map((item) => ({
      id: text(item.id),
      quantity: int(item.quantity),
      configurationId: text(item.configurationId),
      configuration: parseCartItemConfiguration(item.configuration),
    })),
  };
}

/** An order's rows by position; a null row keeps its place. */
function orderRows<T>(value: unknown, map: (row: Wire) => T): { items: (T | null)[] } | null {
  const wire = record(value);
  if (!wire) return null;
  const items = record(wire.cart)?.items;
  return {
    items: Array.isArray(items)
      ? items.map((item) => {
          const row = record(item);
          return row ? map(row) : null;
        })
      : [],
  };
}

export function parseConfiguredOrderLines(value: unknown): ConfiguredOrderLinesType | null {
  return orderRows(value, (row) => {
    const productRow = record(row.product);
    return {
      product: productRow ? { productId: int(productRow.productId), type: text(productRow.type) } : null,
      configuration: parseCartItemConfiguration(row.configuration),
    };
  });
}

export function parseCommittedOrderLines(value: unknown): CommittedOrderLinesType | null {
  return orderRows(value, (row) => {
    const productRow = record(row.product);
    const configuration = record(row.configuration);
    return {
      product: productRow ? { productId: int(productRow.productId) } : null,
      configuration: configuration
        ? {
            sections: Array.isArray(configuration.sections)
              ? rows(configuration.sections).map(committedSection)
              : null,
          }
        : null,
    };
  });
}
