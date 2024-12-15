import {
  BaseApiService,
  CookieService,
  CookieType,
  isServerContext,
  CART_COOKIES,
  CART_COOKIES_MAX_AGE,
  GraphQLQueryOptions,
  FetchPolicyOptions,
  logWrite,
} from '@geins/core';

import { parseCart } from '../parsers';
import { queries } from '../graphql';
import type { CartType, CartItemType, CartItemInputType, GeinsSettings } from '@geins/types';

export interface CartItemsInterface {
  get(): Promise<CartItemType[] | undefined>;
  clear(): Promise<boolean>;
  add(args: { id?: string; skuId?: number; quantity?: number }): Promise<boolean>;
  remove(args: { id?: string; skuId?: number; quantity?: number }): Promise<boolean>;
  delete(args: { id?: string; skuId?: number }): Promise<boolean>;
  update(args: { item: CartItemType }): Promise<boolean>;
}

// addToCart.allowExternalShippingFee ● Boolean scalar
// requestOptions: { fetchPolicy: 'no-cache' }

export class CartService extends BaseApiService {
  private _loaded: boolean = false;
  private _id!: string | undefined;
  private _cart!: CartType | undefined;
  private _cookieService!: CookieService;

  constructor(apiClient: any, geinsSettings: GeinsSettings) {
    super(apiClient, geinsSettings);
    if (!isServerContext()) {
      this._cookieService = new CookieService();
      const cookieId = this.cookieGet();
      logWrite('--- cookieId', cookieId);
      if (cookieId) {
        this._id = cookieId;
      }
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

  private cookieSet(cartId?: string) {
    if (isServerContext()) {
      return;
    }

    if (!cartId) {
      this._cookieService.remove(CART_COOKIES.CART_ID);
      return;
    }

    const variables: CookieType = {
      name: CART_COOKIES.CART_ID,
      payload: cartId,
      maxAge: CART_COOKIES_MAX_AGE.DEFAULT,
    };
    this._cookieService.set(variables);
  }

  private cookieRemove() {
    if (isServerContext()) {
      return;
    }

    this._cookieService.remove(CART_COOKIES.CART_ID);
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
    this._loaded = true;
    this.cookieSet(cart.id);
  }

  async create(): Promise<CartType | undefined> {
    this._cart = undefined;
    this._id = undefined;

    const options: any = {
      query: queries.cartCreate,
      variables: this.generateVars({}),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    try {
      const data = await this.runQuery(options);
      this.loadCartFromData(data);
    } catch (e) {
      throw new Error('Error creating cart');
    }
    return this._cart;
  }

  async get(id?: string): Promise<CartType | undefined> {
    this._cart = undefined;
    this._id = undefined;

    if (!this.id && !id) {
      return this.create();
    }

    const options: any = {
      query: queries.cartGet,
      variables: this.generateVars({ id: id || this.id }),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    try {
      const data = await this.runQuery(options);
      this.loadCartFromData(data);
    } catch (e: any) {
      if (e.message.includes("Variable '$id' is invalid")) {
        return this.create();
      } else {
        throw new Error('Error getting cart');
      }
    }
    return this._cart;
  }

  async setMerchantData(item: any): Promise<any> {
    //setCartMerchantData
    throw new Error('Method not implemented.');
  }

  async setCartPromoCode(item: any): Promise<any> {
    //setCartPromoCode
    throw new Error('Method not implemented.');
  }

  async setCartShippingFee(item: any): Promise<any> {
    //setCartShippingFee
    throw new Error('Method not implemented.');
  }

  async setComplete(): Promise<any> {
    //completeCart
    throw new Error('Method not implemented.');
  }

  async clear(): Promise<void> {
    this._cart = undefined;
    this._id = undefined;
    this.cookieRemove();
  }

  get id(): string | undefined {
    if (!isServerContext() && !this._id) {
      this._id = this.cookieGet();
    }
    return this._id;
  }

  private createCartItemInput(args: { id?: string; skuId?: number; quantity: number }): CartItemInputType {
    const item: CartItemInputType = {
      quantity: args.quantity,
    };

    if (args.id) {
      item.id = args.id;
    } else if (args.skuId) {
      item.skuId = parseInt(args.skuId.toString(), 10);
    } else {
      throw new Error('Sku or id is required');
    }

    return item;
  }

  private async itemsGet(): Promise<CartItemType[] | undefined> {
    if (!this._cart && this.id) {
      await this.get(this.id);
    }
    return this._cart?.items ?? [];
  }

  private async itemUpdate(args: { item: CartItemInputType }): Promise<boolean> {
    if (!this.id) {
      await this.create();
    }

    if (!this.id) {
      throw new Error('Could not update item, cart not created');
    }

    if (!args.item.id && !args.item.skuId) {
      throw new Error('Item id or skuId must be set');
    }

    const vars: { id: string; item?: CartItemInputType } = {
      id: this.id,
    };

    if (args.item.id) {
      vars.item = {
        id: args.item.id,
        quantity: args.item.quantity,
      };
    } else if (args.item.skuId) {
      vars.item = {
        skuId: parseInt(args.item.skuId.toString(), 10),
        quantity: args.item.quantity,
      };
    } else {
      throw new Error('Item id or skuId must be set');
    }

    const variables = await this.generateVars(vars);

    const options: GraphQLQueryOptions = {
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
      query: queries.cartUpdateItem,
      variables,
    };

    const exists = this._cart?.items?.find((item) => {
      return item.id === args.item.id || item.skuId === args.item.skuId;
    });

    if (!exists) {
      options.query = queries.cartAddItem;
    }

    try {
      const data = await this.runMutation(options);
      console.log('--- updating item data', data);
      this.loadCartFromData(data);
    } catch (e) {
      throw new Error('Error updating item');
    }
    return true;
  }

  private async itemAdd(args: { id?: string; skuId?: number; quantity?: number }): Promise<boolean> {
    const resolvedArgs = { ...args, quantity: args.quantity ?? 1 };

    const cartItem = this._cart?.items?.find((item) => {
      return item.id === resolvedArgs.id || item.skuId === resolvedArgs.skuId;
    });

    if (cartItem) {
      resolvedArgs.quantity += cartItem.quantity;
    }

    const item = this.createCartItemInput(resolvedArgs);
    return this.itemUpdate({ item });
  }

  private async itemRemove(args: { id?: string; skuId?: number; quantity?: number }): Promise<boolean> {
    const resolvedArgs = { ...args, quantity: args.quantity ?? 1 };

    const cartItem = this._cart?.items?.find((item) => {
      return item.id === resolvedArgs.id || item.skuId === resolvedArgs.skuId;
    });

    if (!cartItem) {
      return false;
    }

    const newQuantity = cartItem.quantity - resolvedArgs.quantity!;

    const updateitem = this.createCartItemInput({
      id: resolvedArgs.id,
      skuId: resolvedArgs.skuId,
      quantity: newQuantity,
    });
    return this.itemUpdate({ item: updateitem });
  }

  private async itemDelete(args: { id?: string; skuId?: number }): Promise<boolean> {
    const resolvedArgs = { ...args, quantity: 0 };

    const cartItem = this._cart?.items?.find((item) => {
      return item.id === resolvedArgs.id || item.skuId === resolvedArgs.skuId;
    });

    if (!cartItem) {
      return false;
    }

    const updateitem = this.createCartItemInput({
      id: resolvedArgs.id,
      skuId: resolvedArgs.skuId,
      quantity: 0,
    });
    return this.itemUpdate({ item: updateitem });
  }

  private async itemsClear(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  get items(): CartItemsInterface {
    return {
      get: this.itemsGet.bind(this),
      add: this.itemAdd.bind(this),
      update: this.itemUpdate.bind(this),
      remove: this.itemRemove.bind(this),
      delete: this.itemDelete.bind(this),
      clear: this.itemsClear.bind(this),
    };
  }

  parse(result: any): CartType {
    throw new Error('Method not implemented.');
  }
}
