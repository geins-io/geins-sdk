import { GeinsCore } from '../geinsCore';
export abstract class BasePackage {
  constructor(core: GeinsCore) {
    if (!core) {
      throw new Error('Core is required');
    }
    if (!core.client) {
      throw new Error('Merchant API Client is not set');
    }
    if (!core.channel) {
      throw new Error('Channel is required');
    }
  }
}
