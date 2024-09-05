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
    const { client, credentials } = core;

    this.menu = new MenuService(client, credentials);
    this.page = new ContentPageService(client, credentials);
    this.area = new ContentAreaService(client, credentials);
  }
}

export { GeinsCMS };
