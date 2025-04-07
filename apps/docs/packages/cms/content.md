# Content / Widgets

## Overview

The CMS module in Geins SDK provides tools to manage content dynamically through widgets, pages, and structured layouts. Widgets are modular building blocks used to create rich and reusable components for modern applications. These include banners, images, text blocks, and interactive elements.

## Types

Below is an overview of the main types used in the CMS module:

### ContentPageVariables

Used for fetching a specific page by alias.

```typescript
export interface ContentPageVariables extends BaseCmsVariables {
  alias: string;
}
```

### ContentAreaVariables

Used for fetching a specific content area by `areaName` and `family`.

```typescript
export interface ContentAreaVariables extends BaseCmsVariables {
  areaName: string;
  family: string;
}
```

### BaseCmsVariables

Common variables for CMS content fetching.

```typescript
export interface BaseCmsVariables extends GeinsBaseApiVars {
  customerType?: GeinsCustomerType | null;
  preview?: boolean | null;
  filters?: Array<KeyValue> | null;
  displaySetting?: string | null;
}
```

### Content Types

#### ContentImageSizeType

Represents the dimensions of an image.

```typescript
export interface ContentImageSizeType {
  imageWidth: number;
  imageHeight: number;
}
```

#### ContentImageType

Represents an image with its filename and largest size.

```typescript
export interface ContentImageType {
  fileName: string;
  largestSize: ContentImageSizeType;
}
```

#### ContentType

Represents a single content item.

```typescript
export interface ContentType {
  id: string;
  name: string;
  sortOrder: number;
  type: string;
  size: string;
  configuration: string;
  images: ContentImageType[];
}
```

#### ContentContainerType

Represents a container of multiple content items.

```typescript
export interface ContentContainerType {
  id: string;
  name: string;
  sortOrder: number;
  layout: string;
  responsiveMode: string;
  design: string;
  content: ContentType[];
}
```

#### ContentPageAreaType

Represents metadata for a page area.

```typescript
export interface ContentPageAreaType {
  id?: string;
  name?: string;
  index?: number;
}
```

#### ContentMetaType

Contains metadata for content areas or pages.

```typescript
export interface ContentMetaType {
  title?: string;
  description?: string;
}
```

### Higher-Level Types

#### ContentPageType

Represents a complete page with areas, metadata, and containers.

```typescript
export interface ContentPageType {
  id?: string;
  name?: string;
  title?: string;
  pageArea?: ContentPageAreaType;
  familyName?: string;
  meta: ContentMetaType;
  tags: string[];
  containers: ContentContainerType[];
}
```

#### ContentAreaType

Represents a content area with metadata and containers.

```typescript
export interface ContentAreaType {
  meta: ContentMetaType;
  tags: string[];
  containers: ContentContainerType[];
}
```


## Parsing Content / Widgets

The CMS includes a parser that helps in organizing and rendering content based on pre-defined structures. Each widget adheres to a specific schema, allowing flexibility while maintaining consistency in application design.

### Example: Parsing a Content Area

```typescript
const contentAreaService = geinsCMS.area;

// Fetch a content area
const areaData = await contentAreaService.get({
  family: 'homepage',
  areaName: 'hero-banner',
});

if (areaData) {
  areaData.containers.forEach((container) => {
    console.log(`Container Name: ${container.name}`);
    container.content.forEach((widget) => {
      console.log(`Widget Type: ${widget.type}, Data:`, widget.data);
    });
  });
}
```

## Error Handling

Proper error handling ensures the application is robust and user-friendly. Always validate responses and handle edge cases.

```typescript
try {
  const content = await contentAreaService.get({
    family: 'homepage',
    areaName: 'hero-banner',
  });

  if (!content) {
    console.warn('Content area not found.');
  }
} catch (error) {
  console.error('Error fetching content:', error);
}
```

## Conclusion

The CMS module in Geins SDK provides a powerful framework for managing content dynamically and efficiently. Widgets, pages, and content areas are flexible, modular, and adaptable for a variety of application needs. Explore more in the [Geins API documentation](https://docs.geins.io).
