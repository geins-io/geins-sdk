import { BasePackage, GeinsCore } from '@geins/core';
export interface GeinsPIMInterface {}
export class GeinsPIM extends BasePackage {
  constructor(core: GeinsCore) {
    super(core);
    const { client, geinsSettings } = core;
    this._geinsSettings = geinsSettings;
    this._apiClient = () => client ?? undefined;
    this.initServices();
  }

  private async initServices(): Promise<void> {
    console.log('initServices');
  }
}
