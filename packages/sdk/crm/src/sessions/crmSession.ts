import {
  AUTH_STORAGE_KEYS,
  AUTH_STORAGE_MAX_AGE,
  CookieStorageAdapter,
  TokenExpiredError,
  TokenRefreshError,
} from '@geins/core';
import type {
  EventService,
  StorageInterface,
} from '@geins/core';
import type {
  AuthCredentials,
  AuthResponse,
  AuthTokens,
  AuthUser,
  GeinsEventMessage,
  GeinsUserInputTypeType,
  GeinsUserType,
} from '@geins/types';
import { GeinsEventType } from '@geins/types';
import { GeinsCRM } from '../geinsCRM';
import { AuthService } from '../auth/authService';

export interface CrmSessionOptions {
  storage?: StorageInterface;
  events?: EventService;
}

/**
 * Browser-side CRM session.
 * Wraps the stateless GeinsCRM with token persistence, auto-refresh,
 * and event emission.
 *
 * Not safe for server-side shared singletons — one instance per browser session.
 */
export class CrmSession {
  private _crm: GeinsCRM;
  private _storage: StorageInterface;
  private _events?: EventService;
  private _userToken?: string;
  private _refreshToken?: string;
  private _refreshPromise: Promise<AuthResponse | undefined> | null = null;

  constructor(crm: GeinsCRM, options?: CrmSessionOptions) {
    this._crm = crm;
    this._storage = options?.storage ?? new CookieStorageAdapter();
    this._events = options?.events;

    // Restore tokens from storage if available
    this._userToken = this._storage.get(AUTH_STORAGE_KEYS.USER_AUTH);
    this._refreshToken = this._storage.get(AUTH_STORAGE_KEYS.REFRESH_TOKEN);

    // Sync in-memory tokens when another tab refreshes or logs out
    if (this._events) {
      this._events.listenerAdd(() => this.syncFromStorage(), GeinsEventType.SESSION_REFRESH);
      this._events.listenerAdd(() => this.syncFromStorage(), GeinsEventType.USER_LOGOUT);
    }
  }

  /** Whether a refresh token is present (does not verify validity — call `authorized()` for that). */
  get isAuthenticated(): boolean {
    return !!this._refreshToken;
  }

  /** Current JWT user token, or `undefined` if not logged in. */
  get userToken(): string | undefined {
    return this._userToken;
  }

  /** Current refresh token, or `undefined` if not logged in. */
  get refreshToken(): string | undefined {
    return this._refreshToken;
  }

  /** Login and persist tokens to storage. */
  async login(credentials: AuthCredentials): Promise<AuthResponse | undefined> {
    const response = await this._crm.auth.login(credentials);
    if (response?.succeeded) {
      this.storeTokens(response.tokens, credentials.rememberUser);
      this.storeUser(response.user, credentials.rememberUser);
      this.emitEvent(GeinsEventType.USER_LOGIN, {
        user: response.user?.username,
      });
    }
    return response;
  }

  /** Refresh tokens. Deduplicates concurrent calls — only one API call at a time. */
  async refresh(): Promise<AuthResponse | undefined> {
    return this.deduplicatedRefresh();
  }

  /** Get user auth state using stored tokens. */
  async getAuthUser(): Promise<AuthResponse | undefined> {
    if (!this._refreshToken) {
      return undefined;
    }

    const token = await this.ensureValidToken();
    const response = await this._crm.auth.getUser(this._refreshToken, token);
    if (response?.succeeded && response.tokens) {
      this.storeTokens(response.tokens);
      this.storeUser(response.user);
    }
    return response;
  }

  /** Check if the session is authorized. */
  async authorized(): Promise<boolean> {
    if (!this._refreshToken) {
      return false;
    }
    return this._crm.auth.authorized(this._refreshToken);
  }

  /** Get user profile. Auto-refreshes an expired token before the call. */
  async getUser(): Promise<GeinsUserType | undefined> {
    const token = await this.ensureValidToken();
    if (!token) {
      return undefined;
    }
    return this._crm.user.get(token);
  }

  /** Update user profile. Auto-refreshes an expired token before the call. */
  async updateUser(user: GeinsUserInputTypeType): Promise<GeinsUserType | undefined> {
    const token = await this.ensureValidToken();
    if (!token) {
      return undefined;
    }
    return this._crm.user.update(user, token);
  }

  /** Logout — clears all stored tokens. */
  logout(): void {
    this.emitEvent(GeinsEventType.USER_LOGOUT, {});
    this.clearAuth();
  }

  // --- Token refresh logic ---

