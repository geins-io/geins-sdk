/**
 * Favorites session interface.
 * Manages a client-side list of favorite product IDs with storage persistence.
 */
export interface FavoritesInterface {
  /** Get all favorite product IDs. */
  getAll(): string[];
  /** Check if a product is in favorites. */
  has(productId: string): boolean;
  /** Add a product to favorites. */
  add(productId: string): void;
  /** Remove a product from favorites. */
  remove(productId: string): void;
  /** Toggle a product's favorite status. Returns true if added, false if removed. */
  toggle(productId: string): boolean;
  /** Clear all favorites. */
  clear(): void;
  /** Number of favorite items. */
  readonly count: number;
}
