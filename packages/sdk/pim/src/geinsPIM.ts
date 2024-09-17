import { GeinsCore, BasePackage } from '@geins/core';
import type { MarketLanguageType } from '@geins/types';
import { BrandsService } from './services/brandsService';
class GeinsPIM extends BasePackage {
  public brands: BrandsService;

  constructor(
    core: GeinsCore,
    private marketLanguage?: MarketLanguageType,
  ) {
    super(core);
    const { client, credentials } = core;
    this.brands = new BrandsService(client, credentials, marketLanguage);
  }
}

export { GeinsPIM };
