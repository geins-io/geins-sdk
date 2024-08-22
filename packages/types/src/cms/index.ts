import { CustomerType, KeyValue } from '../common';

export type ContentAreaVariabels = {
  url?: string | null,
  alias?: string  | null,
  areaName?: string | null,
  widgetAlias?: string | null,
  family?: string | null,
  filters?: Array<KeyValue> | null,
  customerType?: CustomerType | null,
  preview?: boolean | null,
  displaySetting?: string | null,
};
