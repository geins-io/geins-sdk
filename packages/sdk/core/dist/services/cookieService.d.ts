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
export declare class CookieService {
    private expires;
    private path;
    private expiresDate;
    private domain;
    private secure;
    constructor(config?: CookieServiceConfig);
    protected getCookieConfig(): {
        secure: boolean;
    };
    getAllCookies(): {
        [key: string]: string;
    };
    setCookie(cookie: CookieType): void;
    getCookie(cookie: CookieType): string | undefined;
    removeCookie(cookie: CookieType): void;
}
