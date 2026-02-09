import { MenuService } from '../src/services/menuService';
import { GeinsError } from '@geins/core';
import type { MenuType } from '@geins/types';

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

describe('MenuService', () => {
  let service: MenuService;
  let mockClient: ReturnType<typeof createMockApiClient>['mock'];

  beforeEach(() => {
    const client = createMockApiClient();
    mockClient = client.mock;
    service = new MenuService(client.getter, settings);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('get', () => {
    it('throws when menuLocationId is missing', async () => {
      await expect(service.get({} as any)).rejects.toThrow(GeinsError);
    });

    it('returns parsed menu with items', async () => {
      mockClient.runQuery.mockResolvedValue({
        data: {
          getMenuAtLocation: {
            id: 1,
            title: 'Main Menu',
            menuItems: [
              {
                id: 10,
                label: 'Home',
                title: 'Home Page',
                canonicalUrl: '/',
                type: 'page',
                order: 0,
                open: true,
                hidden: false,
                targetBlank: false,
                children: [],
              },
              {
                id: 20,
                label: 'Products',
                title: 'All Products',
                canonicalUrl: '/products',
                type: 'category',
                order: 1,
                open: false,
                hidden: false,
                targetBlank: false,
                children: [
                  {
                    id: 21,
                    label: 'Shoes',
                    title: 'Shoes',
                    canonicalUrl: '/products/shoes',
                    type: 'category',
                    order: 0,
                    children: [],
                  },
                ],
              },
            ],
          },
        },
      });

      const result = (await service.get({ menuLocationId: 'main' })) as MenuType;
      expect(result.id).toBe(1);
      expect(result.title).toBe('Main Menu');
      expect(result.menuItems).toHaveLength(2);
      expect(result.menuItems[0].label).toBe('Home');
      expect(result.menuItems[1].children).toHaveLength(1);
      expect(result.menuItems[1].children?.[0]?.label).toBe('Shoes');
    });

    it('throws PARSE_ERROR when response structure is invalid', async () => {
      mockClient.runQuery.mockResolvedValue({
        data: { getMenuAtLocation: null },
      });

      await expect(service.get({ menuLocationId: 'main' })).rejects.toThrow(GeinsError);
    });

    it('handles menu with null items in array', async () => {
      mockClient.runQuery.mockResolvedValue({
        data: {
          getMenuAtLocation: {
            id: 1,
            title: 'Sparse Menu',
            menuItems: [
              null,
              {
                id: 10,
                label: 'Only Item',
                children: [],
              },
            ],
          },
        },
      });

      const result = (await service.get({ menuLocationId: 'main' })) as MenuType;
      expect(result.menuItems).toHaveLength(1);
      expect(result.menuItems[0].label).toBe('Only Item');
    });

    it('handles empty menuItems', async () => {
      mockClient.runQuery.mockResolvedValue({
        data: {
          getMenuAtLocation: {
            id: 1,
            title: 'Empty Menu',
            menuItems: [],
          },
        },
      });

      const result = (await service.get({ menuLocationId: 'main' })) as MenuType;
      expect(result.menuItems).toEqual([]);
    });

    it('handles null title', async () => {
      mockClient.runQuery.mockResolvedValue({
        data: {
          getMenuAtLocation: {
            id: 1,
            title: null,
            menuItems: [],
          },
        },
      });

      const result = (await service.get({ menuLocationId: 'main' })) as MenuType;
      expect(result.title).toBe('');
    });
  });

  describe('getRaw', () => {
    it('returns raw response', async () => {
      const rawResponse = { data: { getMenuAtLocation: { id: 1 } } };
      mockClient.runQuery.mockResolvedValue(rawResponse);

      const result = await service.getRaw({ menuLocationId: 'main' });
      expect(result).toEqual(rawResponse);
    });
  });
});
