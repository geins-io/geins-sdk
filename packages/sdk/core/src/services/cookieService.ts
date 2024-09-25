import Cookie from 'cookie-universal';

export interface CookieType extends CookieServiceConfig {
  name: string;
  payload: string;
}

export interface CookieServiceConfig {
  httpOnly?: boolean;
  domain?: string;
  path?: string;
  secure?: boolean;
  maxAge?: number | string; // maxAge can be a number or string here
}

export class CookieService {
  private path = '/';
  private domain = '';
  private secure = true;
  private httpOnly = false;
  private maxAge: number | undefined = undefined; // Ensure maxAge is a number or undefined
  private cookie: ReturnType<typeof Cookie>;

  constructor(config?: CookieServiceConfig, req?: any, res?: any) {
    // Initialize the cookie instance for both client and server
    this.cookie = Cookie(req, res);

    if (config) {
      if (config.path) {
        this.path = config.path;
      }

      if (config.domain) {
        this.domain = config.domain;
      }

      if (config.secure !== undefined) {
        this.secure = config.secure;
      }

      if (config.maxAge !== undefined) {
        this.maxAge = this.parseMaxAge(config.maxAge);
      }
    }
  }

  protected getConfig() {
    return {
      path: this.path,
      domain: this.domain,
      secure: this.secure,
      maxAge: this.maxAge,
      httpOnly: this.httpOnly,
    };
  }

  private parseMaxAge(maxAge: string | number): number | undefined {
    if (typeof maxAge === 'string') {
      const parsed = parseInt(maxAge, 10);
      return isNaN(parsed) ? undefined : parsed;
    }
    return maxAge;
  }

  public getAll() {
    return this.cookie.getAll();
  }

  public set(cookie: CookieType, config?: CookieServiceConfig) {
    const options = config
      ? {
          ...this.getConfig(),
          ...config,
          maxAge:
            config.maxAge !== undefined
              ? this.parseMaxAge(config.maxAge)
              : undefined,
        }
      : this.getConfig();

    if (cookie.domain) {
      options.domain = cookie.domain;
    }

    if (cookie.path) {
      options.path = cookie.path;
    }

    if (cookie.secure !== undefined) {
      options.secure = cookie.secure;
    }

    if (cookie.maxAge !== undefined) {
      options.maxAge = this.parseMaxAge(cookie.maxAge);
    } else if (options.maxAge === undefined) {
      delete options.maxAge;
    }

    if (cookie.httpOnly) {
      options.httpOnly = true;
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
