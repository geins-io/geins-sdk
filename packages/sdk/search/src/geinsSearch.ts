import { GeinsCore, BasePackage } from '@geins/core';
import { ProductSearchService } from './services';
class GeinsSearch extends BasePackage {
  public product: ProductSearchService;
  constructor(core: GeinsCore) {
    super(core);
    const { client, credentials } = core;
    this.product = new ProductSearchService(client, credentials);
  }
}

export { GeinsSearch };
