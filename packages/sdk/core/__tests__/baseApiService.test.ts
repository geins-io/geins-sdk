import { RequestContext } from '@geins/types';
import { BaseApiService, ApiClientGetter } from '../src/base/baseApiService';
import { GraphQLQueryOptions } from '../src/api-client/merchantApiClient';
import { GeinsSettings } from '@geins/types';
import { GeinsError } from '../src/errors/geinsError';
import { gql } from '@apollo/client/core';

// Concrete subclass for testing the abstract BaseApiService
class TestService extends BaseApiService {
  public callCreateVariables(vars: Record<string, unknown>): Record<string, unknown> {
    return this.createVariables(vars);
  }

  public callCreateQueryOptions(
    query: any,
    vars: Record<string, unknown>,
    requestContext?: RequestContext,
  ): GraphQLQueryOptions {
    return this.createQueryOptions(query, vars, requestContext);
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

describe('BaseApiService.createVariables — userToken stripping', () => {
  it('strips userToken from variables so it never becomes a GraphQL variable', () => {
    const svc = new TestService(mockApiClient, baseSettings);
    const result = svc.callCreateVariables({ alias: '/about', userToken: 'jwt-123' });
    expect(result.alias).toBe('/about');
    expect(result.userToken).toBeUndefined();
    expect(result.languageId).toBe('en-US');
  });

  it('works normally when no userToken is present', () => {
    const svc = new TestService(mockApiClient, baseSettings);
    const result = svc.callCreateVariables({ alias: '/about' });
    expect(result.alias).toBe('/about');
    expect(result.userToken).toBeUndefined();
  });
});

describe('BaseApiService.createQueryOptions', () => {
  const dummyQuery = gql`query Test { test }`;

  it('extracts userToken from requestContext into GraphQLQueryOptions', () => {
    const svc = new TestService(mockApiClient, baseSettings);
    const ctx: RequestContext = { userToken: 'preview-jwt-456' };
    const options = svc.callCreateQueryOptions(dummyQuery, { alias: '/home' }, ctx);

    expect(options.userToken).toBe('preview-jwt-456');
    expect(options.variables?.alias).toBe('/home');
    expect(options.variables?.userToken).toBeUndefined();
    expect(options.variables?.languageId).toBe('en-US');
  });

  it('merges locale/market/channel from requestContext into variables', () => {
    const svc = new TestService(mockApiClient, baseSettings);
    const ctx: RequestContext = { languageId: 'sv-SE', marketId: 'se' };
    const options = svc.callCreateQueryOptions(dummyQuery, { alias: '/page' }, ctx);

    expect(options.variables?.languageId).toBe('sv-SE');
    expect(options.variables?.marketId).toBe('se');
    expect(options.userToken).toBeUndefined();
  });

  it('passes both userToken and locale/market when all are provided', () => {
    const svc = new TestService(mockApiClient, baseSettings);
    const ctx: RequestContext = {
      languageId: 'sv-SE',
      marketId: 'se',
      userToken: 'my-jwt',
    };
    const options = svc.callCreateQueryOptions(dummyQuery, { alias: '/page' }, ctx);

    expect(options.userToken).toBe('my-jwt');
    expect(options.variables?.languageId).toBe('sv-SE');
    expect(options.variables?.marketId).toBe('se');
    expect(options.variables?.userToken).toBeUndefined();
  });

  it('works without requestContext (backward compat)', () => {
    const svc = new TestService(mockApiClient, baseSettings);
    const options = svc.callCreateQueryOptions(dummyQuery, { alias: '/page' });

    expect(options.userToken).toBeUndefined();
    expect(options.variables?.alias).toBe('/page');
    expect(options.variables?.languageId).toBe('en-US');
  });

  it('works with empty requestContext', () => {
    const svc = new TestService(mockApiClient, baseSettings);
    const options = svc.callCreateQueryOptions(dummyQuery, { alias: '/page' }, {});

    expect(options.userToken).toBeUndefined();
    expect(options.variables?.alias).toBe('/page');
  });

  it('sets query on the returned options', () => {
    const svc = new TestService(mockApiClient, baseSettings);
    const options = svc.callCreateQueryOptions(dummyQuery, {});
    expect(options.query).toBe(dummyQuery);
  });
});

describe('RequestContext type export from @geins/types', () => {
  it('accepts an empty object as RequestContext', () => {
    const ctx: RequestContext = {};
    expect(ctx).toBeDefined();
  });

  it('accepts all optional fields including userToken', () => {
    const ctx: RequestContext = {
      languageId: 'sv-SE',
      marketId: 'se',
      channelId: 'se-channel|com',
      userToken: 'jwt-token',
    };
    expect(ctx.languageId).toBe('sv-SE');
    expect(ctx.marketId).toBe('se');
    expect(ctx.channelId).toBe('se-channel|com');
    expect(ctx.userToken).toBe('jwt-token');
  });

  it('accepts partial fields', () => {
    const ctx: RequestContext = { languageId: 'de-DE' };
    expect(ctx.languageId).toBe('de-DE');
    expect(ctx.marketId).toBeUndefined();
    expect(ctx.channelId).toBeUndefined();
    expect(ctx.userToken).toBeUndefined();
  });
});
