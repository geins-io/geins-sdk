export interface CookieType {
    name: string;
    payload?: any;
    expires?: number;
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
    protected getConfig(): {
        expires: number;
        path: string;
        domain: string;
        secure: boolean;
    };
    getAll(): {
        [key: string]: string;
    };
    set(cookie: CookieType, config?: CookieServiceConfig): void;
    get(cookie: CookieType): string | undefined;
    remove(cookieName: string): void;
}
