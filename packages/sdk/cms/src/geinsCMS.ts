import { GeinsCore, BasePackage } from '@geins/core';
import type { Channel, ContentAreaVariables } from '@geins/types';
import { MenuService, PageService, ContentAreaService } from './services';

class GeinsCMS extends BasePackage {
  public menu: MenuService;
  public page: PageService;
  public content: ContentAreaService;

  constructor(core: GeinsCore) {
    super(core);
    const { client, channel, defaultMarketLanguage: marketLanguage } = core;

    this.menu = new MenuService(client, channel, marketLanguage);
    this.page = new PageService(client, channel, marketLanguage);
    this.content = new ContentAreaService(client, channel, marketLanguage);
  }
}

export { GeinsCMS, ContentAreaVariables };
