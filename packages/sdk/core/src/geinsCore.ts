import type { GeinsSettings, GeinsChannelTypeType } from '@geins/types';
import { MerchantApiClient, GraphQLClient, ENDPOINTS } from './api-client';
import {
  CookieService,
  EventService,
  ChannelsService,
  ChannelService,
  logWrite,
} from './services/';
import { Channel } from './logic';
import { isServerContext, buildEndpoints } from './utils';

export class GeinsCore {
  // api client
  private endpointsUrls: any;
  private apiClient: any;
  private graphQLClient: GraphQLClient | undefined;
  private settings: GeinsSettings;

  // cookie service
  private cookieService: CookieService | undefined;

  // events
  private eventService: EventService;

  // channel
  public channels: ChannelsService;
  public channel: Channel | undefined;
  // private currentChannel: Channel | undefined;

  constructor(geinsSettings: GeinsSettings) {
    if (!geinsSettings.channel) {
      throw new Error('Channel is required');
    }

    if (!geinsSettings.apiKey) {
      throw new Error('API Key is required');
    }

    // Initialize API Client
    if (geinsSettings.apiKey && geinsSettings.accountName) {
      this.endpointsUrls = buildEndpoints(
        geinsSettings.apiKey,
        geinsSettings.accountName,
        geinsSettings.environment,
      );
    }

    this.settings = geinsSettings;

    // Initialize BroadcastChannel
    if (!isServerContext()) {
      this.cookieService = new CookieService();
    }

    this.eventService = new EventService();
    this.channels = new ChannelsService(this.client, this.settings);
    this.channel = new Channel(this.settings);
  }

  // Initialize API Client
  private initApiClient() {
    if (this.settings.apiKey && this.settings.accountName) {
      this.apiClient = new MerchantApiClient(
        this.endpointsUrls.main,
        this.settings.apiKey,
      );
    } else {
      throw new Error('API Key and Account Name are required');
    }
  }

  public async getChannel(): Promise<GeinsChannelTypeType | null | undefined> {
    if (!this.channel) {
      throw new Error('Channel are not set');
    }
    return this.channel?.getChannel();
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

  get graphql(): GraphQLClient {
    if (!this.graphQLClient) {
      if (this.geinsCredentials.apiKey && this.geinsCredentials.accountName) {
        this.graphQLClient = new GraphQLClient(
          this.endpointsUrls.main,
          this.geinsCredentials.apiKey,
        );
      } else {
        throw new Error('API Key and Account Name are required');
      }
    }
    return this.graphQLClient;
  }

  get endpoints(): any {
    return this.endpointsUrls;
  }

  get geinsSettings(): GeinsSettings {
    return this.settings;
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
