import { GeinsCore } from '@geins/core';
import type { Channel, ContentAreaVariabels } from '@geins/types';
import { MenuService, PageService, ContentAreaService } from './services';

export abstract class BasePackage {
  constructor(core: GeinsCore) {
    if (!core) {
      throw new Error('Core is required');
    }
    if (!core.client) {
      throw new Error('Merchant API Client is not set');
    }
    if (!core.channel) {
      throw new Error('Channel is required');
    }
  }
}

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

export { GeinsCMS, ContentAreaVariabels };
