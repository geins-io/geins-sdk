---
title: Preview Content
description: How to work with preview in the Geins CMS
tags:
  - sdk
  - cms
  - preview
---
# Preview

The Preview functionality in Geins CMS allows developers and content managers to view unpublished content changes before they go live. This feature is essential for ensuring that content appears as expected in the production environment.

## Overview

The **Preview** module enables you to see how content will look in your application before publishing it. It allows you to make adjustments and validate layouts, widgets, and content arrangement in a real-time environment.

### Key Features

- **Unpublished Content View**: Preview content that is still in draft or unpublished state.
- **Time-based Spoofing**: Emulate different times to test time-sensitive content, such as promotions or limited-time offers.
- **Customizable Settings**: Enable or disable preview mode depending on your environment needs.

## Accessing the Preview Service

To enable preview functionality, ensure that you have properly initialized the `GeinsCore` instance, as the CMS preview services rely on it. Access the `PreviewService` through the `GeinsCMS` instance.

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
const previewService = geinsCMS.preview;
```

## Enabling Content Preview

To fetch a preview of specific content, use the `previewContent` method. This will retrieve unpublished content based on an identifier or criteria provided.

### Example Usage

```typescript
const previewData = await previewService.previewContent('content-id');
console.log(previewData);
```

### Example Structure of Preview Content Response

The response from `previewContent` includes the entire content structure as it would appear when published:

```typescript
{
  id: "content-id",
  title: "Seasonal Promotion",
  status: "draft",
  sections: [
    {
      type: "banner",
      data: {
        image: "promotion-banner.jpg",
        link: "/promotions"
      }
    },
    {
      type: "text",
      data: {
        body: "Get ready for our exclusive seasonal discounts!"
      }
    }
  ]
}
```

## Using Time-based Spoofing

Preview mode allows you to test time-sensitive content by emulating different times. This feature is beneficial when planning seasonal promotions or timed announcements.

### Example of Spoofing Time

```typescript
const previewData = await previewService.previewContent('content-id', { time: '2024-12-25T00:00:00Z' });
console.log('Content at Christmas:', previewData);
```

In this example, the `time` parameter sets the context to December 25, 2024, allowing you to see how content will appear during the holiday.

## Error Handling

When using preview mode, it’s crucial to handle cases where the content ID might not exist or preview access is restricted.

```typescript
try {
  const previewData = await previewService.previewContent('non-existent-id');
  if (!previewData) {
    console.warn('Content preview not found');
  }
} catch (error) {
  console.error('Failed to retrieve content preview:', error);
}
```

### Additional Configuration Options

- **Content Versioning**: Preview specific versions of content by providing additional parameters if supported.
- **Customer Type Customization**: Display different content based on customer segmentation during preview.

## Conclusion

The Preview functionality in Geins CMS offers a valuable tool for content managers and developers to validate unpublished content before it goes live. With features like time-based spoofing and easy-to-use settings, you can ensure that content is accurate and visually appealing across different scenarios. For more details, refer to the [Geins API documentation](https://docs.geins.io).

---

This guide provides an introduction to previewing content in Geins CMS, ensuring that your application's content meets all expectations before publication.
