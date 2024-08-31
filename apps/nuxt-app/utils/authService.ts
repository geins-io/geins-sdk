import { checkPrimeSync } from 'crypto';
import { AuthServiceClient } from './authServiceClient';
import { authClaimsTokenSerializeToObject } from './helpers';
interface AuthCredentials {
  username: string;
  password: string;
  newPassword?: string;
  rememberUser?: boolean;
}
interface AuthResponse {
  succeded: boolean;
  data?: AuthToken | AuthUser | any;
}

interface AuthToken {
  token?: string;
  refreshToken?: string;
  expired?: boolean;
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
      throw new Error('AuthServiceClient is not initialized');
    }

    const authReponse: AuthResponse  = { succeded: false, data: {} as AuthUser };

    try {
      await this.client.connect(credentials, 'login');
      authReponse.data = await this.getUser();
      authReponse.succeded = authReponse.data.authenticated;
    } catch (error) {
      console.error('Login failed:', error);
    }

    return authReponse;
  }

  public async logout(): Promise<AuthResponse> {
    if (!this.client) {
      throw new Error('AuthServiceClient is not initialized');
    }

    const authReponse: AuthResponse  = { succeded: false };

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

    const authReponse: AuthResponse  = { succeded: false, data: {} as AuthToken };

    try {
      await this.client.connect();

      authReponse.data.token = this.client.getToken();
      authReponse.data.refreshToken = this.client.getRefreshToken();
      authReponse.data.expiresIn =this.client.getMaxAge();
      authReponse.succeded = true;
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    return authReponse;
  }

  public async changePassword(credentials: AuthCredentials): Promise<AuthResponse> {
    if (!this.client) {
      throw new Error('AuthServiceClient is not initialized');
    }

    const authReponse: AuthResponse  = { succeded: false, data: {} as AuthToken };

    try {
      await this.client.connect(credentials, 'password');
      authReponse.data.token = this.client.getToken();
      authReponse.data.refreshToken = this.client.getRefreshToken();
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
    const user: AuthUser = {
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
      expired: true,
    };
    user.customerType = user?.customerType?.toUpperCase();
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = parseInt(user.expires || '0') - now;
    if (user.expires && now < parseInt(user.expires)) {
      user.authenticated = true;
      user.expired = false;
      user.expiresSoon = timeLeft < 100;
    }
    // console.log('getUserObjectFromToken() timeLeft:', timeLeft);
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
