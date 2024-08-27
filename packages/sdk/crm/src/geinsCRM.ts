import { GeinsCore, BasePackage } from '@geins/core';
import { AuthService } from './services';

class GeinsCRM extends BasePackage {
  private authService: AuthService | undefined;
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

  initAuthService() {
    this.authService = new AuthService(this.authServiceConfig);
  }

  get auth() {
    if (!this.authService) {
      this.initAuthService();
    }
    return this.authService;
  }
}

export { GeinsCRM };
