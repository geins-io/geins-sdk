import { RuntimeContext } from '../common';
import type { CheckoutRedirectsType } from '../shared';
export type OMSSettings = {
  context: RuntimeContext;
  merchantDataTemplate?: unknown;
  defaultPaymentId?: number;
  defaultShippingId?: number;
  checkoutUrls?: CheckoutRedirectsType;
};
