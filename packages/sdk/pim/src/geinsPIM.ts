import { GeinsCore, BasePackage } from '@geins/core';
import type { GeinsMarketLanguageType } from '@geins/types';
import { BrandsService } from './services/brandsService';
class GeinsPIM extends BasePackage {
  private _brands!: BrandsService;

  constructor(
    core: GeinsCore,
    private marketLanguage?: GeinsMarketLanguageType,
  ) {
    super(core);
    const { client, geinsSettings } = core;
    this._apiClient = () => core.client ?? undefined;
    this._geinsSettings = geinsSettings;
  }

  private async initServices(): Promise<void> {
    this._brands = new BrandsService(
      () => this._apiClient(),
      this._geinsSettings,
      this.marketLanguage,
    );
  }

  get brands(): BrandsService {
    return this._brands;
  }
}

export { GeinsPIM };
