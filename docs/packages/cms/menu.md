# Menu

The Menu feature in Geins CMS enables you to create and manage navigational menus within your application. Menus can include multiple levels, organizing content into hierarchies that enhance user navigation and streamline content accessibility.

## Overview

Menus consist of **menu items** that link to various sections within the application. You can configure the structure and design of these menus and place them in predefined locations (e.g., header, footer) or custom areas in your layout.

### Key Components

- **Menu Locations**: Predefined or custom areas where menus can appear.
- **Menu Items**: Links within a menu, which may be organized hierarchically to create nested navigation structures.

## Accessing the Menu Service

To work with menus, ensure you have initialized `GeinsCore` correctly. The `MenuService` is accessible via the CMS instance (`GeinsCMS`), allowing you to retrieve menus based on location or specific identifiers.

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
const menuService = geinsCMS.menu;
```

### Retrieving a Menu

To fetch a menu by its name, use the `getMenu` method. This retrieves the menu structure with its associated items, each containing details like the name, link, and possible sub-items.

#### Example Usage

```typescript
const menu = await menuService.getMenu('main-menu');
console.log(menu);
```

### Example Structure of Menu Response

The response from `getMenu` provides structured data for rendering menus and their nested items:

```typescript
{
  id: "main-menu",
  name: "Main Menu",
  items: [
    {
      id: "home",
      name: "Home",
      link: "/",
      children: [],
      target: "_self",
      rel: "noopener"
    },
    {
      id: "about",
      name: "About Us",
      link: "/about",
      children: [
        {
          id: "team",
          name: "Our Team",
          link: "/about/team",
          children: [],
          target: "_self",
          rel: "noopener"
        }
      ]
    }
  ]
}
```

In this example:

- **id**: Unique identifier for each menu item.
- **name**: Display name of the menu or menu item.
- **link**: URL that the item points to.
- **children**: Nested items for hierarchical menus.
- **target** and **rel**: Additional properties for link behavior.

### Customizing Menus

You can use this structured response to render menus with multiple levels or custom layouts. Customize each menu item’s behavior using properties like `target` and `rel` for enhanced accessibility and SEO.

## Error Handling

When fetching a menu, handle cases where a menu or its items might not exist. This is especially important in multi-channel setups where certain menus may be channel-specific.

```typescript
try {
  const menuData = await menuService.getMenu('main-menu');
  if (!menuData) {
    console.warn('Menu not found');
  }
} catch (error) {
  console.error('Failed to retrieve menu:', error);
}
```

### Additional Options

- **Menu Item Type**: Specify the item type for icons, external links, or custom components.
- **SEO Enhancements**: Use `rel` attributes like `noopener` and `nofollow` to control link behavior.

## Conclusion

Menus in Geins CMS offer a flexible, structured way to build navigational elements in your application. Using the `MenuService`, you can define and manage hierarchical menus that fit seamlessly into your layout. For further details, refer to the [Geins API documentation](https://docs.geins.io).

---

This guide provides an introduction to setting up and customizing menus within Geins CMS, ensuring your application has robust navigation options.
