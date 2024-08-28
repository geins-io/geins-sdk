import type { ManagementApiCredentials } from '@geins/types';
export declare class ManagementApiClient {
    private baseUrl;
    private apiKey;
    private authToken;
    constructor(credentials: ManagementApiCredentials);
    createAuthToken(credentials: ManagementApiCredentials): string;
    getEndpointUrl(path: string): string;
    request(method: string, path: string, data?: any): Promise<any>;
}
