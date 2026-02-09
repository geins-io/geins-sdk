import { GeinsCore, BasePackage } from '@geins/core';
import { MenuService, ContentPageService, ContentAreaService } from './services';

/**
 * CMS package providing access to menus, content pages, and content areas.
 * Exposes service accessors: {@link menu}, {@link page}, and {@link area}.
 */
class GeinsCMS extends BasePackage {
  private _menu!: MenuService;
  private _page!: ContentPageService;
  private _area!: ContentAreaService;

  constructor(core: GeinsCore) {
    super(core);
  }

  destroy(): void {
    this._menu?.destroy();
    this._page?.destroy();
    this._area?.destroy();
  }

  /** Menu service — fetch navigation menus by location or ID. */
  get menu(): MenuService {
    if (!this._menu) {
      this._menu = new MenuService(this._apiClient, this._geinsSettings);
    }
    return this._menu;
  }

  /** Content area service — fetch widget containers by family and area name. */
  get area(): ContentAreaService {
    if (!this._area) {
      this._area = new ContentAreaService(this._apiClient, this._geinsSettings);
    }
    return this._area;
  }

  /** Content page service — fetch CMS pages with widgets by alias or ID. */
  get page(): ContentPageService {
    if (!this._page) {
      this._page = new ContentPageService(this._apiClient, this._geinsSettings);
    }
    return this._page;
  }
}

export { GeinsCMS };
