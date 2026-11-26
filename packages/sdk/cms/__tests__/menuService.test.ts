import { GeinsError, GeinsErrorCode } from '@geins/core';
import type { MenuItemType, MenuType, RequestContext } from '@geins/types';
import type { DocumentNode, FragmentDefinitionNode, SelectionSetNode } from 'graphql';
import { print } from 'graphql';
import { queries } from '../src/graphql';
import { buildMenuQuery, menuQuery } from '../src/graphql/menuQuery';
import { MenuService } from '../src/services/menuService';

/** Levels of menu items a menu document selects, counting the top items as 1. */
function menuItemLevels(doc: DocumentNode): number {
  const base = doc.definitions.find(
    (def): def is FragmentDefinitionNode =>
      def.kind === 'FragmentDefinition' && def.name.value === 'MenuItemBase',
  );
  const levels = (set: SelectionSetNode): number => {
    const children = set.selections.find((sel) => sel.kind === 'Field' && sel.name.value === 'children');
    return children?.kind === 'Field' && children.selectionSet ? 1 + levels(children.selectionSet) : 1;
  };
  return levels(base!.selectionSet);
}

/** Levels of a parsed menu, counting the top items as 1. */
function parsedLevels(items: MenuItemType[] | undefined): number {
  if (!items?.length) return 0;
  return 1 + Math.max(...items.map((item) => parsedLevels(item.children)));
}

