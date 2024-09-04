import { GeinsCore, BasePackage } from '@geins/core';
import type { GeinsCredentials, ContentAreaVariables } from '@geins/types';
import { MenuService, PageService, ContentAreaService } from './services';

class GeinsCMS extends BasePackage {
  public menu: MenuService;
  public page: PageService;
  public contentArea: ContentAreaService;

  constructor(core: GeinsCore) {
    console.log("🚀 ~ GeinsCMS ~ constructor ~ core:", core)
    super(core);
    const { client, credentials } = core;

    this.menu = new MenuService(client, credentials);
    this.page = new PageService(client, credentials);
    this.contentArea = new ContentAreaService(client, credentials);
  }
}

export { GeinsCMS, ContentAreaVariables };
