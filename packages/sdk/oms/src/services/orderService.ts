import {
  BaseApiService,
  CookieService,
  isServerContext,
  CART_COOKIES,
  CART_COOKIES_MAX_AGE,
  CookieType,
  FetchPolicyOptions,
  encodeJWT,
  decodeJWT,
} from '@geins/core';
import { queries } from '../graphql';
import type {
  CartType,
  CartItemType,
  CartItemInputType,
  GeinsSettings,
  OMSSettings,
  ProductPackageSelectionType,
  CartGroupInputType,
  CheckoutInputType,
} from '@geins/types';
import { parseCheckout } from '../parsers';
import { GeinsOMS } from '../geinsOMS';

export class OrderService extends BaseApiService {
  private _settings!: OMSSettings;

  constructor(
    apiClient: any,
    geinsSettings: GeinsSettings,
    _settings: OMSSettings,
    private _parent?: GeinsOMS,
  ) {
    super(apiClient, geinsSettings);
    this._settings = _settings;
  }

  async get(args: any): Promise<any> {
    console.log('OrderService.get::', args);
  }

  async create(args: { cartId: string; user?: any; checkout?: CheckoutInputType }): Promise<any> {
    const variables = {
      cartId: args.cartId,
      checkout: args.checkout,
    };

    const options: any = {
      query: queries.orderCreate,
      variables: this.createVariables(variables),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    // console.log('CHECKOUT validate() - options.variables', options.variables);

    // validation type

    try {
      const data = await this.runQuery(options);
      // console.log('CHECKOUT validate() - data', data);

      return data;
    } catch (e) {
      console.error('ERROR', e);
      throw new Error('Error creating cart');
    }
  }

  // private util methods
}
