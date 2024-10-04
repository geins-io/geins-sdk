// packages/sdk/core/__tests__/GeinsCore.test.ts

import { Channel } from '../src/logic/channel';
import { GeinsSettings } from '@geins/types';
import { validSettings } from '../../../../test/globalSettings';
import exp from 'constants';

describe('Channel', () => {
  let channel: Channel;
  beforeEach(() => {
    channel = Channel.getInstance(validSettings);
  });

  it('should initialize channel correctly', () => {
    expect(channel).toBeDefined();
  });

  it('should get current channel correctly', async () => {
    const currentChannel = await channel.get();
    expect(currentChannel).toBeDefined();
    expect(currentChannel).toHaveProperty('id');
    expect(currentChannel).toHaveProperty('name');
    expect(currentChannel).toHaveProperty('type');
    expect(currentChannel).toHaveProperty('url');
    expect(currentChannel).toHaveProperty('defaultMarketId');
    expect(currentChannel).toHaveProperty('defaultLanguageId');
    if (currentChannel) {
      expect(currentChannel.id).toEqual(
        `${validSettings.channel}|${validSettings.tld}`,
      );
    }
  });

  afterEach(() => {
    // Clean up mocks after each test
    jest.clearAllMocks();
  });
});
