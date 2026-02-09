import type { AuthCredentials, AuthResponse } from '@geins/types';
import { AuthClient } from './authClient';
import { AuthService } from './authService';

/**
 * Auth client that communicates directly with the Geins auth API.
 * Used in server-side (Direct) connection mode where credentials and endpoints
 * are available without a proxy intermediary.
 */
export class AuthClientDirect extends AuthClient {
  private _authService: AuthService;

  constructor(signEndpoint: string, authEndpoint: string) {
    super();
    this._authService = new AuthService(signEndpoint, authEndpoint);
  }

  destroy(): void {
    this._authService.destroy();
    this._authService = undefined!;
  }

  protected async handleLogin(credentials: AuthCredentials): Promise<AuthResponse | undefined> {
    return this._authService.login(credentials);
  }

  protected async handleRefresh(refreshToken: string): Promise<AuthResponse | undefined> {
    return this._authService.refresh(refreshToken);
  }

  protected async handleGetUser(refreshToken: string, userToken?: string): Promise<AuthResponse | undefined> {
    return this._authService.getUser(refreshToken, userToken);
  }

  protected async handleChangePassword(
    credentials: AuthCredentials,
    refreshToken: string,
  ): Promise<AuthResponse | undefined> {
    return this._authService.changePassword(credentials, refreshToken);
  }

  protected async handleRegister(credentials: AuthCredentials): Promise<AuthResponse | undefined> {
    return this._authService.register(credentials);
  }
}
