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
  succeeded: boolean;
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
    this.ensureClientInitialized();

    try {
      await this.client!.connect(credentials, 'login');
      const authResponse = await this.getUser();
      return authResponse || { succeeded: false };
    } catch (error) {
      this.handleError('Login failed', error);
      return { succeeded: false };
    }
  }

  public async logout(): Promise<AuthResponse> {
    this.ensureClientInitialized();

    try {
      await this.client!.connect(undefined, 'logout');
      this.client = undefined;
      return { succeeded: true };
    } catch (error) {
      this.handleError('Logout failed', error);
      return { succeeded: false };
    }
  }

  public async refresh(): Promise<AuthResponse> {
    this.ensureClientInitialized();

    try {
      await this.client!.connect();

      const tokens: AuthTokens = {
        token: this.client!.getToken(),
        refreshToken: this.client!.getRefreshToken(),
        maxAge: this.client!.getMaxAge(),
        expired: false,
      };

      return { succeeded: true, tokens };
    } catch (error) {
      this.handleError('Token refresh failed', error);
      return { succeeded: false };
    }
  }

  public async changePassword(
    credentials: AuthCredentials,
  ): Promise<AuthResponse> {
    this.ensureClientInitialized();

    try {
      await this.client!.connect(credentials, 'password');

      const tokens: AuthTokens = {
        token: this.client!.getToken(),
        refreshToken: this.client!.getRefreshToken(),
      };

      return { succeeded: true, tokens };
    } catch (error) {
      this.handleError('Password change failed', error);
      return { succeeded: false };
    }
  }

  public async register(credentials: AuthCredentials): Promise<boolean> {
    this.ensureClientInitialized();

    try {
      await this.client!.connect(credentials, 'register');
      const authResponse = await this.getUser();
      return true;
    } catch (error) {
      this.handleError('Registration failed', error);
      return false;
    }
  }

  private async getUserObjectFromToken(
    claimsToken: string,
  ): Promise<AuthResponse | undefined> {
    let userFromToken;
    try {
      userFromToken = authClaimsTokenSerializeToObject(claimsToken) || {};
    } catch (error) {
      return undefined;
    }
    if (!userFromToken) {
      return undefined;
    }

    const now = Math.floor(Date.now() / 1000);
    const expiresIn = parseInt(userFromToken.exp || '0') - now;
    const expiresSoon = expiresIn < EXPIRES_SOON_THRESHOLD;

    return {
      succeeded: true,
      user: {
        authenticated: !userFromToken.expired,
        userId: userFromToken.sid || '',
        username: userFromToken.name || 'unknown',
        customerType: (userFromToken.customerType || 'unknown').toUpperCase(),
        memberDiscount: userFromToken.memberDiscount || '0',
        memberType: userFromToken.memberType || 'unknown',
        memberId: userFromToken.memberId || '0',
      },
      tokens: {
        token: claimsToken,
        expires: parseInt(userFromToken.exp || '0'),
        expired: now >= parseInt(userFromToken.exp || '0'),
        expiresSoon,
        expiresIn,
      },
    };
  }

  public async getUser(token?: string): Promise<AuthResponse | undefined> {
    token = token || this.client?.getToken();
    if (!token) {
      return undefined;
    }

    const authResponse = await this.getUserObjectFromToken(token);
    if (authResponse && this.client) {
      authResponse.tokens!.refreshToken = this.client.getRefreshToken();
    }
    return authResponse;
  }

  public get refreshToken(): string | undefined {
    this.ensureClientInitialized();
    return this.client!.getRefreshToken();
  }

  private ensureClientInitialized(): void {
    this.client;
    if (!this.client) {
      this.initClient();
    }
    if (!this.client) {
      throw new Error('AuthServiceClient is not initialized');
    }
  }

  private handleError(message: string, error: unknown): void {
    // TODO:: Implement your custom error handling or logging here
    console.error(message, error);
  }
}
