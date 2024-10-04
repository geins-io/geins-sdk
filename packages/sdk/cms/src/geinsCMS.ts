import { GeinsCore, BasePackage } from '@geins/core';
import {
  MenuService,
  ContentPageService,
  ContentAreaService,
} from './services';

class GeinsCMS extends BasePackage {
  private _menu!: MenuService;
  private _page!: ContentPageService;
  private _area!: ContentAreaService;

  constructor(core: GeinsCore) {
    super(core);
    const { client, geinsSettings } = core;
    this._geinsSettings = geinsSettings;
    this._apiClient = () => client ?? undefined;
    this.initServices();
  }

  private async initServices(): Promise<void> {
    this._menu = new MenuService(() => this._apiClient(), this._geinsSettings);
    this._page = new ContentPageService(
      () => this._apiClient(),
      this._geinsSettings,
    );
    this._area = new ContentAreaService(
      () => this._apiClient(),
      this._geinsSettings,
    );
  }

  get menu(): MenuService {
    return this._menu;
  }

  get area(): ContentAreaService {
    return this._area;
  }

  get page(): ContentPageService {
    return this._page;
  }
}

export { GeinsCMS };
