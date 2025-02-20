import type { GeinsChannelTypeType, GeinsEndpoints, GeinsSettings } from '@geins/types';
import { GeinsChannelInterface } from '@geins/types';
import { MerchantApiClient } from './api-client';
import { Channel } from './logic';
import { GraphQLService } from './services';
import { ChannelsService } from './services/channelsService';
import { CookieService } from './services/cookieService';
import { EventService } from './services/eventService';
import { buildEndpoints, decodeJWT, encodeJWT, isServerContext } from './utils';

export class GeinsCore {
  // api client
  private _endpointsUrls: any;
  private _apiClient!: MerchantApiClient;
  private _geinsSettings: GeinsSettings;
  private _userToken?: string | undefined;

  // exposed graphql service
  private _graphQLService!: GraphQLService;

  // cookie service
  private _cookieService!: CookieService;

  // events
  private _eventService: EventService;

  // channel
  private _currentChannel!: Channel;
  private _accountChannels!: ChannelsService;

  constructor(geinsSettings: GeinsSettings) {
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
    this._geinsSettings = { ...defaultSettings, ...geinsSettings };

    // Initialize API Client
    if (this._geinsSettings.apiKey && this._geinsSettings.accountName) {
      this._endpointsUrls = buildEndpoints(
        this._geinsSettings.apiKey,
        this._geinsSettings.accountName,
        this._geinsSettings.environment,
      );
    }

    // Initialize BroadcastChannel
    if (!isServerContext()) {
      this._cookieService = new CookieService();
    }
    this._currentChannel = new Channel(this._geinsSettings);

    this._eventService = new EventService();
  }

  // Initialize API Client
  private initApiClient() {
    if (this._geinsSettings.apiKey && this._geinsSettings.accountName) {
      const options = {
        apiUrl: this._endpointsUrls.main,
        apiKey: this._geinsSettings.apiKey,
        userToken: this._userToken,
      };
      this._apiClient = new MerchantApiClient(options);
    } else {
      throw new Error('Failed to initialize API Client');
    }
  }

  private initGraphQLService(): void {
    this._graphQLService = new GraphQLService(() => this.client, this._geinsSettings);
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
    if (!this._currentChannel) {
      this._currentChannel = new Channel(this._geinsSettings);
    }
    if (!this._currentChannel) {
      throw new Error('Failed to initialize channel');
    }
    return this._currentChannel?.get() ?? undefined;
  }

  private async channelsGet(): Promise<GeinsChannelTypeType[] | undefined> {
    if (!this._accountChannels) {
      this._accountChannels = new ChannelsService(() => this.client, this._geinsSettings);
    }
    return this._accountChannels.get() ?? undefined;
  }

  /**
   * Set the user token.
   * @param userToken
   */
  public setUserToken(userToken?: string): void {
    this._userToken = userToken;
    if (this._apiClient) {
      this._apiClient.updateToken(userToken);
    }
  }

  /**
   * Get the user token. Returns a token if user is authenticated.
   * @returns string | undefined
   */
  public getUserToken(): string | undefined {
    return this._userToken;
  }

  /**
   * Endpoints for the current environment.
   * - main: The main api endpoint used to query Geins.
   * - auth: The auth endpoint.
   * - authSign: The auth sign endpoint.
   * - image: The base image url
   */
  get endpoints(): GeinsEndpoints {
    return this._endpointsUrls;
  }

  /**
   * Returns the API Client instance.
   */
  get client(): MerchantApiClient {
    if (!this._endpointsUrls) {
      throw new Error('Endpoints are not set');
    }
    if (!this._apiClient) {
      this.initApiClient();
    }
    return this._apiClient;
  }
  /**
   * Returns the GraphQL Client instance.
   * @returns GraphQLClient
   * Use to query Geins using GraphQL.
   */
  get graphql(): GraphQLService {
    if (!this._graphQLService) {
      this.initGraphQLService();
    }
    return this._graphQLService;
  }

  /**
   * Returns the GeinsSettings that was used to to instance the class.
   */
  get geinsSettings(): GeinsSettings {
    return this._geinsSettings;
  }

  /**
   * Returns the EventService instance.
   * @returns EventService
   * @example
   * const eventService = core.events;
   * eventService.listenerAdd((data) => {
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
    return this._eventService;
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
    if (!this._cookieService) {
      this._cookieService = new CookieService();
    }
    return this._cookieService;
  }

  /**
   * Encodes a payload into a JWT.
   * @param payload - The payload object to encode.
   * @param secretKey - The secret key to sign the JWT.
   * @param options - Additional options for signing the JWT.
   * @returns The encoded JWT as a string.
   */
  public static encodeJWT(payload: object, secretKey?: string): string {
    return encodeJWT(payload, secretKey);
  }
  /**
   * Decodes a JWT token and optionally verifies its signature.
   *
   * @param token - The JWT token to decode.
   * @param secretKey - The secret key to verify the signature (optional).
   * @returns An object containing the decoded payload.
   * @throws An error if the token is invalid or the signature verification fails (when secretKey is provided).
   */
  public static decodeJWT(token: string, secretKey?: string): any {
    const decoded = decodeJWT(token, secretKey);
    return decoded.payload;
  }
}
