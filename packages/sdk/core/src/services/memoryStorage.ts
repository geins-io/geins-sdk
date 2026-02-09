import type { StorageInterface, StorageSetOptions } from './storageInterface';

/**
 * In-memory StorageInterface implementation.
 * Useful for tests and server-side session usage where cookies are unavailable.
 * Does not persist across page reloads or process restarts.
 */
export class MemoryStorage implements StorageInterface {
  private _store = new Map<string, string>();

  /** @inheritdoc */
  get(key: string): string | undefined {
    return this._store.get(key);
  }

  /** @inheritdoc */
  set(key: string, value: string, _options?: StorageSetOptions): void {
    this._store.set(key, value);
  }

  /** @inheritdoc */
  remove(key: string): void {
    this._store.delete(key);
  }

  /** Remove all stored values. Test helper. */
  clear(): void {
    this._store.clear();
  }
}
