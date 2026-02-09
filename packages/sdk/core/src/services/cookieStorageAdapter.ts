import { CookieService } from './cookieService';
import type { StorageInterface, StorageSetOptions } from './storageInterface';

/**
 * StorageInterface adapter backed by browser cookies via {@link CookieService}.
 * This is the default storage used by CrmSession and CartSession.
 */
export class CookieStorageAdapter implements StorageInterface {
  private _cookieService: CookieService;

  constructor(cookieService?: CookieService) {
    this._cookieService = cookieService ?? new CookieService();
  }

  /** @inheritdoc */
  get(key: string): string | undefined {
    // CookieService.get() returns '' for missing keys; normalize to undefined
    return this._cookieService.get(key) || undefined;
  }

  /** @inheritdoc */
  set(key: string, value: string, options?: StorageSetOptions): void {
    this._cookieService.set({
      name: key,
      payload: value,
      maxAge: options?.maxAge,
    });
  }

  /** @inheritdoc */
  remove(key: string): void {
    this._cookieService.remove(key);
  }
}
