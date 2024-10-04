import { GeinsCore, BasePackage } from '@geins/core';
import { ProductSearchService } from './services';
class GeinsSearch extends BasePackage {
  private _product!: ProductSearchService;
  constructor(core: GeinsCore) {
    super(core);
    const { client, geinsSettings } = core;
    this._apiClient = () => core.client ?? undefined;
    this._geinsSettings = geinsSettings;
    this.initServices();
  }

  private async initServices(): Promise<void> {
    this._product = new ProductSearchService(
      () => this._apiClient(),
      this._geinsSettings,
    );
  }
}

export { GeinsSearch };
