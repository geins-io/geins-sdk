import {
  FAVORITES_STORAGE_KEYS,
  FAVORITES_STORAGE_MAX_AGE,
  CookieStorageAdapter,
} from '@geins/core';
import type { EventService, StorageInterface } from '@geins/core';
import type { GeinsEventMessage } from '@geins/types';
import { GeinsEventType } from '@geins/types';
import type { FavoritesInterface } from '../types/favoritesTypes';

export interface FavoritesSessionOptions {
  storage?: StorageInterface;
  events?: EventService;
}

/**
 * Client-side favorites session.
 * Manages a list of favorite product IDs with storage persistence
 * and event emission.
 *
 * Always reads from storage on every operation (no in-memory cache)
 * so that cross-tab writes are immediately visible.
 */
export class FavoritesSession implements FavoritesInterface {
  private _storage: StorageInterface;
  private _events?: EventService;

  constructor(options?: FavoritesSessionOptions) {
    this._storage = options?.storage ?? new CookieStorageAdapter();
    this._events = options?.events;
  }

  getAll(): string[] {
    return this.readFromStorage();
  }

  has(productId: string): boolean {
    return this.readFromStorage().includes(productId);
  }

  add(productId: string): void {
    const items = this.readFromStorage();
    if (items.includes(productId)) {
      return;
    }
    items.push(productId);
    this.writeToStorage(items);
    this.emitEvent(GeinsEventType.FAVORITES_ADD, { productId });
  }

  remove(productId: string): void {
    const items = this.readFromStorage();
    const index = items.indexOf(productId);
    if (index === -1) {
      return;
    }
    items.splice(index, 1);
    this.writeToStorage(items);
    this.emitEvent(GeinsEventType.FAVORITES_REMOVE, { productId });
  }

  toggle(productId: string): boolean {
    if (this.has(productId)) {
      this.remove(productId);
      return false;
    }
    this.add(productId);
    return true;
  }

  clear(): void {
    this.writeToStorage([]);
    this.emitEvent(GeinsEventType.FAVORITES_CLEAR, {});
  }

  get count(): number {
    return this.readFromStorage().length;
  }

  // --- Storage ---

  private readFromStorage(): string[] {
    const raw = this._storage.get(FAVORITES_STORAGE_KEYS.ITEMS);
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

  private writeToStorage(items: string[]): void {
    this._storage.set(FAVORITES_STORAGE_KEYS.ITEMS, JSON.stringify(items), {
      maxAge: FAVORITES_STORAGE_MAX_AGE.DEFAULT,
    });
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
