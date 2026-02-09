import type { GeinsChannelTypeType, GeinsSettings } from '@geins/types';
import { FetchPolicyOptions, MerchantApiClient } from '../api-client';
import { GeinsError, GeinsErrorCode } from '../errors/geinsError';
import { ChannelService } from '../services';
import { ChannelStore } from '../stores';
import { buildEndpoints } from '../utils';
import { SimpleCache } from '../utils/simpleCache';

/** Manages channel data for the current tenant, with in-memory caching. */
export class Channel {
  private channelId: string;
  private channelService: ChannelService | undefined;
  private cache: SimpleCache<GeinsChannelTypeType>;
  private store: ChannelStore | undefined;
  private _apiClient!: () => MerchantApiClient;

  constructor(private geinsSettings: GeinsSettings) {
    if (!geinsSettings.channel) {
      throw new GeinsError('Channel is required', GeinsErrorCode.INVALID_ARGUMENT);
    }

    if (!geinsSettings.apiKey) {
      throw new GeinsError('API Key is required', GeinsErrorCode.INVALID_ARGUMENT);
    }

    this.store = new ChannelStore();
    this.channelId = `${geinsSettings.channel}|${geinsSettings.tld}`;
    this.cache = new SimpleCache<GeinsChannelTypeType>(60 * 60 * 1000);
    this.initApiClient();
  }

  private initApiClient() {
    if (this.geinsSettings.apiKey && this.geinsSettings.accountName) {
      const endpointsUrls = buildEndpoints(
        this.geinsSettings.apiKey,
        this.geinsSettings.accountName,
        this.geinsSettings.environment,
      );
      const options = {
        apiUrl: endpointsUrls.main,
        apiKey: this.geinsSettings.apiKey,
        requestOptions: { fetchPolicy: FetchPolicyOptions.CACHE_FIRST },
      };

      this._apiClient = () => new MerchantApiClient(options);
    } else {
      throw new GeinsError('API Key and Account Name are required', GeinsErrorCode.INVALID_ARGUMENT);
    }
  }

  private initChannelService() {
    this.channelService = new ChannelService(() => this._apiClient!(), this.geinsSettings);
  }

  /** Store an arbitrary key-value pair in the channel store. */
  setKey(key: string, value: string): void {
    if (!this.store) {
      throw new GeinsError('Store is not initialized', GeinsErrorCode.NOT_INITIALIZED);
    }
    this.store.setKey(key, value);
  }

  /** Retrieve a value from the channel store by key. */
  async getKey(key: string): Promise<string | null> {
    if (!this.store) {
      throw new GeinsError('Store is not initialized', GeinsErrorCode.NOT_INITIALIZED);
    }
    return this.store.getKey(key);
  }

  private async setChannel() {
    if (!this.channelService) {
      if (!this._apiClient) {
        this.initApiClient();
      }
      this.initChannelService();
    }
    const channel = await this.channelService?.get(this.channelId);
    if (channel) {
      this.cache.set(this.channelId, channel);
    }
    return channel;
  }

  /** Fetch the current channel data, returning a cached result when available. */
  public async get(): Promise<GeinsChannelTypeType | undefined> {
    const cachedChannel = this.cache.get(this.channelId);
    if (cachedChannel) {
      return cachedChannel;
    }

    const channel = await this.setChannel();
    return channel ?? undefined;
  }
}
