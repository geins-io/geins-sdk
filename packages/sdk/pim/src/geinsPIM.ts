import { GeinsCore, BasePackage } from '@geins/core';
import type { GeinsMarketLanguageType } from '@geins/types';
import { BrandsService } from './services/brandsService';
class GeinsPIM extends BasePackage {
  public brands: BrandsService;

  constructor(
    core: GeinsCore,
    private marketLanguage?: GeinsMarketLanguageType,
  ) {
    super(core);
    const { client, credentials } = core;
    this.brands = new BrandsService(client, credentials, marketLanguage);
  }
}

export { GeinsPIM };
