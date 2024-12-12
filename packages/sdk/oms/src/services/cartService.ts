import { BaseApiService } from '@geins/core';
import type { CartType, CartItemType } from '@geins/types';

export class CartService extends BaseApiService {
  private _id!: string;
  private _items: CartItemType[] = [];
  private async generateVars(variables: any) {
    if (!variables.alias) {
      throw new Error('Alias is required');
    }
    return this.createVariables(variables);
  }

  async create(): Promise<any> {
    return true;
  }
  async get(): Promise<any> {
    return this._items;
  }
  async add(item: any): Promise<any> {
    this._items.push(item);
    return this._items;
  }
  async remove(item: any): Promise<any> {
    this._items = this._items.filter(i => i !== item);
    return this._items;
  }
  async clear(): Promise<any> {
    this._items = [];
    return this._items;
  }
}
