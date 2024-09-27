import type { GeinsSettings, GeinsChannelTypeType } from '@geins/types';
import { MerchantApiClient, GraphQLClient } from './api-client';
import { CookieService, EventService, ChannelsService } from './services/';
import { Channel } from './logic';
import { isServerContext, buildEndpoints } from './utils';

interface GeinsChannelInterface {
  current: () => Promise<GeinsChannelTypeType | undefined>;
  all: () => Promise<GeinsChannelTypeType[] | undefined>;
}

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
  private currentChannel: Channel | undefined;
  private accountChannels: ChannelsService | undefined;

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
    this.currentChannel = new Channel(this.settings);
    this.eventService = new EventService();
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
  get channel(): GeinsChannelInterface {
    return {
      current: this.channelGet.bind(this),
      all: this.channelsGet.bind(this),
    };
  }

  private async channelGet(): Promise<GeinsChannelTypeType | undefined> {
    if (!this.currentChannel) {
      this.currentChannel = new Channel(this.settings);
    }
    if (!this.currentChannel) {
      throw new Error('Failed to initialize channel');
    }
    return this.currentChannel?.get() ?? undefined;
  }

  private async channelsGet(): Promise<GeinsChannelTypeType[] | undefined> {
    if (!this.accountChannels) {
      this.accountChannels = new ChannelsService(this.client, this.settings);
    }
    return this.accountChannels.get() ?? undefined;
  }

  get endpoints(): any {
    return this.endpointsUrls;
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
      if (this.settings.apiKey && this.settings.accountName) {
        this.graphQLClient = new GraphQLClient(
          this.endpointsUrls.main,
          this.settings.apiKey,
        );
      } else {
        throw new Error('API Key and Account Name are required');
      }
    }
    return this.graphQLClient;
  }

  get geinsSettings(): GeinsSettings {
    return this.settings;
  }
  /**
   * Returns the EventService instance.
   * @returns EventService
   * @example
   * const eventService = core.events;
   * eventService.listnerAdd((data) => {
   *  console.log(data);
   * });
   * eventService.push({
   * subject: 'USER_LOGIN',
   * payload: {
   * user: 'luke.skywalker@tatooine.com',
   * },
   * broadcast: true,
   * });
   */
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
