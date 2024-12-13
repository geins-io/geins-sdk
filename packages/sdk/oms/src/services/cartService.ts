import { BaseApiService } from '@geins/core';
import type { CartType, CartItemType } from '@geins/types';

export class CartService extends BaseApiService {
  private _id!: string | undefined;
  private _items: CartItemType[] = [];
  private _cart!: CartType;

  private async generateVars(variables: any) {
    return this.createVariables(variables);
  }

  get id(): string | undefined {
    return this._id;
  }

  async create(): Promise<CartType> {
    throw new Error('Method not implemented.');
    /*
    // set cookie
    this._id = 'cart-id-123';
    this._cart = {} as CartType;

    const options: any = {
      query: 'mutation { createCart }',
      variables: await this.generateVars(variables),
    };
    return await this.runQuery(options);
 */
    return this._cart;
  }

  async get(id: string | undefined): Promise<any> {
    throw new Error('Method not implemented.');
    if (!this._id && !id) {
      return this.create();
    }
    return this._cart;
  }

  async add(item: any): Promise<any> {
    throw new Error('Method not implemented.');
    if (!this._id) {
      this.create();
    }

    this._items.push(item);
    return this._items;
  }

  async remove(item: any): Promise<any> {
    throw new Error('Method not implemented.');
    this._items = this._items.filter(i => i !== item);
    return this._items;
  }

  async clear(): Promise<void> {
    throw new Error('Method not implemented.');
    this._id = undefined;
    this._items = [];
  }

  parse(result: any): CartType {
    throw new Error('Method not implemented.');
    return {} as CartType;
  }
}
