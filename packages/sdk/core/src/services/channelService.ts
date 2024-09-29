import type { GeinsChannelTypeType, GeinsSettings } from '@geins/types';
import { SimpleCache } from '../utils/simpleCache';
import { BaseApiService } from '../base/baseApiService';
import { queries } from '../graphql';
import { parseChannelResult } from '../parsers/channelParser';

export class ChannelService extends BaseApiService {
  private cache: SimpleCache<GeinsChannelTypeType>;
  constructor(client: any, geinsSettings: GeinsSettings) {
    super(client, geinsSettings);
    this.cache = new SimpleCache<GeinsChannelTypeType>(15 * 60 * 1000); // 15 minutes cache
  }
  async get(channelId: string): Promise<GeinsChannelTypeType | undefined> {
    console.log('get channel', channelId);
    const cacheKey = `channel_${channelId}`;
    const cachedChannel = this.cache.get(cacheKey);
    console.log('**cache hit', cacheKey);
    if (cachedChannel) {
      console.log('cache hit', cacheKey);
      return cachedChannel;
    }

    const channel = await this.runQueryParsed<GeinsChannelTypeType>(
      queries.channel,
      { channelId },
    );
    if (channel) {
      this.cache.set(cacheKey, channel);
    }
    return channel;
  }

  protected parseResult(result: any): GeinsChannelTypeType | undefined {
    return parseChannelResult(result);
  }
}
