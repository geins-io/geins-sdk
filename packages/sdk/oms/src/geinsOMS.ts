import { GeinsCore, BasePackage } from '@geins/core';
import { CartService } from './services/cartService';

class GeinsOMS extends BasePackage {
  private _cart!: CartService;

  constructor(core: GeinsCore) {
    super(core);
    const { client, geinsSettings } = core;
    this._geinsSettings = geinsSettings;
    this._apiClient = () => client ?? undefined;
    this.initServices();
  }

  private async initServices(): Promise<void> {
    this._cart = new CartService(() => this._apiClient(), this._geinsSettings);
  }

  get cart(): any {
    return this._cart;
  }
}

export { GeinsOMS };
