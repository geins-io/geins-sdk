import { EventService, MemoryStorage, AUTH_STORAGE_KEYS } from '@geins/core';
import { GeinsEventType } from '@geins/types';
import type { AuthResponse } from '@geins/types';
import { TokenExpiredError, TokenRefreshError } from '@geins/core';
import { CrmSession } from '../src/sessions/crmSession';
import { AuthService } from '../src/auth/authService';

// --- Helpers ---

function createMockCRM(overrides: Partial<ReturnType<typeof defaultAuth>> = {}) {
  const auth = { ...defaultAuth(), ...overrides };
  return {
    auth,
    user: {
      get: jest.fn().mockResolvedValue({ email: 'luke@tatooine.com' }),
      update: jest.fn().mockResolvedValue({ email: 'luke@tatooine.com' }),
    },
  } as any;
}

function defaultAuth() {
  return {
    login: jest.fn().mockResolvedValue(successResponse()),
    refresh: jest.fn().mockResolvedValue(successResponse('new-token', 'new-refresh')),
    getUser: jest.fn().mockResolvedValue(successResponse()),
    authorized: jest.fn().mockResolvedValue(true),
    logout: jest.fn(),
  };
}

function successResponse(token = 'user-token', refreshToken = 'refresh-token'): AuthResponse {
  return {
    succeeded: true,
    user: { username: 'luke', customerType: 'PERSON' },
    tokens: {
      token,
      refreshToken,
      expiresIn: 900,
      expired: false,
      expiresSoon: false,
      expires: Math.floor(Date.now() / 1000) + 900,
    },
  };
}

// --- Tests ---

