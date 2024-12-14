import {
  BaseApiService,
  CookieService,
  CookieType,
  isServerContext,
  CART_COOKIES,
  CART_COOKIES_MAX_AGE,
} from '@geins/core';

import { parseCart } from '../parsers';
import { queries } from '../graphql';
import type { CartType, CartItemType, CartItemInputType, GeinsSettings } from '@geins/types';

// addToCart.allowExternalShippingFee ● Boolean scalar
//  requestOptions: { fetchPolicy: 'no-cache' }

export class CartService extends BaseApiService {
  private _id!: string | undefined;
  private _cart!: CartType;
  private _cookieService!: CookieService;

  constructor(apiClient: any, geinsSettings: GeinsSettings) {
    super(apiClient, geinsSettings);
    if (!isServerContext()) {
      this._cookieService = new CookieService();
    }
  }

  private generateVars(variables: any) {
    return this.createVariables(variables);
  }

  private cookieGet(): string | undefined {
    if (isServerContext()) {
      return undefined;
    }

    return this._cookieService.get(CART_COOKIES.CART_ID);
  }

  private cookieSet(cartId: string) {
    if (isServerContext()) {
      return;
    }

    const variables: CookieType = {
      name: CART_COOKIES.CART_ID,
      payload: cartId,
      maxAge: CART_COOKIES_MAX_AGE.DEFAULT,
    };
    this._cookieService.set(variables);
  }

  private loadCartFromData(data: any) {
    const cart = parseCart(data);
    if (!cart) {
      return;
    }
    this.loadCart(cart);
  }

  private loadCart(cart: CartType) {
    if (!cart) {
      return;
    }
    this._id = cart.id;
    this._cart = cart;
    this.cookieSet(cart.id);
  }

  get id(): string | undefined {
    if (!isServerContext() && !this._id) {
      this._id = this.cookieGet();
    }
    return this._id;
  }

  get items(): Promise<CartItemType[] | undefined> {
    return (async () => {
      if (!this._cart) {
        this._cart = await this.get();
      }
      return this._cart.items;
    })();
  }

  async create(): Promise<CartType> {
    if (this._id) {
      return this.get(this._id);
    }

    const options: any = {
      query: queries.cartCreate,
      variables: this.generateVars({}),
    };

    try {
      const data = await this.runQuery(options);
      this.loadCartFromData(data);
    } catch (e) {
      console.error('Error creating cart', e);
    }
    return this._cart;
  }

  async get(id?: string): Promise<any> {
    if (!this._id && !id) {
      return this.create();
    }

    const options: any = {
      query: queries.cartGet,
      variables: this.generateVars({ id: id || this._id }),
    };

    try {
      const data = await this.runQuery(options);
      this.loadCartFromData(data);
    } catch (e) {
      console.error('Error creating cart', e);
    }
    return this._cart;
  }

  async add(args: { item?: CartItemInputType; package?: any }): Promise<CartType | undefined> {
    if (!this._id) {
      await this.create();
    }

    if (!this._id) {
      throw new Error('Could not add item, cart not created');
    }

    const vars: { id: string; item?: CartItemInputType; packageId?: any; selections?: any } = {
      id: this._id,
    };

    if (args.item) {
      vars.item = {
        skuId: args.item.skuId ? parseInt(args.item.skuId.toString()) : 0,
        quantity: args.item.quantity,
        ...(args.item.message && { message: args.item.message }),
      };
    } else if (args.package) {
      throw new Error('Package not implemented');
    }

    const variables = await this.generateVars(vars);
    const options: any = {
      query: queries.cartAddItem,
      variables,
    };

    try {
      const data = await this.runMutation(options);
      this.loadCartFromData(data);
    } catch (e) {
      console.error('Error adding item to cart', e);
    }

    return this._cart;
  }

  async update(args: { item: CartItemType }): Promise<any> {
    if (!this._id) {
      await this.create();
    }

    if (!this._id) {
      throw new Error('Could not update item, cart not created');
    }

    if (!args.item.id && !args.item.skuId) {
      throw new Error('Item id or skuId must be set');
    }
    const vars: { id: string; item?: CartItemInputType; packageId?: any; selections?: any } = {
      id: this._id,
    };

    vars.item = {
      ...(args.item.id && { id: args.item.id }),
      ...(args.item.skuId && { skuId: parseInt(args.item.skuId.toString()) }),
      quantity: args.item.quantity,
      ...(args.item.message && { message: args.item.message }),
    };

    const variables = await this.generateVars(vars);
    const options: any = {
      query: queries.cartUpdateItem,
      variables,
    };

    try {
      const data = await this.runMutation(options);
      this.loadCartFromData(data);
    } catch (e) {
      console.error('Error updating item in cart', e);
    }

    return this._cart;
  }

  async remove(item: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async clear(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  parse(result: any): CartType {
    throw new Error('Method not implemented.');
  }
}
