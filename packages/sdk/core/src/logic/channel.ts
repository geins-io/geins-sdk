import type { GeinsChannelTypeType, GeinsSettings } from '@geins/types';
import { FetchPolicyOptions, MerchantApiClient } from '../api-client';
import { ChannelService } from '../services';
import { ChannelStore } from '../stores';
import { buildEndpoints } from '../utils';
import { SimpleCache } from '../utils/simpleCache';

let instance: Channel | null = null;

export class Channel {
  private channelId: string;
  private channelService: ChannelService | undefined;
  private cache: SimpleCache<GeinsChannelTypeType>;
  private store: ChannelStore | undefined;
  private _apiClient!: () => MerchantApiClient | undefined;

  constructor(private geinsSettings: GeinsSettings) {
    if (!geinsSettings.channel) {
      throw new Error('Channel is required');
    }

    if (!geinsSettings.apiKey) {
      throw new Error('API Key is required');
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
      throw new Error('API Key and Account Name are required');
    }
  }

  private initChannelService() {
    this.channelService = new ChannelService(() => this._apiClient(), this.geinsSettings);
  }

  public static getInstance(geinsSettings: GeinsSettings) {
    if (!instance) {
      instance = new Channel(geinsSettings);
    }
    return instance;
  }

  public static destroy() {
    if (!instance) {
      return;
    }
    instance.cache.clear();
    instance.store?.destroy();
    instance.channelService = undefined;
    instance._apiClient = () => undefined;
    instance = null;
  }

  setKey(key: string, value: string): void {
    if (!this.store) {
      throw new Error('Store is not initialized');
    }
    this.store.setKey(key, value);
  }

  getKey(key: string): Promise<string> {
    if (!this.store) {
      throw new Error('Store is not initialized');
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

  public async get(): Promise<GeinsChannelTypeType | undefined> {
    const cachedChannel = this.cache.get(this.channelId);
    if (cachedChannel) {
      return cachedChannel;
    }

    const channel = await this.setChannel();
    return channel ?? undefined;
  }
}
