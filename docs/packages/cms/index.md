# @geins/cms

The `@geins/cms` package provides a comprehensive content management system that enables developers to create, manage, and preview dynamic content in their applications. This package includes tools for handling content areas, menus, pages, and previewing unpublished content.

## Quick Start

To get started with `@geins/cms`, initialize `GeinsCore` and `GeinsCMS` as follows:

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
```

With `geinsCMS` initialized, you can start using various CMS services like `ContentAreaService`, `MenuService`, and `PageService` to manage content in your application.

## JSON Structure

Content in the Geins CMS is structured in JSON format, making it easy to access, parse, and render data dynamically. Below is a high-level example of a JSON structure returned by a content area service:

```json
{
  "meta": {
    "title": "Main Content Area",
    "description": "Primary content for the homepage"
  },
  "tags": ["homepage", "main"],
  "containers": [
    {
      "id": "header-banner",
      "name": "Header Banner",
      "layout": "full-width",
      "content": [
        {
          "type": "image",
          "fileName": "header.jpg",
          "altText": "Welcome Banner"
        },
        {
          "type": "text",
          "content": "Welcome to our site!"
        }
      ]
    }
  ]
}
```

Each content area includes metadata, tags, containers, and widgets, allowing for modular content placement throughout the application.

## Basic Usage

With the CMS services initialized, you can begin fetching and displaying content areas, menus, or pages. Here’s an example of fetching a menu and displaying its items:

```typescript
const menu = await geinsCMS.menu.getMenu('main-menu');

menu.items.forEach(item => {
  console.log(`Menu Item: ${item.name}, Link: ${item.link}`);
});
```

The CMS API is designed to be intuitive, with methods that follow a standard pattern across content types. This approach allows developers to retrieve and display CMS-managed content efficiently.

## When to Use

The Geins CMS is ideal for applications that require flexible, dynamic content management. Consider using `@geins/cms` in scenarios such as:

- **E-commerce Sites**: For product categories, promotional banners, and customizable landing pages.
- **Marketing Pages**: To enable content managers to update text and images without redeploying the application.
- **Multi-language Sites**: The CMS supports localized content, making it suitable for applications targeting multiple regions.

The preview functionality is particularly useful for content managers who need to see unpublished changes before they go live, reducing the risk of errors in production.

