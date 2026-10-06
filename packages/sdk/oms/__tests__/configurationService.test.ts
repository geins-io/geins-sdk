import { ConfigurationError, FetchPolicyOptions, GeinsError, GeinsErrorCode } from '@geins/core';
import { ConfigurationService } from '../src/services/configurationService';

function createMockApiClient() {
  const mockClient = {
    runQuery: jest.fn(),
    runMutation: jest.fn(),
  };
  return { getter: () => mockClient as any, mock: mockClient };
}

const settings = {
  channel: 'test-channel',
  tld: 'se',
  locale: 'sv-SE',
  market: 'SE',
} as any;

const CHANNEL = { channelId: 'test-channel|se', languageId: 'sv-SE', marketId: 'SE' };

const document = {
  configurationId: 'c1',
  expiresAt: '2026-10-06T12:00:00Z',
  isValid: true,
  articleNumber: 'KONF-1',
  quantity: '1',
  unitPrice: null,
  discountPercent: null,
  weightPerUnit: null,
  templateId: null,
  templateVersion: null,
  messages: null,
  sections: null,
};

const cartLines = {
  id: 'cart',
  items: [{ id: 'a', quantity: 2, configurationId: 'k1', configuration: { summary: [] } }],
};

/** The options of the one call made, whichever of query or mutation it was. */
function sent(mock: ReturnType<typeof createMockApiClient>['mock']) {
  const [call] = [...mock.runQuery.mock.calls, ...mock.runMutation.mock.calls];
  return call[0];
}

