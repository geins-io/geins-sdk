import type { GraphQLQueryOptions } from '@geins/core';
import {
  ConfigurationError,
  FetchPolicyOptions,
  isConfigurationError,
  MerchantApiClient,
  toConfigurationError,
} from '@geins/core';
import type { GeinsSettings } from '@geins/types';
import { queries } from '../src/graphql';
import { ConfigurationService } from '../src/services/configurationService';

// Answers as the merchant API sent them (HTTP 200), measured 2026-10-12. Ids and article
// numbers are placeholders.
const gone = {
  errors: [
    {
      message: "Configuration expired.: Configuration 'c1' has expired. Start a new configuration.",
      extensions: { code: 'ConfigurationGone', codes: ['ConfigurationGone'] },
    },
  ],
  data: { getConfiguration: null },
};

const loginRequired = {
  errors: [
    {
      message: 'You need to be logged in to retrieve this cart',
      locations: [{ line: 1, column: 85 }],
      path: ['getCart'],
      extensions: { code: 'LoginRequired', codes: ['LoginRequired'] },
    },
  ],
  data: { getCart: null },
};

const missingCustomerNumber = {
  errors: [
    {
      message: 'The signed in user has no customer number in the ERP.',
      extensions: { code: 'MissingCustomerNumber', codes: ['MissingCustomerNumber'] },
    },
  ],
  data: { createConfiguration: null },
};

const refusedChange = {
  errors: [
    {
      message: "Apply configuration changes failed.: Variable id 'no-such-variable' is not a Monitor id.",
      extensions: { code: 'ConfigurationFailed', codes: ['ConfigurationFailed'] },
    },
  ],
  data: { applyConfigurationChanges: null },
};

const unchangedCart = {
  id: 'cart',
  items: [{ id: 'line', skuId: 5001, quantity: 1, configurationId: 'k1', configuration: null }],
};

const mismatch = {
  errors: [
    {
      message: 'Configuration k2 is of article A-2, and this cart item is article A-1',
      extensions: { code: 'ConfigurationMismatch', codes: ['ConfigurationMismatch', 'CPQ_CONFIGURATION'] },
    },
  ],
  data: { updateCartItem: unchangedCart },
};

const currencyMismatch = {
  errors: [
    {
      message:
        'The configuration is priced in EUR and this market sells in SEK. Open a new configuration in this market.',
      extensions: { code: 'ConfigurationCurrencyMismatch', codes: ['ConfigurationCurrencyMismatch'] },
    },
  ],
  data: {
    commitConfiguration: {
      committedConfigurationId: 'k3',
      configurationId: 'c1',
      quantity: 1,
      unitPrice: null,
    },
  },
};

const settings: GeinsSettings = {
  apiKey: 'k',
  accountName: 'a',
  channel: '1',
  tld: 'se',
  locale: 'sv-SE',
  market: 'se',
};

function answer(body: unknown) {
  jest
    .spyOn(globalThis, 'fetch')
    .mockImplementation(
      async () =>
        new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } }),
    );
}

type Query = GraphQLQueryOptions['query'];

const newClient = () => new MerchantApiClient({ apiUrl: 'https://api.test/graphql', apiKey: 'k' });

/** The four fields a caller branches on. */
const seen = (error: ConfigurationError) => ({
  providerErrors: error.providerErrors,
  providerCodes: error.providerCodes,
  providerCode: error.providerCode,
  status: error.status,
});

/** What the SDK threw for the same answer before it asked for the data: Apollo's default error policy. */
async function before(kind: 'query' | 'mutation', query: Query): Promise<ConfigurationError> {
  const client = newClient();
  const options = { query, requestOptions: { fetchPolicy: FetchPolicyOptions.NO_CACHE } };
  try {
    await (kind === 'query' ? client.runQuery(options) : client.runMutation(options));
  } catch (error) {
    return toConfigurationError(error);
  }
  throw new Error('the call did not fail');
}

afterEach(() => {
  jest.restoreAllMocks();
});

