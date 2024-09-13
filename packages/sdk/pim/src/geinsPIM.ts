import { GeinsCore, BasePackage } from '@geins/core';

class GeinsPIM extends BasePackage {
  constructor(core: GeinsCore) {
    super(core);
    const { client, credentials } = core;
  }
}

export { GeinsPIM };
