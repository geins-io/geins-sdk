import { AuthServiceClient } from './authServiceClient';

interface Credentials {
  username: string;
  password: string;
  rememberUser?: boolean;
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

  public async login(
    credentials: Credentials,
  ): Promise<ReturnType<AuthService['getUserObject']>> {
    try {
      if (!this.client) {
        this.initClient();
      }
      if (this.client) {
        await this.client.connect(credentials, 'login');
      }
      return this.getUserObject();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  public async logout(): Promise<boolean> {
    // check if the client is initialized
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
      //console.log('Token', token);
      //console.log('Token refreshed', refreshToken);
      // console.log('use :', this.getUserObject());
      console.log('authService.ts Token refreshed');
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

  private getUserObject() {
    if (!this.client) {
      throw new Error('AuthServiceClient is not initialized');
    }

    const refreshToken = this.client.getRefreshToken();

    const user = {
      username: 'unknown',
      authenticated: false,
      customerType: 'unknown',
      role: 'unknown',
      memberId: 0,
      memberDiscount: 0,
      token: '',
      expires: 0,
      refreshToken,
    };

    if (!this.client.authorized) {
      return user;
    }

    if (!this.client.serializedClaims) {
      return user;
    }

    const claimPairs = this.client.serializedClaims.split(';').map((pair) => {
      let [key, value] = pair.split('=');
      if (key.includes('/')) {
        key = key.split('/').pop() || '';
      }
      key = key.charAt(0).toLowerCase() + key.slice(1);
      return { key, value };
    });

    const role = claimPairs.find((pair) => pair.key === 'role');
    const username = claimPairs.find((pair) => pair.key === 'name');
    const memberId = claimPairs.find((pair) => pair.key === 'memberId');
    const memberDiscount = claimPairs.find(
      (pair) => pair.key === 'memberDiscount',
    );
    const customerType = claimPairs.find((pair) => pair.key === 'customerType');
    const token = this.client.getToken();
    const expires = new Date(Date.now() + this.client.getMaxAge() * 1000); // Assuming maxAge is in seconds

    // add the values to the user object
    if (role) user.role = role.value;
    if (username) user.username = username.value;
    if (memberId) user.memberId = parseInt(memberId.value, 10);
    if (memberDiscount) user.memberDiscount = parseFloat(memberDiscount.value);
    if (customerType) user.customerType = customerType.value;

    user.token = token;
    user.expires = expires.getTime();
    user.authenticated = true;
    return user;
  }

  public get user() {
    return this.getUserObject();
  }

  public get refreshToken() {
    if (!this.client) {
      throw new Error('AuthServiceClient is not initialized');
    }
    return this.client.getRefreshToken();
  }
}
