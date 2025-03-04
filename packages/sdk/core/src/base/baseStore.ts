
export interface IStore {
    /**
   * Sets a key-value pair in the cache.
   * @param key - The key under which the value is stored.
   * @param value - The value to store.
   * @returns A promise that resolves when the operation is complete.
   */
  setKey(key: string, value: string): Promise<void>;
  /**
   * Retrieves a value from the cache by its key.
   * @param key - The key of the value to retrieve.
   * @returns A promise that resolves to the value or null if not found.
   */
  getKey(key: string): Promise<string | null>;
  /**
   * Retrieves all keys from the cache.
   * @returns A promise that resolves to an array of all keys
   */
  getKeys(): Promise<string[]>;

  /**
   * Deletes a key-value pair from the cache.
   * @param key - The key of the value to delete.
   * @returns A promise that resolves when the operation is complete.
   */
  deleteKey(key: string): Promise<void>;

  /**
   * Has key in the cache.
   * @param key - The key of the value to check.
   * @returns A promise that resolves to true if the key exists in the cache, false otherwise.
   *
   */
  hasKey(key: string): Promise<boolean>;

  /**
   * Clears the cache.
   * @returns A promise that resolves when the operation is complete.
   */
  clearStore(): Promise<void>;

  /**
   * Destroys the cache.
   * @returns A promise that resolves when the operation is complete.
   */
  destroy(): Promise<void>;

}



