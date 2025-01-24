import {
  BaseApiService,
  CookieService,
  CookieType,
  isServerContext,
  CART_COOKIES,
  CART_COOKIES_MAX_AGE,
  GraphQLQueryOptions,
  FetchPolicyOptions,
  ItemType,
  encodeJWT,
} from '@geins/core';
import { MerchantData } from '../logic';
import { parseCart, groupCartItems } from '../parsers';
import { queries } from '../graphql';
import type {
  CartType,
  CartItemType,
  CartItemInputType,
  GeinsSettings,
  OMSSettings,
  ProductPackageSelectionType,
  CartGroupInputType,
} from '@geins/types';

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

/**
 * Interface representing the operations that can be performed on cart items.
 */
export interface CartItemsInterface {
  /**
   * Retrieves the list of cart items.
   * @returns {Promise<CartItemType[] | undefined>} A promise that resolves to an array of cart items or undefined.
   */
  get(): Promise<CartItemType[] | undefined>;

  /**
   * Clears all items from the cart.
   * @returns {Promise<boolean>} A promise that resolves to true if the cart was successfully cleared, otherwise false.
   */
  clear(): Promise<boolean>;

  /**
   * Adds an item to the cart.
   * @param {Object} args - The arguments for adding an item to the cart.
   * @param {string} [args.id] - The ID of the item.
   * @param {number} [args.skuId] - The SKU ID of the item.
   * @param {number} [args.quantity] - The quantity of the item to add.
   * @param {number} [args.packageId] - The package ID of the item.
   * @param {ProductPackageSelectionType[]} [args.selections] - The selections for the package.
   * @param {CartItemType} [args.item] - The item to add.
   * @param {string} [args.message] - The message for the item.
   * @returns {Promise<boolean>} A promise that resolves to true if the item was successfully added, otherwise false.
   */
  add(args: {
    id?: string;
    skuId?: number;
    quantity?: number;
    packageId?: number;
    selections?: ProductPackageSelectionType[];
    item?: CartItemType;
    message?: string;
  }): Promise<boolean>;

  /**
   * Removes one of the quantity of an item from the cart.
   *
   * - If the quantity is greater than 1, it decrements the quantity.
   * - If the quantity is 1, it removes the item from the cart.
   *
   * @param {Object} args - The arguments for removing an item from the cart.
   * @param {string} [args.id] - The ID of the item.
   * @param {number} [args.skuId] - The SKU ID of the item.
   * @param {number} [args.quantity] - The quantity of the item to remove.
   * @returns {Promise<boolean>} A promise that resolves to true if the item was successfully removed, otherwise false.
   */
  remove(args: { id?: string; skuId?: number; quantity?: number }): Promise<boolean>;

  /**
   * Updates an item in the cart.
   * @param {Object} args - The arguments for updating an item in the cart.
   * @param {CartItemType} args.item - The item to update.
   * @returns {Promise<boolean>} A promise that resolves to true if the item was successfully updated, otherwise false.
   */
  update(args: { item: CartItemType }): Promise<boolean>;

  /**
   * Deletes an item from the cart.
   * @param {Object} args - The arguments for deleting an item from the cart.
   * @param {string} [args.id] - The ID of the item.
   * @param {CartItemType} [args.item] - The item to delete.
   * @param {boolean} [args.updateCart] - Whether to update the cart after deletion.
   * @returns {Promise<boolean>} A promise that resolves to true if the item was successfully deleted, otherwise false.
   */
  delete(args: { id?: string; item?: CartItemType; updateCart?: boolean }): Promise<boolean>;
}

export interface CartServiceInterface {
  /**
   * Gets the ID of the cart.
   *
   * If the code is not running in a server context and the ID is not already set,
   * it attempts to retrieve the ID from cookies.
   *
   * @returns {string | undefined} The ID of the cart, or undefined if not set.
   */
  id: string | undefined;

  /**
   * Gets the read-only status of the cart.
   *
   * @returns {boolean} - Returns `true` if the cart is read-only, otherwise `false`.
   */
  isReadOnly: boolean;

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
  merchantData: any;

  /**
   * PromotionCode
   * Methods:
   * - apply() Applies a promotion code to the cart and recalculates the cart.
   * - remove() Removes the promotion code from the cart and recalculates the cart.
   */
  promotionCode: PromotionCodeInterface;

  /**
   * Shipping Fee
   * Methods:
   * - set() Set the shipping fee for the cart.
   */
  shippingFee: ShippingFeeInterface;

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
  items: CartItemsInterface;

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
  create(): Promise<CartType | undefined>;

