export declare function isServerContext(): boolean;
export declare function buildEndpoints(accountName: string, apiKey: string, environment?: string): {
    main: string;
    auth: string;
    authSign: string;
    image: string;
};
export declare function authClaimTokenParse(token: string): any;
export declare function authClaimsTokenSerialize(token: string): string;
export declare function authClaimsTokenSerializeToObject(token: string): Record<string, string> | null;
