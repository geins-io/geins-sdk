import { CookieService, EventService } from '@geins/core';
import AuthClient from '../auth/authClient';

interface Credentials {
  username: string;
  password: string;
  rememberUser?: boolean;
}

interface InitConfig {
  signEndpoint: string;
  authEndpoint: string;
  cookies: CookieService;
  events?: EventService;
  bc?: BroadcastChannel;
}

export class AuthService {
  private signEndpoint: string;
  private authEndpoint: string;

  private cookies: CookieService;
  private client: AuthClient | null = null;

  private COOKIE_NAME_USER = 'geins_user';

  private user: string | null = null;
  private tokenTimeout: ReturnType<typeof setTimeout> | null = null;
  private eventHandler: any;

  constructor(initConfig: InitConfig) {
    console.log('AuthService constructor', initConfig);
    this.cookies = initConfig.cookies;
    this.signEndpoint = initConfig.signEndpoint;
    this.authEndpoint = initConfig.authEndpoint;
    if (initConfig.events) {
      this.eventHandler = initConfig.events;
    }
    this.initClient();
  }

  async initClient() {
    if (!this.client) {
      this.client = new AuthClient(
        async (id: string) =>
          await fetch(this.signEndpoint + id).then((res) => res.text()),
        this.authEndpoint,
      );
      await this.refresh();
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

  public login2() {
    console.log('login logic');
  }

  public logout() {
    //this.cookies.remove({ name: this.COOKIE_NAME_USER });
    // logout logic
  }

  update(
    payload: { credentials?: Credentials; refetchQueries?: boolean } = {},
  ) {
    console.log('update -> payload', payload);
    const credentials = payload?.credentials;
    let refetchQueries = payload?.refetchQueries || false;
    console.log('update -> credentials', credentials);

    let username: string | null = credentials
      ? credentials.username
      : this.cookies.get({ name: this.COOKIE_NAME_USER }) || null;
    console.log('update -> username', username);
    if (this.client?.authorized) {
      console.log('authorized -- > push event');
      this.eventsPush();
      console.log('authorized --- PUSHED');

      /* this.setTokenTimeout(
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            this.refresh(true);
          }
        }, this.client!.getMaxAge() * 900),
      );

      const maxAgeDays = this.client.getMaxAge() / (3600 * 24);

      Cookies.set('geins-auth', this.client.getToken(), {
        path: '/',
        expires: maxAgeDays,
      });

      let maxage: number = credentials
        ? credentials.rememberUser
          ? 604800
          : 1800
        : parseInt(Cookies.get('geins-user-maxage') || '604800', 10);

      this.setUser(username);
      Cookies.set('geins-user', username!, { path: '/', expires: maxAgeDays });
      Cookies.set('geins-user-maxage', maxage.toString(), {
        path: '/',
        expires: maxAgeDays,
      }); */
    } else if (this.user !== null) {
      console.log('user exists');
      /*       username = null;
      this.clearTokenTimeout();
      this.setUser(username);
      [
        'geins-auth',
        'geins-user',
        'geins-user-maxage',
        'geins-user-type',
      ].forEach((key) => Cookies.remove(key, { path: '/' })); */
    } else {
      console.log('nor authorized user');
      /*   refetchQueries = false;
      broadcast = false; */
    }

    /*  if (broadcast && this.broadcastChannel) {
      this.eventsPush({ type: 'auth' });
    }

    if (refetchQueries) {
      this.refetchQueries();
    } */
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
  eventsPush() {
    this.eventHandler.emmit('auth', { method: 'login' });
  }
}