const withoutLoc = (doc: DocumentNode) =>
  JSON.parse(JSON.stringify(doc, (key, value) => (key === 'loc' ? undefined : value)));

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

  describe('requestContext override', () => {
    it('overrides languageId when requestContext is provided', async () => {
      mockClient.runQuery.mockResolvedValue({
        data: { getMenuAtLocation: { id: 1, title: 'Menu', menuItems: [] } },
      });
      const requestContext: RequestContext = { languageId: 'en-GB' };

      await service.get({ menuLocationId: 'main' }, requestContext);

      const callArgs = mockClient.runQuery.mock.calls[0][0];
      expect(callArgs.variables.languageId).toBe('en-GB');
    });

    it('overrides marketId and channelId when requestContext is provided', async () => {
      mockClient.runQuery.mockResolvedValue({
        data: { getMenuAtLocation: { id: 1, title: 'Menu', menuItems: [] } },
      });
      const requestContext: RequestContext = { marketId: 'NO', channelId: 'channel|no' };

      await service.get({ menuLocationId: 'main' }, requestContext);

      const callArgs = mockClient.runQuery.mock.calls[0][0];
      expect(callArgs.variables.marketId).toBe('NO');
      expect(callArgs.variables.channelId).toBe('channel|no');
    });

    it('uses SDK defaults when requestContext is omitted', async () => {
      mockClient.runQuery.mockResolvedValue({
        data: { getMenuAtLocation: { id: 1, title: 'Menu', menuItems: [] } },
      });

      await service.get({ menuLocationId: 'main' });

      const callArgs = mockClient.runQuery.mock.calls[0][0];
      expect(callArgs.variables.languageId).toBe('sv-SE');
      expect(callArgs.variables.marketId).toBe('SE');
    });
  });

  describe('depth', () => {
    beforeEach(() => {
      mockClient.runQuery.mockResolvedValue({
        data: { getMenuAtLocation: { id: 1, title: 'Menu', menuItems: [] } },
      });
    });

    const sentQuery = () => mockClient.runQuery.mock.calls[0][0].query as DocumentNode;

    it('selects three levels, the document of the .gql files, when no depth is given', async () => {
      await service.get({ menuLocationId: 'main' });
      expect(sentQuery()).toBe(queries.menu);
      expect(menuItemLevels(sentQuery())).toBe(3);
    });

    it('sends the same document for depth 3 as for no depth', async () => {
      await service.get({ menuLocationId: 'main', depth: 3 });
      expect(sentQuery()).toBe(queries.menu);
    });

    it('builds depth 3 exactly as the .gql files select it', () => {
      expect(withoutLoc(buildMenuQuery(3))).toEqual(withoutLoc(queries.menu));
    });

    it.each([1, 4, 6])('selects %i levels when asked for that depth', async (depth) => {
      await service.get({ menuLocationId: 'main', depth });
      expect(menuItemLevels(sentQuery())).toBe(depth);
    });

    it('drops the loc of the 3-level source on a built document, and keeps the original at depth 3', () => {
      // The bundle keeps a document's loc (its source text); the jest transform keeps none.
      const loc = { start: 0, end: 1, source: { body: 'the 3-level source' } };
      const base = queries.menu.definitions.find(
        (def) => def.kind === 'FragmentDefinition' && def.name.value === 'MenuItemBase',
      )!;
      Object.assign(queries.menu, { loc });
      Object.assign(base, { loc });
      try {
        const built = buildMenuQuery(4);
        expect(built).not.toHaveProperty('loc');
        const builtBase = built.definitions.find(
          (def) => def.kind === 'FragmentDefinition' && def.name.value === 'MenuItemBase',
        );
        expect(builtBase).not.toHaveProperty('loc');
        expect(JSON.stringify(builtBase)).not.toContain('3-level source');

        expect(menuQuery(3)).toBe(queries.menu);
        expect(menuQuery(3).loc).toBe(loc);
      } finally {
        Reflect.deleteProperty(queries.menu, 'loc');
        Reflect.deleteProperty(base, 'loc');
      }
    });

    it('prints a depth-4 document with children nested three times below the top items', async () => {
      await service.get({ menuLocationId: 'main', depth: 4 });
      const printed = print(sentQuery());
      const fragment = printed.slice(printed.indexOf('fragment MenuItemBase'));
      const body = fragment.slice(0, fragment.indexOf('\n}\n') + 2);
      expect(body.match(/\bchildren\b/g)).toHaveLength(3);
      expect(body).toMatch(/children \{\s+children \{\s+children \{\s+\.\.\.MenuItem\s+\}/);
    });

    it('keeps every other definition of the menu document as it is', async () => {
      await service.get({ menuLocationId: 'main', depth: 4 });
      const names = (doc: DocumentNode) =>
        doc.definitions.map((def) => ('name' in def ? def.name?.value : def.kind));
      expect(names(sentQuery())).toEqual(names(queries.menu));
      const menu = queries.menu;
      sentQuery().definitions.forEach((def, i) => {
        if ('name' in def && def.name?.value === 'MenuItemBase') return;
        expect(def).toBe(menu.definitions[i]);
      });
    });

    it('builds each depth once', async () => {
      await service.get({ menuLocationId: 'main', depth: 4 });
      await service.get({ menuLocationId: 'main', depth: 4 });
      const [first, second] = mockClient.runQuery.mock.calls.map((call) => call[0].query);
      expect(second).toBe(first);
    });

    it('does not send the depth as a query variable', async () => {
      await service.get({ menuLocationId: 'main', depth: 4 });
      expect(mockClient.runQuery.mock.calls[0][0].variables).not.toHaveProperty('depth');
    });

    it('asks for the depth through getRaw too', async () => {
      await service.getRaw({ menuLocationId: 'main', depth: 4 });
      expect(menuItemLevels(sentQuery())).toBe(4);
      expect(mockClient.runQuery.mock.calls[0][0].variables).not.toHaveProperty('depth');
    });

    it.each([0, -1, 2.5, NaN, 7])('refuses depth %p without a request', async (depth) => {
      const refusal = { code: GeinsErrorCode.INVALID_ARGUMENT };
      await expect(service.get({ menuLocationId: 'main', depth })).rejects.toThrow(GeinsError);
      await expect(service.get({ menuLocationId: 'main', depth })).rejects.toMatchObject(refusal);
      await expect(service.getRaw({ menuLocationId: 'main', depth })).rejects.toMatchObject(refusal);
      expect(mockClient.runQuery).not.toHaveBeenCalled();
    });

    it('parses four levels, the fourth without children when the API sends none', async () => {
      const item = (id: number, children?: unknown[]) => ({
        id,
        label: `Item ${id}`,
        ...(children ? { children } : {}),
      });
      mockClient.runQuery.mockResolvedValue({
        data: {
          getMenuAtLocation: {
            id: 1,
            title: 'Menu',
            menuItems: [item(1, [item(11, [item(111, [item(1111), item(1112, [])])])])],
          },
        },
      });

      const result = (await service.get({ menuLocationId: 'main', depth: 4 })) as MenuType;
      expect(parsedLevels(result.menuItems)).toBe(4);
      const fourth = result.menuItems[0].children?.[0]?.children?.[0]?.children;
      expect(fourth?.map((i) => i.label)).toEqual(['Item 1111', 'Item 1112']);
      expect(fourth?.map((i) => i.children)).toEqual([[], []]);
    });
  });
});