describe('CrmSession', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('restores tokens from storage', () => {
      const storage = new MemoryStorage();
      storage.set(AUTH_STORAGE_KEYS.USER_AUTH, 'stored-user-token');
      storage.set(AUTH_STORAGE_KEYS.REFRESH_TOKEN, 'stored-refresh-token');

      const session = new CrmSession(createMockCRM(), { storage });
      expect(session.userToken).toBe('stored-user-token');
      expect(session.refreshToken).toBe('stored-refresh-token');
      expect(session.isAuthenticated).toBe(true);
    });

    it('starts unauthenticated with empty storage', () => {
      const session = new CrmSession(createMockCRM(), { storage: new MemoryStorage() });
      expect(session.isAuthenticated).toBe(false);
      expect(session.userToken).toBeUndefined();
      expect(session.refreshToken).toBeUndefined();
    });
  });

  describe('login', () => {
    it('stores tokens and emits USER_LOGIN', async () => {
      const storage = new MemoryStorage();
      const events = new EventService();
      const handler = jest.fn();
      events.listenerAdd(handler, GeinsEventType.USER_LOGIN);

      const session = new CrmSession(createMockCRM(), { storage, events });
      const result = await session.login({ username: 'luke', password: 'force' });

      expect(result?.succeeded).toBe(true);
      expect(session.isAuthenticated).toBe(true);
      expect(storage.get(AUTH_STORAGE_KEYS.USER_AUTH)).toBe('user-token');
      expect(storage.get(AUTH_STORAGE_KEYS.REFRESH_TOKEN)).toBe('refresh-token');
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('logout', () => {
    it('clears auth and emits USER_LOGOUT', () => {
      const storage = new MemoryStorage();
      storage.set(AUTH_STORAGE_KEYS.USER_AUTH, 'tok');
      storage.set(AUTH_STORAGE_KEYS.REFRESH_TOKEN, 'ref');

      const events = new EventService();
      const handler = jest.fn();
      events.listenerAdd(handler, GeinsEventType.USER_LOGOUT);

      const session = new CrmSession(createMockCRM(), { storage, events });
      session.logout();

      expect(session.isAuthenticated).toBe(false);
      expect(session.userToken).toBeUndefined();
      expect(storage.get(AUTH_STORAGE_KEYS.USER_AUTH)).toBeUndefined();
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('auto-refresh', () => {
    it('getUser() refreshes an expired token transparently', async () => {
      const storage = new MemoryStorage();
      storage.set(AUTH_STORAGE_KEYS.REFRESH_TOKEN, 'old-refresh');
      // No user token — forces refresh

      const crm = createMockCRM();
      const session = new CrmSession(crm, { storage });

      const user = await session.getUser();

      expect(crm.auth.refresh).toHaveBeenCalledWith('old-refresh');
      expect(crm.user.get).toHaveBeenCalledWith('new-token');
      expect(user).toBeDefined();
    });

    it('getUser() skips refresh when token is still valid', async () => {
      const storage = new MemoryStorage();
      storage.set(AUTH_STORAGE_KEYS.REFRESH_TOKEN, 'refresh');
      storage.set(AUTH_STORAGE_KEYS.USER_AUTH, 'valid-token');

      // Mock the static JWT parser to return a non-expiring token
      jest.spyOn(AuthService, 'getUserObjectFromToken').mockReturnValue({
        succeeded: true,
        tokens: { expired: false, expiresSoon: false, expiresIn: 800, token: 'valid-token' },
      });

      const crm = createMockCRM();
      const session = new CrmSession(crm, { storage });

      await session.getUser();

      expect(crm.auth.refresh).not.toHaveBeenCalled();
      expect(crm.user.get).toHaveBeenCalledWith('valid-token');
    });
  });

  describe('refresh deduplication', () => {
    it('concurrent getUser() calls trigger only one refresh', async () => {
      const storage = new MemoryStorage();
      storage.set(AUTH_STORAGE_KEYS.REFRESH_TOKEN, 'refresh');
      // No user token — forces refresh

      const crm = createMockCRM();
      const session = new CrmSession(crm, { storage });

      await Promise.all([session.getUser(), session.getUser(), session.getUser()]);

      expect(crm.auth.refresh).toHaveBeenCalledTimes(1);
    });
  });

  describe('events', () => {
    it('emits SESSION_REFRESH on successful refresh', async () => {
      const storage = new MemoryStorage();
      storage.set(AUTH_STORAGE_KEYS.REFRESH_TOKEN, 'refresh');

      const events = new EventService();
      const handler = jest.fn();
      events.listenerAdd(handler, GeinsEventType.SESSION_REFRESH);

      const session = new CrmSession(createMockCRM(), { storage, events });
      await session.refresh();

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('emits SESSION_EXPIRED when refresh fails', async () => {
      const storage = new MemoryStorage();
      storage.set(AUTH_STORAGE_KEYS.REFRESH_TOKEN, 'refresh');

      const events = new EventService();
      const handler = jest.fn();
      events.listenerAdd(handler, GeinsEventType.SESSION_EXPIRED);

      const crm = createMockCRM({
        refresh: jest.fn().mockRejectedValue(new Error('network error')),
      });

      const session = new CrmSession(crm, { storage, events });

      await expect(session.refresh()).rejects.toThrow(TokenRefreshError);
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('emits SESSION parent event alongside specific event', async () => {
      const storage = new MemoryStorage();
      storage.set(AUTH_STORAGE_KEYS.REFRESH_TOKEN, 'refresh');

      const events = new EventService();
      const parentHandler = jest.fn();
      events.listenerAdd(parentHandler, GeinsEventType.SESSION);

      const session = new CrmSession(createMockCRM(), { storage, events });
      await session.refresh();

      expect(parentHandler).toHaveBeenCalledTimes(1);
    });

    it('does not throw when no EventService provided', async () => {
      const storage = new MemoryStorage();
      storage.set(AUTH_STORAGE_KEYS.REFRESH_TOKEN, 'refresh');

      const session = new CrmSession(createMockCRM(), { storage });
      // Should not throw
      await session.refresh();
      session.logout();
    });
  });

  describe('cross-tab sync', () => {
    it('syncs tokens from storage when SESSION_REFRESH is broadcast', async () => {
      const storage = new MemoryStorage();
      const events = new EventService();

      const session = new CrmSession(createMockCRM(), { storage, events });
      expect(session.userToken).toBeUndefined();

      // Simulate another tab writing tokens to shared storage
      storage.set(AUTH_STORAGE_KEYS.USER_AUTH, 'token-from-other-tab');
      storage.set(AUTH_STORAGE_KEYS.REFRESH_TOKEN, 'refresh-from-other-tab');

      // Simulate the broadcast event arriving
      events.push({ subject: GeinsEventType.SESSION_REFRESH, payload: {} }, GeinsEventType.SESSION_REFRESH);

      expect(session.userToken).toBe('token-from-other-tab');
      expect(session.refreshToken).toBe('refresh-from-other-tab');
    });

    it('clears tokens when USER_LOGOUT is broadcast from another tab', () => {
      const storage = new MemoryStorage();
      storage.set(AUTH_STORAGE_KEYS.USER_AUTH, 'tok');
      storage.set(AUTH_STORAGE_KEYS.REFRESH_TOKEN, 'ref');

      const events = new EventService();
      const session = new CrmSession(createMockCRM(), { storage, events });
      expect(session.isAuthenticated).toBe(true);

      // Simulate another tab logging out (clears storage, broadcasts)
      storage.remove(AUTH_STORAGE_KEYS.USER_AUTH);
      storage.remove(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
      events.push({ subject: GeinsEventType.USER_LOGOUT, payload: {} }, GeinsEventType.USER_LOGOUT);

      expect(session.isAuthenticated).toBe(false);
      expect(session.userToken).toBeUndefined();
    });
  });

  describe('error types', () => {
    it('throws TokenExpiredError when refresh returns unsuccessful', async () => {
      const storage = new MemoryStorage();
      storage.set(AUTH_STORAGE_KEYS.REFRESH_TOKEN, 'refresh');

      const crm = createMockCRM({
        refresh: jest.fn().mockResolvedValue({ succeeded: false }),
      });

      const session = new CrmSession(crm, { storage });

      await expect(session.refresh()).rejects.toThrow(TokenExpiredError);
    });

    it('throws TokenRefreshError when refresh throws', async () => {
      const storage = new MemoryStorage();
      storage.set(AUTH_STORAGE_KEYS.REFRESH_TOKEN, 'refresh');

      const crm = createMockCRM({
        refresh: jest.fn().mockRejectedValue(new Error('boom')),
      });

      const session = new CrmSession(crm, { storage });

      await expect(session.refresh()).rejects.toThrow(TokenRefreshError);
    });
  });
});
