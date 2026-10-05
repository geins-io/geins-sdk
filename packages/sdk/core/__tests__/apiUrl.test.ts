import { buildEndpoints, GeinsCore } from '@geins/core';
import type { GeinsSettings } from '@geins/types';

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

const API_URL = 'https://merchantapi.geins.io/graphql';
const CUSTOM_API_URL = 'https://merchant-api.example.test/graphql';

const settings: GeinsSettings = {
  apiKey: 'test-api-key',
  accountName: 'monitor',
  channel: '1',
  tld: 'se',
  locale: 'sv-SE',
  market: 'se',
  environment: 'prod',
};

const graphqlResponse = (data: unknown) =>
  new Response(JSON.stringify({ data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

const requestedUrls = (fetchSpy: jest.SpyInstance) =>
  fetchSpy.mock.calls.map(([input]) => String(input instanceof Request ? input.url : input));

describe('buildEndpoints apiUrl', () => {
  it('should use the default GraphQL endpoint when apiUrl is omitted', () => {
    expect(buildEndpoints('key', 'monitor', 'prod').main).toBe(API_URL);
  });

  it('should use the default GraphQL endpoint when apiUrl is empty', () => {
    expect(buildEndpoints('key', 'monitor', 'prod', '').main).toBe(API_URL);
  });

  it('should use apiUrl as the GraphQL endpoint when given', () => {
    expect(buildEndpoints('key', 'monitor', 'prod', CUSTOM_API_URL).main).toBe(CUSTOM_API_URL);
  });

  it('should leave auth, authSign and image unchanged when apiUrl is given', () => {
    const defaults = buildEndpoints('key', 'monitor', 'prod');
    const custom = buildEndpoints('key', 'monitor', 'prod', CUSTOM_API_URL);
    expect(custom.auth).toBe(defaults.auth);
    expect(custom.authSign).toBe(defaults.authSign);
    expect(custom.image).toBe(defaults.image);
  });
});

describe('GeinsCore apiUrl', () => {
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchSpy = jest.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('should expose the default GraphQL endpoint when apiUrl is not set', () => {
    expect(new GeinsCore(settings).endpoints.main).toBe(API_URL);
  });

  it('should expose apiUrl as the GraphQL endpoint when set', () => {
    expect(new GeinsCore({ ...settings, apiUrl: CUSTOM_API_URL }).endpoints.main).toBe(CUSTOM_API_URL);
  });

  it('should send GraphQL queries to apiUrl', async () => {
    fetchSpy.mockResolvedValue(graphqlResponse({ ping: true }));
    const core = new GeinsCore({ ...settings, apiUrl: CUSTOM_API_URL });

    await core.graphql.query({ queryAsString: 'query Ping { ping }' });

    expect(requestedUrls(fetchSpy)).toEqual([CUSTOM_API_URL]);
  });

  it('should send GraphQL queries to the default endpoint when apiUrl is not set', async () => {
    fetchSpy.mockResolvedValue(graphqlResponse({ ping: true }));
    const core = new GeinsCore(settings);

    await core.graphql.query({ queryAsString: 'query Ping { ping }' });

    expect(requestedUrls(fetchSpy)).toEqual([API_URL]);
  });

  it('should send channel queries to apiUrl', async () => {
    fetchSpy.mockResolvedValue(graphqlResponse({ channel: null }));
    const core = new GeinsCore({ ...settings, apiUrl: CUSTOM_API_URL });

    await core.channel.current().catch(() => undefined);

    expect(requestedUrls(fetchSpy).length).toBeGreaterThan(0);
    expect(new Set(requestedUrls(fetchSpy))).toEqual(new Set([CUSTOM_API_URL]));
  });
});
