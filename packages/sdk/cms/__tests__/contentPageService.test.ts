import { ContentPageService } from '../src/services/contentPageService';
import { GeinsError } from '@geins/core';
import type { ContentPageType } from '@geins/core';

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

describe('ContentPageService', () => {
  let service: ContentPageService;
  let mockClient: ReturnType<typeof createMockApiClient>['mock'];

  beforeEach(() => {
    const client = createMockApiClient();
    mockClient = client.mock;
    service = new ContentPageService(client.getter, settings);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('get', () => {
    it('throws when alias is missing', async () => {
      await expect(service.get({} as any)).rejects.toThrow(GeinsError);
    });

    it('returns parsed content page', async () => {
      mockClient.runQuery.mockResolvedValue({
        data: {
          widgetArea: {
            id: 42,
            name: 'About Us',
            title: 'About Our Company',
            pageArea: { id: 1, name: 'Main', index: 0 },
            familyName: 'info',
            meta: { title: 'About', description: 'About page' },
            tags: ['info'],
            containers: [],
          },
        },
      });

      const result = (await service.get({ alias: 'about-us' })) as ContentPageType;
      expect(result.id).toBe('42');
      expect(result.name).toBe('About Us');
      expect(result.title).toBe('About Our Company');
      expect(result.familyName).toBe('info');
    });

    it('returns default page when widgetArea is null', async () => {
      mockClient.runQuery.mockResolvedValue({
        data: { widgetArea: null },
      });

      const result = (await service.get({ alias: 'missing' })) as ContentPageType;
      expect(result.id).toBe('');
      expect(result.name).toBe('');
      expect(result.containers).toEqual([]);
    });

    it('passes alias in variables', async () => {
      mockClient.runQuery.mockResolvedValue({ data: { widgetArea: null } });

      await service.get({ alias: 'my-page' });

      const callArgs = mockClient.runQuery.mock.calls[0][0];
      expect(callArgs.variables).toMatchObject({ alias: 'my-page' });
    });
  });
});
