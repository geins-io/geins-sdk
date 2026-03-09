import {
  EventService,
  MemoryStorage,
  FAVORITES_STORAGE_KEYS,
} from '@geins/core';
import { GeinsEventType } from '@geins/types';
import { FavoritesSession } from '../src/favorites/favoritesSession';

describe('FavoritesSession', () => {
  describe('constructor', () => {
    it('starts with empty favorites when storage is empty', () => {
      const session = new FavoritesSession({ storage: new MemoryStorage() });
      expect(session.getAll()).toEqual([]);
      expect(session.count).toBe(0);
    });

    it('restores favorites from storage', () => {
      const storage = new MemoryStorage();
      storage.set(FAVORITES_STORAGE_KEYS.ITEMS, JSON.stringify(['p1', 'p2']));

      const session = new FavoritesSession({ storage });
      expect(session.getAll()).toEqual(['p1', 'p2']);
      expect(session.count).toBe(2);
    });

    it('handles corrupted storage data gracefully', () => {
      const storage = new MemoryStorage();
      storage.set(FAVORITES_STORAGE_KEYS.ITEMS, 'not-valid-json{{{');

      const session = new FavoritesSession({ storage });
      expect(session.getAll()).toEqual([]);
      expect(session.count).toBe(0);
    });
  });

  describe('add', () => {
    it('adds a product ID to favorites', () => {
      const session = new FavoritesSession({ storage: new MemoryStorage() });
      session.add('p1');
      expect(session.has('p1')).toBe(true);
    });

    it('persists to storage after add', () => {
      const storage = new MemoryStorage();
      const session = new FavoritesSession({ storage });
      session.add('p1');

      const stored = storage.get(FAVORITES_STORAGE_KEYS.ITEMS);
      expect(JSON.parse(stored!)).toEqual(['p1']);
    });

    it('does not add duplicate IDs', () => {
      const session = new FavoritesSession({ storage: new MemoryStorage() });
      session.add('p1');
      session.add('p1');
      expect(session.getAll()).toEqual(['p1']);
      expect(session.count).toBe(1);
    });

    it('emits FAVORITES_ADD event with productId payload', () => {
      const events = new EventService();
      const handler = jest.fn();
      events.listenerAdd(handler, GeinsEventType.FAVORITES_ADD);

      const session = new FavoritesSession({
        storage: new MemoryStorage(),
        events,
      });
      session.add('p1');

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: GeinsEventType.FAVORITES_ADD,
          payload: { productId: 'p1' },
        }),
      );
    });

    it('emits FAVORITES parent event alongside FAVORITES_ADD', () => {
      const events = new EventService();
      const parentHandler = jest.fn();
      events.listenerAdd(parentHandler, GeinsEventType.FAVORITES);

      const session = new FavoritesSession({
        storage: new MemoryStorage(),
        events,
      });
      session.add('p1');

      expect(parentHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('removes an existing product ID', () => {
      const session = new FavoritesSession({ storage: new MemoryStorage() });
      session.add('p1');
      session.remove('p1');
      expect(session.has('p1')).toBe(false);
    });

    it('persists to storage after remove', () => {
      const storage = new MemoryStorage();
      const session = new FavoritesSession({ storage });
      session.add('p1');
      session.add('p2');
      session.remove('p1');

      const stored = storage.get(FAVORITES_STORAGE_KEYS.ITEMS);
      expect(JSON.parse(stored!)).toEqual(['p2']);
    });

    it('is a no-op for non-existent ID', () => {
      const session = new FavoritesSession({ storage: new MemoryStorage() });
      session.add('p1');
      session.remove('p999');
      expect(session.getAll()).toEqual(['p1']);
    });

    it('emits FAVORITES_REMOVE event with productId payload', () => {
      const events = new EventService();
      const handler = jest.fn();
      events.listenerAdd(handler, GeinsEventType.FAVORITES_REMOVE);

      const session = new FavoritesSession({
        storage: new MemoryStorage(),
        events,
      });
      session.add('p1');
      session.remove('p1');

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: GeinsEventType.FAVORITES_REMOVE,
          payload: { productId: 'p1' },
        }),
      );
    });
  });

  describe('toggle', () => {
    it('adds product if not in favorites, returns true', () => {
      const session = new FavoritesSession({ storage: new MemoryStorage() });
      const result = session.toggle('p1');
      expect(result).toBe(true);
      expect(session.has('p1')).toBe(true);
    });

    it('removes product if already in favorites, returns false', () => {
      const session = new FavoritesSession({ storage: new MemoryStorage() });
      session.add('p1');
      const result = session.toggle('p1');
      expect(result).toBe(false);
      expect(session.has('p1')).toBe(false);
    });
  });

  describe('has', () => {
    it('returns true for a favorited product', () => {
      const session = new FavoritesSession({ storage: new MemoryStorage() });
      session.add('p1');
      expect(session.has('p1')).toBe(true);
    });

    it('returns false for a non-favorited product', () => {
      const session = new FavoritesSession({ storage: new MemoryStorage() });
      expect(session.has('p1')).toBe(false);
    });
  });

  describe('getAll', () => {
    it('returns all favorite IDs', () => {
      const session = new FavoritesSession({ storage: new MemoryStorage() });
      session.add('p1');
      session.add('p2');
      session.add('p3');
      expect(session.getAll()).toEqual(['p1', 'p2', 'p3']);
    });

    it('returns empty array when no favorites', () => {
      const session = new FavoritesSession({ storage: new MemoryStorage() });
      expect(session.getAll()).toEqual([]);
    });

    it('reads from storage each time (no stale cache)', () => {
      const storage = new MemoryStorage();
      const session = new FavoritesSession({ storage });
      session.add('p1');

      // Externally mutate storage (simulates another tab)
      storage.set(FAVORITES_STORAGE_KEYS.ITEMS, JSON.stringify(['p1', 'pX']));

      expect(session.getAll()).toEqual(['p1', 'pX']);
    });
  });

  describe('clear', () => {
    it('removes all favorites', () => {
      const session = new FavoritesSession({ storage: new MemoryStorage() });
      session.add('p1');
      session.add('p2');
      session.clear();
      expect(session.getAll()).toEqual([]);
      expect(session.count).toBe(0);
    });

    it('persists empty state to storage', () => {
      const storage = new MemoryStorage();
      const session = new FavoritesSession({ storage });
      session.add('p1');
      session.clear();

      const stored = storage.get(FAVORITES_STORAGE_KEYS.ITEMS);
      expect(JSON.parse(stored!)).toEqual([]);
    });

    it('emits FAVORITES_CLEAR event', () => {
      const events = new EventService();
      const handler = jest.fn();
      events.listenerAdd(handler, GeinsEventType.FAVORITES_CLEAR);

      const session = new FavoritesSession({
        storage: new MemoryStorage(),
        events,
      });
      session.add('p1');
      session.clear();

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('count', () => {
    it('returns the number of favorites', () => {
      const session = new FavoritesSession({ storage: new MemoryStorage() });
      session.add('p1');
      session.add('p2');
      expect(session.count).toBe(2);
    });

    it('returns 0 when empty', () => {
      const session = new FavoritesSession({ storage: new MemoryStorage() });
      expect(session.count).toBe(0);
    });
  });

  describe('events', () => {
    it('does not throw when no EventService provided', () => {
      const session = new FavoritesSession({ storage: new MemoryStorage() });
      expect(() => {
        session.add('p1');
        session.remove('p1');
        session.clear();
      }).not.toThrow();
    });
  });

  describe('cross-instance persistence', () => {
    it('second instance reads what first instance wrote', () => {
      const storage = new MemoryStorage();

      const session1 = new FavoritesSession({ storage });
      session1.add('p1');
      session1.add('p2');

      const session2 = new FavoritesSession({ storage });
      expect(session2.getAll()).toEqual(['p1', 'p2']);
      expect(session2.count).toBe(2);
    });
  });
});
