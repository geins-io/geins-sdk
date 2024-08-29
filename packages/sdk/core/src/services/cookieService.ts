import Cookies from 'js-cookie';

export interface CookieType {
  name: string;
  payload?: any;
}
export interface CookieServiceConfig {
  domain?: string | undefined;
  path?: string;
  secure?: boolean;
  expires?: number;
}

export class CookieService {
  private expires = 1;
  private path = '/';
  private expiresDate = new Date(new Date().getTime() + 31536000000);
  private domain = '';
  private secure = true;
  constructor(config?: CookieServiceConfig) {
    if (config) {
      if (config.expires) {
        this.expires = config.expires;
      }

      if (config.path) {
        this.path = config.path;
      }

      if (config.domain) {
        this.domain = config.domain;
      }

      if (config.secure) {
        this.secure = config.secure;
      }
    }
  }
  protected getConfig() {
    /*    expires: this.expires,
    path: this.path,
    domain: this.domain, */
    return {
      secure: this.secure,
    };
  }

  public getAll() {
    return Cookies.get();
  }

  public set(cookie: CookieType) {
    Cookies.set(cookie.name, cookie.payload, this.getConfig());
  }

  public get(cookie: CookieType) {
    return Cookies.get(cookie.name);
  }

  public remove(cookieName: string) {
    Cookies.remove(cookieName);
  }
}
