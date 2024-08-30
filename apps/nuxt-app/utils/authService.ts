import { checkPrimeSync } from 'crypto';
import { AuthServiceClient } from './authServiceClient';
import { authClaimsTokenSerializeToObject } from './helpers';
interface Credentials {
  username: string;
  password: string;
  rememberUser?: boolean;
}
export interface User {
  authenticated?: boolean;
  userId?: string;
  username?: string;
  customerType?: string;
  memberDiscount?: string;
  memberType?: string;
  memberId?: string;
  token?: string;
  refreshToken?: string;
  expiered?: boolean;
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

  private initClient(): void {
    this.client = new AuthServiceClient(this.authEndpoint, this.signEndpoint);
  }

  public setRefreshToken(refreshToken: string): void {
    if (!this.client) {
      throw new Error('AuthServiceClient is not initialized');
    }
    this.client.setRefreshToken(refreshToken);
  }

  public async login(credentials: Credentials): Promise<any> {
    try {
      if (!this.client) {
        this.initClient();
      }
      if (this.client) {
        await this.client.connect(credentials, 'login');
        return this.getUser();
      } else
        throw new Error(
          'AuthServiceClient is not initialized. Failed to login.',
        );
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  public async logout(): Promise<boolean> {
    if (!this.client) {
      throw new Error('AuthServiceClient is not initialized');
    }

    try {
      await this.client.connect(undefined, 'logout');
      this.client = undefined;
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    }
  }

  public async refresh(): Promise<{ token: string; refreshToken: string }> {
    if (!this.client) {
      throw new Error('AuthServiceClient is not initialized');
    }

    try {
      await this.client.connect();
      const refreshToken = this.client.getRefreshToken();
      const token = this.client.getToken();
      return { token, refreshToken };
    } catch (error) {
      console.error('Token refresh failed:', error);
      return { token: '', refreshToken: '' };
    }
  }

  public async changePassword(
    credentials: Credentials & { newPassword: string },
  ): Promise<boolean> {
    if (!this.client) {
      throw new Error('AuthServiceClient is not initialized');
    }

    try {
      await this.client.connect(credentials, 'password');
      return true;
    } catch (error) {
      console.error('Password change failed:', error);
      return false;
    }
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
    const user: User = {
      authenticated: false,
      userId: userFromToken.sid || '',
      username: userFromToken.name || 'unknown',
      customerType: userFromToken.customerType || 'unknown',
      memberDiscount: userFromToken.memberDiscout || '0',
      memberType: userFromToken.memberType || 'unknown',
      memberId: userFromToken.memberId || '0',
      token: token || '',
      expires: userFromToken.exp,
      expiresSoon: false,
      expiered: true,
    };
    user.customerType = user?.customerType?.toUpperCase();
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = parseInt(user.expires || '0') - now;
    if (user.expires && now < parseInt(user.expires)) {
      user.authenticated = true;
      user.expiered = false;
      user.expiresSoon = timeLeft < 100;
    }
    console.log('getUserObjectFromToken() timeLeft:', timeLeft);
    return user;
  }

  async getUser(token?: string) {
    if (token) {
      return await this.getUserObjectFromToken(token);
    }
    if (this.client) {
      token = this.client.getToken();
      if (token) {
        const refreshToken = this.client.getRefreshToken();
        const user = await this.getUserObjectFromToken(token);
        if (user && refreshToken) {
          user.refreshToken = refreshToken;
        }
        return user;
      }
    }
    return undefined;
  }

  public get refreshToken() {
    if (!this.client) {
      throw new Error('AuthServiceClient is not initialized');
    }
    return this.client.getRefreshToken();
  }
}
