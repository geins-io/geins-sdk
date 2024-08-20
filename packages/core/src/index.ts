

import { Environment } from './types';
import { ENDPOINTS } from './endpoints';
import { Broadcast, BroadcastMessage } from './broadcast'
import GeinsMerchantApiClient from './client';
import type { GeinsCredentialsAPI, GeinsAPILocalization } from './types';

const BROADCAST_CHANNEL = 'geins-channel';

class GeinsCore {
    private endpointsUrls: any;
    private apiClient: any;
    private apiKey: string = '';
    private accountName: string = '';
    private environment: Environment = Environment.PRODUCTION;

    private broadcastChannelId: string = BROADCAST_CHANNEL;
    private bc: Broadcast | undefined;

    constructor(credentials: GeinsCredentialsAPI) {
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
            this.apiClient = new GeinsMerchantApiClient(this.endpointsUrls.main, this.apiKey);
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

    get client(): GeinsMerchantApiClient | undefined {
        if(!this.endpointsUrls){
            throw new Error('Endpoints are not set');            
        }
        if(!this.apiClient){
            this.initApiClient();            
        }
        return this.apiClient;
    }
}

export { 
    GeinsCore, 
    GeinsCredentialsAPI, 
    GeinsMerchantApiClient,
    GeinsAPILocalization,
 };
