import type { GeinsChannelTypeType, GeinsSettings } from '@geins/types';
import type { ApiClientGetter } from '../base/baseApiService';
import { BaseApiService } from '../base/baseApiService';
import type { GraphQLQueryOptions } from '../api-client/merchantApiClient';
import { queries } from '../graphql';
import { parseChannelResult } from '../parsers/channelParser';
import { SimpleCache } from '../utils/simpleCache';

export class ChannelService extends BaseApiService {
  private cache: SimpleCache<GeinsChannelTypeType>;
  constructor(client: ApiClientGetter, geinsSettings: GeinsSettings) {
    super(client, geinsSettings);
    this.cache = new SimpleCache<GeinsChannelTypeType>(15 * 60 * 1000); // 15 minutes cache
  }
  async get(channelId: string): Promise<GeinsChannelTypeType | undefined> {
    const cacheKey = `channel_${channelId}`;
    const cachedChannel = this.cache.get(cacheKey);
    if (cachedChannel) {
      return cachedChannel;
    }
    const options: GraphQLQueryOptions = {
      query: queries.channel,
      variables: { channelId },
    };
    const channel = await this.runQueryParsed<GeinsChannelTypeType>(options);
    if (channel) {
      this.cache.set(cacheKey, channel);
    }
    return channel;
  }

  protected parseResult(result: unknown): GeinsChannelTypeType | undefined {
    return parseChannelResult(result as { data?: { channel?: GeinsChannelTypeType } });
  }
}
