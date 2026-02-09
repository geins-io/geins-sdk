import type { GeinsChannelTypeType, GeinsSettings } from '@geins/types';
import type { ApiClientGetter } from '../base/baseApiService';
import { BaseApiService } from '../base/baseApiService';
import type { GraphQLQueryOptions } from '../api-client/merchantApiClient';
import { queries } from '../graphql';
import { parseChannelsResult } from '../parsers/channelParser';
import { SimpleCache } from '../utils/simpleCache';

export class ChannelsService extends BaseApiService {
  private cache: SimpleCache<GeinsChannelTypeType[]>;

  constructor(client: ApiClientGetter, geinsSettings: GeinsSettings) {
    super(client, geinsSettings);
    this.cache = new SimpleCache<GeinsChannelTypeType[]>(30 * 60 * 1000); // 30 minutes cache
  }

  async get(): Promise<GeinsChannelTypeType[] | undefined> {
    const cacheKey = 'all_channels';
    const cachedChannels = this.cache.get(cacheKey);

    if (cachedChannels) {
      return cachedChannels;
    }
    const options: GraphQLQueryOptions = {
      query: queries.channels,
      variables: {},
    };
    const channels = await this.runQueryParsed<GeinsChannelTypeType[]>(options);
    if (channels) {
      this.cache.set(cacheKey, channels);
    }
    return channels;
  }
  protected parseResult(result: unknown): GeinsChannelTypeType[] | undefined {
    return parseChannelsResult(result as { data?: { channels?: GeinsChannelTypeType[] } });
  }
}
