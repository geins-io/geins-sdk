# Page

The Page module in Geins CMS enables you to create, manage, and render content-rich pages within your application. Pages are central content elements that can hold various widgets and structured data, allowing for a customizable and flexible design.

## Overview

A **Page** is a defined content structure that can include widgets, layouts, and metadata. This module allows you to retrieve specific pages based on identifiers and tailor them according to your application's requirements.

### Key Features

- **Dynamic Content**: Pages can hold various widgets, such as text, images, and interactive elements.
- **Metadata Support**: Pages include metadata for SEO optimization and categorization.
- **Flexible Layouts**: Pages can be designed to support different layouts based on the application’s needs.

## Accessing the Page Service

To work with pages in Geins CMS, initialize `GeinsCore` and `GeinsCMS` properly. The `PageService` provides methods to retrieve page details by ID, enabling dynamic page rendering.

### Initialization Example

```typescript
import { GeinsCore, GeinsCMS } from '@geins/core';

const geinsCore = new GeinsCore({
  apiKey: 'your-api-key',
  accountName: 'your-account-name',
  channel: 'your-channel-id',
  locale: 'your-locale',
  market: 'your-market',
});

const geinsCMS = new GeinsCMS(geinsCore);
const pageService = geinsCMS.page;
```

## Retrieving a Page

To fetch a specific page by its ID or slug, use the `getPage` method. This returns structured data including metadata, layout information, and the page's content.

### Example Usage

```typescript
const pageData = await pageService.getPage('about-page');
console.log(pageData);
```

### Example Structure of Page Response

The response from `getPage` provides a complete representation of the page structure:

```typescript
{
  id: "about-page",
  title: "About Us",
  slug: "about-us",
  metadata: {
    description: "Learn more about our team and mission.",
    keywords: ["team", "mission", "about us"]
  },
  layout: "two-column",
  content: [
    {
      widgetType: "text",
      data: {
        text: "Welcome to our About Us page!"
      }
    },
    {
      widgetType: "image",
      data: {
        src: "team-photo.jpg",
        alt: "Our Team"
      }
    }
  ]
}
```

In this structure:

- **id**: Unique identifier for the page.
- **title**: Display title of the page.
- **slug**: URL-friendly identifier used to access the page.
- **metadata**: SEO information for search engine optimization.
- **layout**: Specifies the layout structure (e.g., one-column, two-column).
- **content**: Array of widgets that hold the page’s content, each widget has a `widgetType` and associated `data`.

## Customizing Page Content

Use the `content` array to dynamically render page sections based on `widgetType`. Each widget may contain data specific to its type (e.g., text, images, videos). The layout attribute defines how widgets are positioned on the page.

### Example Layout Customization

```typescript
// Render each widget based on the `widgetType`
pageData.content.forEach(widget => {
  if (widget.widgetType === 'text') {
    console.log('Text:', widget.data.text);
  } else if (widget.widgetType === 'image') {
    console.log('Image Source:', widget.data.src);
  }
});
```

## Error Handling

When retrieving a page, ensure that appropriate error handling is in place to manage cases where the page ID or slug may not exist:

```typescript
try {
  const pageData = await pageService.getPage('non-existent-page');
  if (!pageData) {
    console.warn('Page not found');
  }
} catch (error) {
  console.error('Failed to retrieve page:', error);
}
```

## Additional Configuration Options

- **Preview Mode**: Enable preview mode to fetch unpublished page versions for testing.
- **SEO Customization**: Populate `metadata` fields for better search engine visibility.

## Conclusion

Pages in Geins CMS offer a structured and flexible way to manage content-rich sections within your application. Using the `PageService`, you can create, customize, and display pages that meet your application’s unique needs. For more information, refer to the [Geins API documentation](https://docs.geins.io).

---

This guide provides an introduction to setting up and customizing pages within Geins CMS, ensuring your application has dynamic and user-friendly content.
