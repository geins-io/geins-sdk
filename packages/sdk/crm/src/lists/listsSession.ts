import {
  LISTS_STORAGE_KEYS,
  LISTS_STORAGE_MAX_AGE,
  CookieStorageAdapter,
} from '@geins/core';
import type { EventService, StorageInterface } from '@geins/core';
import type { GeinsEventMessage } from '@geins/types';
import { GeinsEventType } from '@geins/types';
import type { ListsInterface, ProductList } from '../types/listsTypes';
import { FAVORITES_LIST_ID } from '../types/listsTypes';

export interface ListsSessionOptions {
  storage?: StorageInterface;
  events?: EventService;
}

/**
 * Client-side product lists session.
 * Manages multiple named product lists (including a built-in favorites list)
 * with storage persistence and event emission.
 *
 * Always reads from storage on every operation (no in-memory cache)
 * so that cross-tab writes are immediately visible.
 */
export class ListsSession implements ListsInterface {
  private _storage: StorageInterface;
  private _events?: EventService;

  constructor(options?: ListsSessionOptions) {
    this._storage = options?.storage ?? new CookieStorageAdapter();
    this._events = options?.events;
  }

  // --- Favorites shortcuts ---

  get favorites(): ProductList {
    const lists = this.readFromStorage();
    const fav = lists.find((l) => l.id === FAVORITES_LIST_ID);
    if (fav) {
      return fav;
    }

    // Auto-create favorites list on first access
    const now = Date.now();
    const newFav: ProductList = {
      id: FAVORITES_LIST_ID,
      name: 'Favorites',
      items: [],
      createdAt: now,
      updatedAt: now,
    };
    lists.push(newFav);
    this.writeToStorage(lists);
    return newFav;
  }

  isFavorite(productId: string): boolean {
    return this.hasItem(FAVORITES_LIST_ID, productId);
  }

  toggleFavorite(productId: string): boolean {
    if (this.isFavorite(productId)) {
      this.removeItem(FAVORITES_LIST_ID, productId);
      return false;
    }
    // Ensure favorites list exists before adding
    this.favorites;
    this.addItem(FAVORITES_LIST_ID, productId);
    return true;
  }

  // --- List CRUD ---

  getLists(): ProductList[] {
    return this.readFromStorage();
  }

  getList(listId: string): ProductList | undefined {
    return this.readFromStorage().find((l) => l.id === listId);
  }

  createList(name: string): ProductList {
    const lists = this.readFromStorage();
    const now = Date.now();
    const newList: ProductList = {
      id: this.generateId(),
      name,
      items: [],
      createdAt: now,
      updatedAt: now,
    };
    lists.push(newList);
    this.writeToStorage(lists);
    this.emitEvent(GeinsEventType.LIST_CREATE, { listId: newList.id });
    return newList;
  }

  deleteList(listId: string): void {
    if (listId === FAVORITES_LIST_ID) {
      throw new Error('Cannot delete the favorites list');
    }
    const lists = this.readFromStorage();
    const index = lists.findIndex((l) => l.id === listId);
    if (index === -1) {
      return;
    }
    lists.splice(index, 1);
    this.writeToStorage(lists);
    this.emitEvent(GeinsEventType.LIST_DELETE, { listId });
  }

  renameList(listId: string, name: string): void {
    if (listId === FAVORITES_LIST_ID) {
      throw new Error('Cannot rename the favorites list');
    }
    const lists = this.readFromStorage();
    const list = lists.find((l) => l.id === listId);
    if (!list) {
      return;
    }
    list.name = name;
    list.updatedAt = Date.now();
    this.writeToStorage(lists);
    this.emitEvent(GeinsEventType.LIST_UPDATE, { listId });
  }

  // --- Item management ---

  addItem(listId: string, productId: string): void {
    const lists = this.readFromStorage();
    const list = lists.find((l) => l.id === listId);
    if (!list) {
      return;
    }
    if (list.items.includes(productId)) {
      return;
    }
    list.items.push(productId);
    list.updatedAt = Date.now();
    this.writeToStorage(lists);
    this.emitEvent(GeinsEventType.LIST_ADD_ITEM, { listId, productId });
  }

  removeItem(listId: string, productId: string): void {
    const lists = this.readFromStorage();
    const list = lists.find((l) => l.id === listId);
    if (!list) {
      return;
    }
    const index = list.items.indexOf(productId);
    if (index === -1) {
      return;
    }
    list.items.splice(index, 1);
    list.updatedAt = Date.now();
    this.writeToStorage(lists);
    this.emitEvent(GeinsEventType.LIST_REMOVE_ITEM, { listId, productId });
  }

  hasItem(listId: string, productId: string): boolean {
    const list = this.readFromStorage().find((l) => l.id === listId);
    if (!list) {
      return false;
    }
    return list.items.includes(productId);
  }

  getItems(listId: string): string[] {
    const list = this.readFromStorage().find((l) => l.id === listId);
    if (!list) {
      return [];
    }
    return list.items;
  }

  clearItems(listId: string): void {
    const lists = this.readFromStorage();
    const list = lists.find((l) => l.id === listId);
    if (!list) {
      return;
    }
    list.items = [];
    list.updatedAt = Date.now();
    this.writeToStorage(lists);
    this.emitEvent(GeinsEventType.LIST_CLEAR, { listId });
  }

  get listCount(): number {
    return this.readFromStorage().length;
  }

  // --- Storage ---

  private readFromStorage(): ProductList[] {
    const raw = this._storage.get(LISTS_STORAGE_KEYS.ITEMS);
    if (!raw) {
      return [];
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch {
      return [];
    }
  }

  private writeToStorage(lists: ProductList[]): void {
    this._storage.set(LISTS_STORAGE_KEYS.ITEMS, JSON.stringify(lists), {
      maxAge: LISTS_STORAGE_MAX_AGE.DEFAULT,
    });
  }

  // --- ID generation ---

  private generateId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  // --- Event emission ---

  private emitEvent(eventType: GeinsEventType, payload: unknown): void {
    if (!this._events) {
      return;
    }

    const message: GeinsEventMessage = {
      subject: eventType,
      payload,
    };

    const eventStr = eventType as string;
    if (eventStr.includes('_')) {
      const parent = eventStr.split('_')[0];
      this._events.push(message, parent);
    }

    this._events.push(message, eventStr);
  }
}
