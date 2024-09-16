import type { ChannelType } from '@geins/types';
import { BaseApiService } from '../base/baseApiService';
import { queries } from '../graphql';
import { parseChannelResult } from '../utils/channelParser';

export class ChannelService extends BaseApiService {
  async get(channelId: string): Promise<ChannelType | null> {
    return await this.runQueryParsed(queries.channel, { channelId });
  }
  protected parseResult(result: any): ChannelType | null {
    return parseChannelResult(result);
  }
}
