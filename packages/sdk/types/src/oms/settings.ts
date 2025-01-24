import { RuntimeContext } from '../common';
export type OMSSettings = {
  context: RuntimeContext;
  merchantDataTemplate?: unknown;
  defaultPaymentId?: number;
  defaultShippingId?: number;
  /*
  - Callback url
  - Merchant Data Model
  - Ship Options
  */
};
