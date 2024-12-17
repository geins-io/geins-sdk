import {
  BaseApiService,
  CookieService,
  CookieType,
  isServerContext,
  CART_COOKIES,
  CART_COOKIES_MAX_AGE,
  GraphQLQueryOptions,
  FetchPolicyOptions,
} from '@geins/core';
import { MerchantData } from '../logic';
import { parseCart } from '../parsers';
import { queries } from '../graphql';
import type { CartType, CartItemType, CartItemInputType, GeinsSettings, OMSSettings } from '@geins/types';

/**
 * Shipping fee handling.
 */
export interface ShippingFeeInterface {
  set(fee: number): Promise<boolean>;
}

/**
 * Promotion code handling.
 */
export interface PromotionCodeInterface {
  apply(promoCode: string): Promise<boolean>;
  remove(): Promise<boolean>;
}

export interface CartItemsInterface {
  get(): Promise<CartItemType[] | undefined>;
  clear(): Promise<boolean>;
  add(args: { id?: string; skuId?: number; quantity?: number }): Promise<boolean>;
  remove(args: { id?: string; skuId?: number; quantity?: number }): Promise<boolean>;
  delete(args: { id?: string; skuId?: number }): Promise<boolean>;
  update(args: { item: CartItemType }): Promise<boolean>;
}

// save()???
/// verb first?
// 9c19f2da-03fe-4306-b36f-f0f60109e612 exists???
// JS DOC
// addToCart.allowExternalShippingFee ● Boolean scalar
// requestOptions: { fetchPolicy: 'no-cache' }
// options on how to run this in constructor and defaults for shipping etd
// merchantdata template??
// Apollo " Cache data may be lost when replacing the items field of a CartType object." - https://go.apollo.dev/c/generating-unique-identifiers - https://go.apollo.dev/c/merging-non-normalized-objects

export class CartService extends BaseApiService {
  private _loaded: boolean = false;
  private _id!: string | undefined;
  private _cart!: CartType | undefined;
  private _cookieService!: CookieService;
  private _settings!: OMSSettings;

  private _merchantData!: MerchantData<any> | any;

  constructor(apiClient: any, geinsSettings: GeinsSettings, _settings: OMSSettings) {
    super(apiClient, geinsSettings);
    this._settings = _settings;

    if (_settings.merchantDataTemplate) {
      this._merchantData = new MerchantData(this._settings.merchantDataTemplate);
    } else {
      this._merchantData = new MerchantData();
    }

    if (!isServerContext() && _settings.context !== 'server') {
      this._cookieService = new CookieService();
      const cookieId = this.cookieGet();
      // logWrite('--- cookieId', cookieId);
      if (cookieId) {
        this._id = cookieId;
      }
    }
  }

  /**
   * Gets the ID of the cart.
   *
   * If the code is not running in a server context and the ID is not already set,
   * it attempts to retrieve the ID from cookies.
   *
   * @returns {string | undefined} The ID of the cart, or undefined if not set.
   */
  get id(): string | undefined {
    if (!isServerContext() && !this._id) {
      this._id = this.cookieGet();
    }
    return this._id;
  }

  /**
   * Gets the merchant data as a Proxy object.
   *
   * The Proxy object allows for controlled access and modification of the merchant data.
   *
   * @returns {any} The merchant data wrapped in a Proxy.
   *
   * The Proxy handler performs the following:
   * - Validates the property key before setting a value.
   * - Allows setting of values for valid keys.
   * - If the key is not valid but the data is flexible, it allows setting the value.
   * - Logs a warning and ignores the value if the key is not valid and the data is not flexible.
   */
  get merchantData(): any {
    return new Proxy(this._merchantData.data, {
      set: (target, prop, value) => {
        if (this._merchantData.isKeyValid(prop as keyof any)) {
          target[prop as keyof typeof target] = value;
          return true;
        } else if (this._merchantData.isFlexible) {
          target[prop as keyof typeof target] = value;
          return true;
        } else {
          console.warn(`Key "${String(prop)}" is not in the original template and will be ignored.`);
          return false;
        }
      },
      get: (target, prop) => {
        if (prop === 'save') {
          return this.saveMerchantData.bind(this);
        }
        return target[prop as keyof typeof target];
      },
    });
  }

