export declare function isServerContext(): boolean;
export declare function buildEndpoints(accountName: string, apiKey: string, environment?: string): {
    main: string;
    auth: string;
    authSign: string;
    image: string;
};