// [case, answer, call, kind, document, code, message, data]
const cases: [
  string,
  unknown,
  (s: ConfigurationService) => Promise<unknown>,
  'query' | 'mutation',
  Query,
  string,
  string,
  unknown,
][] = [
  [
    'get after a commit',
    gone,
    (s) => s.get('c1'),
    'query',
    queries.configurationGet,
    'ConfigurationGone',
    gone.errors[0].message,
    undefined,
  ],
  [
    'a signed-out read of a cart with a configured line',
    loginRequired,
    (s) => s.getCartLines('cart'),
    'query',
    queries.configurationGetCartLines,
    'LoginRequired',
    loginRequired.errors[0].message,
    undefined,
  ],
  [
    'a create with no customer number',
    missingCustomerNumber,
    (s) => s.create({ productId: 1, quantity: 1 }),
    'mutation',
    queries.configurationCreate,
    'MissingCustomerNumber',
    missingCustomerNumber.errors[0].message,
    undefined,
  ],
  [
    'a refused change',
    refusedChange,
    (s) => s.applyChanges('c1', [{ type: 'VARIABLE', variableId: 'no-such-variable', value: 1 }]),
    'mutation',
    queries.configurationApplyChanges,
    'ConfigurationFailed',
    refusedChange.errors[0].message,
    undefined,
  ],
  [
    'a refused cart line update',
    mismatch,
    (s) => s.updateCartItem('cart', { id: 'line', quantity: 1, configurationId: 'k2' }),
    'mutation',
    queries.configurationUpdateCartItem,
    'ConfigurationMismatch',
    mismatch.errors[0].message,
    { id: 'cart', items: [{ id: 'line', quantity: 1, configurationId: 'k1', configuration: null }] },
  ],
  [
    'a commit in a market of another currency',
    currencyMismatch,
    (s) => s.commit('c1'),
    'mutation',
    queries.configurationCommit,
    'ConfigurationCurrencyMismatch',
    currencyMismatch.errors[0].message,
    {
      committedConfigurationId: 'k3',
      configurationId: 'c1',
      articleNumber: null,
      quantity: 1,
      unitPrice: null,
      discountPercent: null,
      weightPerUnit: null,
      summary: [],
    },
  ],
];

describe('ConfigurationService on an answer that carries errors', () => {
  describe.each(cases)('%s', (_name, body, call, kind, query, code, message, data) => {
    let client: MerchantApiClient;
    let service: ConfigurationService;

    beforeEach(() => {
      client = newClient();
      service = new ConfigurationService(() => client, settings);
      answer(body);
    });

    it('throws a ConfigurationError with the provider code', async () => {
      const error = await call(service).catch((e: unknown) => e);

      expect(isConfigurationError(error)).toBe(true);
      expect(seen(error as ConfigurationError)).toEqual({
        providerErrors: [{ code, message }],
        providerCodes: [code],
        providerCode: code,
        status: undefined,
      });
    });

    it('gives the same codes and status as before it read the data', async () => {
      const error = (await call(service).catch((e: unknown) => e)) as ConfigurationError;

      expect(seen(error)).toEqual(seen(await before(kind, query)));
    });

    it(data === undefined ? 'carries no data' : 'carries the answer it was sent', async () => {
      const error = (await call(service).catch((e: unknown) => e)) as ConfigurationError;

      expect(error.data).toEqual(data);
    });

    it('keeps nothing in the cache', async () => {
      await call(service).catch(() => undefined);

      expect(client.getClient()!.cache.extract()).toEqual({});
    });
  });
});

describe('ConfigurationService on a non-2xx answer that carries data', () => {
  const body = {
    data: { getCart: null, updateCartItem: null },
    errors: [{ message: 'refused', extensions: { code: 'ConfigurationMismatch' } }],
  };

  beforeEach(() => {
    jest.spyOn(globalThis, 'fetch').mockImplementation(
      async () =>
        new Response(JSON.stringify(body), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
    );
  });

  it.each([
    ['a query', (s: ConfigurationService) => s.getCartLines('cart')],
    [
      'a mutation',
      (s: ConfigurationService) =>
        s.updateCartItem('cart', { id: 'line', quantity: 1, configurationId: 'k2' }),
    ],
  ])('reports the status for %s', async (_name, call) => {
    const client = newClient();
    const error = (await call(new ConfigurationService(() => client, settings)).catch(
      (e: unknown) => e,
    )) as ConfigurationError;

    expect(error.status).toBe(400);
    expect(error.providerCode).toBe('ConfigurationMismatch');
  });
});
