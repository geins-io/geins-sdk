import { CookieService, EventService } from '@geins/core';
/* import AuthServer from './authServer'; */

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
}

export class AuthCLient2 {
  /*  private signEndpoint: string;
  private authEndpoint: string;
  private cookies: CookieService;
  private client: AuthClient | null = null;
  private COOKIE_NAME_USER = 'geins_user';
  private user: string | null = null;
  private tokenTimeout: ReturnType<typeof setTimeout> | null = null; */

  constructor(initConfig: InitConfig) {
    /*  console.log('AuthService constructor', initConfig);
    this.cookies = initConfig.cookies;
    this.signEndpoint = initConfig.signEndpoint;
    this.authEndpoint = initConfig.authEndpoint;
    this.initClient(); */
  }

  /*   async initClient() {
    if (!this.client) {
      this.client = new AuthClient(
        async (id: string) =>
          await fetch(this.signEndpoint + id).then((res) => res.text()),
        this.authEndpoint,
      );
    }
  } */

  async refresh(refetchQueries = false) {
    /* await this.client?.connect();
    this.update({ refetchQueries }); */
  }

  async login(credentials: Credentials) {
    /*  console.log('login -> credentials', credentials);
    await this.client?.connect(credentials);
    this.update({ credentials, refetchQueries: true }); */
  }

  public login2() {
    /*  console.log('login logic');
    // login logic
    this.cookies.setCookie({
      name: this.COOKIE_NAME_USER,
      payload: 'to----ken',
    }); */
  }

  public logout() {
    /*     this.cookies.removeCookie({ name: this.COOKIE_NAME_USER }); */
    // logout logic
  }

  update(
    payload: { credentials?: Credentials; refetchQueries?: boolean } = {},
  ) {
    /*   console.log('update -> payload', payload);
    const credentials = payload?.credentials;
    let refetchQueries = payload?.refetchQueries || false;
    console.log('update -> credentials', credentials);
    let username: string | null = credentials
      ? credentials.username
      : this.cookies.getCookie({ name: this.COOKIE_NAME_USER }) || null;
    console.log('update -> username', username);
    if (this.client?.authorized) {
      console.log('authorized -- > push event');
      console.log('authorized --- PUSHED');
    } else if (this.user !== null) {
      console.log('user exists');
    } else {
      console.log('nor authorized user');
    } */
  }

  /*   setTokenTimeout(timeout: ReturnType<typeof setTimeout>) {
    this.tokenTimeout = timeout;
  }

  clearTokenTimeout() {
    if (this.tokenTimeout) {
      clearTimeout(this.tokenTimeout);
      this.tokenTimeout = null;
    }
  } */
}
