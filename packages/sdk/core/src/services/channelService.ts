import type { GeinsChannelTypeType, GeinsSettings } from '@geins/types';
import { BaseApiService } from '../base/baseApiService';
import { queries } from '../graphql';
import { parseChannelResult } from '../parsers/channelParser';
import { SimpleCache } from '../utils/simpleCache';

export class ChannelService extends BaseApiService {
  private cache: SimpleCache<GeinsChannelTypeType>;
  constructor(client: any, geinsSettings: GeinsSettings) {
    super(client, geinsSettings);
    this.cache = new SimpleCache<GeinsChannelTypeType>(15 * 60 * 1000); // 15 minutes cache
  }
  async get(channelId: string): Promise<GeinsChannelTypeType | undefined> {
    const cacheKey = `channel_${channelId}`;
    const cachedChannel = this.cache.get(cacheKey);
    if (cachedChannel) {
      return cachedChannel;
    }
    const options: any = {
      query: queries.channel,
      variables: { channelId },
    };
    const channel = await this.runQueryParsed<GeinsChannelTypeType>(options);
    if (channel) {
      this.cache.set(cacheKey, channel);
    }
    return channel;
  }

  protected parseResult(result: any): GeinsChannelTypeType | undefined {
    return parseChannelResult(result);
  }
}
