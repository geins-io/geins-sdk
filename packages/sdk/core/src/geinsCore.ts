import type {
  GeinsSettings,
  GeinsChannelTypeType,
  GeinsEndpoints,
  Environment,
} from '@geins/types';
import { GeinsChannelInterface } from '@geins/types';
import { MerchantApiClient, GraphQLClient } from './api-client';
import { CookieService, EventService, ChannelsService } from './services/';
import { Channel } from './logic';
import { isServerContext, buildEndpoints } from './utils';

export class GeinsCore {
  // api client
  private endpointsUrls: any;
  private apiClient: any;
  private graphQLClient: GraphQLClient | undefined;
  private settings: GeinsSettings;
  private userToken?: string;

  // cookie service
  private cookieService: CookieService | undefined;

  // events
  private eventService: EventService;

  // channel
  private currentChannel: Channel | undefined;
  private accountChannels: ChannelsService | undefined;

  constructor(geinsSettings: GeinsSettings, userToken?: string) {
    if (!geinsSettings.channel) {
      throw new Error('Channel is required');
    }

    if (!geinsSettings.apiKey) {
      throw new Error('API Key is required');
    }

    if (!geinsSettings.accountName) {
      throw new Error('Account name is required');
    }

    // Set default environment if not provided
    const defaultSettings: Partial<GeinsSettings> = {
      environment: 'prod',
    };

    // Merge provided settings with defaults
    this.settings = { ...defaultSettings, ...geinsSettings };

    // Set user token if provided
    this.userToken = userToken;

    // Initialize API Client
    if (this.settings.apiKey && this.settings.accountName) {
      this.endpointsUrls = buildEndpoints(
        this.settings.apiKey,
        this.settings.accountName,
        this.settings.environment,
      );
    }

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
        this.userToken,
      );
    } else {
      throw new Error('Failed to initialize API Client');
    }
  }
  /**
   * Channels
   * Methods:
   * - current() gets the current channel for application set from the settings;
   * - all() get all channels for the account;
   */
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

  /**
   * Set the user token.
   * @param userToken
   */
  public setUserToken(userToken?: string): void {
    this.userToken = userToken;
    console.log(
      '🚀 ~ GeinsCore ~ setUserToken ~ this.userToken:',
      this.userToken,
    );

    this.initApiClient();
  }

  /**
   * Get the user token. Returns a token if user is authenticated.
   * @returns string | undefined
   */
  public getUserToken(): string | undefined {
    return this.userToken;
  }

  /**
   * Endpoints for the current environment.
   * - main: The main api endpoint used to query Geins.
   * - auth: The auth endpoint.
   * - authSign: The auth sign endpoint.
   * - image: The base image url
   */
  get endpoints(): GeinsEndpoints {
    return this.endpointsUrls;
  }

  /**
   * Returns the API Client instance.
   */
  get client(): MerchantApiClient {
    if (!this.endpointsUrls) {
      throw new Error('Endpoints are not set');
    }
    if (!this.apiClient) {
      this.initApiClient();
    }
    return this.apiClient;
  }
  /**
   * Returns the GraphQL Client instance.
   * @returns GraphQLClient
   * Use to query Geins using GraphQL.
   */
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

  /**
   * Returns the GeinsSettings that was used to to instance the class.
   */
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

  /**
   * Returns the CookieService instance.
   * @returns CookieService
   * @example
   * const cookieService = core.cookies;
   * cookieService.set('cookieName', 'cookieValue');
   * const cookieValue = cookieService.get('cookieName');
   *
   */
  get cookies(): CookieService {
    if (!this.cookieService) {
      this.cookieService = new CookieService();
    }
    return this.cookieService;
  }
}
