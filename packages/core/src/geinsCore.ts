

import { Environment } from '@geins/types';
import type { MerchantApiCredentials } from '@geins/types';
import { MerchantApiClient, ENDPOINTS } from './api-client';
import { Broadcast, BroadcastMessage } from './services/';


const BROADCAST_CHANNEL = 'geins-channel';

export class GeinsCore {
    // api client
    private endpointsUrls: any;
    private apiClient: any;
    private apiKey: string = '';
    private accountName: string = '';
    private environment: Environment = Environment.PRODUCTION;

    // broadcast channel
    private broadcastChannelId: string = BROADCAST_CHANNEL;
    private bc: Broadcast | undefined;

    constructor(credentials: MerchantApiCredentials) {
        if (!credentials) {
            throw new Error('Credentials are required');
        }
        // Set authentication information
        this.apiKey = credentials.apiKey;
        this.accountName = credentials.accountName;
        this.environment = credentials.environment || Environment.PRODUCTION;

        // Set endpoints

        // Initialize API Client
        if (this.apiKey && this.accountName) {
            this.endpointsUrls = {
                main: ENDPOINTS.main,
                auth: ENDPOINTS.auth.replace('{ACCOUNT}', this.accountName).replace('{ENV}', this.environment),
                authSign: ENDPOINTS.auth_sign.replace('{API-KEY}', this.apiKey),
                image: ENDPOINTS.image.replace('{ACCOUNT}', this.accountName)
            };
        }

        // Initialize BroadcastChannel
        if (!this.serverContext()){
            this.initBroadcastChannel();
        }
    }

    private serverContext() {
        return typeof window === 'undefined';
    }
    // Initialize API Client
    private initApiClient() {
        if (this.apiKey && this.accountName) {
            this.apiClient = new MerchantApiClient(this.endpointsUrls.main, this.apiKey);
        } else {
            throw new Error('API Key and Account Name are required');
        }
    }

    // Initialize Broadcast Channel
    private initBroadcastChannel() {
        try {
            this.bc = new Broadcast(this.broadcastChannelId);
            const handler = (message: BroadcastMessage) => {
                console.log('Broadcast message received:', message);
            }
            this.bc.addEventListener(handler);
        } catch (error) {
            console.error('Broadcas Channel initialization failed', error);
        }
    }

    // Get Broadcast Channel
    get broadcastChannel(): Broadcast | undefined {
        if(!this.serverContext()){
            if (!this.bc) {
                this.initBroadcastChannel();
            }
            return this.bc;
        }
        return undefined;
    }

    get endpoints(): any {
        return this.endpointsUrls;
    }

    get client(): MerchantApiClient | undefined {
        if(!this.endpointsUrls){
            throw new Error('Endpoints are not set');
        }
        if(!this.apiClient){
            this.initApiClient();
        }
        return this.apiClient;
    }
}
