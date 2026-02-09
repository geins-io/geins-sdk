import { ContentAreaService } from '../src/services/contentAreaService';
import { GeinsError } from '@geins/core';
import type { ContentAreaType } from '@geins/core';

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

describe('ContentAreaService', () => {
  let service: ContentAreaService;
  let mockClient: ReturnType<typeof createMockApiClient>['mock'];

  beforeEach(() => {
    const client = createMockApiClient();
    mockClient = client.mock;
    service = new ContentAreaService(client.getter, settings);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('get', () => {
    it('throws when areaName is missing', async () => {
      await expect(service.get({ family: 'landing' } as any)).rejects.toThrow(GeinsError);
    });

    it('throws when family is missing', async () => {
      await expect(service.get({ areaName: 'hero' } as any)).rejects.toThrow(GeinsError);
    });

    it('returns parsed content area', async () => {
      mockClient.runQuery.mockResolvedValue({
        data: {
          widgetArea: {
            meta: { title: 'Hero', description: 'Hero area' },
            tags: ['featured'],
            containers: [
              {
                id: 1,
                name: 'MainContainer',
                sortOrder: 0,
                widgets: [
                  {
                    name: 'TextWidget',
                    type: 'TextPageWidget',
                    size: 'full',
                    sortOrder: 0,
                    configuration: '{"text":"Hello"}',
                  },
                ],
              },
            ],
          },
        },
      });

      const result = (await service.get({ areaName: 'hero', family: 'landing' })) as ContentAreaType;
      expect(result.meta).toEqual({ title: 'Hero', description: 'Hero area' });
      expect(result.tags).toEqual(['featured']);
      expect(result.containers).toHaveLength(1);
      expect(result.containers[0].name).toBe('MainContainer');
      expect(result.containers[0].content).toHaveLength(1);
    });

    it('returns empty area when widgetArea is null', async () => {
      mockClient.runQuery.mockResolvedValue({
        data: { widgetArea: null },
      });

      const result = (await service.get({ areaName: 'empty', family: 'landing' })) as ContentAreaType;
      expect(result.meta).toEqual({});
      expect(result.tags).toEqual([]);
      expect(result.containers).toEqual([]);
    });

    it('passes correct variables to query', async () => {
      mockClient.runQuery.mockResolvedValue({ data: { widgetArea: null } });

      await service.get({ areaName: 'sidebar', family: 'product' });

      expect(mockClient.runQuery).toHaveBeenCalledTimes(1);
      const callArgs = mockClient.runQuery.mock.calls[0][0];
      expect(callArgs.variables).toMatchObject({
        areaName: 'sidebar',
        family: 'product',
        languageId: 'sv-SE',
        marketId: 'SE',
        channelId: 'test-channel|se',
      });
    });
  });

  describe('getRaw', () => {
    it('returns raw response without parsing', async () => {
      const rawResponse = { data: { widgetArea: { id: 1, raw: true } } };
      mockClient.runQuery.mockResolvedValue(rawResponse);

      const result = await service.getRaw({ areaName: 'hero', family: 'landing' });
      expect(result).toEqual(rawResponse);
    });
  });
});
