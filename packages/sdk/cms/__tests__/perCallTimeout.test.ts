import { ContentAreaService } from '../src/services/contentAreaService';
import { ContentPageService } from '../src/services/contentPageService';
import { MenuService } from '../src/services/menuService';

function createMockApiClient() {
  const mockClient = {
    runQuery: jest.fn().mockResolvedValue({ data: {} }),
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

const calls = [
  {
    name: 'menu.get',
    run: (getter: any, options?: { timeoutMs?: number }) =>
      new MenuService(getter, settings).get({ menuLocationId: 'main' } as any, undefined, options),
  },
  {
    name: 'area.get',
    run: (getter: any, options?: { timeoutMs?: number }) =>
      new ContentAreaService(getter, settings).get(
        { areaName: 'Top', family: 'Frontpage' } as any,
        undefined,
        options,
      ),
  },
  {
    name: 'page.get',
    run: (getter: any, options?: { timeoutMs?: number }) =>
      new ContentPageService(getter, settings).get({ alias: 'about' } as any, undefined, options),
  },
];

describe.each(calls)('$name per-call timeout', ({ run }) => {
  it('passes a given timeoutMs to the request context', async () => {
    const { getter, mock } = createMockApiClient();

    await run(getter, { timeoutMs: 3_000 }).catch(() => undefined);

    expect(mock.runQuery.mock.calls[0][0].requestOptions).toEqual({ context: { timeoutMs: 3_000 } });
  });

  it('sends no request options without one, so the client keeps its own limit', async () => {
    const { getter, mock } = createMockApiClient();

    await run(getter).catch(() => undefined);

    expect(mock.runQuery.mock.calls[0][0].requestOptions).toBeUndefined();
  });
});
