import { RequestContext } from '@geins/types';
import { BaseApiService, ApiClientGetter } from '../src/base/baseApiService';
import { GeinsSettings } from '@geins/types';
import { GeinsError } from '../src/errors/geinsError';

// Concrete subclass for testing the abstract BaseApiService
class TestService extends BaseApiService {
  public callCreateVariables(vars: Record<string, unknown>): Record<string, unknown> {
    return this.createVariables(vars);
  }
}

const baseSettings: GeinsSettings = {
  apiKey: 'test-api-key',
  accountName: 'test-account',
  channel: 'test-channel',
  tld: 'com',
  locale: 'en-US',
  market: 'us',
  environment: 'prod',
};

const mockApiClient: ApiClientGetter = () => ({} as any);

describe('BaseApiService.createVariables', () => {
  it('uses settings locale and market when not in vars', () => {
    const svc = new TestService(mockApiClient, baseSettings);
    const result = svc.callCreateVariables({});
    expect(result.languageId).toBe('en-US');
    expect(result.marketId).toBe('us');
    expect(result.channelId).toBe('test-channel|com');
  });

  it('uses caller-provided languageId over settings locale', () => {
    const svc = new TestService(mockApiClient, baseSettings);
    const result = svc.callCreateVariables({ languageId: 'fr-FR' });
    expect(result.languageId).toBe('fr-FR');
    expect(result.marketId).toBe('us');
  });

  it('uses caller-provided marketId over settings market', () => {
    const svc = new TestService(mockApiClient, baseSettings);
    const result = svc.callCreateVariables({ marketId: 'eu' });
    expect(result.marketId).toBe('eu');
    expect(result.languageId).toBe('en-US');
  });

  it('uses caller-provided channelId over derived channelId', () => {
    const svc = new TestService(mockApiClient, baseSettings);
    const result = svc.callCreateVariables({ channelId: 'override-channel' });
    expect(result.channelId).toBe('override-channel');
  });

  it('throws when locale is missing from settings and not in vars', () => {
    const settings: GeinsSettings = { ...baseSettings, locale: undefined as any };
    const svc = new TestService(mockApiClient, settings);
    expect(() => svc.callCreateVariables({})).toThrow('Language is required');
  });

  it('throws when market is missing from settings and not in vars', () => {
    const settings: GeinsSettings = { ...baseSettings, market: undefined as any };
    const svc = new TestService(mockApiClient, settings);
    expect(() => svc.callCreateVariables({})).toThrow('Market is required');
  });

  it('merges additional vars alongside defaults', () => {
    const svc = new TestService(mockApiClient, baseSettings);
    const result = svc.callCreateVariables({ foo: 'bar', count: 10 });
    expect(result.foo).toBe('bar');
    expect(result.count).toBe(10);
    expect(result.languageId).toBe('en-US');
  });
});

describe('RequestContext type export from @geins/types', () => {
  it('accepts an empty object as RequestContext', () => {
    const ctx: RequestContext = {};
    expect(ctx).toBeDefined();
  });

  it('accepts all optional fields', () => {
    const ctx: RequestContext = {
      languageId: 'sv-SE',
      marketId: 'se',
      channelId: 'se-channel|com',
    };
    expect(ctx.languageId).toBe('sv-SE');
    expect(ctx.marketId).toBe('se');
    expect(ctx.channelId).toBe('se-channel|com');
  });

  it('accepts partial fields', () => {
    const ctx: RequestContext = { languageId: 'de-DE' };
    expect(ctx.languageId).toBe('de-DE');
    expect(ctx.marketId).toBeUndefined();
    expect(ctx.channelId).toBeUndefined();
  });
});
