import type { GeinsCredentials, ChannelType } from '@geins/types';
import { MerchantApiClient, ENDPOINTS } from './api-client';
import {
  CookieService,
  EventService,
  ChannelsService,
  ChannelService,
  logWrite,
} from './services/';
import { isServerContext, buildEndpoints } from './utils';

export class GeinsCore {
  // api client
  private endpointsUrls: any;
  private apiClient: any;
  private geinsCredentials: GeinsCredentials;

  // cookie service
  private cookieService: CookieService | undefined;

  // events
  private eventService: EventService;

  // channel
  public channels: ChannelsService;
  // private currentChannel: Channel | undefined;

  constructor(credentials: GeinsCredentials) {
    if (!credentials.channel) {
      throw new Error('Channel is required');
    }

    if (!credentials.apiKey) {
      throw new Error('API Key is required');
    }

    // Initialize API Client
    if (credentials.apiKey && credentials.accountName) {
      this.endpointsUrls = buildEndpoints(
        credentials.apiKey,
        credentials.accountName,
        credentials.environment,
      );
    }

    this.geinsCredentials = credentials;

    // Initialize BroadcastChannel
    if (!isServerContext()) {
      this.cookieService = new CookieService();
    }

    this.eventService = new EventService();
    this.channels = new ChannelsService(this.client, this.credentials);

    // const service = new ChannelService(this.client, this.credentials);
  }

  // Initialize API Client
  private initApiClient() {
    if (this.geinsCredentials.apiKey && this.geinsCredentials.accountName) {
      this.apiClient = new MerchantApiClient(
        this.endpointsUrls.main,
        this.geinsCredentials.apiKey,
      );
    } else {
      throw new Error('API Key and Account Name are required');
    }
  }

  public async getChannel(channelId: string): Promise<ChannelType | null> {
    const service = new ChannelService(this.client, this.credentials);
    const channelData = await service.get(channelId);
    logWrite('Channel Data', channelData);
    return channelData;
  }

  get client(): any {
    if (!this.endpointsUrls) {
      throw new Error('Endpoints are not set');
    }
    if (!this.apiClient) {
      this.initApiClient();
    }
    return this.apiClient;
  }

  get endpoints(): any {
    return this.endpointsUrls;
  }

  get credentials(): GeinsCredentials {
    return this.geinsCredentials;
  }

  get events(): EventService {
    return this.eventService;
  }

  get cookies(): CookieService {
    if (!this.cookieService) {
      this.cookieService = new CookieService();
    }
    return this.cookieService;
  }
}
