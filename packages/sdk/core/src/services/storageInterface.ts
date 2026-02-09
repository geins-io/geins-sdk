/** Options for storing a value. */
export interface StorageSetOptions {
  /** Time-to-live in seconds. Interpretation depends on the adapter (cookie maxAge, etc.). */
  maxAge?: number;
}

/**
 * Pluggable storage abstraction for the session layer.
 * Implementations: {@link CookieStorageAdapter} (default, browser cookies),
 * {@link MemoryStorage} (in-memory, for tests and server-side usage).
 *
 * Consumers can provide their own implementation (e.g. Nuxt `useCookie`,
 * `localStorage`, Redis) by implementing this interface.
 */
export interface StorageInterface {
  /** Get a value by key. Returns `undefined` if the key does not exist. */
  get(key: string): string | undefined;
  /** Set a key-value pair with optional storage options. */
  set(key: string, value: string, options?: StorageSetOptions): void;
  /** Remove a key. */
  remove(key: string): void;
}
