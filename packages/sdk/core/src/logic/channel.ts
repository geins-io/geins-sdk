import type { GeinsSettings, GeinsChannelTypeType } from '@geins/types';
import { SimpleCache } from '../utils/simpleCache';
import { MerchantApiClient, FetchPolicyOptions } from '../api-client';
import { buildEndpoints } from '../utils';
import { ChannelStore } from '../stores';
import { ChannelService } from '../services';

let instance: Channel | null = null;

export class Channel {
  private channelId: string;
  private channelService: ChannelService | undefined;
  private cache: SimpleCache<GeinsChannelTypeType>;
  private store: ChannelStore | undefined;
  private apiClient: MerchantApiClient | undefined;

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

      this.apiClient = new MerchantApiClient(
        endpointsUrls.main,
        this.geinsSettings.apiKey,
        FetchPolicyOptions.CACHE_FIRST,
      );
    } else {
      throw new Error('API Key and Account Name are required');
    }
  }

  private initChannelService() {
    this.channelService = new ChannelService(
      this.apiClient,
      this.geinsSettings,
    );
  }

  public static getInstance(geinsSettings: GeinsSettings) {
    if (!instance) {
      instance = new Channel(geinsSettings);
    }
    return instance;
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
      if (!this.apiClient) {
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