  set merchantData(newData: Partial<any>) {
    this._merchantData.replaceData(newData);
  }

  private async saveMerchantData(): Promise<boolean> {
    if (!this.id) {
      return false;
    }

    const merchantDataString = JSON.stringify(this.merchantData);

    const vars: { id: string; merchantData: string } = {
      id: this.id!,
      merchantData: merchantDataString,
    };

    const options: any = {
      query: queries.cartSetMerchantData,
      variables: this.generateVars(vars),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    try {
      const data = await this.runMutation(options);
      this.loadCartFromData(data);
    } catch (e: any) {
      throw new Error('Error setting Merchant Data to cart');
    }
    return true;
  }

  /**
   * PromotionCode
   * Methods:
   * - apply() Applies a promotion code to the cart and recalculates the cart.
   * - remove() Removes the promotion code from the cart and recalculates the cart.
   */
  get promotionCode(): PromotionCodeInterface {
    return {
      /**
       * Applies a promotion code to the cart.
       *
       */
      apply: this.promotionCodeApply.bind(this),
      /**
       * Removes the promotion code from the cart.
       */
      remove: this.promotionCodeRemove.bind(this),
    };
  }

  // private promotion code methods
  private async promotionCodeApply(promoCode: string): Promise<boolean> {
    if (!this.id) {
      return false;
    }

    const vars: { id: string; promoCode: string } = {
      id: this.id!,
      promoCode: promoCode,
    };

    const options: any = {
      query: queries.cartSetPromotionCode,
      variables: this.generateVars(vars),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    try {
      const data = await this.runMutation(options);
      this.loadCartFromData(data);
    } catch (e: any) {
      if (e.message.includes('Invalid Promo Code')) {
        return false;
      }
    }
    return true;
  }

  private async promotionCodeRemove(): Promise<boolean> {
    return this.promotionCodeApply('');
  }

  /**
   * Shipping Fee
   * Methods:
   * - set() Set the shipping fee for the cart.
   */
  get shippingFee(): ShippingFeeInterface {
    return {
      /**
       * Set a shipping fee for the cart.
       *
       */
      set: this.shippingFeeSet.bind(this),
    };
  }

  // private shipping Fee methods
  private async shippingFeeSet(fee: number): Promise<boolean> {
    if (!this.id) {
      return false;
    }

    const vars: { id: string; shippingFee: number } = {
      id: this.id!,
      shippingFee: fee,
    };

    const options: any = {
      query: queries.cartSetShippingFee,
      variables: this.generateVars(vars),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    try {
      const data = await this.runMutation(options);
      this.loadCartFromData(data);
    } catch (e: any) {
      console.error('Checkout Settings in Geins does not support manual shipping fee');
      return false;
    }
    return true;
  }

  /**
   * Creates a new cart by executing a GraphQL mutation.
   *
   * This method initializes the cart and its ID to undefined, sets up the options for the GraphQL query,
   * and attempts to run the query to create the cart. If successful, it loads the cart data. If an error
   * occurs during the query execution, it throws an error indicating the failure to create the cart.
   *
   * @returns {Promise<CartType | undefined>} A promise that resolves to the created cart or undefined if the creation fails.
   * @throws {Error} If there is an error during the cart creation process.
   */
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

  /**
   * Retrieves the cart based on the provided ID or the instance's ID.
   * If the cart is already loaded in the instance, it returns the cached cart.
   * If no ID is provided and no instance ID is available, it creates a new cart.
   *
   * @param {string} [id] - Optional ID of the cart to retrieve.
   * @returns {Promise<CartType | undefined>} - A promise that resolves to the cart or undefined if no cart is found.
   * @throws {Error} If there is an error during the cart retrieval process.
   */
  async get(id?: string): Promise<CartType | undefined> {
    if (this._cart) {
      return this._cart;
    }

    if (!this.id && !id) {
      // logWrite('--- no id or cookie - creating cart');
      return this.create();
    }

    const cartId = id ?? this.id;

    return this.cartGet(cartId!, false);
  }

  /**
   * Refreshes the current cart. If the cart or its ID is not available,
   * it creates a new cart. Otherwise, it retrieves the cart with the given ID.
   *
   * @returns {Promise<CartType | undefined>} A promise that resolves to the cart object or undefined.
   * @throws {Error} If there is an error during the cart retrieval process.
   */
  async refresh(): Promise<CartType | undefined> {
    if (!this._cart || !this.id) {
      return this.create();
    }
    return this.cartGet(this.id!, true);
  }

  // private cart methods
  private async cartGet(id: string, forceRefesh: boolean = false): Promise<CartType | undefined> {
    const options: any = {
      query: queries.cartGet,
      variables: this.generateVars({ id: id, forceRefresh: forceRefesh }),
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

  /**
   * Removes the current cart by clearing the cart and ID properties and removing the associated cookie.
   *
   * @returns {Promise<boolean>} A promise that resolves to `true` if the cart was successfully removed, or `false` if an error occurred.
   */
  async remove(): Promise<boolean> {
    try {
      this._cart = undefined;
      this._id = undefined;
      this.cookieRemove();
      return true;
    } catch (error) {
      console.error('Error removing cart:', error);
      return false;
    }
  }

  /**
   * Provides access to cart items with various operations.
   *
   * @returns {CartItemsInterface} An object containing methods to interact with cart items.
   *
   * @property {Function} get - Retrieves cart items.
   * @property {Function} add - Adds an item to the cart.
   * @property {Function} update - Updates an item in the cart.
   * @property {Function} remove - Removes an item from the cart.
   * @property {Function} delete - Deletes an item from the cart.
   * @property {Function} clear - Clears all items from the cart.
   */
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

  // private item methods
  private async itemsGet(): Promise<CartItemType[] | undefined> {
    if (!this._cart && this.id) {
      await this.get(this.id);
    }

    return this._cart?.items ?? [];
  }

  private async itemUpdate(args: { item: CartItemInputType; updateCart?: boolean }): Promise<boolean> {
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

    const updateCart = args.updateCart ?? true;

    const variables = await this.generateVars(vars);

    const options: GraphQLQueryOptions = {
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
      variables,
    };

    if (updateCart) {
      options.query = queries.cartUpdateItem;
    } else {
      options.query = queries.cartUpdateItemSilent;
    }

    const exists = this._cart?.items?.find((item) => {
      return item.id === args.item.id || item.skuId === args.item.skuId;
    });

    if (!exists) {
      options.query = queries.cartAddItem;
    }

    try {
      const data = await this.runMutation(options);
      if (updateCart) {
        this.loadCartFromData(data);
      }
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
      const avalibleStock = cartItem.product?.skus?.[0]?.stock?.totalStock ?? 0;
      if (resolvedArgs.quantity > avalibleStock) {
        return false;
      }
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

  private async itemDelete(args: { id?: string; skuId?: number; updateCart?: boolean }): Promise<boolean> {
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

    const updateCart = resolvedArgs.updateCart ?? true;
    return this.itemUpdate({ item: updateitem, updateCart });
  }

  private async itemsClear(): Promise<boolean> {
    if (!this._cart) {
      return false;
    }

    if (!this._cart.items) {
      return false;
    }

    let returndata = true;

    for (let i = 0; i < this._cart.items.length; i++) {
      const isLastItem = i === this._cart.items.length - 1;
      if (!(await this.itemDelete({ id: this._cart.items[i].id, updateCart: isLastItem }))) {
        returndata = false;
      }
    }

    return returndata;
  }

  // private util methods
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

  private generateVars(variables: any) {
    return this.createVariables(variables);
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
    // get merchant data
    this._merchantData.replaceData(cart.merchantData);
    this.cookieSet(cart.id);
  }

  private cookieGet(): string | undefined {
    if (!this._cookieService) {
      return undefined;
    }

    return this._cookieService.get(CART_COOKIES.CART_ID);
  }

  private cookieSet(cartId?: string) {
    if (!this._cookieService) {
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
    if (!this._cookieService) {
      return;
    }

    this._cookieService.remove(CART_COOKIES.CART_ID);
  }
}
