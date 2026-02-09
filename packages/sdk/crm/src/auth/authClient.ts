import type { AuthResponse, AuthCredentials } from '@geins/types';
import { AuthService } from './authService';

/**
 * Stateless abstract auth client.
 * No cookies, no stored tokens. All state flows through method parameters.
 * Cookie/token persistence is handled by the session layer (CrmSession).
 */
export abstract class AuthClient {
  // abstract methods — implemented by Direct and Proxy subclasses
  protected abstract handleLogin(credentials: AuthCredentials): Promise<AuthResponse | undefined>;
  protected abstract handleRefresh(refreshToken: string): Promise<AuthResponse | undefined>;
  protected abstract handleGetUser(
    refreshToken: string,
    userToken?: string,
  ): Promise<AuthResponse | undefined>;
  protected abstract handleChangePassword(
    credentials: AuthCredentials,
    refreshToken: string,
  ): Promise<AuthResponse | undefined>;
  protected abstract handleRegister(credentials: AuthCredentials): Promise<AuthResponse | undefined>;

  destroy(): void {
    // no-op in base class; subclasses may override
  }

  async login(credentials: AuthCredentials): Promise<AuthResponse | undefined> {
    return this.handleLogin(credentials);
  }

  async refresh(refreshToken: string): Promise<AuthResponse | undefined> {
    if (!refreshToken) {
      return undefined;
    }
    return this.handleRefresh(refreshToken);
  }

  async getUser(refreshToken: string, userToken?: string): Promise<AuthResponse | undefined> {
    if (!refreshToken) {
      return undefined;
    }

    if (userToken) {
      return this.handleUserTokenScenario({ userToken, refreshToken });
    }

    return this.handleGetUser(refreshToken);
  }

  async changePassword(
    credentials: AuthCredentials,
    refreshToken: string,
  ): Promise<AuthResponse | undefined> {
    if (!refreshToken) {
      return undefined;
    }
    return this.handleChangePassword(credentials, refreshToken);
  }

  async register(credentials: AuthCredentials): Promise<AuthResponse | undefined> {
    return this.handleRegister(credentials);
  }

  async logout(): Promise<AuthResponse | undefined> {
    return { succeeded: true };
  }

  private async handleUserTokenScenario(tokens: {
    refreshToken: string;
    userToken: string;
  }): Promise<AuthResponse | undefined> {
    const authResponse = AuthService.getUserObjectFromToken(tokens.userToken, tokens.refreshToken);

    if (authResponse?.succeeded && authResponse.tokens?.expiresSoon) {
      return this.handleGetUser(tokens.refreshToken, tokens.userToken);
    }

    return authResponse;
  }
}
