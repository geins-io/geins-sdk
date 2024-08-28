import { AuthServiceClient } from './authServiceClient';

interface Credentials {
  username: string;
  password: string;
  rememberUser?: boolean;
}

export class AuthService {
  private signEndpoint: string;
  private authEndpoint: string;
  private client: AuthServiceClient | null = null;

  constructor(signEndpoint: string, authEndpoint: string) {
    this.signEndpoint = signEndpoint;
    this.authEndpoint = authEndpoint;
    this.initClient();
  }

  /**
   * Initializes the AuthServiceClient instance
   */
  private initClient(): void {
    this.client = new AuthServiceClient(this.authEndpoint, this.signEndpoint);
  }

  /**
   * Logs in the user with the provided credentials.
   * @param credentials The user's login credentials.
   * @returns The authenticated user object.
   */
  public async login(
    credentials: Credentials,
  ): Promise<ReturnType<AuthService['getUserObject']>> {
    if (!this.client) {
      throw new Error('AuthServiceClient is not initialized');
    }
    try {
      await this.client.connect(credentials, 'login');
      return this.getUserObject();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * Logs out the current user.
   * @returns A boolean indicating success.
   */
  public async logout(): Promise<boolean> {
    if (!this.client) {
      throw new Error('AuthServiceClient is not initialized');
    }

    try {
      await this.client.connect(undefined, 'logout');
      this.client = null; // Reset the client to clear the session
      console.log('Logout successful');
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    }
  }

  /**
   * Checks the current authentication status.
   * @returns A boolean indicating whether the user is authenticated.
   */
  public async status(): Promise<boolean> {
    if (!this.client) {
      throw new Error('AuthServiceClient is not initialized');
    }

    return this.client.authorized;
  }

  /**
   * Returns a user object with authentication details.
   * @returns The user object containing authentication information.
   */
  private getUserObject() {
    if (!this.client) {
      throw new Error('AuthServiceClient is not initialized');
    }

    const user = {
      username: 'unknown',
      authenticated: false,
      customerType: 'unknown',
      role: 'unknown',
      memberId: 0,
      memberDiscount: 0,
      token: '',
      expires: 0,
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

  /**
   * A getter for the user object.
   * @returns The current user object.
   */
  public get user() {
    return this.getUserObject();
  }
}