  /**
   * Retrieves the cart based on the provided ID or the instance's ID.
   * If the cart is already loaded in the instance, it returns the cached cart.
   * If no ID is provided and no instance ID is available, it creates a new cart.
   *
   * @param {string} [id] - Optional ID of the cart to retrieve.
   * @returns {Promise<CartType | undefined>} - A promise that resolves to the cart or undefined if no cart is found.
   * @throws {Error} If there is an error during the cart retrieval process.
   */
  get(id?: string): Promise<CartType | undefined>;

  /**
   * Refreshes the current cart. If the cart or its ID is not available,
   * it creates a new cart. Otherwise, it retrieves the cart with the given ID.
   *
   * @returns {Promise<CartType | undefined>} A promise that resolves to the cart object or undefined.
   * @throws {Error} If there is an error during the cart retrieval process.
   */
  refresh(): Promise<CartType | undefined>;

  /**
   * Copies the current cart and returns the new cart's ID.
   *
   * @param args - An object containing optional parameters:
   *   @param args.id - The ID of the cart to copy. If not provided, the current cart's ID will be used.
   *   @param args.resetPromotions - A boolean indicating whether to reset promotions in the copied cart. Defaults to `true`.
   *   @param args.loadCopy - A boolean indicating whether to load the copied cart. Defaults to `false`.
   *
   * @returns A promise that resolves to the new cart's ID, or `undefined` if the operation fails or if the service is in read-only mode.
   *
   * @throws Will throw an error if there is an issue copying the cart.
   */
  copy(args: { id?: string; resetPromotions?: boolean; loadCopy?: boolean }): Promise<string | undefined>;

  /**
   * Completes the cart and sets it as completed and read only.
   *
   * @returns {Promise<boolean>} A promise that resolves to `true` if the cart was successfully completed, or `false` if an error occurred.
   */
  complete(): Promise<boolean>;

  /**
   * Removes the current cart by clearing the cart and ID properties and removing the associated cookie.
   *
   * @returns {Promise<boolean>} A promise that resolves to `true` if the cart was successfully removed, or `false` if an error occurred.
   */
  remove(): Promise<boolean>;
}

