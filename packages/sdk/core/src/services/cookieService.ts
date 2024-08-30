//import Cookies from 'js-cookie';
import Cookie from 'cookie-universal';

export interface CookieType extends CookieServiceConfig {
  name: string;
  payload: string;
}
export interface CookieServiceConfig {
  domain?: string | undefined;
  path?: string;
  secure?: boolean;
  maxAge?: number;
}

export class CookieService {
  private path = '/';
  private domain = '';
  private secure = true;
  private maxAge = 0;
  private cookie = Cookie();
  constructor(config?: CookieServiceConfig) {
    if (config) {
      if (config.path) {
        this.path = config.path;
      }

      if (config.domain) {
        this.domain = config.domain;
      }

      if (config.secure) {
        this.secure = config.secure;
      }

      if (config.maxAge) {
        this.maxAge = config.maxAge;
      }
    }
  }
  protected getConfig() {
    return {
      path: this.path,
      domain: this.domain,
      secure: this.secure,
      maxAge: this.maxAge,
    };
  }

  public getAll() {
    return this.cookie.getAll();
  }

  public set(cookie: CookieType, config?: CookieServiceConfig) {
    const options = config || this.getConfig();
    if (cookie.domain) {
      options.domain = cookie.domain;
    }

    if (cookie.path) {
      options.path = cookie.path;
    }

    if (cookie.secure) {
      options.secure = cookie.secure;
    }

    if (cookie.maxAge) {
      options.maxAge = cookie.maxAge;
    }

    this.cookie.set(cookie.name, cookie.payload, options);
  }

  public get(cookieName: string) {
    return this.cookie.get(cookieName);
  }

  public remove(cookieName: string) {
    this.cookie.remove(cookieName);
  }
}
