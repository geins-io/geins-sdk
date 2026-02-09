# @geins/cms

Content Management System package for the Geins SDK. Provides access to navigation menus, CMS pages with widgets, and content areas.

## Install

```bash
npm install @geins/cms @geins/core
# or
yarn add @geins/cms @geins/core
```

`@geins/core` is a peer dependency and must be installed alongside this package.

## Quick start

```ts
import { GeinsCore } from '@geins/core';
import { GeinsCMS } from '@geins/cms';

const core = new GeinsCore({ apiKey: '...', accountName: '...', channel: '...' });
const cms = new GeinsCMS(core);

// Fetch a navigation menu
const menu = await cms.menu.get({ menuLocationId: 'main-menu' });

// Fetch a CMS page by alias
const page = await cms.page.get({ alias: '/about' });

// Fetch a content area
const area = await cms.area.get({ family: 'category', areaName: 'hero' });
```

## API overview

| Export | Description |
|---|---|
| `GeinsCMS` | CMS entry point — exposes `menu`, `page`, and `area` services. |

### GeinsCMS services

- **`cms.menu`** — `get({ menuLocationId })` — Fetch navigation menus by location.
- **`cms.page`** — `get({ alias })` — Fetch CMS pages with widget data.
- **`cms.area`** — `get({ family, areaName })` — Fetch content areas (widget containers).

## Documentation

See the [full documentation](https://sdk.geins.dev/packages/cms/) for detailed usage.

## License

MIT
