import { ChannelType } from '@geins/types';
import { BaseApiService } from '../base/baseApiService';
import { queries } from '../graphql';
import { parseChannel } from '../utils/channelParser';
import { logWrite } from './logService';

export class ChannelService extends BaseApiService {
  async get(channelId: string): Promise<ChannelType | null> {
    return await this.runQueryParsed(queries.channel, { channelId });
  }
  protected parseResult(result: any): ChannelType | null {
    logWrite('parseResult Channel Result', result);
    return parseChannel(result);
  }
}
