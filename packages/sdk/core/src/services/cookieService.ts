import { type CookieSerializeOptions } from 'cookie';
import Cookie from 'cookie-universal';

/** Configuration options for setting cookies. */
export interface CookieServiceConfig {
  /** If `true`, the cookie is inaccessible to client-side scripts. */
  httpOnly?: boolean;

  /** Domain for which the cookie is valid. Defaults to the current document host. */
  domain?: string;

  /** URL path required for the browser to send the cookie. Defaults to `'/'`. */
  path?: string;

  /** If `true`, the cookie is only sent over HTTPS. */
  secure?: boolean;

  /** Controls cross-site cookie behaviour. Defaults to `'lax'`. */
  sameSite?: 'strict' | 'lax' | 'none';

  /** Maximum age of the cookie in seconds. */
  maxAge?: number | string;
}

/** A cookie with a name and payload, extending the cookie configuration options. */
export interface CookieType extends CookieServiceConfig {
  /** The name of the cookie. */
  name: string;

  /** The value stored in the cookie. */
  payload: string;
}

/** Service for managing cookies. */
export class CookieService {
  private path = '/';
  private domain = '';
  private secure = true;
  private httpOnly = true;
  private sameSite: 'strict' | 'lax' | 'none' = 'lax';
  private maxAge: number;
  private cookie = Cookie();

  /**
   * Creates an instance of CookieService.
   * @param config - Optional configuration for the cookie service.
   */
  constructor(config?: CookieServiceConfig) {
    this.maxAge = 0;
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

      if (config.httpOnly !== undefined) {
        this.httpOnly = config.httpOnly;
      }

      if (config.sameSite !== undefined) {
        this.sameSite = config.sameSite;
      }

      if (config.maxAge !== undefined) {
        this.maxAge = this.parseMaxAge(config.maxAge);
      }
    }
  }

  /**
   * Retrieves the current cookie configuration.
   * @returns The current configuration settings.
   */
  protected getConfig(): CookieServiceConfig {
    return {
      path: this.path,
      domain: this.domain,
      secure: this.secure,
      httpOnly: this.httpOnly,
      sameSite: this.sameSite,
      maxAge: this.maxAge,
    };
  }

  private parseMaxAge(maxAge: string | number): number {
    if (typeof maxAge === 'string') {
      const parsed = parseInt(maxAge, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
    return maxAge;
  }

  private configToCookieOptions(config: CookieServiceConfig): CookieSerializeOptions {
    return {
      path: config.path,
      domain: config.domain,
      secure: config.secure,
      httpOnly: config.httpOnly,
      sameSite: config.sameSite,
      maxAge: config.maxAge !== undefined ? this.parseMaxAge(config.maxAge) : undefined,
    };
  }

  /**
   * Retrieves all cookies.
   * @returns An object containing all cookies.
   */
  public getAll(): Record<string, string> {
    return this.cookie.getAll() as Record<string, string>;
  }

  /**
   * Retrieves the value of a specific cookie.
   * @param cookieName - The name of the cookie to retrieve.
   * @returns The value of the cookie, or an empty string if not found.
   */
  public get(cookieName: string): string {
    return this.cookie.get(cookieName) || '';
  }

  /**
   * Removes a specific cookie.
   * @param cookieName - The name of the cookie to remove.
   */
  public remove(cookieName: string): void {
    this.cookie.remove(cookieName);
  }

  /**
   * Sets a cookie with the specified options.
   * @param cookie - The cookie to set, including name and payload.
   * @param config - Optional configuration for setting the cookie.
   */
  public set(cookie: CookieType, config?: CookieServiceConfig): void {
    const baseConfig = this.getConfig();
    const mergedConfig = { ...baseConfig, ...config, ...cookie };
    const options = this.configToCookieOptions(mergedConfig);

    this.cookie.set(cookie.name, cookie.payload, options);
  }
}
