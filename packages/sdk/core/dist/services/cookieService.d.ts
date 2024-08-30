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
    private cookie;
    constructor(config?: CookieServiceConfig);
    protected getConfig(): {
        path: string;
        domain: string;
        secure: boolean;
        maxAge: number;
    };
    getAll(): object;
    set(cookie: CookieType, config?: CookieServiceConfig): void;
    get(cookieName: string): any;
    remove(cookieName: string): void;
}
