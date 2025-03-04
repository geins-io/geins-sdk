# Content Areas

Content Areas in the Geins CMS allow you to create dynamic, reusable sections of content that can be placed in various parts of your application templates. These areas support a range of customizable content, enabling developers to build modular, adaptable page structures.

## Overview

A **Content Area** is defined by several key attributes, including its `family`, `areaName`, layout options, and content widgets it contains. You can retrieve and manage these content areas through the `ContentAreaService`.

### Key Concepts

- **Family**: Categorizes content areas for organizing different sets of content.
- **Area Name**: A unique identifier for a specific content area, used for retrieval.
- **Containers**: Each content area can include multiple containers, which hold structured content elements or widgets.

## Retrieving Content Areas

The `ContentAreaService` provides methods to fetch content areas either in a raw format or parsed format, making it flexible to use according to your application's needs.

### Initialization

To start working with content areas, ensure that the `GeinsCore` instance is correctly set up, as the CMS services depend on it. Here’s an example of initializing `GeinsCore` and accessing the `ContentAreaService`:

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
const contentAreaService = geinsCMS.area;
```

### Fetching Content Area Data

To fetch a content area by its name and family, use the `get` method. This returns a parsed result including metadata, tags, and containers within the specified content area.

#### Example Usage

```typescript
// Define the area variables
const areaVariables = {
  family: 'main-content',
  areaName: 'homepage-hero',
};

// Fetch and display the content area
const contentAreaData = await contentAreaService.get(areaVariables);
console.log(contentAreaData);
```

In this example:

- **family** and **areaName** are required to uniquely identify the content area.
- The result includes structured metadata, tags, and an array of containers with widgets for organized content display.

### Example Structure of Content Area Response

The response from the `get` method has the following structure:

```typescript
{
  meta: { /* Meta information like title and description */ },
  tags: ["tag1", "tag2"],
  containers: [
    {
      id: "container1",
      name: "Header",
      sortOrder: 1,
      layout: "grid",
      responsiveMode: "desktop",
      design: "modern",
      content: [
        {
          id: "widget1",
          name: "Hero Image",
          sortOrder: 1,
          type: "image",
          size: "large",
          configuration: { /* widget-specific configuration */ },
          images: [
            {
              fileName: "hero.jpg",
              largestSize: {
                imageWidth: 1920,
                imageHeight: 1080
              }
            }
          ]
        }
      ]
    }
  ]
}
```

### Customizing Content Display

Each content area includes:

- **Containers**: Sections within the content area, each potentially with its own layout and design.
- **Widgets**: Items within containers, which can vary in type (e.g., image, banner, text).
- **Metadata and Tags**: Additional information to categorize and describe content areas.

You can use this structured response to dynamically render content areas in your application.

## Error Handling

When retrieving a content area, ensure to handle cases where the content area or its containers might not be found:

```typescript
try {
  const contentAreaData = await contentAreaService.get(areaVariables);
  if (!contentAreaData) {
    console.warn('Content area not found');
  }
} catch (error) {
  console.error('Failed to retrieve content area:', error);
}
```

### Additional Configuration Options

- **Preview Mode**: Enable preview mode for unpublished content by setting the `preview` property in `ContentAreaVariables`.
- **Customer Type**: Customize the content based on customer segmentation by specifying `customerType`.

## Conclusion

Content Areas in Geins CMS provide a flexible and robust way to manage and render structured content in your applications. With the `ContentAreaService`, you can fetch, configure, and display these areas in a way that aligns with your application’s dynamic content requirements.

For more detailed implementation, refer to the [Geins API documentation](https://docs.geins.io).
