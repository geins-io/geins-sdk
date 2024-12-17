import { GeinsCore, BasePackage, RuntimeContext } from '@geins/core';
import { CartService } from './services/cartService';

class GeinsOMS extends BasePackage {
  private _cart!: CartService;
  private _omsSettings: any;

  constructor(core: GeinsCore, options?: any) {
    super(core);
    const { client, geinsSettings } = core;
    this._omsSettings = options?.omsSettings ?? { context: RuntimeContext.HYBRID };
    this._geinsSettings = geinsSettings;
    this._apiClient = () => client ?? undefined;
    this.initServices();
  }

  private async initServices(): Promise<void> {}

  get cart(): CartService {
    if (!this._cart) {
      this._cart = new CartService(() => this._apiClient(), this._geinsSettings, this._omsSettings);
    }
    return this._cart;
  }
}

export { GeinsOMS };
