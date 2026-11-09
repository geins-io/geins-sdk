import { GeinsCore } from '@geins/core';
import { GeinsCRM } from '@geins/crm';
import type { GeinsSettings } from '@geins/types';
import { gatedFetch } from '../../../../test/gatedFetch';

// ChannelStore's NodeCache starts a check interval that keeps Jest from exiting.
jest.mock('@cacheable/node-cache', () => ({
  NodeCache: class {
    private data = new Map<string, unknown>();
    get = (key: string) => this.data.get(key);
    set = (key: string, value: unknown) => this.data.set(key, value);
    keys = () => [...this.data.keys()];
    flushAll = () => this.data.clear();
    close = () => undefined;
  },
}));

const settings: GeinsSettings = {
  apiKey: 'k',
  accountName: 'a',
  channel: '1',
  tld: 'se',
  locale: 'sv-SE',
  market: 'se',
};

afterEach(() => {
  jest.restoreAllMocks();
});

describe('crm.user.get in flight for two buyers at the same time', () => {
  it('makes a call per buyer, each answered with its own user', async () => {
    const gate = gatedFetch((auth) => ({ getUser: { email: auth } }));
    const crm = new GeinsCRM(new GeinsCore(settings), { clientConnectionMode: 'Direct' });

    const a = crm.user.get('A');
    const b = crm.user.get('B');
    await gate.settle();

    expect(gate.held.map((r) => r.auth)).toEqual(['Bearer A', 'Bearer B']);
    gate.open();
    expect((await a)?.email).toBe('Bearer A');
    expect((await b)?.email).toBe('Bearer B');
  });
});
