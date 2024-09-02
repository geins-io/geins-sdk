import { GeinsCore, BasePackage } from '@geins/core';

class GeinsCRM extends BasePackage {
  private authServiceConfig: any;
  constructor(core: GeinsCore) {
    super(core);
    const { channel, endpoints } = core;
    this.authServiceConfig = {
      signEndpoint: endpoints.authSign,
      authEndpoint: endpoints.auth,
      cookies: core.cookies,
      events: core.events,
    };
  }
}

export { GeinsCRM };
