// MANAGER TO USE

import AuthClient from './authClient';
import { BroadcastChannel } from 'broadcast-channel';

interface Credentials {
  username: string;
  password: string;
  newPassword?: string;
  rememberUser?: boolean;
}

interface InitConfig {
  signEndpoint: string;
  authEndpoint: string;
  bc?: BroadcastChannel;
}

class AuthManager {
  private user: string | null = null;
  private client: AuthClient | null = null;
  private tokenTimeout: ReturnType<typeof setTimeout> | null = null;
  private broadcastChannel: BroadcastChannel | undefined | null = null;

  constructor(
    private initConfig: InitConfig,
    bc?: BroadcastChannel,
  ) {
    this.initClient();
    this.broadcastChannel = bc;
  }

  async initClient() {
    if (!this.client) {
      this.client = new AuthClient(
        async (id: string) =>
          await fetch(this.initConfig.signEndpoint + id).then((res) =>
            res.text(),
          ),
        this.initConfig.authEndpoint,
      );
      await this.refresh();
    }
  }

  setUser(user: string | null) {
    this.user = user;
  }

  setTokenTimeout(timeout: ReturnType<typeof setTimeout>) {
    this.tokenTimeout = timeout;
  }

  clearTokenTimeout() {
    if (this.tokenTimeout) {
      clearTimeout(this.tokenTimeout);
      this.tokenTimeout = null;
    }
  }

  async refresh(refetchQueries = false) {
    await this.client?.connect();
    this.update({ refetchQueries });
  }

  async login(credentials: Credentials) {
    console.log('login -> credentials', credentials);
    await this.client?.connect(credentials);
    this.update({ credentials, refetchQueries: true });
  }

  async register(credentials: Credentials) {
    await this.client?.connect(credentials, 'register');
    this.update({ credentials, refetchQueries: true });
  }

  async changePassword(credentials: Credentials) {
    await this.client?.connect(credentials, 'password');
    this.update();
  }

  async logout() {
    console.log('logout -> client', this.client);
    await this.client?.connect({ username: '', password: '' }, 'logout');
    this.eventsPush({ type: 'user:logout' });
    this.update({ refetchQueries: true });
  }

  update(
    payload: { credentials?: Credentials; refetchQueries?: boolean } = {},
  ) {}

  private eventsPush(event: { type: string }) {
    console.log('eventsPush ', event);
    /*     const broadcast = typeof window !== 'undefined';
    if (broadcast && this.broadcastChannel) {
      this.broadcastChannel.postMessage({ type: 'auth', data: event });
    } */
  }

  private refetchQueries() {
    // Dummy implementation for the query refetching
  }

  async userObject() {
    if (!this.client?.getToken()) {
      //await this.client?.connect();
      console.log('client ', this.client);
    }
    return this.client?.getToken();
  }

  get authenticated(): boolean {
    console.log('this.client?.authorized  ', this.client?.authorized);
    return this.client?.authorized || false;
  }

  get getUser(): string | null {
    if (!this.user) {
      return null;
    }
    return this.user;
  }

  get getToken(): string | null {
    if (!this.client) {
      return null;
    }
    return this.client?.getToken() || null;
  }
}

export { AuthManager, Credentials, InitConfig };
