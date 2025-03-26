import type {
  CheckoutInputType,
  CheckoutRedirectsType,
  CheckoutUrlsInputType,
  GeinsSettings,
  GeinsUserType,
  GenerateCheckoutTokenOptions,
  GetCheckoutOptions,
  OMSSettings,
} from '@geins/core';
import { CustomerType } from '@geins/core';
import { GeinsOMS } from '../geinsOMS';
import { CheckoutError } from '../util/checkoutError';
import { UrlProcessor } from '../util/urlProcessor';
export interface CheckoutData {
  cartId: string;
  paymentMethodId: number;
  shippingMethodId: number;
  checkoutOptions: CheckoutInputType;
}

export class CheckoutDataResolver {
  private readonly urlProcessor;
  constructor(
    private readonly _geinsSettings: GeinsSettings,
    private readonly _settings: OMSSettings,
    private readonly _parent: GeinsOMS,
  ) {
    this.urlProcessor = new UrlProcessor();
  }

  resolveCheckoutTokenOptions(args?: GenerateCheckoutTokenOptions): GenerateCheckoutTokenOptions {
    const resolvedArgs = { ...args };
    resolvedArgs.cartId = this.resolveCartId(args?.cartId);
    resolvedArgs.geinsSettings = this.resolveGeinsSettings(args?.geinsSettings);
    resolvedArgs.customerType = args?.customerType ?? CustomerType.PERSON;
    resolvedArgs.user = this.resolveUser(args?.user);

    const paymentAndShipping = this.paymentAndShipping({
      paymentMethodId: args?.selectedPaymentMethodId,
      shippingMethodId: args?.selectedShippingMethodId,
    });

    resolvedArgs.selectedPaymentMethodId = paymentAndShipping.paymentMethodId;
    resolvedArgs.selectedShippingMethodId = paymentAndShipping.shippingMethodId;
    resolvedArgs.redirectUrls = this.resolveRedirectUrls(args?.redirectUrls);
    return resolvedArgs;
  }

  resolveGetCheckoutOptions(args?: GetCheckoutOptions): CheckoutData {
    return {
      cartId: this.resolveCartId(args?.cartId),
      ...this.resolvePaymentAndShipping(args),
      checkoutOptions: {
        ...this.resolveCheckoutInputOptions(args?.checkoutOptions),
      },
    };
  }

  private resolveCheckoutInputOptions(providedOptions?: CheckoutInputType): CheckoutInputType | undefined {
    const options = { ...providedOptions };

    if (options.paymentId) {
      delete options.paymentId;
    }
    if (options.shippingId) {
      delete options.shippingId;
    }

    const checkoutUrls = this.resolveUrls(options);
    if (checkoutUrls) {
      options.checkoutUrls = checkoutUrls;
    }
    return options;
  }

  private resolveRedirectUrls(redirectUrls?: CheckoutRedirectsType): CheckoutRedirectsType | undefined {
    return this.urlProcessor.processUrls(this.fillMissingRedirects(redirectUrls));
  }

  private resolveUrls(options: CheckoutInputType): CheckoutUrlsInputType | undefined {
    const redirects = this.mapUrlsToRedirects(options.checkoutUrls);
    const resolvedRedirects = this.urlProcessor.processUrls(this.fillMissingRedirects(redirects));
    return this.mapRedirectsToUrls(resolvedRedirects);
  }

  private mapUrlsToRedirects(checkoutUrls?: CheckoutUrlsInputType): CheckoutRedirectsType {
    if (!checkoutUrls) return {};

    const mapping: Record<keyof CheckoutUrlsInputType, keyof CheckoutRedirectsType> = {
      redirectUrl: 'success',
      checkoutPageUrl: 'cancel',
      termsPageUrl: 'terms',
    };

    return Object.entries(checkoutUrls).reduce((acc, [key, value]) => {
      if (value) acc[mapping[key as keyof CheckoutUrlsInputType]] = value;
      return acc;
    }, {} as CheckoutRedirectsType);
  }

  private fillMissingRedirects(redirects?: CheckoutRedirectsType): CheckoutRedirectsType {
    if (!redirects) return {};

    const defaultUrls = this._settings.checkoutUrls || {};
    const keys: (keyof CheckoutRedirectsType)[] = [
      'terms',
      'success',
      'error',
      'cancel',
      'continue',
      'privacy',
    ];

    return keys.reduce((acc, key) => {
      if (redirects[key] || defaultUrls[key]) acc[key] = redirects[key] || defaultUrls[key]!;
      return acc;
    }, {} as CheckoutRedirectsType);
  }

  private mapRedirectsToUrls(redirects?: CheckoutRedirectsType): CheckoutUrlsInputType | undefined {
    if (!redirects) return undefined;

    const mapping: Record<keyof CheckoutRedirectsType, keyof CheckoutUrlsInputType> = {
      success: 'redirectUrl',
      terms: 'termsPageUrl',
      privacy: 'termsPageUrl',
      cancel: 'checkoutPageUrl',
      continue: 'checkoutPageUrl',
      error: 'checkoutPageUrl',
    };

    return Object.entries(redirects).reduce((acc, [key, value]) => {
      if (value) acc[mapping[key as keyof CheckoutRedirectsType]] = value;
      return acc;
    }, {} as CheckoutUrlsInputType);
  }

  private resolveCartId(providedCartId?: string): string {
    const cartId = providedCartId || this._parent?.cart.id;
    if (!cartId) {
      throw new CheckoutError('Missing cartId');
    }
    return cartId;
  }

  private resolveGeinsSettings(providedSettings?: GeinsSettings): GeinsSettings {
    const settings = providedSettings || this._geinsSettings;
    if (!settings) {
      throw new CheckoutError('Missing geinsSettings');
    }
    return settings;
  }

  private resolveUser(providedUser?: GeinsUserType): GeinsUserType | undefined {
    if (!providedUser) {
      return undefined;
    }
    return providedUser;
  }

  private resolvePaymentAndShipping(args?: GetCheckoutOptions) {
    return this.paymentAndShipping({
      paymentMethodId: args?.paymentMethodId || args?.checkoutOptions?.paymentId,
      shippingMethodId: args?.shippingMethodId || args?.checkoutOptions?.shippingId,
    });
  }

  private paymentAndShipping(args?: { paymentMethodId?: number; shippingMethodId?: number }) {
    return {
      paymentMethodId: args?.paymentMethodId || this._settings.defaultPaymentId || 0,
      shippingMethodId: args?.shippingMethodId || this._settings.defaultShippingId || 0,
    };
  }
}
