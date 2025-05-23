import { BasePackage, GeinsCore } from '@geins/core';
import { BrandService } from './services';
export type PIMSettings = {};
export interface GeinsPIMInterface {}
export class GeinsPIM extends BasePackage {
  private _brand!: BrandService;

  constructor(core: GeinsCore, options?: { pimSettings?: PIMSettings }) {
    super(core);
    const { client, geinsSettings } = core;
    this._geinsSettings = geinsSettings;
    this._apiClient = () => client ?? undefined;
    this.initServices();
  }

  get brand(): BrandService {
    if (!this._brand) {
      this._brand = new BrandService(() => this._apiClient(), this._geinsSettings, {});
    }
    return this._brand;
  }

  destroy(): void {
    this._brand.destroy();
  }

  private async initServices(): Promise<void> {
    console.log('initServices');
  }
}
