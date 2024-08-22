import { GeinsCore, MerchantApiClient } from '@geins/core';
import { BrandService } from './services';

class GeinsPIM {
  private merchantApiClient: MerchantApiClient;
  public brand: BrandService;
  constructor(core: GeinsCore) {
    if (!core) {
      throw new Error('Core is required');
    }
    if (core.client) {
      this.merchantApiClient = core.client;
    } else {
      throw new Error('Merchant API Client is not set');
    }
    this.brand = new BrandService(this.merchantApiClient);
  }
  get client(): MerchantApiClient {
    if (!this.merchantApiClient) {
      throw new Error('Merchant API Client is not set');
    }
    return this.merchantApiClient;
  }
}
export { GeinsPIM };
