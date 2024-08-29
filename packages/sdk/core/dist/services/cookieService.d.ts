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
    protected getConfig(): {
        secure: boolean;
    };
    getAll(): {
        [key: string]: string;
    };
    set(cookie: CookieType): void;
    get(cookie: CookieType): string | undefined;
    remove(cookieName: string): void;
}
