import NodeCache from '@cacheable/node-cache';
import { IStore } from '../base';

const TTL_SECONDS = 60 * 60 * 24; // 24 hours

/**
 * RoutingStore implements the IStore interface using NodeCache for in-memory caching.
 */
export class RoutingStore implements IStore {
  private store: NodeCache;

  constructor() {
    this.store = new NodeCache({
      stdTTL: TTL_SECONDS,
      checkperiod: TTL_SECONDS * 0.2,
      useClones: false,
    });
  }

  /**
   * Sets a key-value pair in the cache.
   * @param key - The key under which the value is stored.
   * @param value - The value to store.
   * @returns A promise that resolves when the operation is complete.
   */
  public async setKey(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }

  /**
   * Retrieves a value from the cache by its key.
   * @param key - The key of the value to retrieve.
   * @returns A promise that resolves to the value or null if not found.
   */
  public async getKey(key: string): Promise<string | null> {
    const value = this.store.get<string>(key);
    return value !== undefined ? value : null;
  }

  /**
   * Retrieves all keys from the cache.
   * @returns A promise that resolves to an array of all keys.
   */
  public async getKeys(): Promise<string[]> {
    return this.store.keys();
  }

  /**
   * Deletes a key-value pair from the cache.
   * @param key - The key of the value to delete.
   * @returns A promise that resolves when the operation is complete.
   */
  public async deleteKey(key: string): Promise<void> {
    this.store.del(key);
  }
}