describe('ConfigurationService', () => {
  let service: ConfigurationService;
  let mock: ReturnType<typeof createMockApiClient>['mock'];

  beforeEach(() => {
    const client = createMockApiClient();
    mock = client.mock;
    service = new ConfigurationService(client.getter, settings);
  });

  it('throws when channel is missing', () => {
    expect(() => new ConfigurationService(createMockApiClient().getter, { tld: 'se' } as any)).toThrow(
      GeinsError,
    );
  });

  // [method, call, kind, field the answer is read from, answer, variables sent]
  const calls: [
    string,
    (s: ConfigurationService) => Promise<unknown>,
    'query' | 'mutation',
    string,
    unknown,
    object,
  ][] = [
    [
      'create',
      (s) => s.create({ productId: 1359, quantity: 1 }),
      'mutation',
      'createConfiguration',
      document,
      { productId: 1359, quantity: 1 },
    ],
    ['get', (s) => s.get('c1'), 'query', 'getConfiguration', document, { configurationId: 'c1' }],
    [
      'applyChanges',
      (s) => s.applyChanges('c1', [{ type: 'QUANTITY', quantity: 2 }]),
      'mutation',
      'applyConfigurationChanges',
      document,
      { configurationId: 'c1', changes: [{ type: 'QUANTITY', quantity: 2 }] },
    ],
    [
      'renew',
      (s) => s.renew('c1'),
      'mutation',
      'renewConfiguration',
      { expiresAt: 'x' },
      { configurationId: 'c1' },
    ],
    [
      'commit',
      (s) => s.commit('c1'),
      'mutation',
      'commitConfiguration',
      { committedConfigurationId: 'k1', summary: null },
      { configurationId: 'c1' },
    ],
    ['delete', (s) => s.delete('c1'), 'mutation', 'deleteConfiguration', true, { configurationId: 'c1' }],
    [
      'reopenCartItem',
      (s) => s.reopenCartItem('cart', 'a'),
      'mutation',
      'reopenCartItemConfiguration',
      document,
      { cartId: 'cart', itemId: 'a' },
    ],
    [
      'addCartItem',
      (s) => s.addCartItem('cart', { skuId: 5, quantity: 2, configurationId: 'k1' }),
      'mutation',
      'addToCart',
      cartLines,
      { id: 'cart', item: { skuId: 5, quantity: 2, configurationId: 'k1' } },
    ],
    [
      'updateCartItem',
      (s) => s.updateCartItem('cart', { id: 'a', quantity: 2, configurationId: 'k2' }),
      'mutation',
      'updateCartItem',
      cartLines,
      { id: 'cart', item: { id: 'a', quantity: 2, configurationId: 'k2' } },
    ],
    ['getCartLines', (s) => s.getCartLines('cart'), 'query', 'getCart', cartLines, { id: 'cart' }],
    [
      'getOrderLines',
      (s) => s.getOrderLines('p1'),
      'query',
      'getOrderPublic',
      { cart: { items: [] } },
      { publicOrderId: 'p1' },
    ],
    [
      'getOrderLineChoices',
      (s) => s.getOrderLineChoices('p1'),
      'query',
      'getOrderPublic',
      { cart: { items: [] } },
      { publicOrderId: 'p1' },
    ],
  ];

  describe.each(calls)('%s', (_name, call, kind, field, answer, variables) => {
    const run = () => (kind === 'query' ? mock.runQuery : mock.runMutation);

    beforeEach(() => {
      run().mockResolvedValue({ data: { [field]: answer } });
    });

    it(`runs one ${kind} with the channel variables`, async () => {
      await call(service);

      expect(run()).toHaveBeenCalledTimes(1);
      expect(kind === 'query' ? mock.runMutation : mock.runQuery).not.toHaveBeenCalled();
      expect(sent(mock).variables).toEqual({ ...variables, ...CHANNEL });
    });

    it('runs without the cache', async () => {
      await call(service);

      expect(sent(mock).requestOptions.fetchPolicy).toBe(FetchPolicyOptions.NO_CACHE);
    });

    it(kind === 'mutation' ? 'is never retried' : 'may be retried', async () => {
      await call(service);

      expect(sent(mock).requestOptions.context?.retry).toBe(kind === 'mutation' ? false : undefined);
    });

    it('answers null when the field is null', async () => {
      run().mockResolvedValue({ data: { [field]: null } });

      expect(await call(service)).toBeNull();
    });

    it('wraps a failure as a ConfigurationError with the provider code', async () => {
      run().mockRejectedValue({
        graphQLErrors: [{ message: 'gone', extensions: { code: 'ConfigurationGone' } }],
      });

      const error = await call(service).catch((e: unknown) => e);

      expect(error).toBeInstanceOf(ConfigurationError);
      expect((error as ConfigurationError).providerCode).toBe('ConfigurationGone');
    });
  });

  it("passes a settings error on as it is, not as the provider's failure", async () => {
    const client = createMockApiClient();
    const noMarket = new ConfigurationService(client.getter, {
      channel: 'test-channel',
      tld: 'se',
      locale: 'sv-SE',
    } as any);

    const error = await noMarket.get('c1').catch((e: unknown) => e);

    expect(error).toMatchObject({ name: 'GeinsError', code: GeinsErrorCode.INVALID_ARGUMENT });
    expect(client.mock.runQuery).not.toHaveBeenCalled();
  });

  it('answers null for a renewal without an expiry', async () => {
    mock.runMutation.mockResolvedValue({ data: { renewConfiguration: { expiresAt: null } } });

    expect(await service.renew('c1')).toBeNull();
  });

  it('parses the document it answers', async () => {
    mock.runMutation.mockResolvedValue({ data: { createConfiguration: document } });

    const result = await service.create({ productId: 1359, quantity: 1 });

    expect(result).toMatchObject({ configurationId: 'c1', quantity: 1, sections: [], messages: [] });
  });

  it('starts from an article number as well', async () => {
    mock.runMutation.mockResolvedValue({ data: { createConfiguration: document } });

    await service.create({ articleNumber: 'KONF-1', quantity: 2 });

    expect(sent(mock).variables).toEqual({ articleNumber: 'KONF-1', quantity: 2, ...CHANNEL });
  });

  it('answers whether a delete released the session', async () => {
    mock.runMutation.mockResolvedValue({ data: { deleteConfiguration: false } });

    expect(await service.delete('c1')).toBe(false);
  });

  it('answers the renewal expiry', async () => {
    mock.runMutation.mockResolvedValue({
      data: { renewConfiguration: { expiresAt: '2026-10-06T13:00:00Z' } },
    });

    expect(await service.renew('c1')).toEqual({ expiresAt: '2026-10-06T13:00:00Z' });
  });

  it('takes language, market and channel from the request context, and the token as a header', async () => {
    mock.runQuery.mockResolvedValue({ data: { getConfiguration: document } });

    await service.get('c1', { languageId: 'de-DE', marketId: 'de', userToken: 'tok' });

    expect(sent(mock).variables).toEqual({
      configurationId: 'c1',
      languageId: 'de-DE',
      marketId: 'de',
      channelId: 'test-channel|se',
    });
    expect(sent(mock).userToken).toBe('tok');
  });

  it("passes the call's deadline on", async () => {
    mock.runMutation.mockResolvedValue({ data: { reopenCartItemConfiguration: document } });

    await service.reopenCartItem('cart', 'a', undefined, { timeoutMs: 45_000 });

    expect(sent(mock).requestOptions.context).toEqual({ retry: false, timeoutMs: 45_000 });
  });

  it('sends no deadline unless asked', async () => {
    mock.runQuery.mockResolvedValue({ data: { getCart: cartLines } });

    await service.getCartLines('cart');

    expect(sent(mock).requestOptions.context).toBeUndefined();
  });
});
