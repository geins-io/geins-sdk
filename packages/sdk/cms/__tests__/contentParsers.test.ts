import {
  parseMenuItem,
  parseContentArea,
  parseContentPage,
  parseContainer,
  parseMetaData,
  parseContent,
  parseContentData,
  parseContentDataByType,
  parseJsonSafe,
  parseContentDataJson,
  parseContentDataText,
  parseContentDataHtml,
  parseContentDataProductList,
  parseContentDataImage,
  parseContentDataBanner,
  parseContentDataButtons,
} from '../src/parsers/contentParsers';
import { GeinsError } from '@geins/core';

describe('contentParsers', () => {
  describe('parseMenuItem', () => {
    it('parses a flat menu item', () => {
      const input = {
        id: 1,
        label: 'Home',
        title: 'Home Page',
        canonicalUrl: '/',
        type: 'page',
        order: 0,
        open: true,
        hidden: false,
        targetBlank: false,
        children: [],
      };
      const result = parseMenuItem(input as any);
      expect(result.label).toBe('Home');
      expect(result.canonicalUrl).toBe('/');
      expect(result.children).toEqual([]);
    });

    it('parses nested children recursively', () => {
      const input = {
        id: 1,
        label: 'Parent',
        children: [
          {
            id: 2,
            label: 'Child',
            children: [
              {
                id: 3,
                label: 'Grandchild',
                children: [],
              },
            ],
          },
        ],
      };
      const result = parseMenuItem(input as any);
      expect(result.children).toHaveLength(1);
      expect(result.children?.[0]?.label).toBe('Child');
      expect(result.children?.[0]?.children).toHaveLength(1);
      expect(result.children?.[0]?.children?.[0]?.label).toBe('Grandchild');
    });

    it('defaults children to empty array when null', () => {
      const input = { id: 1, label: 'Leaf', children: null };
      const result = parseMenuItem(input as any);
      expect(result.children).toEqual([]);
    });
  });

  describe('parseContentArea', () => {
    it('throws PARSE_ERROR when result is null', () => {
      expect(() => parseContentArea(null as any)).toThrow(GeinsError);
    });

    it('throws PARSE_ERROR when result.data is undefined', () => {
      expect(() => parseContentArea({} as any)).toThrow(GeinsError);
    });

    it('returns empty area when widgetArea is undefined', () => {
      const result = parseContentArea({ data: { widgetArea: undefined } });
      expect(result.meta).toEqual({});
      expect(result.tags).toEqual([]);
      expect(result.containers).toEqual([]);
    });

    it('parses area with meta, tags, and containers', () => {
      const input = {
        data: {
          widgetArea: {
            meta: { title: 'Area Title', description: 'Desc' },
            tags: ['tag1', null, 'tag2'],
            containers: [
              {
                id: 1,
                name: 'Main',
                sortOrder: 0,
                layout: 'full',
                widgets: [],
              },
            ],
          },
        },
      };
      const result = parseContentArea(input as any);
      expect(result.meta).toEqual({ title: 'Area Title', description: 'Desc' });
      expect(result.tags).toEqual(['tag1', 'tag2']);
      expect(result.containers).toHaveLength(1);
      expect(result.containers[0].name).toBe('Main');
    });

    it('filters null containers', () => {
      const input = {
        data: {
          widgetArea: {
            containers: [null, { id: 1, name: 'Valid', widgets: [] }],
          },
        },
      };
      const result = parseContentArea(input as any);
      expect(result.containers).toHaveLength(1);
    });
  });

  describe('parseContentPage', () => {
    it('throws PARSE_ERROR when result is null', () => {
      expect(() => parseContentPage(null as any)).toThrow(GeinsError);
    });

    it('throws PARSE_ERROR when result.data is missing', () => {
      expect(() => parseContentPage({} as any)).toThrow(GeinsError);
    });

    it('returns default page when widgetArea is undefined', () => {
      const result = parseContentPage({ data: { widgetArea: undefined } });
      expect(result.id).toBe('');
      expect(result.name).toBe('');
      expect(result.containers).toEqual([]);
    });

    it('parses a full page', () => {
      const input = {
        data: {
          widgetArea: {
            id: 42,
            name: 'Homepage',
            title: 'Welcome',
            pageArea: { id: 1, name: 'Main Area', index: 0 },
            familyName: 'landing',
            meta: { title: 'Home', description: 'Landing page' },
            tags: ['featured'],
            containers: [
              { id: 10, name: 'Hero', sortOrder: 0, widgets: [] },
            ],
          },
        },
      };
      const result = parseContentPage(input as any);
      expect(result.id).toBe('42');
      expect(result.name).toBe('Homepage');
      expect(result.title).toBe('Welcome');
      expect(result.familyName).toBe('landing');
      expect(result.pageArea).toEqual({ id: '1', name: 'Main Area', index: 0 });
      expect(result.meta).toEqual({ title: 'Home', description: 'Landing page' });
      expect(result.tags).toEqual(['featured']);
      expect(result.containers).toHaveLength(1);
    });

    it('handles null title and familyName', () => {
      const input = {
        data: {
          widgetArea: {
            id: 1,
            name: 'Page',
            title: null,
            pageArea: null,
            familyName: null,
            meta: null,
            tags: null,
            containers: null,
          },
        },
      };
      const result = parseContentPage(input as any);
      expect(result.title).toBeUndefined();
      expect(result.familyName).toBeUndefined();
      expect(result.pageArea).toEqual({});
      expect(result.meta).toEqual({});
      expect(result.tags).toEqual([]);
      expect(result.containers).toEqual([]);
    });
  });

  describe('parseContainer', () => {
    it('parses container with widgets', () => {
      const input = {
        id: 5,
        name: 'Sidebar',
        sortOrder: 1,
        layout: 'column',
        responsiveMode: 'desktop',
        design: 'default',
        widgets: [
          { name: 'Widget1', type: 'TextPageWidget', size: 'full', sortOrder: 0, configuration: '{"text":"Hello"}' },
        ],
      };
      const result = parseContainer(input as any);
      expect(result.id).toBe('5');
      expect(result.name).toBe('Sidebar');
      expect(result.content).toHaveLength(1);
    });

    it('handles null widgets array', () => {
      const input = { id: 1, name: 'Empty', widgets: null };
      const result = parseContainer(input as any);
      expect(result.content).toEqual([]);
    });

    it('filters null widgets', () => {
      const input = {
        id: 1,
        name: 'WithNulls',
        widgets: [null, { name: 'W1', type: 'TextPageWidget', configuration: '{}' }],
      };
      const result = parseContainer(input as any);
      expect(result.content).toHaveLength(1);
    });
  });

  describe('parseMetaData', () => {
    it('parses title and description', () => {
      expect(parseMetaData({ title: 'Title', description: 'Desc' } as any)).toEqual({
        title: 'Title',
        description: 'Desc',
      });
    });

    it('uses undefined for null values', () => {
      expect(parseMetaData({ title: null, description: null } as any)).toEqual({
        title: undefined,
        description: undefined,
      });
    });
  });

  describe('parseContent', () => {
    it('parses widget with type and configuration', () => {
      const input = {
        name: 'MyWidget',
        type: 'TextPageWidget',
        size: 'half',
        sortOrder: 2,
        configuration: JSON.stringify({ text: 'Hello', active: true, displayName: 'Custom Name' }),
      };
      const result = parseContent(input as any);
      expect(result.config.name).toBe('MyWidget');
      expect(result.config.type).toBe('TextPageWidget');
      expect(result.config.active).toBe(true);
      expect(result.config.displayName).toBe('Custom Name');
      expect(result.data.text).toBe('Hello');
      // active and displayName should be removed from data
      expect(result.data.active).toBeUndefined();
      expect(result.data.displayName).toBeUndefined();
    });

    it('handles widget with no type', () => {
      const input = {
        name: 'NoType',
        type: undefined,
        size: 'full',
        sortOrder: 0,
        configuration: '{}',
      };
      const result = parseContent(input as any);
      expect(result.config.active).toBe(false);
      expect(result.data).toEqual({});
    });

    it('handles invalid JSON configuration', () => {
      const input = {
        name: 'BadJson',
        type: 'TextPageWidget',
        size: 'full',
        sortOrder: 0,
        configuration: 'not valid json',
      };
      const result = parseContent(input as any);
      expect(result.data).toEqual({ name: undefined, active: false });
    });
  });

  describe('parseContentData', () => {
    it('returns empty object when data is empty/falsy', () => {
      expect(parseContentData('TextPageWidget', '')).toEqual({});
      expect(parseContentData('TextPageWidget', null as any)).toEqual({});
    });

    it('parses valid JSON data', () => {
      const result = parseContentData('TextPageWidget', JSON.stringify({ text: 'Hello', name: 'Widget1', active: true }));
      expect(result.name).toBe('Widget1');
      expect(result.active).toBe(true);
      expect(result.text).toBe('Hello');
    });
  });

  describe('parseContentDataByType', () => {
    const validJson = JSON.stringify({ key: 'value' });

    it('routes TextPageWidget correctly', () => {
      expect(parseContentDataByType('TextPageWidget', validJson)).toEqual({ key: 'value' });
    });

    it('routes HTMLPageWidget correctly', () => {
      expect(parseContentDataByType('HTMLPageWidget', validJson)).toEqual({ key: 'value' });
    });

    it('routes Product listPageWidget correctly', () => {
      expect(parseContentDataByType('Product listPageWidget', validJson)).toEqual({ key: 'value' });
    });

    it('routes ButtonsPageWidget correctly', () => {
      expect(parseContentDataByType('ButtonsPageWidget', validJson)).toEqual({ key: 'value' });
    });

    it('routes ImagePageWidget correctly', () => {
      expect(parseContentDataByType('ImagePageWidget', validJson)).toEqual({ key: 'value' });
    });

    it('routes BannerPageWidget correctly', () => {
      expect(parseContentDataByType('BannerPageWidget', validJson)).toEqual({ key: 'value' });
    });

    it('routes JSONPageWidget to parseContentDataJson', () => {
      const data = JSON.stringify({ title: 'Test', json: JSON.stringify({ nested: true }) });
      const result = parseContentDataByType('JSONPageWidget', data);
      expect(result.title).toBe('Test');
      expect(result.nested).toBe(true);
      expect(result.json).toBeUndefined();
    });

    it('falls back to parseJsonSafe for unknown types', () => {
      expect(parseContentDataByType('UnknownWidget', validJson)).toEqual({ key: 'value' });
    });

    it('returns empty object for invalid JSON on unknown type', () => {
      expect(parseContentDataByType('UnknownWidget', 'bad json')).toEqual({});
    });
  });

  describe('parseJsonSafe', () => {
    it('parses valid JSON', () => {
      expect(parseJsonSafe('{"a":1}')).toEqual({ a: 1 });
    });

    it('returns empty object for invalid JSON', () => {
      expect(parseJsonSafe('not json')).toEqual({});
      expect(parseJsonSafe('')).toEqual({});
    });
  });

  describe('parseContentDataJson', () => {
    it('parses outer and nested json field', () => {
      const data = JSON.stringify({
        title: 'Outer',
        json: JSON.stringify({ innerKey: 'innerValue' }),
      });
      const result = parseContentDataJson(data);
      expect(result.title).toBe('Outer');
      expect(result.innerKey).toBe('innerValue');
      expect(result.json).toBeUndefined();
    });

    it('handles missing json field', () => {
      const data = JSON.stringify({ title: 'NoNested' });
      const result = parseContentDataJson(data);
      expect(result.title).toBe('NoNested');
    });

    it('handles invalid outer JSON', () => {
      const result = parseContentDataJson('not json');
      expect(result).toEqual({});
    });

    it('handles invalid nested json field', () => {
      const data = JSON.stringify({ title: 'Valid', json: 'not valid json' });
      const result = parseContentDataJson(data);
      expect(result.title).toBe('Valid');
      // json key gets deleted even if nested parse fails
      expect(result.json).toBeUndefined();
    });

    it('merges nested fields over outer fields', () => {
      const data = JSON.stringify({
        key: 'outer',
        json: JSON.stringify({ key: 'inner' }),
      });
      const result = parseContentDataJson(data);
      // Spread order: { ...parsedData, ...jsonData }, so inner wins
      expect(result.key).toBe('inner');
    });
  });

  describe('individual type parsers', () => {
    const validJson = '{"text":"hello"}';
    const invalidJson = 'bad';

    it('parseContentDataText handles valid/invalid JSON', () => {
      expect(parseContentDataText(validJson)).toEqual({ text: 'hello' });
      expect(parseContentDataText(invalidJson)).toEqual({});
    });

    it('parseContentDataHtml handles valid/invalid JSON', () => {
      expect(parseContentDataHtml(validJson)).toEqual({ text: 'hello' });
      expect(parseContentDataHtml(invalidJson)).toEqual({});
    });

    it('parseContentDataProductList handles valid/invalid JSON', () => {
      expect(parseContentDataProductList(validJson)).toEqual({ text: 'hello' });
      expect(parseContentDataProductList(invalidJson)).toEqual({});
    });

    it('parseContentDataImage handles valid/invalid JSON', () => {
      expect(parseContentDataImage(validJson)).toEqual({ text: 'hello' });
      expect(parseContentDataImage(invalidJson)).toEqual({});
    });

    it('parseContentDataBanner handles valid/invalid JSON', () => {
      expect(parseContentDataBanner(validJson)).toEqual({ text: 'hello' });
      expect(parseContentDataBanner(invalidJson)).toEqual({});
    });

    it('parseContentDataButtons handles valid/invalid JSON', () => {
      expect(parseContentDataButtons(validJson)).toEqual({ text: 'hello' });
      expect(parseContentDataButtons(invalidJson)).toEqual({});
    });
  });
});
