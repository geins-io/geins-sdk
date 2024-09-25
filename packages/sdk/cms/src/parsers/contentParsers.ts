import { ContentAreaType, ContentContainerType } from '@geins/core';
import type { MenuItemType } from '@geins/types';

export function parseMenuItem(item: any): MenuItemType {
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
    children: item.children
      ? item.children.map((child: any) => parseMenuItem(child))
      : [],
  };
}

export function parseContentArea(result: any): ContentAreaType {
  if (!result || !result.data) {
    throw new Error('Invalid result structure for content area');
  }
  const area = result.data.widgetArea;

  if (!area) {
    console.warn('No area found');
    return {
      meta: {},
      tags: [],
      containers: [],
    };
  }

  const parsedResult = {
    meta: area.meta ? parseMetaData(area.meta) : {},
    tags: area.tags,
    containers: area.containers.map((item: any) => parseContainer(item)),
  };

  return parsedResult as ContentAreaType;
}

export function parseContainer(container: any): ContentContainerType {
  const parsedContainer = {
    id: container.id,
    name: container.name,
    sortOrder: container.sortOrder,
    layout: container.layout,
    responsiveMode: container.responsiveMode,
    design: container.design,
    content: container.widgets.map((content: any) => parseContent(content)),
  };
  return parsedContainer;
}

export function parseMetaData(meta: any) {
  return {
    title: meta.title,
    description: meta.description,
  };
}

export function parseContent(content: any) {
  const parsedContent = {
    config: {
      name: content.name,
      displayName: content.name,
      active: false,
      type: content.type,
      size: content.size,
      sortOrder: content.sortOrder,
    },
    data: {},
  };

  if (content.type) {
    const data = parseContentData(content.type, content.configuration);

    if (data) {
      parsedContent.data = data;
    }

    if (data.active) {
      parsedContent.config.active = data.active;
      delete data.active;
    }

    if (data.displayName) {
      parsedContent.config.displayName = data.displayName;
      delete data.displayName;
    }
  }

  return parsedContent;
}

export function parseContentData(type: string, data: any) {
  if (!data) {
    console.warn('No data found for type', type);
    return {};
  }

  const parsedData = parseContentDataByType(type, data);
  const parsedContentData = {
    name: data.name,
    active: data.active || false,
    ...parsedData,
  };

  return parsedContentData;
}

export function parseContentDataByType(type: string, data: any) {
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

export function parseJsonSafe(data: any) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

export function parseContentDataJson(data: any) {
  let parsedData: any = {};
  let jsonData: any = {};

  try {
    parsedData = JSON.parse(data);
  } catch (e) {
    console.error('Error parsing data', e);
  }
  try {
    jsonData = JSON.parse(parsedData.json);
  } catch (e) {
    console.error('Error parsing json attribute from content data', e);
  }
  if (parsedData.json) {
    delete parsedData.json;
  }
  return { ...parsedData, ...jsonData };
}

export function parseContentDataText(data: any) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

export function parseContentDataHtml(data: any) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

export function parseContentDataProductList(data: any) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

export function parseContentDataImage(data: any) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

export function parseContentDataBanner(data: any) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

export function parseContentDataButtons(data: any) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}
