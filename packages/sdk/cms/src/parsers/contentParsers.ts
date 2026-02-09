import { ContentAreaType, ContentPageType, GeinsMenuItemTypeType, ContentContainerType, ContentType, GeinsError, GeinsErrorCode, sdkLogger } from '@geins/core';
import type {
  GeinsMenuItemBaseType,
  GeinsPageWidgetCollectionTypeType,
  GeinsPageWidgetContainerTypeType,
  GeinsPageWidgetTypeType,
  GeinsMetadataTypeType,
} from '@geins/core';

/** Maps a raw menu item to a structured menu type, recursively parsing children. */
export function parseMenuItem(item: GeinsMenuItemBaseType): GeinsMenuItemTypeType {
  return {
    id: item.id,
    label: item.label,
    title: item.title,
    canonicalUrl: item.canonicalUrl,
    type: item.type,
    order: item.order,
    open: item.open,
    hidden: item.hidden,
    targetBlank: item.targetBlank,
    children: item.children ? item.children.map((child) => parseMenuItem(child!)) : [],
  };
}

/**
 * Parses a widget area result into a content area with meta, tags, and containers.
 * @param result - Raw query result containing a widget area.
 * @returns Parsed content area; returns empty containers/tags if no area is found.
 * @throws {GeinsError} If the result structure is invalid.
 */
export function parseContentArea(result: {
  data?: { widgetArea?: GeinsPageWidgetCollectionTypeType };
}): ContentAreaType {
  if (!result || !result.data) {
    throw new GeinsError('Invalid result structure for content area', GeinsErrorCode.PARSE_ERROR);
  }
  const area = result.data.widgetArea;

  if (!area) {
    sdkLogger.warn('No area found');
    return {
      meta: {},
      tags: [],
      containers: [],
    };
  }

  return {
    meta: area.meta ? parseMetaData(area.meta) : {},
    tags: area.tags ? area.tags.filter((t): t is string => t != null) : [],
    containers: area.containers
      ? area.containers
          .filter((c): c is GeinsPageWidgetContainerTypeType => c != null)
          .map((item) => parseContainer(item))
      : [],
  };
}

/**
 * Parses a widget area result into a full content page with page area, meta, tags, and containers.
 * @param result - Raw query result containing a widget area.
 * @returns Parsed content page; returns a default empty page if no page is found.
 * @throws {GeinsError} If the result structure is invalid.
 */
export function parseContentPage(result: {
  data?: { widgetArea?: GeinsPageWidgetCollectionTypeType };
}): ContentPageType {
  if (!result || !result.data) {
    throw new GeinsError('Invalid result structure for content page', GeinsErrorCode.PARSE_ERROR);
  }

  const parsedResult: ContentPageType = {
    id: '',
    name: '',
    title: '',
    pageArea: {},
    familyName: '',
    meta: {},
    tags: [],
    containers: [],
  };

  const page = result.data.widgetArea;
  if (!page) {
    sdkLogger.warn('No page found');
    return parsedResult;
  }

  parsedResult.id = String(page.id);
  parsedResult.name = page.name;
  parsedResult.title = page.title ?? undefined;
  parsedResult.pageArea = page.pageArea
    ? { id: String(page.pageArea.id), name: page.pageArea.name ?? undefined, index: page.pageArea.index }
    : {};
  parsedResult.familyName = page.familyName ?? undefined;
  parsedResult.meta = page.meta ? parseMetaData(page.meta) : {};
  parsedResult.tags = page.tags ? page.tags.filter((t): t is string => t != null) : [];
  parsedResult.containers = page.containers
    ? page.containers
        .filter((c): c is GeinsPageWidgetContainerTypeType => c != null)
        .map((item) => parseContainer(item))
    : [];

  return parsedResult;
}

/** Parses a widget container into a content container, mapping child widgets to content items. */
export function parseContainer(container: GeinsPageWidgetContainerTypeType): ContentContainerType {
  return {
    id: String(container.id),
    name: container.name,
    sortOrder: container.sortOrder,
    layout: container.layout,
    responsiveMode: container.responsiveMode,
    design: container.design,
    content: container.widgets
      ? container.widgets
          .filter((w): w is GeinsPageWidgetTypeType => w != null)
          .map((content) => parseContent(content))
      : [],
  };
}

/** Extracts title and description from metadata, converting nulls to undefined. */
export function parseMetaData(meta: GeinsMetadataTypeType) {
  return {
    title: meta.title ?? undefined,
    description: meta.description ?? undefined,
  };
}

