import type { PriceType } from '../shared';

// ---------------------------------------------------------------------------
// The CPQ (configure, price, quote) area of the merchant API, as the
// configuration service returns it. Lists are never null and hold no null
// rows; a `Decimal` is a number. Ids stay nullable as the schema declares
// them. Enum values are typed as the known members but may be any string, so a
// value added upstream reaches the caller.
// ---------------------------------------------------------------------------

/** A string enum that may also carry a value the SDK does not know yet. */
type Open<T extends string> = T | (string & {});

export type ConfigurationSelectionSource = Open<
  | 'UNKNOWN'
  | 'INITIAL'
  | 'MANUAL'
  | 'RULE_SELECTED'
  | 'RULE_DESELECTED'
  | 'GROUP_RULE'
  | 'LOCKED'
  | 'TEMPORARILY_LOCKED'
  | 'NONE'
>;

export type ConfigurationValueSource = Open<
  'UNKNOWN' | 'INITIAL' | 'MANUAL' | 'FORMULA' | 'LINKED' | 'FALLBACK'
>;

export type ConfigurationValueType = Open<'UNKNOWN' | 'STRING' | 'NUMBER' | 'BOOLEAN' | 'DATE'>;

export type ConfigurationMessageSeverity = Open<'UNKNOWN' | 'INFO' | 'WARNING' | 'ERROR'>;

/** The `CpqValue` scalar: a variable's value in whatever form it was sent. */
export type ConfigurationValue = string | number | boolean | null;

export type ConfigurationMessageType = {
  severity: ConfigurationMessageSeverity;
  text: string | null;
};

export type ConfigurationVariableType = {
  id: string | null;
  name: string | null;
  description: string | null;
  valueType: ConfigurationValueType;
  value: ConfigurationValue;
  defaultValue: ConfigurationValue;
  required: boolean;
  available: boolean;
  readOnly: boolean;
  min: number | null;
  max: number | null;
  step: number | null;
  decimals: number | null;
  unit: string | null;
  selectionSource: ConfigurationSelectionSource;
  valueSource: ConfigurationValueSource;
  sortIndex: number | null;
  messages: ConfigurationMessageType[];
};

/** The catalogue product an option stands for, when the option is a sellable article. */
export type ConfigurationOptionProductType = {
  productId: number | null;
  name: string | null;
  articleNumber: string | null;
  alias: string | null;
  canonicalUrl: string | null;
  productImages: { fileName: string | null }[];
};

export type ConfigurationOptionType = {
  id: string | null;
  instanceId: string | null;
  articleNumber: string | null;
  name: string | null;
  description: string | null;
  selected: boolean;
  available: boolean;
  readOnly: boolean;
  selectionSource: ConfigurationSelectionSource;
  quantity: number | null;
  defaultQuantity: number | null;
  minQuantity: number | null;
  maxQuantity: number | null;
  unitPrice: PriceType | null;
  discountPercent: number | null;
  product: ConfigurationOptionProductType | null;
  messages: ConfigurationMessageType[];
};

export type ConfigurationOptionGroupType = {
  id: string | null;
  code: string | null;
  name: string | null;
  description: string | null;
  available: boolean;
  minSelections: number | null;
  maxSelections: number | null;
  minQuantity: number | null;
  maxQuantity: number | null;
  quantityEditable: boolean;
  sortIndex: number | null;
  /** Selected three levels deep. */
  optionGroups: ConfigurationOptionGroupType[];
  options: ConfigurationOptionType[];
  messages: ConfigurationMessageType[];
};

export type ConfigurationSectionType = {
  id: string | null;
  name: string | null;
  description: string | null;
  visible: boolean;
  sortIndex: number | null;
  /** Selected four levels deep. */
  sections: ConfigurationSectionType[];
  variables: ConfigurationVariableType[];
  optionGroups: ConfigurationOptionGroupType[];
  messages: ConfigurationMessageType[];
};

/** A configuration session: the whole re-evaluated document. */
export type ConfigurationType = {
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

/** One change in a batch, as the `CpqConfigurationChangeInputType` takes it. */
export type ConfigurationChangeInputType =
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

export type ConfigurationSummaryLineType = {
  label: string | null;
  value: string | null;
};

/** The committed configuration a cart line is, as the line carries it. */
export type CartItemConfigurationType = {
  summary: ConfigurationSummaryLineType[];
};

/** What a commit answers: the frozen configuration a cart line can carry. */
export type CommittedConfigurationType = {
  committedConfigurationId: string;
  configurationId: string | null;
  articleNumber: string | null;
  quantity: number | null;
  unitPrice: PriceType | null;
  discountPercent: number | null;
  weightPerUnit: number | null;
  summary: ConfigurationSummaryLineType[];
};

export type ConfigurationRenewalType = {
  expiresAt: string;
};

/** A cart's lines, as far as the configured-line reads select them. */
export type ConfiguredCartLinesType = {
  id: string | null;
  items: {
    id: string | null;
    quantity: number | null;
    configurationId: string | null;
    configuration: CartItemConfigurationType | null;
  }[];
};

/**
 * An order's rows by position: `null` keeps a row's place, so a position
 * matches the row of the order read through the order service.
 */
export type ConfiguredOrderLinesType = {
  items: ({
    product: { productId: number | null; type: string | null } | null;
    configuration: CartItemConfigurationType | null;
  } | null)[];
};

/** A committed variable: the value in invariant culture, without its unit. */
export type CommittedConfigurationVariableType = {
  id: string | null;
  valueType: ConfigurationValueType;
  value: string | null;
};

export type CommittedConfigurationOptionGroupType = {
  id: string | null;
  options: { id: string | null; instanceId: string | null; quantity: number | null }[];
  /** Selected three levels deep. */
  optionGroups: CommittedConfigurationOptionGroupType[];
};

/** Only what the buyer saw and chose. */
export type CommittedConfigurationSectionType = {
  id: string | null;
  variables: CommittedConfigurationVariableType[];
  optionGroups: CommittedConfigurationOptionGroupType[];
  /** Selected four levels deep. */
  sections: CommittedConfigurationSectionType[];
};

/** An order's rows by position, each with the structure it was committed with. */
export type CommittedOrderLinesType = {
  items: ({
    product: { productId: number | null } | null;
    /** `sections` is null for a row committed before the structure was recorded. */
    configuration: { sections: CommittedConfigurationSectionType[] | null } | null;
  } | null)[];
};

/** A committed configuration added to a cart as a line of its own. */
export type ConfiguredCartItemInputType = {
  skuId: number;
  quantity: number;
  configurationId: string;
};

/** A cart line swapped onto another committed configuration. */
export type ConfiguredCartItemUpdateInputType = {
  id: string;
  quantity: number;
  configurationId: string;
};

export type ConfigurationCallOptions = {
  /** This call's deadline in milliseconds, over the client's own. */
  timeoutMs?: number;
};
