import type { GeinsEventMessage, GeinsSettings } from '@geins/types';
import { GeinsEventType } from '@geins/types';
import { MerchantApiClient } from '../api-client/merchantApiClient';
import { GeinsCore } from '../geinsCore';
export abstract class BasePackage {
  protected _geinsSettings: GeinsSettings;
  protected _apiClient: () => MerchantApiClient;

  constructor(protected core: GeinsCore) {
    if (!core) {
      throw new Error('Core is required');
    }
    if (!core.client) {
      throw new Error('Merchant API Client is not set');
    }
    if (!core.geinsSettings) {
      throw new Error('Settings are required');
    }
    const { client, geinsSettings } = core;
    this._geinsSettings = geinsSettings;
    this._apiClient = () => client ?? undefined;
  }

  protected pushEvent(eventMessage: GeinsEventMessage, eventName?: GeinsEventType) {
    const eventNameStr = eventName ? GeinsEventType[eventName] : undefined;
    if (eventNameStr && eventNameStr.includes('_')) {
      const parentEvent = eventNameStr.split('_')[0];
      this.core.events.push(eventMessage, parentEvent);
    }
    this.core.events.push(eventMessage, eventNameStr);
  }

  public getCore() {
    return this.core;
  }
}