  /**
   * Ensures the current user token is valid. If expired or expiring soon,
   * triggers a deduplicated refresh. Returns the valid token or undefined.
   */
  private async ensureValidToken(): Promise<string | undefined> {
    if (!this._refreshToken) {
      return undefined;
    }

    // No user token — need to refresh
    if (!this._userToken) {
      const response = await this.deduplicatedRefresh();
      return response?.tokens?.token;
    }

    // Check local expiry using the static JWT parser
    try {
      const parsed = AuthService.getUserObjectFromToken(this._userToken, this._refreshToken);
      if (!parsed.tokens?.expiresSoon && !parsed.tokens?.expired) {
        return this._userToken;
      }
    } catch {
      // Token parse failed — try refresh
    }

    // Token is expired or expiring soon — refresh
    const response = await this.deduplicatedRefresh();
    return response?.tokens?.token;
  }

  /**
   * Deduplicates concurrent refresh calls. Only one refresh API call
   * runs at a time; concurrent callers await the same promise.
   */
  private async deduplicatedRefresh(): Promise<AuthResponse | undefined> {
    if (this._refreshPromise) {
      return this._refreshPromise;
    }
    this._refreshPromise = this.performRefresh();
    try {
      return await this._refreshPromise;
    } finally {
      this._refreshPromise = null;
    }
  }

  private async performRefresh(): Promise<AuthResponse | undefined> {
    if (!this._refreshToken) {
      return undefined;
    }

    try {
      const response = await this._crm.auth.refresh(this._refreshToken);
      if (response?.succeeded && response.tokens) {
        this.storeTokens(response.tokens);
        this.storeUser(response.user);
        this.emitEvent(GeinsEventType.SESSION_REFRESH, {
          user: response.user?.username,
        });
        return response;
      }

      // Refresh returned but wasn't successful
      this.emitEvent(GeinsEventType.SESSION_EXPIRED, {});
      this.clearAuth();
      throw new TokenExpiredError('Session expired — refresh was not successful');
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw error;
      }
      this.emitEvent(GeinsEventType.SESSION_EXPIRED, {});
      this.clearAuth();
      throw new TokenRefreshError('Token refresh failed', error);
    }
  }

  // --- Event emission ---

  private emitEvent(eventType: GeinsEventType, payload: unknown): void {
    if (!this._events) {
      return;
    }

    const message: GeinsEventMessage = {
      subject: eventType,
      payload,
    };

    // Emit parent event (e.g., SESSION for SESSION_REFRESH)
    const eventStr = eventType as string;
    if (eventStr.includes('_')) {
      const parent = eventStr.split('_')[0];
      this._events.push(message, parent);
    }

    this._events.push(message, eventStr);
  }

  // --- Storage management ---

  private storeTokens(tokens?: AuthTokens, rememberUser?: boolean): void {
    if (!tokens) return;

    const maxAge = rememberUser
      ? AUTH_STORAGE_MAX_AGE.REMEMBER_USER
      : this.getStoredMaxAge() ?? AUTH_STORAGE_MAX_AGE.DEFAULT;

    if (tokens.refreshToken) {
      this._refreshToken = tokens.refreshToken;
      this._storage.set(AUTH_STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken, { maxAge });
    }

    if (tokens.token) {
      this._userToken = tokens.token;
      this._storage.set(AUTH_STORAGE_KEYS.USER_AUTH, tokens.token, {
        maxAge: tokens.expiresIn || 900,
      });
    }
  }

  private storeUser(user?: AuthUser, rememberUser?: boolean): void {
    if (!user) return;

    const maxAge = rememberUser
      ? AUTH_STORAGE_MAX_AGE.REMEMBER_USER
      : this.getStoredMaxAge() ?? AUTH_STORAGE_MAX_AGE.DEFAULT;

    this._storage.set(AUTH_STORAGE_KEYS.USER_MAX_AGE, maxAge.toString(), { maxAge });

    if (user.username) {
      this._storage.set(AUTH_STORAGE_KEYS.USER, user.username, { maxAge });
    }

    if (user.customerType) {
      this._storage.set(AUTH_STORAGE_KEYS.USER_TYPE, user.customerType, { maxAge });
    }
  }

  private clearAuth(): void {
    this._userToken = undefined;
    this._refreshToken = undefined;
    Object.values(AUTH_STORAGE_KEYS).forEach((key) => {
      this._storage.remove(key);
    });
  }

  private syncFromStorage(): void {
    this._userToken = this._storage.get(AUTH_STORAGE_KEYS.USER_AUTH);
    this._refreshToken = this._storage.get(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  }

  private getStoredMaxAge(): number | undefined {
    const maxAge = this._storage.get(AUTH_STORAGE_KEYS.USER_MAX_AGE);
    return maxAge ? parseInt(maxAge, 10) : undefined;
  }
}
