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
export declare class CookieService {
    private path;
    private domain;
    private secure;
    private maxAge;
    constructor(config?: CookieServiceConfig);
    protected getConfig(): {
        path: string;
        domain: string;
        secure: boolean;
        maxAge: number;
    };
    getAll(): {
        [key: string]: string;
    };
    set(cookie: CookieType, config?: CookieServiceConfig): void;
    get(cookieName: string): string | undefined;
    remove(cookieName: string): void;
}
