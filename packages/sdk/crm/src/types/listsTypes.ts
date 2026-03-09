/** Reserved list ID for the built-in favorites list. */
export const FAVORITES_LIST_ID = '__favorites__';

/** A named product list containing product aliases. */
export interface ProductList {
  /** Unique identifier. Reserved: '__favorites__'. */
  id: string;
  /** Display name for the list. */
  name: string;
  /** Product aliases in this list. */
  items: string[];
  /** Timestamp (Date.now()) when the list was created. */
  createdAt: number;
  /** Timestamp (Date.now()) of the last mutation. */
  updatedAt: number;
}

/** Unified product lists interface — manages all lists including favorites. */
export interface ListsInterface {
  /** The built-in favorites list (auto-created on first access). */
  readonly favorites: ProductList;
  /** Check if a product is in the favorites list. */
  isFavorite(productId: string): boolean;
  /** Toggle a product in the favorites list. Returns true if added, false if removed. */
  toggleFavorite(productId: string): boolean;

  /** Get all product lists (including favorites). */
  getLists(): ProductList[];
  /** Get a specific list by ID, or undefined if not found. */
  getList(listId: string): ProductList | undefined;
  /** Create a new product list with the given name. Returns the created list. */
  createList(name: string): ProductList;
  /** Delete a product list. Throws if listId is '__favorites__'. */
  deleteList(listId: string): void;
  /** Rename a product list. Throws if listId is '__favorites__'. */
  renameList(listId: string, name: string): void;

  /** Add a product to a list. No-op if already present. */
  addItem(listId: string, productId: string): void;
  /** Remove a product from a list. No-op if not present. */
  removeItem(listId: string, productId: string): void;
  /** Check if a product is in a list. */
  hasItem(listId: string, productId: string): boolean;
  /** Get all product IDs in a list. */
  getItems(listId: string): string[];
  /** Remove all items from a list. */
  clearItems(listId: string): void;

  /** Total number of lists (including favorites). */
  readonly listCount: number;
}
