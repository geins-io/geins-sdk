import type { AuthResponse, AuthCredentials } from '@geins/types';
import { AuthClient } from './authClient';
import { AuthService } from './authService';

export class AuthClientDirect extends AuthClient {
  private _authService: AuthService;

  constructor(signEndpoint: string, authEndpoint: string) {
    super();
    this._authService = new AuthService(signEndpoint, authEndpoint);
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