export class CartService extends BaseApiService implements CartServiceInterface {
  private _id!: string | undefined;
  private _cart!: CartType | undefined;
  private _cookieService!: CookieService;
  private _settings!: OMSSettings;
  private _isReadOnly: boolean = false;

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
      if (cookieId) {
        this._id = cookieId;
      }
    }
  }

  get id(): string | undefined {
    if (!isServerContext() && !this._id) {
      this._id = this.cookieGet();
    }
    return this._id;
  }

  get isReadOnly() {
    return this._isReadOnly;
  }

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
      await this.create();
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

  async create(): Promise<CartType | undefined> {
    this._cart = undefined;
    this._id = undefined;
    this._isReadOnly = false;

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
    if (this._cart) {
      return this._cart;
    }

    if (!this.id && !id) {
      return this.create();
    }

    const cartId = id ?? this.id;

    return this.cartGet(cartId!, false);
  }

  async refresh(): Promise<CartType | undefined> {
    if (!this._cart || !this.id) {
      return await this.create();
    }
    return this.cartGet(this.id!, true);
  }

  async copy(
    args: { id?: string; resetPromotions?: boolean; loadCopy?: boolean } = {},
  ): Promise<string | undefined> {
    if (this._isReadOnly) {
      return undefined;
    }

    const resolvedArgs = {
      ...args,
      resetPromotions: args.resetPromotions ?? true,
      loadCopy: args.loadCopy ?? false,
    };

    if (!resolvedArgs.id && !this.id) {
      return undefined;
    }

    if (!resolvedArgs.id) {
      resolvedArgs.id = this.id;
    }

    let cartCopy = undefined;

    const options: any = {
      query: queries.cartCopy,
      variables: this.generateVars({ id: resolvedArgs.id, resetPromotions: resolvedArgs.resetPromotions }),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    try {
      const data = await this.runMutation(options);
      cartCopy = parseCart(data, this._geinsSettings.locale);
      if (!cartCopy) {
        throw new Error('Error copying cart');
      }
    } catch (error) {
      console.error('Error setting cart as completed:', error);
      return undefined;
    }

    if (resolvedArgs.loadCopy) {
      this.loadCart(cartCopy);
    }

    return this._id;
  }

  async complete(): Promise<boolean> {
    if (!this.id) {
      return false;
    }

    const options: any = {
      query: queries.cartComplete,
      variables: this.generateVars({ id: this.id }),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    try {
      const data = await this.runQuery(options);
      this.loadCartFromData(data);
    } catch (error) {
      console.error('Error setting cart as completed:', error);
      return false;
    }
    return true;
  }

  async remove(): Promise<boolean> {
    try {
      this._cart = undefined;
      this._id = undefined;
      this._isReadOnly = false;
      this.cookieRemove();
      return true;
    } catch (error) {
      console.error('Error removing cart:', error);
      return false;
    }
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
        return await this.create();
      } else {
        throw new Error('Error getting cart');
      }
    }

    return this._cart;
  }

  get items(): CartItemsInterface {
    return {
      get: this.itemsGet.bind(this),
      clear: this.itemsClear.bind(this),
      add: this.itemAdd.bind(this),
      remove: this.itemRemove.bind(this),
      update: this.itemUpdate.bind(this),
      delete: this.itemDelete.bind(this),
    };
  }

  // private cart item methods
  private async itemsGet(): Promise<CartItemType[] | undefined> {
    if (!this._cart && this.id) {
      await this.get(this.id);
    }
    if (!this._cart?.items) {
      return [];
    }

    const hasPackages = this._cart?.items?.some((item) => {
      return item.productPackage || null !== null;
    });

    if (!hasPackages) {
      return this._cart?.items;
    }

    return groupCartItems(this._cart.items, this._geinsSettings.locale);
  }

  private async itemUpdate(args: { item: CartItemType; updateCart?: boolean }): Promise<boolean> {
    if (this._isReadOnly) {
      return false;
    }

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

    const exists = this._cart?.items?.find((item) => {
      return (
        item.id === args.item.id ||
        (item.skuId === args.item.skuId && (item.message ?? '') === (args.item.message ?? ''))
      );
    });

    if (args.item.id) {
      vars.item = {
        id: args.item.id,
        quantity: args.item.quantity,
        message: args.item.message,
      };
    } else if (args.item.skuId) {
      vars.item = {
        skuId: parseInt(args.item.skuId.toString(), 10),
        quantity: args.item.quantity,
        message: args.item.message,
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
    // check if item was added
    return this.itemsGet().then((items) => {
      if (
        !items?.find(
          (item) =>
            (item.id === args.item.id || item.skuId === args.item.skuId) &&
            item.quantity === args.item.quantity,
        )
      ) {
        return false;
      }
      return true;
    });
  }

  private async itemPackageUpdate(args: {
    packageId?: number;
    selections?: ProductPackageSelectionType[];
    item?: CartItemType;
    quantity?: number;
    updateCart?: boolean;
  }): Promise<boolean> {
    if (!this.id) {
      await this.create();
    }

    if (!this.id) {
      throw new Error('Could not update item, cart not created');
    }

    const vars: {
      id: string;
      packageId?: number;
      selections?: ProductPackageSelectionType[];
      item?: CartGroupInputType;
    } = {
      id: this.id,
    };

    const options: GraphQLQueryOptions = {
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    if (args.packageId && args.selections) {
      // set query
      options.query = queries.cartAddPackageItem;

      // set package selections
      vars.packageId = args.packageId;
      vars.selections = args.selections;
    } else if (args.item) {
      // set query
      options.query = queries.cartUpdatePackageItem;

      // set vars
      vars.item = this.createCartGroupInput({
        item: args.item,
        quantity: args.quantity ?? 1,
      });
    }
    // set variables
    const variables = await this.generateVars(vars);
    options.variables = variables;

    const updateCart = args.updateCart ?? true;
    try {
      const data = await this.runMutation(options);
      if (updateCart) {
        this.loadCartFromData(data);
      }
    } catch (e) {
      console.error('Error updating package', e);
      throw new Error('Error updating package');
    }
    return true;
  }

  private async itemAdd(args: {
    id?: string;
    skuId?: number;
    quantity?: number;
    packageId?: number;
    selections?: ProductPackageSelectionType[];
    item?: CartItemType;
    message?: string;
  }): Promise<boolean> {
    const resolvedArgs = { ...args, quantity: args.quantity ?? 1 };

    if (this._isReadOnly) {
      return false;
    }

    if (!args.item) {
      resolvedArgs.item = this._cart?.items?.find((item) => {
        return (
          item.id === resolvedArgs.id ||
          (item.skuId === resolvedArgs.skuId && (item.message ?? '') === (resolvedArgs.message ?? ''))
        );
      });
    }

    if (resolvedArgs.item) {
      resolvedArgs.quantity += resolvedArgs.item.quantity;
    }

    if ((resolvedArgs.packageId && resolvedArgs.selections) || resolvedArgs.item?.type === ItemType.PACKAGE) {
      // PACKAGE
      let quantity = resolvedArgs.quantity ?? 1;
      if (resolvedArgs.item) {
        quantity += resolvedArgs.item.quantity;
      }

      return this.itemPackageUpdate({
        packageId: resolvedArgs.packageId,
        selections: resolvedArgs.selections,
        item: resolvedArgs.item,
        quantity: resolvedArgs.quantity,
      });
    } else {
      // NO PACKAGE
      const item = this.createCartItemInput(resolvedArgs);
      return this.itemUpdate({ item });
    }
  }

  private async itemRemove(args: {
    id?: string;
    skuId?: number;
    quantity?: number;
    item?: CartItemType;
  }): Promise<boolean> {
    const resolvedArgs = { ...args, quantity: args.quantity ?? 1 };

    if (this._isReadOnly) {
      return false;
    }

    if (!args.item) {
      resolvedArgs.item = this._cart?.items?.find((item) => {
        return item.id === resolvedArgs.id || item.skuId === resolvedArgs.skuId;
      });
    }

    if (!resolvedArgs.item) {
      return false;
    }

    const newQuantity = resolvedArgs.item.quantity - resolvedArgs.quantity!;

    if (resolvedArgs.item?.type === ItemType.PACKAGE) {
      return this.itemPackageUpdate({
        item: resolvedArgs.item,
        quantity: newQuantity,
        updateCart: true,
      });
    } else {
      const updateitem = this.createCartItemInput({
        id: resolvedArgs.id,
        skuId: resolvedArgs.skuId,
        quantity: newQuantity,
      });

      return this.itemUpdate({ item: updateitem });
    }
  }

  private async itemDelete(args: {
    id?: string;
    item?: CartItemType;
    updateCart?: boolean;
  }): Promise<boolean> {
    const resolvedArgs = { ...args, quantity: 0 };

    if (this._isReadOnly) {
      return false;
    }

    if (!args.item) {
      resolvedArgs.item = this._cart?.items?.find((item) => {
        return item.id === resolvedArgs.id;
      });
    }

    if (!resolvedArgs.item) {
      return false;
    }
    const updateCart = resolvedArgs.updateCart ?? true;

    if (resolvedArgs.item?.type === ItemType.PACKAGE) {
      return this.itemPackageUpdate({
        item: resolvedArgs.item,
        quantity: 0,
        updateCart: true,
      });
    } else {
      const updateitem = this.createCartItemInput({
        id: resolvedArgs.id,
        quantity: 0,
      });

      return this.itemUpdate({ item: updateitem, updateCart });
    }
  }

  private async itemsClear(): Promise<boolean> {
    if (this._isReadOnly) {
      return false;
    }

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
  private createCartGroupInput(args: {
    groupKey?: string;
    item?: CartItemType;
    quantity: number;
  }): CartGroupInputType {
    const item: CartGroupInputType = {
      groupKey: args.groupKey ?? args.item?.groupKey ?? '',
      quantity: args.quantity,
    };

    if (args.groupKey) {
      item.groupKey = args.groupKey;
    } else if (args.item && args.item.groupKey) {
      item.groupKey = args.item.groupKey;
    } else {
      throw new Error('groupKey or item with groupkey is required');
    }

    return item;
  }

  private createCartItemInput(args: {
    id?: string;
    skuId?: number;
    item?: CartItemType;
    quantity: number;
    message?: string;
  }): CartItemInputType {
    const item: CartItemInputType = {
      quantity: args.quantity,
      message: args.message,
    };

    if (args.item) {
      item.id = args.item.id;
      item.skuId = args.item.skuId;
    } else if (args.id) {
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

  private loadCartFromData(data: any): boolean {
    const cart = parseCart(data, this._geinsSettings.locale);
    if (!cart) {
      return false;
    }
    return this.loadCart(cart);
  }

  private loadCart(cart: CartType): boolean {
    if (!cart) {
      return false;
    }
    this._id = cart.id;
    this._cart = cart;
    this._isReadOnly = cart.completed;
    this._merchantData.replaceData(cart.merchantData);
    this.cookieSet(cart.id);
    return true;
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
