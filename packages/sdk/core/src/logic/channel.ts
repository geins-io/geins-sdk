import type { GeinsCredentials, GeinsChannelTypeType } from '@geins/types';
import { MerchantApiClient, FetchPolicy } from '../api-client';
import { isServerContext, buildEndpoints } from '../utils';
import { ChannelStore } from '../stores';
import { ChannelService, logWrite } from '../services';

let instance: Channel | null = null;
const oneHourMs = 60 * 60 * 1000; // 1 hour in milliseconds

export class Channel {
  private channelId: string;
  private channel: GeinsChannelTypeType | undefined;
  private channelService: ChannelService | undefined;
  private store: ChannelStore | undefined;
  private apiClient: MerchantApiClient | undefined;

  constructor(private geinsCredentials: GeinsCredentials) {
    if (!geinsCredentials.channel) {
      throw new Error('Channel is required');
    }

    if (!geinsCredentials.apiKey) {
      throw new Error('API Key is required');
    }

    this.store = new ChannelStore();

    this.channelId = `${geinsCredentials.channel}|${geinsCredentials.tld}`;
    this.initApiClient();
  }

  private initApiClient() {
    if (this.geinsCredentials.apiKey && this.geinsCredentials.accountName) {
      const endpointsUrls = buildEndpoints(
        this.geinsCredentials.apiKey,
        this.geinsCredentials.accountName,
        this.geinsCredentials.environment,
      );

      this.apiClient = new MerchantApiClient(
        endpointsUrls.main,
        this.geinsCredentials.apiKey,
        FetchPolicy.CACHE_FIRST,
      );
    } else {
      throw new Error('API Key and Account Name are required');
    }
  }

  private initChannelService() {
    this.channelService = new ChannelService(
      this.apiClient,
      this.geinsCredentials,
    );
  }

  public static getInstance(credentials: GeinsCredentials) {
    if (!instance) {
      instance = new Channel(credentials);
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
      this.initChannelService();
    }
    const channel = await this.channelService?.get(this.channelId);
    this.setKey(this.channelId, JSON.stringify(channel));
    return channel;
  }

  public async getChannel(): Promise<GeinsChannelTypeType | null | undefined> {
    const cachedChannel = await this.getKey(this.channelId);
    if (cachedChannel) {
      return JSON.parse(cachedChannel);
    }
    return this.setChannel();
  }
}
