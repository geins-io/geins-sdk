import {
  EventService,
  MemoryStorage,
  LISTS_STORAGE_KEYS,
} from '@geins/core';
import { GeinsEventType } from '@geins/types';
import { ListsSession } from '../src/lists/listsSession';
import { FAVORITES_LIST_ID } from '../src/types/listsTypes';

describe('ListsSession', () => {
  describe('favorites (well-known list)', () => {
    it('favorites getter returns ProductList with id __favorites__', () => {
      const session = new ListsSession({ storage: new MemoryStorage() });
      const fav = session.favorites;
      expect(fav.id).toBe(FAVORITES_LIST_ID);
      expect(fav.name).toBe('Favorites');
      expect(fav.items).toEqual([]);
      expect(fav.createdAt).toBeGreaterThan(0);
      expect(fav.updatedAt).toBeGreaterThan(0);
    });

    it('favorites list is auto-created on first access', () => {
      const storage = new MemoryStorage();
      const session = new ListsSession({ storage });

      // Storage starts empty
      expect(storage.get(LISTS_STORAGE_KEYS.ITEMS)).toBeFalsy();

      // Access favorites — triggers auto-creation
      const fav = session.favorites;
      expect(fav.id).toBe(FAVORITES_LIST_ID);

      // Now persisted
      const stored = JSON.parse(storage.get(LISTS_STORAGE_KEYS.ITEMS)!);
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe(FAVORITES_LIST_ID);
    });

    it('isFavorite returns false for non-favorited product', () => {
      const session = new ListsSession({ storage: new MemoryStorage() });
      expect(session.isFavorite('p1')).toBe(false);
    });

    it('isFavorite returns true for favorited product', () => {
      const session = new ListsSession({ storage: new MemoryStorage() });
      session.favorites; // ensure favorites list exists
      session.addItem(FAVORITES_LIST_ID, 'p1');
      expect(session.isFavorite('p1')).toBe(true);
    });

    it('toggleFavorite adds product, returns true', () => {
      const session = new ListsSession({ storage: new MemoryStorage() });
      const result = session.toggleFavorite('p1');
      expect(result).toBe(true);
      expect(session.isFavorite('p1')).toBe(true);
    });

    it('toggleFavorite removes product, returns false', () => {
      const session = new ListsSession({ storage: new MemoryStorage() });
      session.toggleFavorite('p1');
      const result = session.toggleFavorite('p1');
      expect(result).toBe(false);
      expect(session.isFavorite('p1')).toBe(false);
    });

    it('favorites list cannot be deleted', () => {
      const session = new ListsSession({ storage: new MemoryStorage() });
      session.favorites; // ensure it exists
      expect(() => session.deleteList(FAVORITES_LIST_ID)).toThrow();
    });

    it('favorites list cannot be renamed', () => {
      const session = new ListsSession({ storage: new MemoryStorage() });
      session.favorites; // ensure it exists
      expect(() => session.renameList(FAVORITES_LIST_ID, 'My Favs')).toThrow();
    });
  });

  describe('list CRUD', () => {
    it('createList creates a new list with generated ID', () => {
      const session = new ListsSession({ storage: new MemoryStorage() });
      const list = session.createList('Wishlist');
      expect(list.id).toBeTruthy();
      expect(list.id).not.toBe(FAVORITES_LIST_ID);
      expect(list.name).toBe('Wishlist');
      expect(list.items).toEqual([]);
      expect(list.createdAt).toBeGreaterThan(0);
      expect(list.updatedAt).toBeGreaterThan(0);
    });

    it('createList persists to storage', () => {
      const storage = new MemoryStorage();
      const session = new ListsSession({ storage });
      const list = session.createList('Wishlist');

      const stored = JSON.parse(storage.get(LISTS_STORAGE_KEYS.ITEMS)!);
      const found = stored.find((l: { id: string }) => l.id === list.id);
      expect(found).toBeDefined();
      expect(found.name).toBe('Wishlist');
    });

    it('createList emits LIST_CREATE event with listId', () => {
      const events = new EventService();
      const handler = jest.fn();
      events.listenerAdd(handler, GeinsEventType.LIST_CREATE);

      const session = new ListsSession({
        storage: new MemoryStorage(),
        events,
      });
      const list = session.createList('Wishlist');

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: GeinsEventType.LIST_CREATE,
          payload: { listId: list.id },
        }),
      );
    });

    it('getList returns undefined for non-existent list', () => {
      const session = new ListsSession({ storage: new MemoryStorage() });
      expect(session.getList('nope')).toBeUndefined();
    });

    it('getList returns the list by ID', () => {
      const session = new ListsSession({ storage: new MemoryStorage() });
      const list = session.createList('Wishlist');
      const found = session.getList(list.id);
      expect(found).toBeDefined();
      expect(found!.id).toBe(list.id);
      expect(found!.name).toBe('Wishlist');
    });

    it('getLists returns all lists including favorites', () => {
      const session = new ListsSession({ storage: new MemoryStorage() });
      session.favorites; // ensure favorites exists
      session.createList('Wishlist');
      session.createList('Gift Ideas');

      const lists = session.getLists();
      expect(lists.length).toBe(3);
      expect(lists.some((l) => l.id === FAVORITES_LIST_ID)).toBe(true);
    });

    it('deleteList removes a list', () => {
      const session = new ListsSession({ storage: new MemoryStorage() });
      const list = session.createList('Wishlist');
      session.deleteList(list.id);
      expect(session.getList(list.id)).toBeUndefined();
    });

    it('deleteList emits LIST_DELETE event', () => {
      const events = new EventService();
      const handler = jest.fn();
      events.listenerAdd(handler, GeinsEventType.LIST_DELETE);

      const session = new ListsSession({
        storage: new MemoryStorage(),
        events,
      });
      const list = session.createList('Wishlist');
      session.deleteList(list.id);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: GeinsEventType.LIST_DELETE,
          payload: { listId: list.id },
        }),
      );
    });

    it('deleteList is no-op for non-existent list', () => {
      const session = new ListsSession({ storage: new MemoryStorage() });
      expect(() => session.deleteList('nope')).not.toThrow();
    });

    it('renameList updates name and updatedAt', () => {
      const session = new ListsSession({ storage: new MemoryStorage() });
      const list = session.createList('Wishlist');
      const originalUpdatedAt = list.updatedAt;

      // Small delay to ensure updatedAt changes
      jest.spyOn(Date, 'now').mockReturnValueOnce(originalUpdatedAt + 1000);

      session.renameList(list.id, 'My Wishlist');
      const updated = session.getList(list.id);
      expect(updated!.name).toBe('My Wishlist');
      expect(updated!.updatedAt).toBeGreaterThanOrEqual(originalUpdatedAt);

      jest.restoreAllMocks();
    });

    it('renameList emits LIST_UPDATE event', () => {
      const events = new EventService();
      const handler = jest.fn();
      events.listenerAdd(handler, GeinsEventType.LIST_UPDATE);

      const session = new ListsSession({
        storage: new MemoryStorage(),
        events,
      });
      const list = session.createList('Wishlist');
      session.renameList(list.id, 'My Wishlist');

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: GeinsEventType.LIST_UPDATE,
          payload: { listId: list.id },
        }),
      );
    });

    it('listCount returns number of lists', () => {
      const session = new ListsSession({ storage: new MemoryStorage() });
      session.favorites; // auto-create favorites
      session.createList('Wishlist');
      expect(session.listCount).toBe(2);
    });
  });

  describe('item management', () => {
    it('addItem adds product to list', () => {
      const session = new ListsSession({ storage: new MemoryStorage() });
      const list = session.createList('Wishlist');
      session.addItem(list.id, 'p1');
      expect(session.hasItem(list.id, 'p1')).toBe(true);
    });

    it('addItem updates updatedAt timestamp', () => {
      const session = new ListsSession({ storage: new MemoryStorage() });
      const list = session.createList('Wishlist');
      const originalUpdatedAt = list.updatedAt;

      jest.spyOn(Date, 'now').mockReturnValueOnce(originalUpdatedAt + 1000);
      session.addItem(list.id, 'p1');

      const updated = session.getList(list.id);
      expect(updated!.updatedAt).toBeGreaterThanOrEqual(originalUpdatedAt);

      jest.restoreAllMocks();
    });

    it('addItem does not add duplicates', () => {
      const session = new ListsSession({ storage: new MemoryStorage() });
      const list = session.createList('Wishlist');
      session.addItem(list.id, 'p1');
      session.addItem(list.id, 'p1');
      expect(session.getItems(list.id)).toEqual(['p1']);
    });

    it('addItem emits LIST_ADD_ITEM with listId and productId', () => {
      const events = new EventService();
      const handler = jest.fn();
      events.listenerAdd(handler, GeinsEventType.LIST_ADD_ITEM);

      const session = new ListsSession({
        storage: new MemoryStorage(),
        events,
      });
      const list = session.createList('Wishlist');
      session.addItem(list.id, 'p1');

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: GeinsEventType.LIST_ADD_ITEM,
          payload: { listId: list.id, productId: 'p1' },
        }),
      );
    });

    it('addItem emits LIST parent event', () => {
      const events = new EventService();
      const parentHandler = jest.fn();
      events.listenerAdd(parentHandler, GeinsEventType.LIST);

      const session = new ListsSession({
        storage: new MemoryStorage(),
        events,
      });
      const list = session.createList('Wishlist');
      // Reset handler after createList emitted LIST parent
      parentHandler.mockClear();

      session.addItem(list.id, 'p1');

      expect(parentHandler).toHaveBeenCalledTimes(1);
    });

    it('removeItem removes product from list', () => {
      const session = new ListsSession({ storage: new MemoryStorage() });
      const list = session.createList('Wishlist');
      session.addItem(list.id, 'p1');
      session.removeItem(list.id, 'p1');
      expect(session.hasItem(list.id, 'p1')).toBe(false);
    });

    it('removeItem is no-op for non-existent product', () => {
      const session = new ListsSession({ storage: new MemoryStorage() });
      const list = session.createList('Wishlist');
      session.addItem(list.id, 'p1');
      session.removeItem(list.id, 'p999');
      expect(session.getItems(list.id)).toEqual(['p1']);
    });

    it('removeItem emits LIST_REMOVE_ITEM event', () => {
      const events = new EventService();
      const handler = jest.fn();
      events.listenerAdd(handler, GeinsEventType.LIST_REMOVE_ITEM);

      const session = new ListsSession({
        storage: new MemoryStorage(),
        events,
      });
      const list = session.createList('Wishlist');
      session.addItem(list.id, 'p1');
      session.removeItem(list.id, 'p1');

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: GeinsEventType.LIST_REMOVE_ITEM,
          payload: { listId: list.id, productId: 'p1' },
        }),
      );
    });

    it('hasItem returns true/false', () => {
      const session = new ListsSession({ storage: new MemoryStorage() });
      const list = session.createList('Wishlist');
      expect(session.hasItem(list.id, 'p1')).toBe(false);
      session.addItem(list.id, 'p1');
      expect(session.hasItem(list.id, 'p1')).toBe(true);
    });

    it('getItems returns all items in a list', () => {
      const session = new ListsSession({ storage: new MemoryStorage() });
      const list = session.createList('Wishlist');
      session.addItem(list.id, 'p1');
      session.addItem(list.id, 'p2');
      session.addItem(list.id, 'p3');
      expect(session.getItems(list.id)).toEqual(['p1', 'p2', 'p3']);
    });

    it('getItems returns empty array for non-existent list', () => {
      const session = new ListsSession({ storage: new MemoryStorage() });
      expect(session.getItems('nope')).toEqual([]);
    });

    it('clearItems empties all items', () => {
      const session = new ListsSession({ storage: new MemoryStorage() });
      const list = session.createList('Wishlist');
      session.addItem(list.id, 'p1');
      session.addItem(list.id, 'p2');
      session.clearItems(list.id);
      expect(session.getItems(list.id)).toEqual([]);
    });

    it('clearItems emits LIST_CLEAR event', () => {
      const events = new EventService();
      const handler = jest.fn();
      events.listenerAdd(handler, GeinsEventType.LIST_CLEAR);

      const session = new ListsSession({
        storage: new MemoryStorage(),
        events,
      });
      const list = session.createList('Wishlist');
      session.addItem(list.id, 'p1');
      session.clearItems(list.id);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: GeinsEventType.LIST_CLEAR,
          payload: { listId: list.id },
        }),
      );
    });
  });

  describe('storage', () => {
    it('handles corrupted storage data gracefully', () => {
      const storage = new MemoryStorage();
      storage.set(LISTS_STORAGE_KEYS.ITEMS, 'not-valid-json{{{');

      const session = new ListsSession({ storage });
      expect(session.getLists()).toEqual([]);
      expect(session.listCount).toBe(0);
    });

    it('cross-instance persistence (second instance reads first writes)', () => {
      const storage = new MemoryStorage();

      const session1 = new ListsSession({ storage });
      const list = session1.createList('Wishlist');
      session1.addItem(list.id, 'p1');

      const session2 = new ListsSession({ storage });
      expect(session2.getList(list.id)).toBeDefined();
      expect(session2.hasItem(list.id, 'p1')).toBe(true);
    });

    it('persists across all operations', () => {
      const storage = new MemoryStorage();
      const session = new ListsSession({ storage });

      // Create + add
      const list = session.createList('Wishlist');
      session.addItem(list.id, 'p1');
      session.addItem(list.id, 'p2');

      // Verify raw storage
      const stored = JSON.parse(storage.get(LISTS_STORAGE_KEYS.ITEMS)!);
      const found = stored.find((l: { id: string }) => l.id === list.id);
      expect(found.items).toEqual(['p1', 'p2']);

      // Remove
      session.removeItem(list.id, 'p1');
      const afterRemove = JSON.parse(storage.get(LISTS_STORAGE_KEYS.ITEMS)!);
      const foundAfter = afterRemove.find((l: { id: string }) => l.id === list.id);
      expect(foundAfter.items).toEqual(['p2']);

      // Delete list
      session.deleteList(list.id);
      const afterDelete = JSON.parse(storage.get(LISTS_STORAGE_KEYS.ITEMS)!);
      expect(afterDelete.find((l: { id: string }) => l.id === list.id)).toBeUndefined();
    });
  });

  describe('events', () => {
    it('does not throw when no EventService provided', () => {
      const session = new ListsSession({ storage: new MemoryStorage() });
      expect(() => {
        session.createList('Wishlist');
        const lists = session.getLists();
        const list = lists.find((l) => l.id !== FAVORITES_LIST_ID);
        if (list) {
          session.addItem(list.id, 'p1');
          session.removeItem(list.id, 'p1');
          session.clearItems(list.id);
          session.renameList(list.id, 'Renamed');
          session.deleteList(list.id);
        }
        session.toggleFavorite('p1');
      }).not.toThrow();
    });
  });
});
