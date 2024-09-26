import { GeinsCore, BasePackage } from '@geins/core';
import {
  MenuService,
  ContentPageService,
  ContentAreaService,
} from './services';

class GeinsCMS extends BasePackage {
  public menu: MenuService;
  public page: ContentPageService;
  public area: ContentAreaService;

  constructor(core: GeinsCore) {
    super(core);
    const { client, geinsSettings } = core;

    this.menu = new MenuService(client, geinsSettings);
    this.page = new ContentPageService(client, geinsSettings);
    this.area = new ContentAreaService(client, geinsSettings);
  }
}

export { GeinsCMS };
