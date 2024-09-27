import type { GeinsChannelTypeType } from '@geins/types';
import { BaseApiService } from '../base/baseApiService';
import { queries } from '../graphql';
import { parseChannelsResult } from '../parsers/channelParser';

export class ChannelsService extends BaseApiService {
  async get(): Promise<GeinsChannelTypeType[] | undefined> {
    return await this.runQueryParsed(queries.channels, {});
  }
  protected parseResult(result: any): GeinsChannelTypeType[] | undefined {
    return parseChannelsResult(result);
  }
}
