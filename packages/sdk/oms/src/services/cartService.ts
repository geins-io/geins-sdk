import type {
  CartGroupInputType,
  CartItemInputType,
  CartType,
  GeinsSettings,
  ProductPackageSelectionType,
} from '@geins/types';
import { BaseApiService, CartError, FetchPolicyOptions, GeinsError, GeinsErrorCode } from '@geins/core';
import type { ApiClientGetter, GraphQLQueryOptions } from '@geins/core';
import { queries } from '../graphql';
import { parseCart } from '../parsers/cartParser';

/**
 * Stateless cart service.
 * Every method takes a cartId (where applicable) and returns the full CartType.
 * No instance state — safe for server-side shared singletons.
 */
export class CartService extends BaseApiService {
  constructor(apiClient: ApiClientGetter, geinsSettings: GeinsSettings) {
    super(apiClient, geinsSettings);
  }

  // --- Lifecycle ---

  /** Create a new cart. Returns the full cart with its generated ID. */
  async create(): Promise<CartType> {
    const options: GraphQLQueryOptions = {
      query: queries.cartCreate,
      variables: this.createVariables({}),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    const data = await this.runMutation(options);
    const cart = parseCart(data, this._geinsSettings.locale);
    if (!cart) {
      throw new CartError('Failed to create cart');
    }
    return cart;
  }

  /** Get an existing cart by ID. */
  async get(cartId: string, forceRefresh = false): Promise<CartType> {
    const options: GraphQLQueryOptions = {
      query: queries.cartGet,
      variables: this.createVariables({ id: cartId, forceRefresh }),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    try {
      const data = await this.runQuery(options);
      const cart = parseCart(data, this._geinsSettings.locale);
      if (!cart) {
        throw new CartError('Cart not found', GeinsErrorCode.CART_NOT_FOUND);
      }
      return cart;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      if (message.includes("Variable '$id' is invalid")) {
        return this.create();
      }
      throw new CartError('Error getting cart', GeinsErrorCode.CART_OPERATION_FAILED, e);
    }
  }

  /** Mark a cart as completed. Returns the completed cart. */
  async complete(cartId: string): Promise<CartType> {
    const options: GraphQLQueryOptions = {
      query: queries.cartComplete,
      variables: this.createVariables({ id: cartId }),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    const data = await this.runQuery(options);
    const cart = parseCart(data, this._geinsSettings.locale);
    if (!cart) {
      throw new CartError('Failed to complete cart');
    }
    return cart;
  }

  /** Copy a cart. Returns the new cart. */
  async copy(cartId: string, options?: { resetPromotions?: boolean }): Promise<CartType> {
    const resetPromotions = options?.resetPromotions ?? true;

    const queryOptions: GraphQLQueryOptions = {
      query: queries.cartCopy,
      variables: this.createVariables({ id: cartId, resetPromotions }),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    const data = await this.runMutation(queryOptions);
    const cart = parseCart(data, this._geinsSettings.locale);
    if (!cart) {
      throw new CartError('Failed to copy cart');
    }
    return cart;
  }

  // --- Item mutations ---

  /** Add an item to the cart. If the item already exists, use {@link updateItem} to set the new quantity. */
  async addItem(cartId: string, input: CartItemInputType): Promise<CartType> {
    const item = this.normalizeItemInput(input);
    const options: GraphQLQueryOptions = {
      query: queries.cartAddItem,
      variables: this.createVariables({ id: cartId, item }),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    const data = await this.runMutation(options);
    const cart = parseCart(data, this._geinsSettings.locale);
    if (!cart) {
      throw new CartError('Failed to add item to cart');
    }
    return cart;
  }

  /** Update an existing item's quantity in the cart. */
  async updateItem(cartId: string, input: CartItemInputType): Promise<CartType> {
    const item = this.normalizeItemInput(input);
    const options: GraphQLQueryOptions = {
      query: queries.cartUpdateItem,
      variables: this.createVariables({ id: cartId, item }),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    const data = await this.runMutation(options);
    const cart = parseCart(data, this._geinsSettings.locale);
    if (!cart) {
      throw new CartError('Failed to update item in cart');
    }
    return cart;
  }

  /** Delete an item from the cart (sets quantity to 0). */
  async deleteItem(cartId: string, itemId: string): Promise<CartType> {
    return this.updateItem(cartId, { id: itemId, quantity: 0 });
  }

  // --- Package item mutations ---

  /** Add a package item to the cart. */
  async addPackageItem(
    cartId: string,
    packageId: number,
    selections: ProductPackageSelectionType[],
  ): Promise<CartType> {
    const options: GraphQLQueryOptions = {
      query: queries.cartAddPackageItem,
      variables: this.createVariables({ id: cartId, packageId, selections }),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    const data = await this.runMutation(options);
    const cart = parseCart(data, this._geinsSettings.locale);
    if (!cart) {
      throw new CartError('Failed to add package item to cart');
    }
    return cart;
  }

  /** Update a package item in the cart. */
  async updatePackageItem(cartId: string, input: CartGroupInputType): Promise<CartType> {
    const options: GraphQLQueryOptions = {
      query: queries.cartUpdatePackageItem,
      variables: this.createVariables({ id: cartId, item: input }),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    const data = await this.runMutation(options);
    const cart = parseCart(data, this._geinsSettings.locale);
    if (!cart) {
      throw new CartError('Failed to update package item in cart');
    }
    return cart;
  }

  // --- Modifiers ---

  /** Apply a promotion code to the cart. */
  async setPromotionCode(cartId: string, code: string): Promise<CartType> {
    const options: GraphQLQueryOptions = {
      query: queries.cartSetPromotionCode,
      variables: this.createVariables({ id: cartId, promoCode: code }),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    const data = await this.runMutation(options);
    const cart = parseCart(data, this._geinsSettings.locale);
    if (!cart) {
      throw new CartError('Failed to set promotion code');
    }
    return cart;
  }

  /** Remove the promotion code from the cart. */
  async removePromotionCode(cartId: string): Promise<CartType> {
    return this.setPromotionCode(cartId, '');
  }

  /** Set a shipping fee on the cart. */
  async setShippingFee(cartId: string, fee: number): Promise<CartType> {
    const options: GraphQLQueryOptions = {
      query: queries.cartSetShippingFee,
      variables: this.createVariables({ id: cartId, shippingFee: fee }),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    const data = await this.runMutation(options);
    const cart = parseCart(data, this._geinsSettings.locale);
    if (!cart) {
      throw new CartError('Failed to set shipping fee');
    }
    return cart;
  }

  /** Set merchant data on the cart. */
  async setMerchantData(cartId: string, data: string): Promise<CartType> {
    const options: GraphQLQueryOptions = {
      query: queries.cartSetMerchantData,
      variables: this.createVariables({ id: cartId, merchantData: data }),
      requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE },
    };

    const result = await this.runMutation(options);
    const cart = parseCart(result, this._geinsSettings.locale);
    if (!cart) {
      throw new CartError('Failed to set merchant data');
    }
    return cart;
  }

  // --- Private helpers ---

  /**
   * Normalize a cart item input, ensuring either id or skuId is present.
   * @throws GeinsError if neither id nor skuId is provided.
   */
  private normalizeItemInput(input: CartItemInputType): CartItemInputType {
    const item: CartItemInputType = {
      quantity: input.quantity,
      message: input.message,
    };

    if (input.id) {
      item.id = input.id;
    } else if (input.skuId != null) {
      item.skuId = typeof input.skuId === 'number' ? input.skuId : parseInt(String(input.skuId), 10);
    } else {
      throw new GeinsError('Item id or skuId is required', GeinsErrorCode.INVALID_ARGUMENT);
    }

    return item;
  }
}
