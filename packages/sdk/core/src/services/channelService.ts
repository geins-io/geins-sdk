import type { GeinsChannelTypeType } from '@geins/types';
import { BaseApiService } from '../base/baseApiService';
import { queries } from '../graphql';
import { parseChannelResult } from '../parsers/channelParser';

export class ChannelService extends BaseApiService {
  async get(channelId: string): Promise<GeinsChannelTypeType | null> {
    return await this.runQueryParsed(queries.channel, { channelId });
  }
  protected parseResult(result: any): GeinsChannelTypeType | null {
    return parseChannelResult(result);
  }
}
