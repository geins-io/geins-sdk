import type { GeinsChannelTypeType, GeinsEndpoints, GeinsSettings } from '@geins/types';
import { GeinsChannelInterface } from '@geins/types';
import { MerchantApiClient } from './api-client';
import { GeinsError, GeinsErrorCode } from './errors/geinsError';
import type { TelemetryCollector } from './api-client/links/telemetryLink';
import { Channel } from './logic';
import { GraphQLService } from './services';
import { ChannelsService } from './services/channelsService';
import { CookieService } from './services/cookieService';
import { EventService } from './services/eventService';
import { buildEndpoints, decodeJWT, encodeJWT, isServerContext } from './utils';

/**
 * Root entry point for the Geins SDK.
 * Holds the API client, channel logic, event bus, and settings.
 * Instantiate once per application and pass to domain packages (CRM, CMS, OMS).
 */
export class GeinsCore {
  // api client
  private _endpointsUrls: GeinsEndpoints | undefined;
  private _apiClient!: MerchantApiClient;
  private _geinsSettings: GeinsSettings;

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
      throw new GeinsError('Channel is required', GeinsErrorCode.INVALID_ARGUMENT);
    }

    if (!geinsSettings.apiKey) {
      throw new GeinsError('API Key is required', GeinsErrorCode.INVALID_ARGUMENT);
    }

    if (!geinsSettings.accountName) {
      throw new GeinsError('Account name is required', GeinsErrorCode.INVALID_ARGUMENT);
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
        apiUrl: this._endpointsUrls!.main,
        apiKey: this._geinsSettings.apiKey,
        settings: this._geinsSettings,
      };
      this._apiClient = new MerchantApiClient(options);
    } else {
      throw new GeinsError('Failed to initialize API Client', GeinsErrorCode.NOT_INITIALIZED);
    }
  }

  private initGraphQLService(): void {
    this._graphQLService = new GraphQLService(() => this.client, this._geinsSettings);
  }

  /** Channel accessor — `current()` returns the configured channel, `all()` lists every channel on the account. */
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
      throw new GeinsError('Failed to initialize channel', GeinsErrorCode.NOT_INITIALIZED);
    }
    return this._currentChannel?.get() ?? undefined;
  }

  private async channelsGet(): Promise<GeinsChannelTypeType[] | undefined> {
    if (!this._accountChannels) {
      this._accountChannels = new ChannelsService(() => this.client, this._geinsSettings);
    }
    return this._accountChannels.get() ?? undefined;
  }

  /** Endpoints for the current environment: main (API), auth, authSign, and image base URL. */
  get endpoints(): GeinsEndpoints {
    if (!this._endpointsUrls) {
      throw new GeinsError('Endpoints are not set', GeinsErrorCode.NOT_INITIALIZED);
    }
    return this._endpointsUrls;
  }

  /** Returns the API Client instance. */
  get client(): MerchantApiClient {
    if (!this._endpointsUrls) {
      throw new GeinsError('Endpoints are not set', GeinsErrorCode.NOT_INITIALIZED);
    }
    if (!this._apiClient) {
      this.initApiClient();
    }
    return this._apiClient;
  }
  /** Returns the GraphQL Client instance. */
  get graphql(): GraphQLService {
    if (!this._graphQLService) {
      this.initGraphQLService();
    }
    return this._graphQLService;
  }

  /** Returns the GeinsSettings that was used to instance the class. */
  get geinsSettings(): GeinsSettings {
    return this._geinsSettings;
  }

  /** Returns the EventService instance. */
  get events(): EventService {
    return this._eventService;
  }

  /** Returns the CookieService instance. */
  get cookies(): CookieService {
    if (!this._cookieService) {
      this._cookieService = new CookieService();
    }
    return this._cookieService;
  }

  /**
   * Returns the TelemetryCollector if telemetry is enabled, or null.
   * Use to get metrics snapshots or flush metrics on demand.
   */
  get telemetry(): TelemetryCollector | null {
    return this._apiClient?.telemetry ?? null;
  }

  /**
   * Encodes a payload into a JWT.
   * @param payload - The payload object to encode.
   * @param secretKey - The secret key to sign the JWT.
   * @param options - Additional options for signing the JWT.
   * @returns The encoded JWT as a string.
   */
  public static encodeJWT(payload: Record<string, unknown>, secretKey?: string): string {
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
  public static decodeJWT(token: string, secretKey?: string): Record<string, unknown> {
    const decoded = decodeJWT(token, secretKey);
    return decoded.payload;
  }
}