/** Parses a widget into a content item with config and type-specific data. Promotes `active` and `displayName` from data to config. */
export function parseContent(content: GeinsPageWidgetTypeType): ContentType {
  const parsedContent = {
    config: {
      name: content.name,
      displayName: content.name,
      active: false,
      type: content.type,
      size: content.size,
      sortOrder: content.sortOrder,
    },
    data: {} as Record<string, unknown>,
  };

  if (content.type) {
    const data = parseContentData(content.type, content.configuration);

    if (data) {
      parsedContent.data = data;
    }

    if (data.active) {
      parsedContent.config.active = data.active as boolean;
      delete data.active;
    }

    if (data.displayName) {
      parsedContent.config.displayName = data.displayName as string;
      delete data.displayName;
    }
  }

  return parsedContent;
}

/**
 * Parses raw content data by widget type, injecting `name` and `active` fields.
 * @returns Parsed data record; returns empty object if data is missing.
 */
export function parseContentData(type: string, data: string): Record<string, unknown> {
  if (!data) {
    sdkLogger.warn(`No data found for type ${type}`);
    return {};
  }

  const parsedData = parseContentDataByType(type, data);
  const parsedContentData: Record<string, unknown> = {
    name: parsedData.name,
    active: parsedData.active || false,
    ...parsedData,
  };

  return parsedContentData;
}

/** Dispatches content data parsing to the appropriate type-specific parser. Falls back to {@link parseJsonSafe}. */
export function parseContentDataByType(type: string, data: string): Record<string, unknown> {
  switch (type) {
    case 'TextPageWidget':
      return parseContentDataText(data);
    case 'HTMLPageWidget':
      return parseContentDataHtml(data);
    case 'Product listPageWidget':
      return parseContentDataProductList(data);
    case 'ButtonsPageWidget':
      return parseContentDataButtons(data);
    case 'ImagePageWidget':
      return parseContentDataImage(data);
    case 'BannerPageWidget':
      return parseContentDataBanner(data);
    case 'JSONPageWidget':
      return parseContentDataJson(data);
    default:
      return parseJsonSafe(data);
  }
}

/** Safely parses a JSON string. Returns an empty object on parse failure. */
export function parseJsonSafe(data: string): Record<string, unknown> {
  try {
    return JSON.parse(data) as Record<string, unknown>;
  } catch (e) {
    return {};
  }
}

/** Parses a JSON widget's data, merging the nested `json` attribute into the top-level result. Returns empty object on parse failure. */
export function parseContentDataJson(data: string): Record<string, unknown> {
  let parsedData: Record<string, unknown> = {};
  let jsonData: Record<string, unknown> = {};

  try {
    parsedData = JSON.parse(data) as Record<string, unknown>;
  } catch (e) {
    sdkLogger.error(`Error parsing data: ${e}`);
  }
  try {
    jsonData = JSON.parse(parsedData.json as string) as Record<string, unknown>;
  } catch (e) {
    sdkLogger.error(`Error parsing json attribute from content data: ${e}`);
  }
  if (parsedData.json) {
    delete parsedData.json;
  }
  return { ...parsedData, ...jsonData };
}

/** Parses text widget data from a JSON string. Returns empty object on parse failure. */
export function parseContentDataText(data: string): Record<string, unknown> {
  try {
    return JSON.parse(data) as Record<string, unknown>;
  } catch (e) {
    return {};
  }
}

/** Parses HTML widget data from a JSON string. Returns empty object on parse failure. */
export function parseContentDataHtml(data: string): Record<string, unknown> {
  try {
    return JSON.parse(data) as Record<string, unknown>;
  } catch (e) {
    return {};
  }
}

/** Parses product list widget data from a JSON string. Returns empty object on parse failure. */
export function parseContentDataProductList(data: string): Record<string, unknown> {
  try {
    return JSON.parse(data) as Record<string, unknown>;
  } catch (e) {
    return {};
  }
}

/** Parses image widget data from a JSON string. Returns empty object on parse failure. */
export function parseContentDataImage(data: string): Record<string, unknown> {
  try {
    return JSON.parse(data) as Record<string, unknown>;
  } catch (e) {
    return {};
  }
}

/** Parses banner widget data from a JSON string. Returns empty object on parse failure. */
export function parseContentDataBanner(data: string): Record<string, unknown> {
  try {
    return JSON.parse(data) as Record<string, unknown>;
  } catch (e) {
    return {};
  }
}

/** Parses buttons widget data from a JSON string. Returns empty object on parse failure. */
export function parseContentDataButtons(data: string): Record<string, unknown> {
  try {
    return JSON.parse(data) as Record<string, unknown>;
  } catch (e) {
    return {};
  }
}
