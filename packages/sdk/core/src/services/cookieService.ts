import { parse, serialize, type SerializeOptions } from 'cookie';

type CookieDocument = { cookie: string };

function browserDocument(): CookieDocument | undefined {
  const { document } = globalThis as { document?: { cookie?: unknown } };
  return typeof document === 'object' && typeof document.cookie === 'string'
    ? (document as CookieDocument)
    : undefined;
}

// Reads values the way cookie-universal did: surrounding quotes stripped before decoding.
function decodeValue(raw: string): string {
  const value = raw.charAt(0) === '"' ? raw.slice(1, -1) : raw;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

// Values that are valid JSON come back parsed, as they always have.
function parseJson(value: string | undefined): unknown {
  try {
    return JSON.parse(value as string);
  } catch {
    return value;
  }
}

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
  // Without a document every method is a no-op: get returns '', getAll {}.
  private document = browserDocument();

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

  private configToCookieOptions(config: CookieServiceConfig): SerializeOptions {
    return {
      path: config.path,
      domain: config.domain,
      secure: config.secure,
      httpOnly: config.httpOnly,
      sameSite: config.sameSite,
      maxAge: this.toSerializedMaxAge(config.maxAge),
    };
  }

  // cookie-universal wrote no Max-Age for null and Max-Age=±Infinity, which browsers ignore;
  // both stay session cookies. NaN still throws in serialize, as it did.
  private toSerializedMaxAge(maxAge: CookieServiceConfig['maxAge'] | null): number | undefined {
    if (maxAge == null) {
      return undefined;
    }
    const parsed = this.parseMaxAge(maxAge);
    return Math.abs(parsed) === Infinity ? undefined : Math.floor(parsed);
  }

  private readCookies(): Record<string, string | undefined> {
    return this.document ? parse(this.document.cookie, { decode: decodeValue }) : {};
  }

  /**
   * Retrieves all cookies.
   * @returns An object containing all cookies.
   */
  public getAll(): Record<string, string> {
    const cookies = this.readCookies();
    const all: Record<string, string> = {};
    for (const name of Object.keys(cookies)) {
      // cookie-universal dropped names Object.prototype already has, __proto__ among them.
      if (!(name in Object.prototype)) {
        all[name] = parseJson(cookies[name]) as string;
      }
    }
    return all;
  }

  /**
   * Retrieves the value of a specific cookie.
   * @param cookieName - The name of the cookie to retrieve.
   * @returns The value of the cookie, or an empty string if not found.
   */
  public get(cookieName: string): string {
    return (parseJson(this.readCookies()[cookieName]) as string) || '';
  }

  /**
   * Removes a specific cookie.
   * @param cookieName - The name of the cookie to remove.
   */
  public remove(cookieName: string): void {
    if (this.document) {
      this.document.cookie = serialize(cookieName, '', { path: '/', expires: new Date(0) });
    }
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

    if (this.document) {
      const { payload } = cookie as { payload: unknown };
      let value = payload === undefined ? '' : String(payload);
      if (typeof payload === 'object') {
        value = JSON.stringify(payload);
      }
      this.document.cookie = serialize(cookie.name, value, options);
    }
  }
}
