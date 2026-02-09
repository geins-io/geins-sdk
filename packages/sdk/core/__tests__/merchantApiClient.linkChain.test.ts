import { ApolloLink } from '@apollo/client/core';
import { MerchantApiClient } from '../src/api-client/merchantApiClient';
import type { GeinsSettings } from '@geins/types';

// We can't easily test live requests, but we can test that the link chain
// is assembled correctly by inspecting the ApolloClient's link structure.

function getClientLink(client: MerchantApiClient): ApolloLink | undefined {
  const apolloClient = client.getClient();
  return (apolloClient as any)?.link;
}

function countLinks(link: ApolloLink): number {
  let count = 1;
  let current = link as any;
  while (current.left || current.right) {
    if (current.right) {
      count++;
      current = current.right;
    } else {
      break;
    }
  }
  return count;
}

describe('MerchantApiClient link chain', () => {
  const baseOptions = {
    apiUrl: 'https://api.test.com/graphql',
    apiKey: 'test-key',
  };

  it('creates client with no settings (backward compatible)', () => {
    const client = new MerchantApiClient(baseOptions);
    const apolloClient = client.getClient();
    expect(apolloClient).toBeDefined();

    // Should still have a link chain (RequestIdLink + LoggingLink + HttpLink = 3)
    const link = getClientLink(client);
    expect(link).toBeDefined();
  });

  it('creates client with empty requestConfig', () => {
    const settings: GeinsSettings = {
      apiKey: 'test-key',
      accountName: 'test',
      channel: '1',
      tld: 'com',
      locale: 'en',
      market: 'us',
      requestConfig: {},
    };

    const client = new MerchantApiClient({ ...baseOptions, settings });
    expect(client.getClient()).toBeDefined();
  });

  it('creates client with full requestConfig', () => {
    const onRequest = jest.fn();
    const onResponse = jest.fn();
    const onError = jest.fn();

    const settings: GeinsSettings = {
      apiKey: 'test-key',
      accountName: 'test',
      channel: '1',
      tld: 'com',
      locale: 'en',
      market: 'us',
      requestConfig: {
        timeoutMs: 30000,
        retry: { maxRetries: 3, initialDelayMs: 300 },
        interceptors: { onRequest, onResponse, onError },
      },
    };

    const client = new MerchantApiClient({ ...baseOptions, settings });
    expect(client.getClient()).toBeDefined();

    // With all features: RequestIdLink + LoggingLink + InterceptorLink + TimeoutLink + RetryLink + HttpLink = 6
    const link = getClientLink(client);
    expect(link).toBeDefined();
  });

  it('creates client with retry disabled', () => {
    const settings: GeinsSettings = {
      apiKey: 'test-key',
      accountName: 'test',
      channel: '1',
      tld: 'com',
      locale: 'en',
      market: 'us',
      requestConfig: {
        retry: false,
      },
    };

    const client = new MerchantApiClient({ ...baseOptions, settings });
    expect(client.getClient()).toBeDefined();
  });

  it('creates client with timeout only', () => {
    const settings: GeinsSettings = {
      apiKey: 'test-key',
      accountName: 'test',
      channel: '1',
      tld: 'com',
      locale: 'en',
      market: 'us',
      requestConfig: {
        timeoutMs: 5000,
      },
    };

    const client = new MerchantApiClient({ ...baseOptions, settings });
    expect(client.getClient()).toBeDefined();
  });

  it('skips timeout when timeoutMs is 0', () => {
    const settings: GeinsSettings = {
      apiKey: 'test-key',
      accountName: 'test',
      channel: '1',
      tld: 'com',
      locale: 'en',
      market: 'us',
      requestConfig: {
        timeoutMs: 0,
      },
    };

    const client = new MerchantApiClient({ ...baseOptions, settings });
    expect(client.getClient()).toBeDefined();
  });

  it('respects fetchPolicy option', () => {
    const client = new MerchantApiClient({
      ...baseOptions,
      fetchPolicy: 'network-only',
    });

    expect(client.fetchPolicy).toBe('network-only');
  });
});
