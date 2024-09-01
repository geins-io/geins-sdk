import { AuthServiceClient } from './authServiceClient';
import { authClaimsTokenSerializeToObject } from './helpers';
const EXPIRES_SOON_THRESHOLD = 895;

export interface AuthCredentials {
  username: string;
  password: string;
  newPassword?: string;
  rememberUser?: boolean;
}
export interface AuthResponse {
  succeded: boolean;
  user?: AuthUser;
  tokens?: AuthTokens;
}

export interface AuthTokens {
  token?: string;
  refreshToken?: string;
  maxAge?: number;
  expired?: boolean;
  expires?: number;
  expiresIn?: number;
  expiresSoon?: boolean;
}
export interface AuthUser {
  authenticated?: boolean;
  userId?: string;
  username?: string;
  customerType?: string;
  memberDiscount?: string;
  memberType?: string;
  memberId?: string;
  token?: string;
  refreshToken?: string;
  expired?: boolean;
  expires?: string;
  expiresSoon?: boolean;
}
export class AuthService {
  private signEndpoint: string;
  private authEndpoint: string;
  private client: AuthServiceClient | undefined;

  constructor(signEndpoint: string, authEndpoint: string) {
    this.signEndpoint = signEndpoint;
    this.authEndpoint = authEndpoint;
    this.initClient();
  }

  public setRefreshToken(refreshToken: string): void {
    if (!this.client) {
      throw new Error('AuthServiceClient is not initialized');
    }
    this.client.setRefreshToken(refreshToken);
  }

  private initClient(): void {
    this.client = new AuthServiceClient(this.authEndpoint, this.signEndpoint);
  }

  public async login(credentials: AuthCredentials): Promise<AuthResponse> {
    if (!this.client) {
      this.initClient();
    }

    if (!this.client) {
      throw new Error('AuthServiceClient is not initialized');
    }

    let authReponse: AuthResponse = { succeded: false };

    try {
      await this.client.connect(credentials, 'login');
      const userResponse = await this.getUser();
      authReponse = userResponse || { succeded: false };
      authReponse.succeded = authReponse?.user?.authenticated || false;
    } catch (error) {
      console.error('Login failed:', error);
    }

    return authReponse;
  }

  public async logout(): Promise<AuthResponse> {
    if (!this.client) {
      throw new Error('AuthServiceClient is not initialized');
    }

    const authReponse: AuthResponse = { succeded: false };

    try {
      await this.client.connect(undefined, 'logout');
      this.client = undefined;
      authReponse.succeded = true;
    } catch (error) {
      console.error('Logout failed:', error);
    }
    return authReponse;
  }

  public async refresh(): Promise<AuthResponse> {
    if (!this.client) {
      throw new Error('AuthServiceClient is not initialized');
    }

    const authReponse: AuthResponse = {
      succeded: false,
      tokens: {} as AuthTokens,
    };

    try {
      await this.client.connect();

      console.log('[2 - 1] Token refreshed');

      authReponse.tokens = {};
      authReponse.tokens.token = this.client.getToken();
      authReponse.tokens.refreshToken = this.client.getRefreshToken();
      authReponse.tokens.maxAge = this.client.getMaxAge();
      authReponse.succeded = true;

      console.log('[2 - 2] Token refreshed authReponse', authReponse);
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    return authReponse;
  }

  public async changePassword(
    credentials: AuthCredentials,
  ): Promise<AuthResponse> {
    if (!this.client) {
      throw new Error('AuthServiceClient is not initialized');
    }

    const authReponse: AuthResponse = {
      succeded: false,
      tokens: {} as AuthTokens,
    };

    try {
      await this.client.connect(credentials, 'password');

      authReponse.tokens = {};
      authReponse.tokens.token = this.client.getToken();
      authReponse.tokens.refreshToken = this.client.getRefreshToken();
      authReponse.succeded = true;
    } catch (error) {
      console.error('Password change failed:', error);
    }
    return authReponse;
  }

  public async register(
    credentials: Credentials & { customerType: string },
  ): Promise<boolean> {
    if (!this.client) {
      throw new Error('AuthServiceClient is not initialized');
    }

    try {
      await this.client.connect(credentials, 'register');
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  }

  async getUserObjectFromToken(claimsToken: string) {
    const authReponse: AuthResponse = {
      succeded: false,
      tokens: {} as AuthTokens,
      user: {} as AuthUser,
    };

    let token;
    let userFromToken;
    try {
      userFromToken = authClaimsTokenSerializeToObject(claimsToken) || {};
    } catch (error) {
      return undefined;
    }
    if (!userFromToken) {
      return undefined;
    }
    token = claimsToken;

    authReponse.succeded = true;

    authReponse.user = {} as AuthUser;
    authReponse.user.authenticated = false;
    authReponse.user.userId = userFromToken.sid || '';
    authReponse.user.username = userFromToken.name || 'unknown';
    authReponse.user.customerType = (
      userFromToken.customerType || 'unknown'
    ).toUpperCase();
    authReponse.user.memberDiscount = userFromToken.memberDiscout || '0';
    authReponse.user.memberType = userFromToken.memberType || 'unknown';
    authReponse.user.memberId = userFromToken.memberId || '0';

    authReponse.tokens = {} as AuthTokens;
    authReponse.tokens.token = token;
    authReponse.tokens.expires = parseInt(userFromToken.exp || '0');

    authReponse.tokens.expiresSoon = false;
    authReponse.tokens.expired = true;

    const now = Math.floor(Date.now() / 1000);
    if (now < parseInt(userFromToken.exp)) {
      authReponse.user.authenticated = true;
      authReponse.tokens.expired = false;
      const timeLeft = parseInt(userFromToken.exp || '0') - now;
      authReponse.tokens.expiresIn = timeLeft;
      authReponse.tokens.expiresSoon = timeLeft < EXPIRES_SOON_THRESHOLD;
    }

    return authReponse;
  }

  async getUser(token?: string) {
    if (token) {
      return await this.getUserObjectFromToken(token);
    }

    if (this.client) {
      token = this.client.getToken();
      if (token) {
        const authReponse = await this.getUserObjectFromToken(token);
        if (authReponse && authReponse.tokens) {
          authReponse.tokens.refreshToken = this.client.getRefreshToken();
        }
        return authReponse;
      }
    }
    return;
  }

  public get refreshToken() {
    if (!this.client) {
      throw new Error('AuthServiceClient is not initialized');
    }
    return this.client.getRefreshToken();
  }
}
